import { Builder } from "flatbuffers";
import * as fs from "fs";
import geohash from "ngeohash";
import { parse } from "osm-read";
import * as path from "path";
import { NodeHelper } from "./entities/NodeHelper";
import { WayHelper } from "./entities/WayHelper";
import { NodesTable } from "./flatbuffers/geo-table/nodes-table";
import { haversine } from "./graph/aStar2";
import bTreeNode from "./modules/singleton/bNodesTree";
import bTreePOI from "./modules/singleton/bTreePoi";
import NodesTbl from "./modules/singleton/nodeTable";
import BTree from "./trees/Btree";
import { GeoTree, GeoTreeNode } from "./trees/GeoTree/GeoTree";
import { Node } from "./trees/Node";
import { Way } from "./trees/Way";
import { COUNTRY, ENCODE } from "./utils/constants";
import {
  calulateHwySpeedAvg,
  connectGeotreeNodesInWay,
  hwySpeedAvg,
} from "./utils/helper";
import { Graph } from "./graph/osmnx-graph/graph";
import { Distance } from "./graph/osmnx-graph/distance";
import { countStreetsPerNode } from "./graph/osmnx-graph/stats";
import {
  parseNodesPaths,
  setNodeAttributes,
} from "./graph/osmnx-graph/graphHelper";
import { addEdgeSpeeds, addEdgeTravelTimes } from "./graph/osmnx-graph/speed";
import { TGraphWay } from "./graph/osmnx-graph/interface/graph";
import { OverpassData } from "./graph/osmnx/interface/graph";

const wayHelper = new WayHelper();
const nodeHelper = new NodeHelper();

const geotree: GeoTree = new GeoTree(ENCODE);
export const bTreeWay: BTree<number, Way> = new BTree();
export const bTreeWayNode: BTree<number, Node> = new BTree();
export const bTreeWayNodeGeohash: BTree<string, Node> = new BTree();
const GBuff = new Graph();

