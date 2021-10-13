import { parse } from "osm-read";
import * as path from "path";
import { haversine, AStar2 } from "./graph/aStar2";
import BTree from "./trees/Btree";
import { Node } from "./trees/Node";
import { Way } from "./trees/Way";
import { connectNodesInWay } from "./utils/helper";

const bTreeLoad = new BTree();

const main = () => {
  // console.time("loadNodesFromFileTime");
  // bTreeLoad.loadNodesFromFile(path.join(__dirname, "nodesBtreeNodes"));
  // console.timeEnd("loadNodesFromFileTime");
  console.time("astar");

  console.time("astar init");
  const astar = new AStar2(path.join(__dirname, "nodesBtreeNodes"));
  console.timeEnd("astar init");

  console.time("astar search");
  astar.search("1454283110", "748833076");
  console.timeEnd("astar search");
  console.timeEnd("astar");
};

main();
