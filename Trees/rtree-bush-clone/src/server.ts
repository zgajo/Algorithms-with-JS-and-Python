import express, { Request, Response } from "express";
import path from "path";

import { bTreeWay } from "../test";

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
  res.render("index", {
    title: "Welcome to Login system",
    ways: JSON.stringify(
      bTreeWay
        .valuesArray()
        .map((way) => ({
          ...way,
          nodes: way.nodes.map((node) => [node.lat, node.lon]),
        }))
    ),
  });
});

app.get("/ways", (_req: Request, res: Response) => {
  res.send(bTreeWay);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
