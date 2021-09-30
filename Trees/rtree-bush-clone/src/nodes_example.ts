import * as fs from "fs";
import * as process from "process";
import * as Schema from "./nodes_pb";

const { Node } = Schema;

const node = new Node();

node.setId(123456);
node.setLat(14.6598985);
node.setLon(1.65899);

const node2 = new Node();

node2.setId(654321);
node2.setLat(14.3498985);
node2.setLon(1.34899);
node.addPointsto(node2);
node2.addPointsto(node);

const nodes = new Schema.Nodes();

nodes.addNodes(node);
nodes.addNodes(node2);

const nodesBytes = nodes.serializeBinary();
console.log("Binary: ", nodesBytes);
fs.writeFileSync("nodesbinary", nodesBytes);

const fileData = fs.readFileSync("./nodesbinary");

const deserializedFileData = Schema.Nodes.deserializeBinary(fileData);

deserializedFileData.getNodesList();
deserializedFileData.getNodesList().forEach((n) => {
  console.log("node: ", n.toObject());
});

const used = process.memoryUsage();
type Keys = keyof typeof used;

for (let k in used) {
  /**
   * memoryUsage returns an object with various information: rss, heapTotal, heapUsed, external:

rss stands for Resident Set Size, it is the total memory allocated for the process execution
heapTotal is the total size of the allocated heap
heapUsed is the actual memory used during the execution of our process . external is, according to the documentation, the memory used by "C++ objects bound to JavaScript objects managed by V8"
   */
  let key: Keys = k as Keys;
  console.log(`${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`);
}
