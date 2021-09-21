// import RBush from "rbush";
import { parse } from "osm-read";
import { Node } from "./Node";
import { RTree } from "./RTree";

import BTree from "./Btree";

const btree = new BTree();
const bTreeCity = new BTree();
const rtree = new RTree(10);

const main = () => {
  // console.log(rtree.search(new Node(42.5059199, 1.5289214)));
  // console.log("End");
  // console.log(btree);
  console.log(bTreeCity.filter((key) => key.startsWith("Me")).valuesArray());
};

parse({
  filePath: "andorra-latest.osm.pbf",
  endDocument: function () {
    // console.log(rtree);
    main();
    // Najbolje je nakon inserta svih nodeova i waysa u Btree, proci kroz sve
  },
  bounds: function (bounds: any) {
    // console.log("bounds: " + JSON.stringify(bounds));
  },
  node: function (node: any) {
    // Spremiti node po id-ju u BTREE
    if (node.tags["addr:city"]) {
      // Spremiti gradove po imenima u BTree
      rtree.insert(new Node(node.lat, node.lon, node.tags));
    }

    if (node.tags.place) {
      // console.log(node);
      bTreeCity.set(node.tags.name, node);
    }
    // if (node.id === "6393274537") {
    //   console.log("NODE: ", node);
    // }
  },
  way: function (way: any) {
    if (way.tags.highway) {
      btree.set(way.id, way);
      // Spremiti ulice po imenima u BTree
      // console.log("way", way);
      // if (way.tags?.name?.includes("Carrer Pau Casals")) {
      //   console.log(way);
      // }
      // if (way.tags?.oneway) {
      //   console.log("oneway", way);
      // }
    }
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
