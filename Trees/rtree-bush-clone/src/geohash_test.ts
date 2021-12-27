import geohash from "ngeohash";

import { parse } from "osm-read";
import * as path from "path";
import { haversine, AStar2 } from "./graph/aStar2";
import { AStar3 } from "./graph/aStar3";
import { AStar4 } from "./graph/aStar4";
import Btree from "./trees/Btree";
import BTree from "./trees/Btree";
import { GeoTree, GeoTreeNode } from "./trees/GeoTree/GeoTree";
import { Node } from "./trees/Node";
import { Way } from "./trees/Way";
import { COUNTRY } from "./utils/constants";
import {
  connectGeotreeNodesInWay,
  connectNodesInWay,
  isWayToStore,
  shouldStoreHistoric,
  shouldStoreTourism,
  shouldStoreWaterway,
} from "./utils/helper";

const ENCODE = 11;

const geotree: GeoTree = new GeoTree(ENCODE);
const bTreeNode: BTree<number, any> = new BTree();
const bTreeHistoric = new BTree();
export const bTreeWay: BTree<number, Way> = new BTree();
export const bTreeWayNode: BTree<number, Node> = new BTree();
export const bTreeWayNodeGeohash: BTree<string, Node> = new BTree();

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

        let newStartNode = false;
        const h = geohash.encode(
          startCalculationNode.lat,
          startCalculationNode.lon,
          ENCODE
        );
        let startGTreeCalculationNode = (geotree.getNode(h) || [])[0];

        if (!startGTreeCalculationNode) {
          newStartNode = true;
          startGTreeCalculationNode = new GeoTreeNode({
            id: geohash.encode(
              startCalculationNode.lat,
              startCalculationNode.lon,
              ENCODE
            ),
          });
        }

        let newGeoTreeNode = false;
        let gTreeNode = (geotree.getNode(
          geohash.encode(node.lat, node.lon, ENCODE)
        ) || [])[0];
        if (!gTreeNode) {
          newGeoTreeNode = true;
          gTreeNode = new GeoTreeNode({
            id: geohash.encode(node.lat, node.lon, ENCODE),
          });
        }

        connectGeotreeNodesInWay(
          way,
          startGTreeCalculationNode,
          gTreeNode,
          parseInt(String(nodesDistance))
        );

        if (newStartNode) {
          geotree.insert(
            startGTreeCalculationNode.id,
            startGTreeCalculationNode
          );
        }

        if (newGeoTreeNode) {
          geotree.insert(gTreeNode.id, gTreeNode);
        }

        // ovo je kad se ne brise
        return true;
      }
      // ovo je kad se ne brise
      if (node.linkCount > 1) {
        nodesDistance += haversine(way.nodes[index - 1], node);

        let newStartNode = false;
        let startGTreeCalculationNode = (geotree.getNode(
          geohash.encode(
            startCalculationNode.lat,
            startCalculationNode.lon,
            ENCODE
          )
        ) || [])[0];
        if (!startGTreeCalculationNode) {
          newStartNode = true;
          startGTreeCalculationNode = new GeoTreeNode({
            id: geohash.encode(
              startCalculationNode.lat,
              startCalculationNode.lon,
              ENCODE
            ),
          });
        }

        let newGeoTreeNode = false;
        let gTreeNode = (geotree.getNode(
          geohash.encode(node.lat, node.lon, ENCODE)
        ) || [])[0];
        if (!gTreeNode) {
          newGeoTreeNode = true;
          gTreeNode = new GeoTreeNode({
            id: geohash.encode(node.lat, node.lon, ENCODE),
          });
        }

        connectGeotreeNodesInWay(
          way,
          startGTreeCalculationNode,
          gTreeNode,
          parseInt(String(nodesDistance))
        );

        if (newStartNode) {
          geotree.insert(
            startGTreeCalculationNode.id,
            startGTreeCalculationNode
          );
        }

        if (newGeoTreeNode) {
          geotree.insert(gTreeNode.id, gTreeNode);
        }

        startCalculationNode = node;
        nodesDistance = 0;
        return true;
      }
      nodesDistance += haversine(way.nodes[index - 1], way.nodes[index]);
      // ovo je kad se treba brisati
      return false;
    });
  });

  // console.time("astar 3");
  // console.log("a star");
  // new AStar3(path.join(__dirname, COUNTRY + "BtreeNodes.bin")).search(
  //   // bTreeWayNode.get("1934144326") as Node,
  //   Number(1934144326),
  //   // bTreeWayNode.get("51390143") as Node,
  //   Number(51390143)

  //   // r.selo -> rovinj

  //   // bTreeWayNode.get("1454283110") as Node,
  //   // bTreeWayNode.get("748833076") as Node
  // );
  // console.timeEnd("astar 3");

  geotree.storeToTheFile(path.join(__dirname, COUNTRY + "GtreeWayNodes.bin"));
  // console.time("astar 4");

  // new AStar4(path.join(__dirname, COUNTRY + "GtreeWayNodes.bin")).search(
  //   "sp91upk3u5n",
  //   "sp94p2wdbs3"
  // );

  // console.timeEnd("astar 4");

  // bTreeLoad.loadNodesFromFile(path.join(__dirname, "BtreeNodes.bin"));
  console.log(geotree);
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

    if (
      shouldStoreHistoric(node) ||
      shouldStoreWaterway(node) ||
      shouldStoreTourism(node)
    ) {
      bTreeHistoric.set(node.tags.name, node);
    }
  },
  way: function (way: Way) {
    if (isWayToStore(way)) {
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
