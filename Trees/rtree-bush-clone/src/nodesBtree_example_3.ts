import { parse } from "osm-read";
import * as path from "path";
import { haversine, AStar2 } from "./graph/aStar2";
import { AStar3 } from "./graph/aStar3";
import BTree from "./trees/Btree";
import { Node } from "./trees/Node";
import { Way } from "./trees/Way";
import { COUNTRY } from "./utils/constants";
import { connectNodesInWay } from "./utils/helper";

const bTreeLoad = new BTree();
const bTreeTest = new BTree();
const bTreeNode: BTree<number, any> = new BTree();
const bTreeHistoric = new BTree();
export const bTreeWay: BTree<number, Way> = new BTree();
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
  newWay.nodeRefs.forEach((element: string) => {
    const node = bTreeWayNode.get(Number(element));

    if (node) {
      node.increaseLinkCount();
      node.partOfWays.push(newWay);
      newWay.addNode(node);
    } else {
      const storedNode = bTreeNode.get(Number(element));

      const newNode = new Node({
        ...storedNode,
      });

      newNode.addWay(newWay);

      bTreeWayNode.set(Number(element), newNode);

      newWay.addNode(newNode);
    }
  });
};

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
        connectNodesInWay(
          way,
          startCalculationNode,
          node,
          parseInt(String(nodesDistance))
        );
        // ovo je kad se ne brise
        return true;
      }
      // ovo je kad se ne brise
      if (node.linkCount > 1) {
        nodesDistance += haversine(way.nodes[index - 1], node);
        connectNodesInWay(
          way,
          startCalculationNode,
          node,
          parseInt(String(nodesDistance))
        );
        startCalculationNode = node;
        nodesDistance = 0;
        return true;
      }
      nodesDistance += haversine(way.nodes[index - 1], way.nodes[index]);
      // ovo je kad se treba brisati
      return false;
    });
  });

  bTreeWayNode.storeNodesToFile(
    path.join(__dirname, COUNTRY + "BtreeNodes.bin")
  );
  console.log("bTreeHistoric", bTreeHistoric.valuesArray().length);
  // console.log(bTreeWayNode.get("1934144326"));

  bTreeHistoric.storeNodesToFile(
    path.join(__dirname, COUNTRY + "BtreeHistoricNodes.bin")
  );

  bTreeWay.storeNodesToFile(path.join(__dirname, COUNTRY + "BtreeWays.bin"));

  // bTreeLoad.loadNodesFromFile(path.join(__dirname, "BtreeNodes.bin"));
  console.log("object");
};

parse({
  filePath: path.join(__dirname, COUNTRY + "-latest.osm.pbf"),
  endDocument: function () {
    console.log("document end");
    main();
  },
  bounds: function (bounds: any) {},
  node: function (node: any) {
    bTreeNode.set(Number(node.id), node);

    if (shouldStoreHistoric(node)) {
      bTreeHistoric.set(node.tags.name, node);
    }
  },
  way: function (way: Way) {
    // if (shouldStoreHistoric(way)) {
    //   const newWay = new Way(way);

    //   createNodesForWay(newWay);

    //   let minLat = newWay.nodes[0].lat;
    //   let minLon = newWay.nodes[0].lon;
    //   let maxLat = newWay.nodes[0].lat;
    //   let maxLon = newWay.nodes[0].lon;

    //   newWay.nodes.forEach((node) => {
    //     if (node.lat > maxLat) maxLat = node.lat;
    //     if (node.lat < minLat) minLat = node.lat;
    //     if (node.lon > maxLon) maxLon = node.lon;
    //     if (node.lon < minLon) minLat = node.lon;
    //   });

    //   const lat = (minLat + maxLat) / 2
    //   const lon = (minLon + maxLon) / 2

    //    new Node({

    //    })

    //   bTreeHistoric.set(way.tags.name, node);
    // }

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

      createNodesForWay(newWay);

      bTreeWay.set(Number(way.id), newWay);
    }
  },
  relation: function (relation: any) {},
  error: function (msg: string) {
    console.log("error: " + msg);
  },
});
