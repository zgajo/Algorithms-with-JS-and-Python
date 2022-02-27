import {_isPathOneWay, _isPathReversed, weeklyConnectedComponents,} from "./graphHelper";
import {TGraphEdges, TGraphNode, TGraphWay, TPreparedGraphWay,} from "./interface/graph";

export class Graph {
  _succ: { [key: string | number]: any };
  _pred: {[key: string]: any};
  _node: TGraphNode | {[key: string | number]: any};
  _adj: {[key: string | number]: any};
  nodes: string[];
  edges: number[][];
  graph: {[key: string | number]: any};
  degree: {[key: string]: any};
  inDegree: {[key: string]: any};
  outDegree: {[key: string]: any};
  simplified: boolean = false;

  constructor() {
    this._succ = {};
    this._pred = {};
    this._node = {};
    this._adj = this._succ;
    this.nodes = [];
    this.edges = [];
    this.graph = {};
    this.degree = {};
    this.inDegree = {};
    this.outDegree = {};
  }

  addNode(node: string, data: TGraphNode) {
    if (!this._succ[node]) {
      this._succ[node] = {};
      this._pred[node] = {};
      // @ts-ignore
      this._node[node] = { ...data };
      this.degree[node] = 0;
      this.inDegree[node] = 0;
      this.outDegree[node] = 0;
      this.nodes.push(node);
    }
  }

  addEdgesFrom(ebunchToAdd: TGraphEdges, ...rest: TPreparedGraphWay[]) {
    const keyList = [];

    for (const e of ebunchToAdd) {
      let u, v, key, dd;

      if (e.length === 4) {
        [u, v, key, dd] = e;
      } else if (e.length === 3) {
        [u, v, dd] = e;
        key = null;
      } else if (e.length === 2) {
        [u, v] = e;
        dd = {};
        key = null;
      } else {
        throw new Error(`Edge tuple ${e} musti be a 2, 3 or 4 tuple`);
      }

      let ddd = { ...rest[0] };

      if (typeof dd === "object" && dd !== null) {
        ddd = { ...ddd, ...dd };
      }

      key = this.addEdge(u, v, key);
      this._succ[u][v][key] = ddd;
      this._pred[v][u][key] = ddd;
      this.degree[u] = this.degree[u] + 1;
      this.degree[v] = this.degree[v] + 1;
      this.inDegree[v] = this.inDegree[v] + 1;
      this.outDegree[u] = this.outDegree[u] + 1;
      keyList.push(key);
    }

    return keyList;
  }
  addEdge(u: number, v: number, key: number | null = null, ...rest: {}[]) {
    if (!(u in this._succ)) {
      this._succ[u] = {};
      this._pred[u] = {};
      this._node[u] = {};
    }
    if (!(v in this._succ)) {
      this._succ[v] = {};
      this._pred[v] = {};
      this._node[v] = {};
    }

    if (key === null) {
      key = this.newEdgeKey(u, v);
    }

    if (v in this._succ[u]) {
      const keyDict = this._adj[u][v];

      let dataDict = keyDict[key];
      dataDict = { ...dataDict, ...rest[0] };
      keyDict[key] = dataDict;
      this.edges.push([u, v, key]);
      // 1450665250, 1450665253
    } else {
      let dataDict = { ...rest[0] };
      const keyDict: {[key: string | number]: any} = {};
      keyDict[key] = dataDict;
      this._succ[u][v] = keyDict;
      this._pred[v][u] = keyDict;
      this.edges.push([u, v, key]);
    }

    return key;
  }

  newEdgeKey(u: number, v: number): number {
    try {
      const keyDict = this._adj[u][v];

      if (!keyDict) {
        throw new Error("keyDict not found");
      }

      let key: number = Object.keys(keyDict).length;
      while (key in keyDict) {
        key += 1;
      }

      return key;
    } catch (error) {
      return 0;
    }
  }

  setEdgeAttributes(values: [number[], number][], name = "") {
    if (name) {
      try {
        for (const [[u, v, key], distValue] of values) {
          this._adj[u][v][key][name] = distValue;
        }
      } catch (error) {}
    } else {
    }
  }

