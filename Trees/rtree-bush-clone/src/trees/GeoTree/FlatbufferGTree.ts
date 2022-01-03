import { defaultComparator } from "sorted-btree";
import { GTree } from "../../flatbuffers/geo-table/g-tree";
import { GTreeBox } from "../../flatbuffers/geo-table/g-tree-box";

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
}
