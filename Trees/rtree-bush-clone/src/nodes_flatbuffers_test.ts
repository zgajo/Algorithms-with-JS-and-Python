import { Builder, ByteBuffer } from "flatbuffers";
import * as fs from "fs";
import { Node } from "./flatbuffers/map/node/node";

var builder = new Builder(1024);
Node.startNode(builder);
Node.addId(builder, 1);
Node.addLat(builder, 14.14);
Node.addLon(builder, 1.13);
Node.addDistance(builder, 4);
const node1 = Node.endNode(builder);

// Call `finish()` to instruct the builder that this monster is complete.
builder.finish(node1); // You could also call `MyGame.Sample.Monster.finishMonsterBuffer(builder, orc);`.

Node.startNode(builder);
Node.addId(builder, 1);
Node.addLat(builder, 14.14);
Node.addLon(builder, 1.13);
Node.addDistance(builder, 4);
const node2 = Node.endNode(builder);

// Call `finish()` to instruct the builder that this monster is complete.
builder.finish(node2); // You could also call `MyGame.Sample.Monster.finishMonsterBuffer(builder, orc);`.
