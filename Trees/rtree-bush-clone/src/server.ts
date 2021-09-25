import express, { Request, Response } from "express";
import path from "path";

const app = express();
const port = 4000;
const publicPath = path.join(__dirname, "public");

app.use(express.static("public"));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
