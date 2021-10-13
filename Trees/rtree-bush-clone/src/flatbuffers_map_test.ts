import { Builder, ByteBuffer, Encoding } from "flatbuffers";
import * as fs from "fs";
import * as path from "path";
import { defaultComparator } from "sorted-btree";
import { BNodesTree } from "./flatbuffers/map/node/b-nodes-tree";
import { BTreeNode } from "./flatbuffers/map/node/b-tree-node";
import { COUNTRY } from "./utils/constants";

const indexOf = (
  node: BTreeNode | null | undefined,
  key: number,
  failXor: number,
  leaf: boolean
): number => {
  var cmp = defaultComparator;
  var lo = 0,
    hi = node?.keysLength() as number,
    mid = hi >> 1;
  let leafNodeFound = false;
  while (lo < hi) {
    var c = cmp(node?.keys(mid), key);
    if (c < 0) lo = mid + 1;
    else if (c > 0)
      // key < keys[mid]
      hi = mid;
    else if (c === 0) {
      if (leaf) {
        leafNodeFound = true;
      }
      return mid;
    } else {
      // c is NaN or otherwise invalid
      if (key === key) {
        // at least the search key is not NaN
        return node?.keysLength() as number;
      } else throw new Error("BTree: NaN was used as a key");
    }
    mid = (lo + hi) >> 1;
  }
  if (leaf && !leafNodeFound) {
    throw new Error("BTree: Key not found in db");
  }
  return mid ^ failXor;
};

const getKey = (key: string, root: BTreeNode | null | undefined) => {
  let node = root;
  let foundNode = null;

  while (!foundNode && node) {
    const index = indexOf(
      node,
      Number(key),
      0,
      (node?.childrenLength() as number) <= 0
    );
    if (node?.childrenLength()) {
      node = node?.children(index);
    } else {
      console.log(index);
      foundNode = node?.values(index);
      console.log("found", foundNode);
    }
  }

  return foundNode;
};

// the data you just read, as a `Uint8Array`
// Note that the example here uses `readFileSync` from the built-in `fs` module,
// but other methods for accessing the file contents will also work.
console.time("readbytes");
var bytes = new Uint8Array(
  fs.readFileSync(path.join(__dirname, COUNTRY + "BtreeNodes.bin"))
);
console.timeEnd("readbytes");

var buf2 = new ByteBuffer(bytes);

// Get an accessor to the root object inside the buffer.
var btree = BNodesTree.getRootAsBNodesTree(buf2);
const root = btree.root();

console.time("find");
const findNode = getKey("1934144326", root);
console.timeEnd("find");
console.log(findNode?.id(), findNode?.lat(), findNode?.lon());
console.log(btree);
