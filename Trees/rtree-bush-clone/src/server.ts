import express, { Request, Response } from "express";
import path from "path";
import { AStar } from "./aStar";

import { bTreeWay, bTreeWayNode } from "./dataGen";
import { Node } from "./graph/Node";

const app = express();
const port = 4000;
const publicPath = path.join(__dirname, "public");

const initializeExpress = () => {};

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.get("/", (_req: Request, res: Response) => {
  console.log(bTreeWay.size);
  console.log("object");

  const aStar = new AStar().search(
    bTreeWayNode.get("52252412") as Node,
    // bTreeWayNode.get("51390143") as Node,
    bTreeWayNode.get("51390012") as Node
  );

  res.render("index", {
    title: "Welcome to Login system",
    ways: JSON.stringify(
      bTreeWay.valuesArray().map((way) => ({
        ...way,
        nodes: way.nodes.map((node) => [node.lat, node.lon]),
      }))
    ),
    path: aStar.route,
    visited: aStar.visitedNodes,
  });
});

app.get("/ways", (_req: Request, res: Response) => {
  res.send(bTreeWay);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