  simplifyGraph(strict = true, removeRings = true) {
    const G = this;
    if (this.graph["simplified"]) {
      throw new Error(
        "This graph has already been simplified, cannot simplify it again"
      );
    }
    const attrsToSum = ["length", "travel_time"];

    // const initialNodeCount = this.nodes.length;
    // const initialEdgeCount = this.edges.length;
    let allNodesToRemove: string[] = [];
    const allEdgesToAdd = [];

    const paths = this.getPathsToSimplify(strict);
    let gen;

    while (!(gen = paths.next()).done) {
      let path = gen.value;

      const path1 = path.slice(0, -1);
      const path2 = path.slice(1);
      const pathAttributes: {[key: string | number]: any[] } = {};

      for (let i = 0; i < path1.length; i++) {
        const u = path1[i];
        const v = path2[i];

        const edgeCount = this.numberOfEdges(u, v);

        if (edgeCount !== 1) {
          console.log(
            `Found ${edgeCount} edges between ${u} and ${v} when simplifying`
          );
        }

        const edgeData = this._adj[u][v][0];

        for (const attr in edgeData) {
          if (attr in pathAttributes) {
            pathAttributes[attr].push(edgeData[attr]);
          } else {
            pathAttributes[attr] = [edgeData[attr]];
          }
        }
      }

      for (const attr in pathAttributes) {
        const pathAttrSet = new Set(pathAttributes[attr]);
        if (attrsToSum.includes(attr)) {
          pathAttributes[attr] = pathAttributes[attr].reduce(
            (partialSum: any, a: any) => partialSum + a,
            0
          );
        } else if (pathAttrSet.size === 1) {
          pathAttributes[attr] = pathAttributes[attr][0];
        } else {
          // @ts-ignore
          pathAttributes[attr] = pathAttrSet.values();
        }
      }

      const points = path.reduce((str, node, currentIndex) => {
        str += `${G._node[node]["x"]}, ${G._node[node]["y"]}`;
        if (currentIndex !== path.length - 1) {
          str += ", ";
        }

        return str;
      }, "");
      pathAttributes["geometry"] = `LINESTRING (${points})` as any;

      allNodesToRemove = allNodesToRemove.concat(path.slice(1, -1));
      allEdgesToAdd.push({
        origin: path[0],
        destination: path[path.length - 1],
        attr_dict: pathAttributes,
      });
    }

    for (const edge of allEdgesToAdd) {
      this.addEdge(
        Number(edge.origin),
        Number(edge.destination),
        null,
        edge.attr_dict
      );
    }

    const uniqueNodesToRemove = new Set(allNodesToRemove);
    this.removeNodesFrom(Array.from(uniqueNodesToRemove));
    console.log(this.edges);

    if (removeRings) {
      const wccs = weeklyConnectedComponents(this);
      const nodesInRings = new Set<string>();
      let wccsGeneratorHandler;

      while (!(wccsGeneratorHandler = wccs.next()).done) {
        let wcc = wccsGeneratorHandler.value;

        for (const n of wcc.values()) {
          if (!this.isEndpoint(n)) {
            wcc.forEach(nodesInRings.add, nodesInRings);
          }
        }

        this.removeNodesFrom(Array.from(nodesInRings));
      }
    }

    this["simplified"] = true;

    // const msg = `Simplified graph: ${initialNodeCount} to ${
    //   Object.keys(G._node).length
    // } nodes, ${initialEdgeCount} to ${G.edges.length} edges`;

    return this;
  }

  removeNodesFrom(nodes: any[]) {
    for (let i =0; i< nodes.length; i++) {
      const n  = nodes[i]
      const succs = this._succ[n];

      delete this._node[n];
      // Ovo mogu brisati i tako da posaljem set preko parametra i nakon sta se zavrsi for petlja napraviti:
      // this.nodes = this.nodes.filter((curr) => !nodesSet.get(curr));
      this.nodes = this.nodes.filter((curr) => curr !== n);

      for (const u in succs) {
        delete this._pred[u][n];
        this.edges = this.edges.filter(
          ([a, b]) => !(Number(n) === Number(a) && Number(u) === Number(b))
        );
      }

      delete this._succ[n];

      for (const u in this._pred[n]) {
        delete this._succ[u][n];
        this.edges = this.edges.filter(
          ([a, b]) => !(Number(n) === b && Number(u) === a)
        );
      }

      delete this._pred[n];
    }
  }

