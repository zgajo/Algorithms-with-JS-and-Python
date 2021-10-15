import { Builder, ByteBuffer, Encoding } from "flatbuffers";
import * as fs from "fs";
import * as path from "path";
import { defaultComparator } from "sorted-btree";
import { BNodesTree } from "./flatbuffers/map/node/b-nodes-tree";
import { BTreeNode } from "./flatbuffers/map/node/b-tree-node";
import { COUNTRY } from "./utils/constants";

function indexOf(
  node: BTreeNode,
  keysLength: number,
  key: number,
  leaf: boolean,
  cmp = defaultComparator
): number {
  var lo = 0,
    hi = keysLength,
    mid = hi >> 1,
    chosen = 0;

  let leafNodeFound = false;

  while (lo < hi) {
    console.log("------------------");
    console.log("lo", lo, "mid", mid, "hi", hi);
    console.log("keys(mid)", node.keys(mid));

    var c = cmp(node.keys(mid), key);
    console.log("c", c);

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
          return keysLength;
        else throw new Error("BTree: NaN was used as a key");
      }
    }
    mid = (lo + hi) >> 1;

    console.log("------------------");
  }
  // if (leaf && !leafNodeFound) {
  //   throw new Error("BTree: Key not found in db");
  // }
  return chosen;
}

const getKey = (key: number, root: BTreeNode | null | undefined) => {
  let node = root;
  let foundNode = null;

  const indexes = [];

  while (!foundNode && node) {
    const index = indexOf(
      node,
      node.keysLength(),
      key,
      (node?.childrenLength() as number) <= 0
    );
    indexes.push(index);
    if (node?.childrenLength()) {
      node = node?.children(index);
    } else {
      foundNode = node?.values(index);
    }
  }

  console.log("indexes", indexes);

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

const l = root?.keysLength() || 0;
for (let i = 0; i < l; i++) {
  console.log(root?.keys(i));
}

const findNode = getKey(1934144326, root);
console.timeEnd("find");
console.log(findNode?.id(), findNode?.lat(), findNode?.lon());
console.log(
  "path to: [1,5,12,19]",
  root?.children(1)?.children(5)?.children(12)?.values(19)?.id()
);
