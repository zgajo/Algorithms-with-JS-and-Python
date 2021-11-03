import { parse } from "osm-read";
import * as path from "path";
import BTree from "./trees/Btree";
import { Node } from "./trees/Node";
import { BBox } from "./trees/RTree/BBox";
import { RTree } from "./trees/RTree/RTree";
import { Way } from "./trees/Way";
import { COUNTRY } from "./utils/constants";

const rTreeNode = new RTree();
export const bTreeWayNode: BTree<number, Node> = new BTree();

const shouldStoreHistoric = (node: any) => {
  // Moze biti i relation i way
  if (
    (node.tags?.historic || node.tags?.tourism || node.tags?.waterway) &&
    node.tags?.name
  ) {
    if (
      node.tags.tourism &&
      (node.tags.tourism === "hostel" ||
        node.tags.tourism === "hotel" ||
        node.tags.tourism === "guest_house" ||
        node.tags.tourism === "information" ||
        node.tags.tourism === "caravan_site" ||
        node.tags.tourism === "chalet" ||
        node.tags.tourism === "camp_site" ||
        node.tags.tourism === "camp_pitch" ||
        node.tags.tourism === "apartment" ||
        node.tags.tourism === "motel")
    ) {
      return false;
    }

    if (
      node.tags.waterway &&
      node.tags.waterway !== "dam" &&
      node.tags.waterway !== "weir" &&
      node.tags.waterway !== "waterfall" &&
      node.tags.waterway !== "rapids" &&
      node.tags.waterway !== "lock_gate"
    ) {
      return false;
    }

    return true;
  }

  return false;
};

const createNodesForWay = (newWay: Way) => {
  // newWay.nodeRefs.forEach((element: string) => {
  //   const node = bTreeWayNode.get(Number(element));
  //   if (node) {
  //     node.increaseLinkCount();
  //     node.partOfWays.push(newWay);
  //     newWay.addNode(node);
  //   } else {
  //     const storedNode = bTreeNode.get(Number(element));
  //     const newNode = new Node({
  //       ...storedNode,
  //     });
  //     newNode.addWay(newWay);
  //     bTreeWayNode.set(Number(element), newNode);
  //     newWay.addNode(newNode);
  //   }
  // });
};

const main = () => {};

parse({
  filePath: path.join(__dirname, COUNTRY + "-latest.osm.pbf"),
  endDocument: function () {
    console.log("document end");
    main();
  },
  bounds: function (bounds: any) {},
  node: function (node: any) {
    rTreeNode.insert(
      new Node({
        id: node.id,
        lat: Number(node.lat),
        lon: Number(node.lon),
      })
    );
  },
  way: function (way: Way) {},
  relation: function (relation: any) {},
  error: function (msg: string) {
    console.log("error: " + msg);
  },
});
