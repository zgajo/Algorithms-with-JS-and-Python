import { ByteBuffer } from "flatbuffers";
import fs from "fs";
import path from "path";
import { NodesTable } from "./flatbuffers/geo-table/nodes-table";
import { FlatBufferGeoHashTree } from "./trees/GeoTree/FlatbufferGTree";
import { COUNTRY } from "./utils/constants";

console.log(FlatBufferGeoHashTree.proximityHash(45.11096, 13.70914, 1000, 6));

var bytes = new Uint8Array(
  fs.readFileSync(path.join(__dirname, COUNTRY + "GtreeNodes.bin"))
);

var buf2 = new ByteBuffer(bytes);

// Get an accessor to the root object inside the buffer.
var nodesTable = NodesTable.getRootAsNodesTable(buf2);
const places = nodesTable.placeNodes();
if (places) {
  const geohashTree = new FlatBufferGeoHashTree(places);
  const foundInRadius = geohashTree.findNearestNodes(45.11096, 13.70914);

  console.log(foundInRadius);

  const bounds = FlatBufferGeoHashTree.bounds("u218xunwq");
  console.log(Object.values(bounds.ne), Object.values(bounds.sw));
}
