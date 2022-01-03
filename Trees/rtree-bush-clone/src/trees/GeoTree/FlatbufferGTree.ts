import { defaultComparator } from "sorted-btree";
import { GTree } from "../../flatbuffers/geo-table/g-tree";
import { GTreeBox } from "../../flatbuffers/geo-table/g-tree-box";

const base32 = "0123456789bcdefghjkmnpqrstuvwxyz"; // (geohash-specific) Base32 map

export class FlatBufferGeoHashTree {
  geohashTree: GTree;

  constructor(tree: GTree) {
    this.geohashTree = tree;
  }

  indexOf(
    gTreeData: GTree | GTreeBox,
    length: number,
    key: string,
    leaf: boolean,
    cmp = defaultComparator
  ): number {
    var lo = 0,
      hi = length,
      mid = hi >> 1,
      chosen = 0;

    let leafNodeFound = false;

    while (lo < hi) {
      var c = cmp(gTreeData.data(mid)?.key(), key);

      if (c === 0) return mid;
      else {
        if (c < 0) {
          lo = mid + 1;
        } else if (c > 0) {
          // key < keys[mid]
          chosen = mid;
          hi = mid;
        } else {
          // c is NaN or otherwise invalid
          if (key === key)
            // at least the search key is not NaN
            return length;
          else throw new Error("GeoHashTree: NaN was used as a key");
        }
      }
      mid = (lo + hi) >> 1;
    }
    if (leaf && !leafNodeFound) {
      throw new Error(`GeoHashTree: Key ${key} not found in db`);
    }
    return chosen;
  }

  getNode(key: string) {
    let gTreeData: GTree | GTreeBox = this.geohashTree;
    let gTreeDataLength = this.geohashTree.dataLength();
    let precision = this.geohashTree.precision();
    let currentPrecision = this.geohashTree.precision();

    let gTreeBoxData;

    let foundNode = null;

    while (!foundNode && currentPrecision > 0) {
      const searchKey = key.substring(0, precision - currentPrecision + 1);

      const index = this.indexOf(
        gTreeData,
        gTreeDataLength,
        searchKey,
        gTreeDataLength <= 0
      );

      gTreeDataLength = gTreeData.data(index)?.dataLength() as number;

      if (gTreeDataLength) {
        gTreeData = gTreeData.data(index) as GTreeBox;
      } else {
        foundNode = (gTreeData as GTreeBox).data(index)?.values(0);
      }

      --currentPrecision;
    }

    return foundNode;
  }

  /**
   * Returns SW/NE latitude/longitude bounds of specified geohash.
   *
   * @param   {string} geohash - Cell that bounds are required of.
   * @returns {{sw: {lat: number, lon: number}, ne: {lat: number, lon: number}}}
   * @throws  Invalid geohash.
   */
  static bounds(geohash: string) {
    if (geohash.length == 0) throw new Error("Invalid geohash");

    geohash = geohash.toLowerCase();

    let evenBit = true;
    let latMin = -90,
      latMax = 90;
    let lonMin = -180,
      lonMax = 180;

    for (let i = 0; i < geohash.length; i++) {
      const chr = geohash.charAt(i);
      const idx = base32.indexOf(chr);
      if (idx == -1) throw new Error("Invalid geohash");

      for (let n = 4; n >= 0; n--) {
        const bitN = (idx >> n) & 1;
        if (evenBit) {
          // longitude
          const lonMid = (lonMin + lonMax) / 2;
          if (bitN == 1) {
            lonMin = lonMid;
          } else {
            lonMax = lonMid;
          }
        } else {
          // latitude
          const latMid = (latMin + latMax) / 2;
          if (bitN == 1) {
            latMin = latMid;
          } else {
            latMax = latMid;
          }
        }
        evenBit = !evenBit;
      }
    }

    const bounds = {
      sw: { lat: latMin, lon: lonMin },
      ne: { lat: latMax, lon: lonMax },
    };

    return bounds;
  }

  /**
   * Determines adjacent cell in given direction.
   *
   * @param   geohash - Cell to which adjacent cell is required.
   * @param   direction - Direction from geohash (N/S/E/W).
   * @returns {string} Geocode of adjacent cell.
   * @throws  Invalid geohash.
   */
  static adjacent(geohash: string, direction: "n" | "e" | "s" | "w") {
    // based on github.com/davetroy/geohash-js

    geohash = geohash.toLowerCase();

    if (geohash.length == 0) throw new Error("Invalid geohash");
    if ("nsew".indexOf(direction) == -1) throw new Error("Invalid direction");

    const neighbour = {
      n: [
        "p0r21436x8zb9dcf5h7kjnmqesgutwvy",
        "bc01fg45238967deuvhjyznpkmstqrwx",
      ],
      s: [
        "14365h7k9dcfesgujnmqp0r2twvyx8zb",
        "238967debc01fg45kmstqrwxuvhjyznp",
      ],
      e: [
        "bc01fg45238967deuvhjyznpkmstqrwx",
        "p0r21436x8zb9dcf5h7kjnmqesgutwvy",
      ],
      w: [
        "238967debc01fg45kmstqrwxuvhjyznp",
        "14365h7k9dcfesgujnmqp0r2twvyx8zb",
      ],
    };
    const border = {
      n: ["prxz", "bcfguvyz"],
      s: ["028b", "0145hjnp"],
      e: ["bcfguvyz", "prxz"],
      w: ["0145hjnp", "028b"],
    };

    const lastCh = geohash.slice(-1); // last character of hash
    let parent = geohash.slice(0, -1); // hash without last character

    const type = geohash.length % 2;

    // check for edge-cases which don't share common prefix
    if (border[direction][type].indexOf(lastCh) != -1 && parent != "") {
      parent = FlatBufferGeoHashTree.adjacent(parent, direction);
    }

    // append letter for direction to parent
    return parent + base32.charAt(neighbour[direction][type].indexOf(lastCh));
  }

  /**
   * Returns all 8 adjacent cells to specified geohash.
   *
   * @param   {string} geohash - Geohash neighbours are required of.
   * @returns {{n,ne,e,se,s,sw,w,nw: string}}
   * @throws  Invalid geohash.
   */
  static neighbours(geohash: string) {
    return {
      n: FlatBufferGeoHashTree.adjacent(geohash, "n"),
      ne: FlatBufferGeoHashTree.adjacent(
        FlatBufferGeoHashTree.adjacent(geohash, "n"),
        "e"
      ),
      e: FlatBufferGeoHashTree.adjacent(geohash, "e"),
      se: FlatBufferGeoHashTree.adjacent(
        FlatBufferGeoHashTree.adjacent(geohash, "s"),
        "e"
      ),
      s: FlatBufferGeoHashTree.adjacent(geohash, "s"),
      sw: FlatBufferGeoHashTree.adjacent(
        FlatBufferGeoHashTree.adjacent(geohash, "s"),
        "w"
      ),
      w: FlatBufferGeoHashTree.adjacent(geohash, "w"),
      nw: FlatBufferGeoHashTree.adjacent(
        FlatBufferGeoHashTree.adjacent(geohash, "n"),
        "w"
      ),
    };
  }

  boundingBoxSearch(geohash: string) {
    // hops to neighbours until POI is found
  }

  proximitySearch(geohash: string) {
    // bottom - up seach
  }
}
