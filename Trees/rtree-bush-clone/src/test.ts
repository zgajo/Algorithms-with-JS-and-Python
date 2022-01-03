import { Builder, ByteBuffer } from "flatbuffers";
import * as fs from "fs";
import * as path from "path";
import { NodesTable } from "./flatbuffers/geo-table/nodes-table";
import { FlatBufferBTree } from "./trees/Btree/FlatbufferBTree";
import { FlatBufferGeoHashTree } from "./trees/GeoTree/FlatbufferGTree";
import { COUNTRY } from "./utils/constants";

const storePath = path.join(__dirname, COUNTRY + "GtreeNodes.bin");

var bytes = new Uint8Array(fs.readFileSync(storePath));

var buf2 = new ByteBuffer(bytes);
var nodesTable = NodesTable.getRootAsNodesTable(buf2);

const nodesTablePlaceNodes = nodesTable.placeNodes();

const nodesTableIndexPlaces = nodesTable.indexPlaces();
const placesIndex = nodesTableIndexPlaces
  ? new FlatBufferBTree(nodesTableIndexPlaces)
  : null;
const placesNodes = nodesTablePlaceNodes
  ? new FlatBufferGeoHashTree(nodesTablePlaceNodes)
  : null;

const geonode = placesNodes?.getNode("u218qqwpe");
const node = placesIndex?.getKey("Rovinj");

console.log(geonode?.id(), JSON.parse(geonode?.tags() || ""));
console.log(node?.id(), JSON.parse(node?.tags() || ""));
console.log("object");
