import { BBox } from "./BBox";
import { Rectangle } from "./Rectangle";

export class RTree {
  data: Rectangle;
  maxEntries: number;
  minEntries: number;

  constructor(maxEntries: number = 9) {
    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this.maxEntries = Math.max(4, maxEntries);
    this.minEntries = Math.max(2, maxEntries * 0.4);
    this.data = new Rectangle([]);
  }

  clear() {
    // this.data = createNode([]);
    this.data = new Rectangle([]);
    return this;
  }

  all() {
    return this._all(this.data, []);
  }

  _all(node: Rectangle, result: Rectangle[]) {
    const nodesToSearch: Rectangle[] = [];

    while (node) {
      if (node.leaf) {
        result.push(...node.children);
      } else {
        nodesToSearch.push(...node.children);
      }

      const poppedNode = nodesToSearch.pop();

      if (poppedNode) {
        node = poppedNode;
      }
    }

    return result;
  }

  insert(item: BBox) {
    if (item) {
      this._insert(item, this.data.height - 1);
    }
    return this;
  }

  /**
   *
   * @param item
   * @param level
   * @param isNode
   *
   * 1. @_chooseSubtree Pronalazi se Rectangle ( @node ) u koji se node moze staviti a da se najmanje povecanje rectanglea radi, ako su jednaka povecanja, onda se gleda najmanja izmjena od area koja ce se napraviti
   *                    Sprema se put u @insertPath do kojeg se doslo u rectangle koji ima leaf
   * 2. Dodaje se item u pronađeni node
   * 3. @extend Postavljaju se nove vrijednosti za x's i y's za node gdje se spremio item.
   * 4. @while Ako je pun node u koji se spremio item, treba ga splittati @split
   * 5. @_adjustParentBBoxes za svaki rectangle kroz koji se prošlo da bi se dodao item se radi rekalkulacija x's i y's
   *
   *
   */
  _insert(item: BBox, level: number, isNode?: boolean) {
    const bbox = isNode ? item : this.toBBox(item);

    const insertPath: Rectangle[] = [];

    // find the best node for accommodating the item, saving all nodes along the path too
    const node = this._chooseSubtree(bbox, this.data, level, insertPath);
    node.children.push(item as Rectangle);
    node.extend(bbox);
    // split on node overflow; propagate upwards if necessary
    while (level >= 0) {
      if (insertPath[level].children.length > this.maxEntries) {
        this._split(insertPath, level);
        level--;
      } else break;
    }

    this._adjustParentBBoxes(bbox, insertPath, level);
  }

  toBBox(item: BBox) {
    return item;
  }

  _adjustParentBBoxes(bbox: BBox, path: Rectangle[], level: number) {
    // adjust bboxes along the given tree path
    for (let i = level; i >= 0; i--) {
      path[i].extend(bbox);
    }
  }

  _chooseSubtree(
    bbox: BBox,
    node: Rectangle,
    level: number,
    path: Rectangle[]
  ) {
    while (true) {
      path.push(node);

      if (node.leaf || path.length - 1 === level) break;

      let minArea = Infinity;
      let minEnlargement = Infinity;
      let targetNode;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const area = child.bboxArea();
        const enlargement = bbox.enlargedArea(child) - area;

        // choose entry with the least area enlargement
        if (enlargement < minEnlargement) {
          minEnlargement = enlargement;
          minArea = area < minArea ? area : minArea;
          targetNode = child;
        } else if (enlargement === minEnlargement) {
          // otherwise choose one with the smallest area
          if (area < minArea) {
            minArea = area;
            targetNode = child;
          }
        }
      }
      console.log("Neces ovdje doci");
      node = targetNode || node.children[0];
    }

    return node;
  }

  /**
   *
   * @param insertPath
   * @param level
   * 1. @_chooseSplitAxis pronalazi najbolji nacin kako za sort unutar rectanglea za splittanje
   * 2. @_chooseSplitIndex Pronalazi index gdje ce biti najmanje preklapanje između nova dva Rectanglea kada se splita children
   * 3. napravi se split prema pronađenom indexu,
   * 4. rekalkulacija x's i y's od rectanglea se radi prema novim childrenima
   * 5. ako nismo u rootu, dodaj novo kreirani node u posljedni rectangle iz insertPatha
   * 6. ako je trenutni level root, onda treba splitati root
   *
   */
  _split(insertPath: Rectangle[], level: number) {
    const node = insertPath[level];
    const rtreeMinEntries = this.minEntries;

    // Sorts the children in a best way for splitting
    node._chooseSplitAxis(rtreeMinEntries);

    const splitIndex = node._chooseSplitIndex(rtreeMinEntries);

    const newNode = new Rectangle(
      node.children.splice(splitIndex, node.children.length - splitIndex)
    );

    newNode.height = node.height;
    newNode.leaf = node.leaf;

    // Calculate x's and y's for the Rectangles
    node.calcBBox();
    newNode.calcBBox();

    if (level) insertPath[level - 1].children.push(newNode);
    else this._splitRoot(node, newNode);
  }

  _splitRoot(node: Rectangle, newNode: Rectangle) {
    // split root node
    this.data = new Rectangle([node, newNode]);
    this.data.height = node.height + 1;
    this.data.leaf = false;
    this.data.calcBBox();
  }
}
