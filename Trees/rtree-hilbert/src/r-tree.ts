interface Node {
  id: number;
  lon: number;
  lat: number;
  name: string;
}

interface Way {
  id: number;
  name: string;
  nodes: Array<Node>;
}

interface Relation {
  nodes: Array<Node>;
}

class RTreeRectangle {
  public children: Array<RTreeRectangle> = [];
  public parent: RTreeRectangle;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public data: any
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
