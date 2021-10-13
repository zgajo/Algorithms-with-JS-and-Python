import * as path from "path";
import * as fs from "fs";
import BTree from "../trees/Btree";

import { Node } from "../trees/Node";
import { ByteBuffer } from "flatbuffers";
import { BNodesTree } from "../flatbuffers/map/node/b-nodes-tree";
import { BTreeNode } from "../flatbuffers/map/node/b-tree-node";
import { defaultComparator } from "sorted-btree";
import { BTreeLeafNode } from "../flatbuffers/map/node/b-tree-leaf-node";

export function heuristic(a: Node, b: Node) {
  // euclidian distance
  return Math.abs(a.lat - b.lat) + Math.abs(a.lon - b.lon);
}
// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
const manhattan = (pos0: Node, pos1: Node) => {
  var d1 = Math.abs(pos1.lat - pos0.lat);
  var d2 = Math.abs(pos1.lon - pos0.lon);
  return d1 + d2;
};

const diagonal = function (pos0: Node, pos1: Node) {
  var D = 1;
  var D2 = Math.sqrt(2);
  var d1 = Math.abs(pos1.lat - pos0.lat);
  var d2 = Math.abs(pos1.lon - pos0.lon);
  return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
};

// https://www.movable-type.co.uk/scripts/latlong.html
export const haversine = (a: Node, b: Node) => {
  const R = 6371e3; // metres
  const φ1 = (a.lat * Math.PI) / 180; // φ, λ in radians
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lon - a.lon) * Math.PI) / 180;

  const calculation =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));

  const d = R * c; // in metres

  return d;
};

class SearchNode {
  node: Node;
  previous: SearchNode | null;
  gScore: number;
  fScore: number;
  hScore: number;
  visited: boolean;
  closed: boolean;

  constructor(node: Node) {
    this.gScore = 0;
    this.fScore = 0;
    this.hScore = 0;
    this.node = node;
    this.previous = null;
    this.visited = false;
    this.closed = false;
  }
}

function removeFromArray(arr: SearchNode[], el: Node) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].node == el) {
      arr.splice(i, 1);
    }
  }

  return arr;
}

export class AStar3 {
  btree: BNodesTree;

  constructor(filePath: string) {
    var bytes = new Uint8Array(fs.readFileSync(filePath));

    var buf2 = new ByteBuffer(bytes);

    // Get an accessor to the root object inside the buffer.
    var btree = BNodesTree.getRootAsBNodesTree(buf2);
    this.btree = btree;
  }

  indexOf(
    node: BTreeNode | null | undefined,
    key: string,
    failXor: number,
    leaf: boolean
  ): number {
    var cmp = defaultComparator;
    var lo = 0,
      hi = node?.keysLength() as number,
      mid = hi >> 1;
    let leafNodeFound = false;
    while (lo < hi) {
      var c = cmp(node?.keys(mid), key);
      if (c < 0) lo = mid + 1;
      else if (c > 0)
        // key < keys[mid]
        hi = mid;
      else if (c === 0) {
        if (leaf) {
          leafNodeFound = true;
        }
        return mid;
      } else {
        // c is NaN or otherwise invalid
        if (key === key) {
          // at least the search key is not NaN
          return node?.keysLength() as number;
        } else throw new Error("BTree: NaN was used as a key");
      }
      mid = (lo + hi) >> 1;
    }
    if (leaf && !leafNodeFound) {
      throw new Error("BTree: Key not found in db");
    }
    return mid ^ failXor;
  }

  getKey(key: string) {
    let node = this.btree.root();
    let foundNode = null;

    while (!foundNode && node) {
      const index = this.indexOf(
        node,
        key,
        0,
        (node?.childrenLength() as number) <= 0
      );
      if (node?.childrenLength()) {
        node = node?.children(index);
      } else {
        foundNode = node?.values(index);
      }
    }

    return foundNode;
  }

