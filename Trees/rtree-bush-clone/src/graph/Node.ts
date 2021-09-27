import { BBox } from "../BBox";
import { distanceInKmBetweenEarthCoordinates } from "../utils/helper";
import { Way } from "./Way";

export class Node extends BBox {
  id: string;
  lon: number;
  lat: number;
  pointsTo: Node[];
  distance: number[];
  tags: { [key: string]: any } | undefined;
  partOfWays: Way[];
  linkCount: number;

  constructor(node: {
    id: string;
    lat: number;
    lon: number;
    tags?: { [key: string]: any };
  }) {
    super(node.lat, node.lon, node.lat, node.lon);

    this.id = node.id;
    this.lon = node.lon;
    this.lat = node.lat;
    this.pointsTo = [];
    this.distance = [];

    this.tags = node.tags;
    this.partOfWays = [];
    this.linkCount = 1;
  }

  calculateDistance(to: Node): number {
    return distanceInKmBetweenEarthCoordinates(this, to);
  }

  connectToNode(node: Node) {
    this.pointsTo.push(node);
    this.distance.push(distanceInKmBetweenEarthCoordinates(this, node));
  }

  addWay(way: Way) {
    this.partOfWays.push(way);
  }

  increaseLinkCount() {
    this.linkCount += 1;
  }
}
