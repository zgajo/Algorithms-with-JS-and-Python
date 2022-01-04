import * as geohash from "ngeohash";
import { defaultComparator } from "sorted-btree";
import { GTree } from "../../flatbuffers/geo-table/g-tree";
import { GTreeBox } from "../../flatbuffers/geo-table/g-tree-box";
import { GTreeNode } from "../../flatbuffers/geo-table/g-tree-node";

const base32 = "0123456789bcdefghjkmnpqrstuvwxyz"; // (geohash-specific) Base32 map

function inCircleCheck(
  latitude: number,
  longitude: number,
  centre_lat: number,
  centre_lon: number,
  radius: number
) {
  const xDiff = longitude - centre_lon;
  const yDiff = latitude - centre_lat;

  if (Math.pow(xDiff, 2) + Math.pow(yDiff, 2) <= Math.pow(radius, 2)) {
    return true;
  }

  return false;
}

function getCentroid(
  latitude: number,
  longitude: number,
  height: number,
  width: number
) {
  const yCen = latitude + height / 2;
  const xCen = longitude + width / 2;

  return [xCen, yCen];
}

function convertToLatLon(
  y: number,
  x: number,
  latitude: number,
  longitude: number
) {
  const pi = 3.14159265359;

  const rEarth = 6371000;

  const latDiff = (y / rEarth) * (180 / pi);
  const lonDiff = ((x / rEarth) * (180 / pi)) / Math.cos((latitude * pi) / 180);

  const finalLat = latitude + latDiff;
  const finalLon = longitude + lonDiff;

  return [finalLat, finalLon];
}

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

  proximitySearch() {
    // bottom - up seach
  }

  /**
   * https://github.com/ashwin711/proximityhash
   * @param latitude
   * @param longitude
   * @param radius
   * @param precision
   * @param minlevel
   * @param maxlevel
   * @returns
   */
  static proximityHash(
    latitude: number,
    longitude: number,
    radius: number,
    precision: number,
    minlevel = 1,
    maxlevel = 12
  ) {
    let x = 0.0;
    let y = 0.0;

    const points = [];
    const geohashes = new Set();

    // 1	≤ 5,000km	×	5,000km
    // 2	≤ 1,250km	×	625km
    // 3	≤ 156km	×	156km
    // 4	≤ 39.1km	×	19.5km
    // 5	≤ 4.89km	×	4.89km
    // 6	≤ 1.22km	×	0.61km
    // 7	≤ 153m	×	153m
    // 8	≤ 38.2m	×	19.1m
    // 9	≤ 4.77m	×	4.77m
    // 10	≤ 1.19m	×	0.596m
    // 11	≤ 149mm	×	149mm
    // 12	≤ 37.2mm	×	18.6mm
    const gridWidth = [
      5009400.0, 1252300.0, 156500.0, 39100.0, 4900.0, 1200.0, 152.9, 38.2, 4.8,
      1.2, 0.149, 0.037,
    ];
    const gridHeight = [
      4992600.0, 624100.0, 156000.0, 19500.0, 4900.0, 609.4, 152.4, 19.0, 4.8,
      0.595, 0.149, 0.0199,
    ];

    let height = gridHeight[precision - 1] / 2;
    let width = gridWidth[precision - 1] / 2;

    const latMoves = parseInt(Math.ceil(radius / height).toString());
    const lonMoves = parseInt(Math.ceil(radius / width).toString());

    for (let i = 0; i < latMoves; i++) {
      const tempLat = y + height * i;
      for (let j = 0; j < lonMoves; j++) {
        const tempLon = x + width * j;

        if (inCircleCheck(tempLat, tempLon, y, x, radius)) {
          const [xCen, yCen] = getCentroid(tempLat, tempLon, height, width);

          const [lat1, lon1] = convertToLatLon(yCen, xCen, latitude, longitude);
          points.push([lat1, lon1]);
          const [lat2, lon2] = convertToLatLon(
            -yCen,
            xCen,
            latitude,
            longitude
          );
          points.push([lat2, lon2]);
          const [lat3, lon3] = convertToLatLon(
            yCen,
            -xCen,
            latitude,
            longitude
          );
          points.push([lat3, lon3]);
          const [lat4, lon4] = convertToLatLon(
            -yCen,
            -xCen,
            latitude,
            longitude
          );
          points.push([lat4, lon4]);
        }
      }
    }

    for (const point of points) {
      const hash = geohash.encode(point[0], point[1], precision);

      if (!geohashes.has(hash)) {
        geohashes.add(hash);
      }
    }

    return geohashes;
  }
}
