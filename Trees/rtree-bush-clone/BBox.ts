import { Rectangle } from "./Rectangle";

export class BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  constructor(
    maxX = -Infinity,
    maxY = -Infinity,
    minX = Infinity,
    minY = Infinity
  ) {
    this.maxX = maxX;
    this.maxY = maxY;
    this.minX = minX;
    this.minY = minY;
  }

  bboxArea() {
    return (this.maxX - this.minY) * (this.maxY - this.minY);
  }

  bboxMargin() {
    return this.maxX - this.minX + (this.maxY - this.minY);
  }

  enlargedArea(bbox: Rectangle) {
    return (
      (Math.max(this.maxX, bbox.maxX) - Math.min(this.minX, bbox.minX)) *
      (Math.max(this.maxY, bbox.maxY) - Math.min(this.minY, bbox.minY))
    );
  }
}
