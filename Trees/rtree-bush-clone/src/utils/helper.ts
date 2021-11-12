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
