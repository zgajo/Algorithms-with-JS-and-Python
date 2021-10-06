import { parse } from "osm-read";
import * as path from "path";
import { haversine } from "./aStar";
import BTree from "./Btree";
import { Node } from "./graph/Node";
import { Way } from "./graph/Way";
import { connectNodesInWay } from "./utils/helper";

const bTreeLoad = new BTree();
const bTreeTest = new BTree();
const bTreeNode = new BTree();
export const bTreeWay: BTree<string, Way> = new BTree();
export const bTreeWayNode: BTree<string, Node> = new BTree();

const main = () => {
  bTreeWay.valuesArray().forEach((way) => {
    let nodesDistance = 0;
    let startCalculationNode: Node = way.nodes[0];

    // Remove nodes from way
    way.nodes = way.nodes.filter((node, index) => {
      if (index === 0) {
        return true;
      }
      // zadnji node
      if (index === way.nodes.length - 1) {
        nodesDistance += haversine(way.nodes[index - 1], node);
        connectNodesInWay(way, startCalculationNode, node, nodesDistance);
        // ovo je kad se ne brise
        return true;
      }
      // ovo je kad se ne brise
      if (node.linkCount > 1) {
        nodesDistance += haversine(way.nodes[index - 1], node);
        connectNodesInWay(way, startCalculationNode, node, nodesDistance);
        startCalculationNode = node;
        nodesDistance = 0;
        return true;
      }
      nodesDistance += haversine(way.nodes[index - 1], way.nodes[index]);
      // ovo je kad se treba brisati
      return false;
    });
  });

  bTreeWayNode.storeNodesToFile(path.join(__dirname, "nodesBtreeNodes"));

  bTreeLoad.loadNodesFromFile(path.join(__dirname, "nodesBtreeNodes"));
  console.log("object");
  // bTreeWay.valuesArray().forEach((way) => {
  //   let nodesDistance = 0;
  //   let startCalculationNode: Node = way.nodes[0];
  //   // Remove nodes from way
  //   way.nodes = way.nodes.filter((node, index) => {
  //     if (index === 0) {
  //       return true;
  //     }
  //     // zadnji node
  //     if (index === way.nodes.length - 1) {
  //       nodesDistance += haversine(way.nodes[index - 1], node);
  //       connectNodesInWay(way, startCalculationNode, node, nodesDistance);
  //       // ovo je kad se ne brise
  //       return true;
  //     }
  //     // ovo je kad se ne brise
  //     if (node.linkCount > 1) {
  //       nodesDistance += haversine(way.nodes[index - 1], node);
  //       connectNodesInWay(way, startCalculationNode, node, nodesDistance);
  //       startCalculationNode = node;
  //       nodesDistance = 0;
  //       return true;
  //     }
  //     nodesDistance += haversine(way.nodes[index - 1], way.nodes[index]);
  //     // ovo je kad se treba brisati
  //     return false;
  //   });
  //   // Connect nodes in way
  //   // connectNodesInWay(way);
  // });
  // bTreeWay.storeWaysToFile();
};

parse({
  filePath: path.join(__dirname, "andorra-latest.osm.pbf"),
  endDocument: function () {
    console.log("document end");
    main();
  },
  bounds: function (bounds: any) {},
  node: function (node: any) {
    bTreeTest.set("test", {});
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
