import { parse } from "osm-read";
import * as path from "path";
import { RTree } from "./RTree";

import BTree from "./Btree";
import { Way } from "./graph/Way";
import { Node } from "./graph/Node";
import * as Schema from "./nodesBtree_pb";

const bTreeNode = new BTree();
export const bTreeWay: BTree<string, Way> = new BTree();
export const bTreeWayNode: BTree<string, Node> = new BTree();

const main = () => {
  bTreeWay.storeWaysToFile();
};

parse({
  filePath: path.join(__dirname, "andorra-latest.osm.pbf"),
  endDocument: function () {
    console.log("document end");
    main();
  },
  bounds: function (bounds: any) {},
  node: function (node: any) {
    bTreeNode.set(node.id, node);
  },
  way: function (way: Way) {
    if (
      (way.tags.highway && way.tags.highway === "motorway") ||
      way.tags.highway === "trunk" ||
      way.tags.highway === "primary" ||
      way.tags.highway === "tertiary" ||
      way.tags.highway === "unclassified" ||
      way.tags.highway === "residential" ||
      way.tags.highway === "trunk_link" ||
      way.tags.highway === "motorway_link" ||
      way.tags.highway === "primary_link" ||
      way.tags.highway === "secondary_link" ||
      way.tags.highway === "tertiary_link" ||
      way.tags.highway === "service" ||
      way.tags.highway === "secondary"
    ) {
      const newWay = new Way(way);

      newWay.nodeRefs.forEach((element: string) => {
        const node = bTreeWayNode.get(element);

        if (node) {
          node.increaseLinkCount();
          node.partOfWays.push(newWay);
          newWay.addNode(node);
        } else {
          const storedNode = bTreeNode.get(element);

          const newNode = new Node({
            ...storedNode,
          });

          newNode.addWay(newWay);

          bTreeWayNode.set(element, newNode);

          newWay.addNode(newNode);
        }
      });

      bTreeWay.set(way.id, newWay);
    }
  },
  relation: function (relation: any) {},
  error: function (msg: string) {
    console.log("error: " + msg);
  },
});