  numberOfEdges(u: string, v: string) {
    const edgeData = this._adj[u][v];

    return Object.keys(edgeData).length;
  }

  *getPathsToSimplify(strict = true) {
    const endpoints = new Set<string>();

    for (const n of this.nodes) {
      if (this.isEndpoint(n, strict)) {
        endpoints.add(n);
      }
    }

    for (const endpoint of endpoints.values()) {
      for (const successor in this._succ[endpoint]) {
        if (!endpoints.has(successor)) {
          // # if endpoint node's successor is not an endpoint, build path
          // # from the endpoint node, through the successor, and on to the
          // # next endpoint node
          yield this.buildPath(endpoint, successor, endpoints);
        }
      }
    }

    return [];
  }

  buildPath(
    endpoint: string,
    endpointSuccessor: string,
    endpoints: Set<string>
  ) {
    const path = [endpoint, endpointSuccessor];

    for (let successor in this._succ[endpointSuccessor]) {
      if (!path.includes(successor)) {
        path.push(successor);

        while (!endpoints.has(successor)) {
          const successors: string[] = [];
          for (const n in this._succ[successor]) {
            if (!path.includes(n)) {
              successors.push(n);
            }
          }

          if (successors.length === 1) {
            successor = successors[0];
            path.push(successor);
          } else if (successors.length === 0) {
            if (endpoint in this._succ[successor]) {
              return path.concat([endpoint]);
            }
            return path;
          } else {
            throw new Error(
              `Unexpected simplify pattern handled near ${successor}`
            );
          }
        }

        return path;
      }
    }

    return path;
  }

  isEndpoint(node: string, strict = true) {
    const neighbourgs = new Set(
      Object.keys(this._pred[node] || {}).concat(
        Object.keys(this._succ[node] || {})
      )
    );
    const n = neighbourgs.size;
    const d = this.degree[node];

    if (neighbourgs.has(node)) {
      //  if the node appears in its list of neighbors, it self-loops
      //  this is always an endpoint.
      return true;
    } else if (this.outDegree[node] === 0 || this.inDegree[node] === 0) {
      //  if node has no incoming edges or no outgoing edges, it is an endpoint
      return true;
    } else if (!(n === 2 && (d === 2 || d === 4))) {
      // # else, if it does NOT have 2 neighbors AND either 2 or 4 directed
      //   # edges, it is an endpoint. either it has 1 or 3+ neighbors, in which
      //   # case it is a dead-end or an intersection of multiple streets or it has
      //   # 2 neighbors but 3 degree (indicating a change from oneway to twoway)
      //   # or more than 4 degree (indicating a parallel edge) and thus is an
      //   # endpoint
      return true;
    } else if (!strict) {
      //    # non-strict mode: do its incident edges have different OSM IDs?
      // osmids = []
      // # add all the edge OSM IDs for incoming edges
      // for u in G.predecessors(node):
      //     for key in G[u][node]:
      //         osmids.append(G.edges[u, node, key]["osmid"])
      // # add all the edge OSM IDs for outgoing edges
      // for v in G.successors(node):
      //     for key in G[node][v]:
      //         osmids.append(G.edges[node, v, key]["osmid"])
      // # if there is more than 1 OSM ID in the list of edge OSM IDs then it is
      // # an endpoint, if not, it isn't
      // return len(set(osmids)) > 1
      return false;
    } else return false;
  }

  static _addPaths(G: Graph, paths: TGraphWay, bidirectional?: false) {
    for (let pathKey in paths) {
      const path = paths[pathKey];
      let nodes = [...path.nodes];

      const isOneWay = _isPathOneWay(path, bidirectional);
      if (isOneWay && _isPathReversed(path)) {
        nodes = nodes.reverse();
      }

      path.oneway = isOneWay;

      let edges: TGraphEdges = [];

      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push([nodes[i], nodes[i + 1]]);
      }

      if (!isOneWay) {
        edges = edges.concat(edges.map((arr) => arr.slice(0).reverse()));
      }

      G.addEdgesFrom(edges, path);
    }
  }
}
