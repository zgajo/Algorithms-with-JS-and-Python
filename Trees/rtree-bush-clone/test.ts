// import RBush from "rbush";
import { parse } from "osm-read";
import { Node } from "./Node";
import { RTree } from "./RTree";

import BTree from "./Btree";

const btree = new BTree();
const bTreeCity = new BTree();
const bTreeNode = new BTree();
const bTreeStreet = new BTree();
const bTreeAddress = new BTree();
const rtree = new RTree(10);

const main = () => {
  // console.log(rtree.search(new Node(42.5059199, 1.5289214)));
  // console.log("End");
  // console.log(btree);
  /**
   * Assuming you want only roads, then a possible algorithm is this:

1. parse all ways; throw away those that are not roads, and for the others, remember the node IDs they consist of, by incrementing a "link counter" for each node referenced.
2. parse all ways a second time; a way will normally become one edge, but if any nodes apart from the first and the last have a link counter greater than one, then split the way into two edges at that point. Nodes with a link counter of one and which are neither first nor last can be thrown away unless you need to compute the length of the edge.
3. (if you need geometry for your graph nodes) parse the nodes section of the XML now, recording coordinates for all nodes that you have retained.
If you are only working on a small data set you can of course simply read everything into memory and do the above analysis in memory.
   */
  console.log(
    bTreeAddress.filter((key) => key.startsWith("Vicani")).valuesArray()
  );

  console.log(bTreeNode.get("51552755"));
};
console.time("test");

parse({
  filePath: "andorra-latest.osm.pbf",
  endDocument: function () {
    // console.log(rtree);
    console.timeEnd("test");
    console.log("document end");
    main();
    // Najbolje je nakon inserta svih nodeova i waysa u Btree, proci kroz sve
  },
  bounds: function (bounds: any) {
    // console.log("bounds: " + JSON.stringify(bounds));
  },
  node: function (node: any) {
    // Spremiti node po id-ju u BTREE
    // if (node.tags["addr:city"]) {
    //   // Spremiti gradove po imenima u BTree
    //   rtree.insert(new Node(node.lat, node.lon, node.tags));
    // }
    if (node.tags["addr:housenumber"] && node.tags["addr:street"]) {
      // Spremiti gradove po imenima u BTree
      if (node.tags.name) {
        bTreeAddress.set(node.tags.name, node);
      }

      if (node.tags["addr:street"] && node.tags["addr:housenumber"]) {
        bTreeAddress.set(
          `${node.tags["addr:street"]} ${node.tags["addr:housenumber"]}`,
          node
        );
      }
    }

    // if (node.tags.place) {
    //   // console.log(node);
    //   bTreeCity.set(node.tags.name, node);
    // }
    // if (node.id === "6393274537") {
    //   console.log("NODE: ", node);
    // }
  },
  way: function (way: any) {
    if (way.tags.highway === "residential") {
      // console.log(node);
      if (way.tags.name) {
        bTreeAddress.set(`${way.tags.name}|${way.id}`, way);
      }
    }

    if (way.tags["addr:street"]) {
      // Spremiti gradove po imenima u BTree
      if (way.tags.name) {
        bTreeAddress.set(way.tags.name, way);
      }

      if (way.tags["addr:housenumber"]) {
        return bTreeAddress.set(
          `${way.tags["addr:street"]} ${way.tags["addr:housenumber"]}`,
          way
        );
      }

      bTreeAddress.set(`${way.tags["addr:street"]}}`, way);
    }

    if (way.tags.building && way.tags.name) {
      // Spremiti gradove po imenima u BTree
      if (way.tags.name) {
        bTreeAddress.set(way.tags.name, way);
      }

      if (way.tags["addr:street"] && way.tags["addr:housenumber"]) {
        bTreeAddress.set(
          `${way.tags["addr:street"]} ${way.tags["addr:housenumber"]}`,
          way
        );
      }
    }

    if (way.tags.highway) {
      way.nodeRefs.forEach((element: string) => {
        const node = bTreeNode.get(element);
        if (node) {
          node.linkCount + 1;
          node.partOfWays.push(way);
        } else {
          bTreeNode.set(element, {
            id: element,
            linkCount: 1,
            partOfWays: [way],
          });
        }
      });
      // bTreeNode.set(way.id, way);
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
