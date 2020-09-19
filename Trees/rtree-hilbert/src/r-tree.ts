export interface Node {
  id: number;
  lon: number;
  lat: number;
}

export interface Way {
  id: number;
  nd: Array<{ ref: number }>;
}

export interface Relation {
  id: number;
  member: Array<{ ref: number }>;
}

class RTreeRectangle {
  public children: Array<RTreeRectangle> = [];
  public parent: RTreeRectangle;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public data: Node | Way | Relation
  ) {}

  public static generateEmptyNode(): RTreeRectangle {
    return new RTreeRectangle(Infinity, Infinity, 0, 0, null);
  }
}

class Rtree {
  public root: RTreeRectangle = RTreeRectangle.generateEmptyNode();
  protected minNodes: number;
  /**
   *
   * @param minNodes min 2
   */
  constructor(minNodes: number) {
    if (minNodes < 2) {
      throw new Error("Min nodes is 2");
    }
    this.minNodes = minNodes;
  }
}

const tree: Rtree = new Rtree(1);