  createNode(key: string) {
    const keyNode = this.getKey(key);
    const keyNodeDistance = [];
    const keyNodePointsTo = [];
    for (
      let index = 0;
      index < (keyNode as BTreeLeafNode)?.distanceLength();
      index++
    ) {
      keyNodeDistance.push(keyNode?.distance(index));
      keyNodePointsTo.push(keyNode?.pointsTo(index));
    }

    const node = new Node({
      id: keyNode?.id() as string,
      lat: keyNode?.lat() as number,
      lon: keyNode?.lon() as number,
      distance: keyNodeDistance as number[],
      pointsTo: keyNodePointsTo as string[],
    });

    return node;
  }

  search(start: string, e: string) {
    let openedSet: SearchNode[] = [];
    let closedSet: Node[] = [];
    let path = [];

    const startNode = this.createNode(start);
    const end = this.createNode(e);

    let current: SearchNode | null = null;

    const startSearchNode = new SearchNode(startNode);

    openedSet.push(startSearchNode);

    while (openedSet.length) {
      // search node
      let lowestFIndex = 0;

      // openedSet should be imlemented as priority queue
      //find the node with the least f on  the open list, call it "q"
      // pop q off the open list
      for (const index in openedSet) {
        // console.log(
        //   "openedSet[index].fScore",
        //   openedSet[index].fScore,
        //   "openedSet[lowestFIndex].fScore",
        //   openedSet[lowestFIndex].fScore,
        //   openedSet[index].node.id,
        //   openedSet[lowestFIndex].node.id
        // );
        if (openedSet[index].fScore < openedSet[lowestFIndex].fScore) {
          lowestFIndex = Number(index);
        }
      }

      current = openedSet[lowestFIndex] as SearchNode;

      if (current.node.id === end.id) {
        // console.log("Done!", current, end);
        break;
      }

      // openedSet = removeFromArray(openedSet, current.node);
      openedSet.splice(lowestFIndex, 1);
      openedSet = openedSet;

      closedSet.push(current.node);

      // generate q's 8 successors and set their parents to q
      for (const i in current.node.pointsTo) {
        const newNode = this.createNode(current.node.pointsTo[i] as string);
        const newSearchNode = openedSet.find((sn) => sn.node.id === newNode.id);

        const neighbor = newSearchNode || new SearchNode(newNode);

        const neighborDistance = current.node.distance[i];

        if (!closedSet.map((sn) => sn.id).includes(neighbor.node.id)) {
          let tempG = current.gScore + neighborDistance;
          // f(n) = g(n) + f(n)
          // g(n) is the cost of the path from the start node to n,
          // h(n) is a heuristic function that estimates the cost of the cheapest path from n to the goal.

          let newPath = false;

          if (newSearchNode) {
            if (tempG < neighbor.gScore) {
              neighbor.gScore = tempG;
              newPath = true;
            }
          } else {
            newPath = true;
            neighbor.gScore = tempG;
            openedSet.push(neighbor);
          }

          // update neighbourgh only if g is better than previous one
          if (newPath) {
            neighbor.previous = current;
            neighbor.hScore = haversine(neighbor.node, end);
            neighbor.fScore = neighbor.gScore + neighbor.hScore;
          }
        }
      }
    }

    let temp = current;

    console.log("openedSet", openedSet.length);
    console.log("closedSet", closedSet.length);

    path = [temp];

    while (temp?.previous) {
      if (temp?.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
    }

    // console.log(path);

    let distance = 0;
    path.forEach((sn) => {
      if (sn?.previous) {
        const indexOf = sn.previous.node.pointsTo
          .map((node) => (node as Node).id || node)
          .indexOf(sn.node.id);

        distance += sn.previous.node.distance[indexOf];
      }
    });

    console.log("distance", distance);

    // return {
    //   route: path.map((sn) => [sn?.node.lat, sn?.node.lon]) as [number[]],
    //   visitedNodes: closedSet.map((node) => ({
    //     ...node,
    //     pointsTo: node.pointsTo.map((p) => this.nodesBtree.get(p).id),
    //     partOfWays: node.partOfWays.map((w) => w.id),
    //   })),
    // };
  }
}
