import { distanceInKmBetweenEarthCoordinates } from "../utils/helper";
import { BBox } from "./RTree/BBox";
import { Way } from "./Way";

export class Node extends BBox {
  id: string;
  lon: number;
  lat: number;
  pointsTo: Node[] | string[];
  highway: string[];
  distance: number[];
  edgeSpeed: number[];
  travelTime: number[];
  tags: { [key: string]: any } | undefined;
  partOfWays: Way[];
  linkCount: number;
  street_count: number;

  constructor(node: {
    id: string;
    lat: number;
    lon: number;
    tags?: { [key: string]: any };
    partOfWays?: Way[];
    linkCount?: number;
    pointsTo?: Node[] | string[];
    highway?: string[];
    distance?: number[];
    edgeSpeed?: number[];
    travelTime?: number[];
  }) {
    super(node.lat, node.lon, node.lat, node.lon);

    this.id = node.id;
    this.lon = node.lon;
    this.lat = node.lat;
    this.pointsTo = node.pointsTo || [];
    this.distance = node.distance || [];
    this.edgeSpeed = node.edgeSpeed || [];
    this.travelTime = node.travelTime || [];
    this.highway = node.highway || [];

    this.tags = node.tags;
    this.partOfWays = node.partOfWays || [];
    this.linkCount = node.linkCount || 1;
    this.street_count = node.linkCount || 1;
  }

  calculateDistance(to: Node): number {
    return distanceInKmBetweenEarthCoordinates(this, to);
  }

  connectToNode(node: Node) {
    (this.pointsTo as Node[]).push(node);
    this.distance.push(distanceInKmBetweenEarthCoordinates(this, node));
  }

  addWay(way: Way) {
    this.partOfWays.push(way);
  }

  increaseLinkCount() {
    this.linkCount += 1;
    this.street_count += 1;
  }
}
