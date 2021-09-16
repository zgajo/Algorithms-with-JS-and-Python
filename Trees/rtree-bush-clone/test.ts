// import RBush from "rbush";
import { parse } from "osm-read";
import fs from "fs";

import { BBox } from "./BBox";
import { RTree } from "./RTree";
import { Node } from "./Node";

const rtree = new RTree(10);

var parser = parse({
  filePath: "andorra-latest.osm.pbf",
  endDocument: function () {
    console.log("document end");
    console.log(rtree);
  },
  bounds: function (bounds: any) {
    // console.log("bounds: " + JSON.stringify(bounds));
  },
  node: function (node: any) {
    if (node.tags["addr:city"]) {
      // console.log("node: " + JSON.stringify(node));
      rtree.insert(new Node(node.lat, node.lon, node.tags));
    }
  },
  way: function (way: any) {
    // console.log("way: " + JSON.stringify(way));
  },
  relation: function (relation: any) {
    // console.log("relation: " + JSON.stringify(relation));
  },
  error: function (msg: string) {
    console.log("error: " + msg);
  },
});

// const r1 = new Rectangle([]);
// const r2 = new Rectangle([]);
// const r3 = new Rectangle([]);
// const r4 = new Rectangle([]);
// const r5 = new Rectangle([]);
// let counter = 0;

// function randomNumber(number: number) {
//   return Math.floor(Math.random() * number);
// }

// while (counter < 20) {
//   rtree.insert(
//     new BBox(
//       randomNumber(20),
//       randomNumber(20),
//       randomNumber(20),
//       randomNumber(20)
//     )
//   );

//   counter++;
// }

// rtree.insert(new BBox(5, 3, 2, 2));
// rtree.insert(r2);
// rtree.insert(r3);
// rtree.insert(r4);
// rtree.insert(r5);
// rtree.insert(new BBox(1, 1, 1, 1));
// rtree.insert(new BBox(1, 1, 0, 0));

// const tree = new RBush(1);
// tree.insert({ minX: 0, minY: 0, maxX: 1, maxY: 1 });
// tree.insert({ minX: 0, minY: 1, maxX: 1, maxY: 1 });
// console.log("object");
// const treeData = tree.toJSON();
// console.log(JSON.stringify(treeData));