console.time("kreiranje karte");
const createNodesForWay = (newWay: Way) => {
  newWay.nodeRefs.forEach((element: string) => {
    let node = bTreeWayNode.get(Number(element));

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

const generatedJson: { elements: any[] } = { elements: [] };

const main = () => {
  calulateHwySpeedAvg();
  // brisemo road

  bTreeWay.valuesArray().forEach((way) => {
    let streetLength = 0;
    for (let i = 0; i < way.nodes.length - 1; i++) {
      const node = way.nodes[i];
      const node2 = way.nodes[i + 1];
      const lat1 = node.lat;
      const lng1 = node.lon;
      const lat2 = node2.lat;
      const lng2 = node2.lon;
      streetLength += Distance.greatCircleVecNum(lat1, lng1, lat2, lng2);
    }
    way.setStreetLength(streetLength);
  });

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
        const node1 = way.nodes[index - 1];
        const node2 = node;
        nodesDistance += Distance.greatCircleVecNum(
          node1.lat,
          node1.lon,
          node2.lat,
          node2.lon
        );

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
          Number(parseFloat(String(nodesDistance)).toFixed(1))
        );

        if (newStartNode) {
          geotree.insert(
            startGTreeCalculationNode.id,
            startGTreeCalculationNode
          );
          NodesTbl.wayNodes.insert(
            startGTreeCalculationNode.id,
            startGTreeCalculationNode
          );
        }

        if (newGeoTreeNode) {
          geotree.insert(gTreeNode.id, gTreeNode);
          NodesTbl.wayNodes.insert(gTreeNode.id, gTreeNode);
        }

        // ovo je kad se ne brise
        return true;
      }
      // ovo je kad se ne brise
      if (node.linkCount > 1) {
        const node1 = way.nodes[index - 1];
        const node2 = node;
        nodesDistance += Distance.greatCircleVecNum(
          node1.lat,
          node1.lon,
          node2.lat,
          node2.lon
        );

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
          Number(parseFloat(String(nodesDistance)).toFixed(1))
        );

        if (newStartNode) {
          geotree.insert(
            startGTreeCalculationNode.id,
            startGTreeCalculationNode
          );
          NodesTbl.wayNodes.insert(
            startGTreeCalculationNode.id,
            startGTreeCalculationNode
          );
        }

        if (newGeoTreeNode) {
          geotree.insert(gTreeNode.id, gTreeNode);
          NodesTbl.wayNodes.insert(gTreeNode.id, gTreeNode);
        }

        startCalculationNode = node;
        nodesDistance = 0;
        return true;
      }
      const node1 = way.nodes[index - 1];
      const node2 = way.nodes[index];

      nodesDistance += Distance.greatCircleVecNum(
        node1.lat,
        node1.lon,
        node2.lat,
        node2.lon
      );
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
  const { nodes, paths } = parseNodesPaths(generatedJson as OverpassData);

  const GBuff = new Graph();

  for (let nodeKey in nodes) {
    // @ts-ignore
    GBuff.addNode(nodeKey, nodes[nodeKey]);
  }

  Graph._addPaths(GBuff, paths);

  Distance.addEdgeLength(GBuff);

  GBuff.simplifyGraph();

  const spn = countStreetsPerNode(GBuff, GBuff.nodes);

  setNodeAttributes(GBuff, spn, "street_count");
  const G = GBuff;
  addEdgeSpeeds(G);
  addEdgeTravelTimes(G);

  const storePath = path.join(__dirname, COUNTRY + "GtreeNodes.bin");

  let builder = new Builder(1024);
  const { index: placeIndex, nodes: placeNodes } = NodesTbl.placeNodes
    .prepareIndex()
    .generateDataStructures(builder);
  const { index: poiIndex, nodes: poiNodes } = NodesTbl.poiNodes
    .prepareIndex()
    .generateDataStructures(builder);
  const { nodes: wayNodes } = NodesTbl.wayNodes.generateDataStructures(builder);

  NodesTable.startNodesTable(builder);

  NodesTable.addWayNodes(builder, wayNodes);

  NodesTable.addPlaceNodes(builder, placeNodes);
  if (placeIndex) {
    NodesTable.addIndexPlaces(builder, placeIndex);
  }

  NodesTable.addPoiNodes(builder, poiNodes);
  if (poiIndex) {
    NodesTable.addIndexPois(builder, poiIndex);
  }

  const nodesTable = NodesTable.endNodesTable(builder);

  builder.finish(nodesTable);

  const serializedBytes = builder.asUint8Array();

  fs.writeFileSync(storePath, serializedBytes, "binary");
  console.timeEnd("kreiranje karte");

  // console.time("astar 4");

  // new AStar4(path.join(__dirname, COUNTRY + "GtreeWayNodes.bin")).search(
  //   "sp91upk3u5n",
  //   "sp94p2wdbs3"
  // );

  // console.timeEnd("astar 4");

  // bTreeLoad.loadNodesFromFile(path.join(__dirname, "BtreeNodes.bin"));

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${used} MB`);
};

parse({
  filePath: path.join(__dirname, COUNTRY + "-latest.osm.pbf"),
  endDocument: function () {
    console.log("document end");
    main();
  },
  bounds: function (bounds: any) {},
  node: function (node: any) {
    generatedJson.elements.push({ ...node, type: "node" });

    GBuff.addNode(node.id, node);

    bTreeNode.set(Number(node.id), node);

    if (wayHelper.isStreetAddress(node)) {
    }

    if (
      nodeHelper.isHistoric(node) ||
      nodeHelper.isWaterway(node) ||
      nodeHelper.isTourism(node)
    ) {
      bTreePOI.set(node.tags.name, node);
      const geoHashId = geohash.encode(node.lat, node.lon, ENCODE);

      const geoHashNode = new GeoTreeNode({
        id: geoHashId,
        tags: node.tags,
      });

      NodesTbl.poiNodes.insert(geoHashId, geoHashNode);

      NodesTbl.index.pois.set(node.tags.name, [geoHashNode]);
    }
    if (nodeHelper.isAmenity(node)) {
      bTreePOI.set(node.tags.name, node);
      const geoHashId = geohash.encode(node.lat, node.lon, ENCODE);

      const geoHashNode = new GeoTreeNode({
        id: geoHashId,
        tags: node.tags,
      });

      NodesTbl.poiNodes.insert(geoHashId, geoHashNode);

      NodesTbl.index.pois.set(
        node.tags.name || node.tags.brand,
        [geoHashNode],
        true
      );
    }

    if (nodeHelper.isPlace(node)) {
      bTreePOI.set(node.tags.name, node);
      const geoHashId = geohash.encode(node.lat, node.lon, ENCODE);
      const geoHashNode = new GeoTreeNode({
        id: geoHashId,
        tags: node.tags,
      });
      NodesTbl.placeNodes.insert(geoHashId, geoHashNode);
      NodesTbl.index.places.set(node.tags.name, geoHashNode);
    }
  },
  way: function (way: Way) {
    generatedJson.elements.push({ ...way, nodes: way.nodeRefs, type: "way" });
    if (
      wayHelper.isHistoric(way) ||
      wayHelper.isWaterway(way) ||
      wayHelper.isTourism(way)
    ) {
      const { middleLat, middleLon } = wayHelper.findMiddleCoordinate(
        way,
        bTreeNode
      );

      const geoHashId = geohash.encode(middleLat, middleLon, ENCODE);
      const geoHashNode = new GeoTreeNode({
        id: geoHashId,
        tags: way.tags,
      });

      NodesTbl.poiNodes.insert(geoHashId, geoHashNode);
      NodesTbl.index.pois.set(way.tags.name, [geoHashNode]);
    }

    if (wayHelper.isAmenity(way)) {
      const { middleLat, middleLon } = wayHelper.findMiddleCoordinate(
        way,
        bTreeNode
      );

      const geoHashId = geohash.encode(middleLat, middleLon, ENCODE);
      const geoHashNode = new GeoTreeNode({
        id: geoHashId,
        tags: way.tags,
      });

      NodesTbl.poiNodes.insert(geoHashId, geoHashNode);
      NodesTbl.index.pois.set(way.tags.name || way.tags.brand, [geoHashNode]);
    }

    if (wayHelper.isPlace(way)) {
      const { middleLat, middleLon } = wayHelper.findMiddleCoordinate(
        way,
        bTreeNode
      );

      const geoHashId = geohash.encode(middleLat, middleLon, ENCODE);
      const geoHashNode = new GeoTreeNode({
        id: geoHashId,
        tags: way.tags,
      });
      NodesTbl.placeNodes.insert(geoHashId, geoHashNode);
      NodesTbl.index.places.set(way.tags.name, geoHashNode);
    }

    if (wayHelper.isRoadToStore(way)) {
      const newWay = new Way(way);

      const highway = way.tags["highway"];
      const speed = way.tags["maxspeed"];

      if (!(highway in hwySpeedAvg)) {
        hwySpeedAvg[highway] = null;
      }

      if (speed) {
        const road = hwySpeedAvg[highway];
        if (road) {
          road.push(speed);
        } else {
          hwySpeedAvg[highway] = [speed];
        }
      }

      createNodesForWay(newWay);

      bTreeWay.set(Number(way.id), newWay);
    }
  },
  relation: function (relation: any) {},
  error: function (msg: string) {
    console.log("error: " + msg);
  },
});
