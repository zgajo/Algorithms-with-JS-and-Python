import { GeoTreeNode } from "../trees/GeoTree/GeoTree";
import { Node } from "../trees/Node";
import { Way } from "../trees/Way";

export const KM_TO_METERS = 1000;

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
  const highway = way.tags["highway"];
  let speedKph = way.tags["maxspeed"] || hwySpeedAvg[highway];
  const travelTime = calculateTravelTime(nodesDistance, speedKph);
  // JEDNOSMJERNE
  // junction	roundabout
  // oneway=yes
  // oneway=-1 suprotni smjer
  if (way.tags.oneway == "-1") {
    (endNode.pointsTo as Node[]).push(startCalculationNode);
    endNode.distance.push(nodesDistance);
    endNode.edgeSpeed.push(speedKph);
    endNode.highway.push(highway);
    endNode.travelTime.push(travelTime);
  } else if (way.tags.oneway === "yes" || way.tags.junction === "roundabout") {
    (startCalculationNode.pointsTo as Node[]).push(endNode);
    startCalculationNode.distance.push(nodesDistance);
    startCalculationNode.edgeSpeed.push(speedKph);
    startCalculationNode.highway.push(highway);
    startCalculationNode.travelTime.push(travelTime);
  } else {
    (startCalculationNode.pointsTo as Node[]).push(endNode);
    startCalculationNode.distance.push(nodesDistance);
    startCalculationNode.edgeSpeed.push(speedKph);
    startCalculationNode.highway.push(highway);
    startCalculationNode.travelTime.push(travelTime);

    (endNode.pointsTo as Node[]).push(startCalculationNode);
    endNode.distance.push(nodesDistance);
    endNode.edgeSpeed.push(speedKph);
    endNode.highway.push(highway);
    endNode.travelTime.push(travelTime);
  }
};

export const connectGeotreeNodesInWay = (
  way: Way,
  startCalculationNode: GeoTreeNode,
  endNode: GeoTreeNode,
  nodesDistance: number
) => {
  const highway = way.tags["highway"];
  let speedKph = way.tags["maxspeed"] || hwySpeedAvg[highway];
  const travelTime = calculateTravelTime(nodesDistance, speedKph);
  // JEDNOSMJERNE
  // junction	roundabout
  // oneway=yes
  // oneway=-1 suprotni smjer
  if (way.tags.oneway == "-1") {
    endNode.pointsTo.push(startCalculationNode.id);
    endNode.distance.push(nodesDistance);
    endNode.edgeSpeed.push(speedKph);
    endNode.highway.push(highway);
    endNode.travelTime.push(travelTime);
  } else if (way.tags.oneway === "yes" || way.tags.junction === "roundabout") {
    startCalculationNode.pointsTo.push(endNode.id);
    startCalculationNode.distance.push(nodesDistance);
    startCalculationNode.edgeSpeed.push(speedKph);
    startCalculationNode.highway.push(highway);
    startCalculationNode.travelTime.push(travelTime);
  } else {
    startCalculationNode.pointsTo.push(endNode.id);
    startCalculationNode.distance.push(nodesDistance);
    startCalculationNode.edgeSpeed.push(speedKph);
    startCalculationNode.highway.push(highway);
    startCalculationNode.travelTime.push(travelTime);

    endNode.pointsTo.push(startCalculationNode.id);
    endNode.distance.push(nodesDistance);
    endNode.edgeSpeed.push(speedKph);
    endNode.highway.push(highway);
    endNode.travelTime.push(travelTime);
  }
};

export const hwySpeedAvg: { [key: string]: null | any[] } = {};

export const calulateHwySpeedAvg = () => {
  //* Stavljamo speed za svako road
  const arrAvg = (arr: any[]) =>
    arr.reduce((a, b) => Number(a) + Number(b), 0) / arr.length;

  let avg = 0;
  let avgCount = 0;

  for (const key in hwySpeedAvg) {
    if (hwySpeedAvg[key]) {
      const speedAvg = arrAvg(hwySpeedAvg[key] || []);
      hwySpeedAvg[key] = speedAvg as any;
      avgCount += 1;
      avg += speedAvg;
    }
  }

  for (const key in hwySpeedAvg) {
    if (!hwySpeedAvg[key]) {
      hwySpeedAvg[key] = (avg / avgCount) as any;
    }
  }
};

/**
 * @distanceKm transforms retreived distance in meters to kilometers
 * @speedKmSec transforms speed in kph to kps
 * returns travel time in seconds
 * */
export const calculateTravelTime = (
  distanceMeter: number,
  speedKph: number
) => {
  //  convert distance meters to km, and speed km per hour to km per second
  const distanceKm = distanceMeter / 1000;
  const speedKmSec = speedKph / (60 * 60);

  const travelTime = parseFloat(Number(distanceKm / speedKmSec).toFixed(1));

  return travelTime;
};
