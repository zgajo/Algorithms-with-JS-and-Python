import { Node } from "../Node";
import { BBox } from "./BBox";

export class Rectangle extends BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  children: Rectangle[];
  values: Node[];
  height: number;
  leaf: boolean;

  constructor(children: Rectangle[] | null) {
    super();

    this.children = children || [];
    this.values = [];
    this.height = 1;
    this.leaf = true;
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
  }

  extend(bbox: BBox) {
    this.minX = Math.min(this.minX, bbox.minX);
    this.minY = Math.min(this.minY, bbox.minY);
    this.maxX = Math.max(this.maxX, bbox.maxX);
    this.maxY = Math.max(this.maxY, bbox.maxY);
  }

  // sorts node children by the best axis for split
  _chooseSplitAxis(rtreeMinEntries: number) {
    // searching the best axis for split
    const xMargin = this._allDistMargin(rtreeMinEntries, this.compareMinX);
    const yMargin = this._allDistMargin(rtreeMinEntries, this.compareMinY);

    // if total distributions margin value is minimal for x, sort by minX,
    // otherwise it's already sorted by minY
    if (xMargin < yMargin) this.children.sort(this.compareMinX);
  }

  compareMinX(a: BBox, b: BBox) {
    return a.minX - b.minX;
  }
  compareMinY(a: BBox, b: BBox) {
    return a.minY - b.minY;
  }

  // total margin of all possible split distributions where each node is at least rtreeMinEntries full
  // sorts children, creates two rectangles with their
  _allDistMargin(
    rtreeMinEntries: number,
    compare: typeof this.compareMinX | typeof this.compareMinY
  ) {
    rtreeMinEntries = parseInt(String(rtreeMinEntries));
    const nodeChildrenLength = this.children.length;
    this.children.sort(compare);

    // Create two new Rectangles that are hodling this children x's and y's
    const leftBBox = this.distBBox(0, rtreeMinEntries);
    const rightBBox = this.distBBox(
      nodeChildrenLength - rtreeMinEntries,
      nodeChildrenLength
    );

    let margin = leftBBox.bboxMargin() + rightBBox.bboxMargin();

    for (
      let i = rtreeMinEntries;
      i < nodeChildrenLength - rtreeMinEntries;
      i++
    ) {
      const child = this.children[i];
      leftBBox.extend(this.leaf ? child : child);
      margin += leftBBox.bboxMargin();
    }

    for (
      let i = nodeChildrenLength - rtreeMinEntries - 1;
      i >= rtreeMinEntries;
      i--
    ) {
      const child = this.children[i];
      rightBBox.extend(this.leaf ? child : child);
      margin += rightBBox.bboxMargin();
    }

    return margin;
  }

  // min bounding rectangle of node children from k to p-1
  /**
   *
   * @param k start index that is going to start on this.children array
   * @param p end index that is going to start on this.children array
   * @param destNode Rectangle in which current Rectangle x and y are going to be created
   * @returns newly created Rectangle
   */
  distBBox(k: number, p: number, destNode?: Rectangle) {
    if (!destNode) destNode = new Rectangle(null);

    destNode.minX = Infinity;
    destNode.minY = Infinity;
    destNode.maxX = -Infinity;
    destNode.maxY = -Infinity;

    for (let i = k; i < p; i++) {
      const child = this.children[i];
      destNode.extend(this.leaf ? child : child);
    }

    return destNode;
  }

  _chooseSplitIndex(rtreeMinEntries: number) {
    let index;
    let minOverlap = Infinity;
    let minArea = Infinity;
    const nodeChildrenLength: number = this.children.length;

    for (
      let i = rtreeMinEntries;
      i <= nodeChildrenLength - rtreeMinEntries;
      i++
    ) {
      // creates 2 new rectangles
      const bbox1 = this.distBBox(0, i);
      const bbox2 = this.distBBox(i, nodeChildrenLength);

      const overlap = bbox1.intersectionArea(bbox2);
      const area = bbox1.bboxArea() + bbox2.bboxArea();

      // choose distribution with minimum overlap
      if (overlap < minOverlap) {
        minOverlap = overlap;
        index = i;

        minArea = area < minArea ? area : minArea;
      } else if (overlap === minOverlap) {
        // otherwise choose distribution with minimum area
        if (area < minArea) {
          minArea = area;
          index = i;
        }
      }
    }

    return index || nodeChildrenLength - rtreeMinEntries;
  }

  intersectionArea(b: Rectangle) {
    const minX = Math.max(this.minX, b.minX);
    const minY = Math.max(this.minY, b.minY);
    const maxX = Math.min(this.maxX, b.maxX);
    const maxY = Math.min(this.maxY, b.maxY);

    return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
  }

  calcBBox() {
    this.distBBox(0, this.children.length, this);
  }
}
