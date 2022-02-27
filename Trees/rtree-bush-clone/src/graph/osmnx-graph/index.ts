import * as fs from "fs";
import * as path from "path";
import { parseNodesPaths, setNodeAttributes } from "./graphHelper";
import { Graph } from "./graph";
import { Distance } from "./distance";
import { countStreetsPerNode } from "./stats";
import { addEdgeSpeeds, addEdgeTravelTimes } from "./speed";

var rseloJson = JSON.parse(
  fs.readFileSync(path.join(__dirname + "/rselo.json"), "utf8")
);

console.log(rseloJson.elements.length);

const { nodes, paths } = parseNodesPaths(rseloJson);

const GBuff = new Graph();

for (let nodeKey in nodes) {
  // @ts-ignore
  GBuff.addNode(nodeKey, nodes[nodeKey]);
}

Graph._addPaths(GBuff, paths);

console.log(
  `Created graph with ${GBuff.edges.length} edges and ${GBuff.nodes.length} nodes`
);

Distance.addEdgeLength(GBuff);

GBuff.simplifyGraph();

const spn = countStreetsPerNode(GBuff, GBuff.nodes);

setNodeAttributes(GBuff, spn, "street_count");
const G = GBuff;
addEdgeSpeeds(G);
addEdgeTravelTimes(G);

const startNode = 1454283110;
const destNode = 1454282153;

console.log("first");
