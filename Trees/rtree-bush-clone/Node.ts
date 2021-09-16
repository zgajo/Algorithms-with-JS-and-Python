import { BBox } from "./BBox";

export class Node extends BBox {
  lon: number;
  lat: number;
  tags: { [key: string]: any } | undefined;

  constructor(lat: number, lon: number, tags?: { [key: string]: any }) {
    super(lat, lon, lat, lon);
    this.lon = lon;
    this.lat = lat;
    this.tags = tags;
  }
}
