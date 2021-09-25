import { Node } from "./Node";

export class Edge {
  from: Node;
  to: Node;
  distance: number;

  constructor(from: Node, to: Node, distance: number) {
    this.from = from;
    this.to = to;
    this.distance = distance;
  }
}

export class ConnectionGraph {
  edgeList: Edge[];

  constructor() {
    this.edgeList = [];
  }

  addEdge() {}
}
