import { BBox } from "./BBox";
import { Way } from "./Way";

export class Node extends BBox {
  lon: number;
  lat: number;
  tags: { [key: string]: any } | undefined;
  partOfWays: Way[];

  constructor(lat: number, lon: number, tags?: { [key: string]: any }) {
    super(lat, lon, lat, lon);
    this.lon = lon;
    this.lat = lat;
    this.tags = tags;
    this.partOfWays = [];
  }

  addWay(way: Way) {
    this.partOfWays.push(way);
  }
}
