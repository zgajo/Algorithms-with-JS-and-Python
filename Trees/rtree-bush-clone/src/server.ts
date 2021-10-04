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

app.get("/", (req: Request, res: Response) => {
  console.log(req.query.start);
  console.log(req.query.end);
  if (!req.query.start || !req.query.end) {
    return res.render("index", {
      title: "Welcome to Login system",
      ways: JSON.stringify(
        bTreeWay.valuesArray().map((way) => ({
          ...way,
          nodes: way.nodes.map((node) => [node.lat, node.lon]),
        }))
      ),
    });
  }

  const foundStartNode = bTreeWayNode.get(req.query.start as string) as Node;
  const startNode = {
    id: foundStartNode.id,
    latLng: [foundStartNode?.lat, foundStartNode?.lon],
  };

  const foundEndNode = bTreeWayNode.get(req.query.end as string) as Node;
  const endNode = {
    id: foundEndNode.id,
    latLng: [foundEndNode?.lat, foundEndNode?.lon],
  };

  // const nodes = {
  //   "1934144326": { id: "1934144326", latLng: [42.5352594, 1.5880477] },
  //   "52252412": { id: "52252412", latLng: [42.462679, 1.4911587] },
  //   "51390012": { id: "51390012", latLng: [42.5463649, 1.7309591] },
  //   "51390143": { id: "51390143", latLng: [42.5423052, 1.7338036] },
  //   // croatia
  //   "1454283110": { id: "1454283110", latLng: [45.110571, 13.7094278] },
  //   "2682013028": { id: "2682013028", latLng: [45.0809029, 13.6384089] },
  //   "748833076": { id: "748833076", latLng: [45.0808344, 13.6383927] },
  // };

  // const startNode = nodes["2682013028"];
  // const endNode = nodes["748833076"];

  const aStar = new AStar().search(
    // bTreeWayNode.get("1934144326") as Node,
    bTreeWayNode.get(startNode.id) as Node,
    // bTreeWayNode.get("51390143") as Node,
    bTreeWayNode.get(endNode.id) as Node

    // r.selo -> rovinj

    // bTreeWayNode.get("1454283110") as Node,
    // bTreeWayNode.get("748833076") as Node
  );

  res.render("index", {
    title: "Welcome to Login system",
    startNode: startNode.latLng,
    endNode: endNode.latLng,
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
