import { GeoTreeNode } from "../trees/GeoTree/GeoTree";
import { Node } from "../trees/Node";
import { Way } from "../trees/Way";

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function distanceInKmBetweenEarthCoordinates(from: Node, to: Node) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(to.lat - from.lat);
  var dLon = degreesToRadians(to.lon - from.lon);

  const lat1 = degreesToRadians(from.lat);
  const lat2 = degreesToRadians(to.lat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export const connectNodesInWay = (
  way: Way,
  startCalculationNode: Node,
  endNode: Node,
  nodesDistance: number
) => {
  // JEDNOSMJERNE
  // junction	roundabout
  // oneway=yes
  // oneway=-1 suprotni smjer
  if (way.tags.oneway == "-1") {
    (endNode.pointsTo as Node[]).push(startCalculationNode);
    endNode.distance.push(nodesDistance);
  } else if (way.tags.oneway === "yes" || way.tags.junction === "roundabout") {
    (startCalculationNode.pointsTo as Node[]).push(endNode);
    startCalculationNode.distance.push(nodesDistance);
  } else {
    (startCalculationNode.pointsTo as Node[]).push(endNode);
    startCalculationNode.distance.push(nodesDistance);
    (endNode.pointsTo as Node[]).push(startCalculationNode);
    endNode.distance.push(nodesDistance);
  }
};

export const connectGeotreeNodesInWay = (
  way: Way,
  startCalculationNode: GeoTreeNode,
  endNode: GeoTreeNode,
  nodesDistance: number
) => {
  // JEDNOSMJERNE
  // junction	roundabout
  // oneway=yes
  // oneway=-1 suprotni smjer
  if (way.tags.oneway == "-1") {
    endNode.pointsTo.push(startCalculationNode.id);
    endNode.distance.push(nodesDistance);
  } else if (way.tags.oneway === "yes" || way.tags.junction === "roundabout") {
    startCalculationNode.pointsTo.push(endNode.id);
    startCalculationNode.distance.push(nodesDistance);
  } else {
    startCalculationNode.pointsTo.push(endNode.id);
    startCalculationNode.distance.push(nodesDistance);
    endNode.pointsTo.push(startCalculationNode.id);
    endNode.distance.push(nodesDistance);
  }
};

export const isWayToStore = (way: any) => {
  return (
    way.tags.highway &&
    (way.tags.highway === "motorway" ||
      way.tags.highway === "trunk" ||
      way.tags.highway === "primary" ||
      way.tags.highway === "tertiary" ||
      way.tags.highway === "unclassified" ||
      way.tags.highway === "residential" ||
      way.tags.highway === "trunk_link" ||
      way.tags.highway === "motorway_link" ||
      way.tags.highway === "primary_link" ||
      way.tags.highway === "secondary_link" ||
      way.tags.highway === "tertiary_link" ||
      way.tags.highway === "service" ||
      way.tags.highway === "secondary")
  );
};

export const shouldStoreWaterway = (node: any) => {
  if (node.tags?.waterway && node.tags?.name) {
    // List of waterways we want to store
    if (
      node.tags.waterway &&
      node.tags.waterway !== "dam" &&
      node.tags.waterway !== "weir" &&
      node.tags.waterway !== "waterfall" &&
      node.tags.waterway !== "rapids" &&
      node.tags.waterway !== "lock_gate"
    ) {
      return false;
    }

    return true;
  }

  return false;
};

export const shouldStoreTourism = (node: any) => {
  if (node.tags?.tourism && node.tags?.name) {
    // List of tourisms we dont want to store
    if (
      node.tags.tourism &&
      (node.tags.tourism === "hostel" ||
        node.tags.tourism === "hotel" ||
        node.tags.tourism === "guest_house" ||
        node.tags.tourism === "information" ||
        node.tags.tourism === "caravan_site" ||
        node.tags.tourism === "chalet" ||
        node.tags.tourism === "camp_site" ||
        node.tags.tourism === "camp_pitch" ||
        node.tags.tourism === "apartment" ||
        node.tags.tourism === "motel")
    ) {
      return false;
    }

    return true;
  }

  return false;
};

export const shouldStoreHistoric = (node: any) => {
  // Moze biti i relation i way
  if (node.tags?.historic && node.tags?.name) {
    return true;
  }

  return false;
};
