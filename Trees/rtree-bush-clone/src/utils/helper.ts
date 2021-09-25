import { Node } from "../graph/Node";

function degreesToRadians(degrees: number) {
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
