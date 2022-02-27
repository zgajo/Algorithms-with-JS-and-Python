import { Graph } from "./graph";
import { Element, OverpassData, Type } from "../osmnx/interface/graph";
import {
  TGraphNode,
  TGraphWay,
  TPreparedGraphNode,
  TPreparedGraphWay,
} from "./interface/graph";
import {
  usefulTagsNode,
  usefulTagsWay,
  onewayValues,
  reversedValues,
} from "./settings";

export function parseNodesPaths(responseJson: OverpassData) {
  const nodes: TGraphNode = {};

  const paths: TGraphWay = {};

  for (const element of responseJson["elements"]) {
    if (element["type"] === Type.Node) {
      nodes[element.id] = convertNode(element);
    } else if (element["type"] === Type.Way) {
      paths[element.id] = convertPath(element);
    }
  }

  return { nodes, paths };
}

function convertNode(element: Element) {
  if (element.lat === undefined || element.lon === undefined) {
    throw new Error("lat or lon not set");
  }

  const node: TPreparedGraphNode = {
    x: element["lon"],
    y: element["lat"],
  };

  if (element.tags) {
    for (let usefulTag of usefulTagsNode) {
      if (element["tags"][usefulTag]) {
        node[usefulTag] = element["tags"][usefulTag];
      }
    }
  }
  return node;
}

function convertPath(element: Element) {
  const path: TPreparedGraphWay = {
    osmid: element.id,
    nodes: element["nodes"] as number[],
  };

  if (element.tags) {
    for (let usefulTag of usefulTagsWay) {
      // @ts-ignore
      if (element["tags"][usefulTag]) {
        // @ts-ignore
        path[usefulTag] = element["tags"][usefulTag];
      }
    }
  }
  return path;
}

export const _isPathOneWay = (
  path: TPreparedGraphWay,
  bidirectional?: boolean
) => {
  if (bidirectional) {
    // # if this is a bi-directional network type, then nothing in it is
    // # considered one-way. eg, if this is a walking network, this may very
    // # well be a one-way street (as cars/bikes go), but in a walking-only
    // # network it is a bi-directional edge (you can walk both directions on
    // # a one-way street). so we will add this path (in both directions) to
    // # the graph and set its oneway attribute to False.
    return false;
  } else if (
    "oneway" in path &&
    path["oneway"] &&
    String(path["oneway"]) in onewayValues
  ) {
    // # if this path is tagged as one-way and if it is not a bi-directional
    // # network type then we'll add the path in one direction only
    return true;
  } else if ("junction" in path && path["junction"] == "roundabout") {
    // # roundabouts are also one-way but are not explicitly tagged as such
    return true;
  } else {
    // # otherwise this path is not tagged as a one-way
    return false;
  }
};

export const _isPathReversed = (path: TPreparedGraphWay) => {
  if (
    "oneway" in path &&
    path["oneway"] &&
    String(path["oneway"]) in reversedValues
  ) {
    return true;
  } else {
    return false;
  }
};

export function* weeklyConnectedComponents(G: Graph) {
  const seen = new Set();

  for (const v in G._adj) {
    if (!seen.has(v)) {
      const c = new Set(plainBfs(G, v));
      yield c;
    }
  }
}

function* plainBfs(G: Graph, source: string) {
  const gSucc = G._succ;
  const gPred = G._pred;

  const seen = new Set();
  let nextLevel = new Set<string>([source]);

  while (nextLevel.size) {
    const thisLevel = nextLevel;
    nextLevel = new Set();

    for (const v of thisLevel.values()) {
      if (!seen.has(v)) {
        seen.add(v);
        Object.keys(gSucc[v]).forEach(nextLevel.add, nextLevel);
        Object.keys(gPred[v]).forEach(nextLevel.add, nextLevel);

        yield v;
      }
    }
  }
}

export const setNodeAttributes = (
  G: Graph,
  values: { [key: string]: number },
  name: any
) => {
  if (name) {
    for (const node in values) {
      G._node[node][name] = values[node];
    }
  }
};

// Converts numeric degrees to radians
function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
export function calcCrow(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  var EARTH_RADIUS_KM = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = EARTH_RADIUS_KM * c;
  return d;
}
