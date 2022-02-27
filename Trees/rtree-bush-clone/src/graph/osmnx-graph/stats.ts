import { Graph } from "./graph";

export function countStreetsPerNode(G: Graph, nodes?: string[]) {
  if (!nodes) {
    nodes = G.nodes;
  }

  const nodeCount: {[key: string]: number} = {};

  for (const node in G._node) {
    nodeCount[node] = Object.keys(G._adj[node]).length;
  }

  return nodeCount;
}
