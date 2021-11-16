import * as path from "path";
import * as fs from "fs";
import geohash from "ngeohash";

import BTree from "../trees/Btree";

import { Node } from "../trees/Node";
import { ByteBuffer } from "flatbuffers";
import { BNodesTree } from "../flatbuffers/map/node/b-nodes-tree";
import { BTreeNode } from "../flatbuffers/map/node/b-tree-node";
import { defaultComparator } from "sorted-btree";
import { BTreeLeafNode } from "../flatbuffers/map/node/b-tree-leaf-node";
import { GTreeNode } from "../flatbuffers/g-tree/g-tree-node";
import { GeoTree, GeoTreeNode } from "../trees/GeoTree/GeoTree";
import { GTree } from "../flatbuffers/g-tree/g-tree";
import { GTreeBox } from "../flatbuffers/g-tree/g-tree-box";

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

export class AStar4 {
  geohashTree: GTree;

  constructor(filePath: string) {
    var bytes = new Uint8Array(fs.readFileSync(filePath));

    var buf2 = new ByteBuffer(bytes);

    // Get an accessor to the root object inside the buffer.
    var geohashTree = GTree.getRootAsGTree(buf2);
    this.geohashTree = geohashTree;
  }

  indexOf = (
    node: GTree["data"] | GTreeBox["data"],
    length: number,
    key: string,
    leaf: boolean,
    cmp = defaultComparator
  ): number => {
    var lo = 0,
      hi = length,
      mid = hi >> 1,
      chosen = 0;

    let leafNodeFound = false;

    while (lo < hi) {
      var c = cmp(node(mid)?.key(), key);

      if (c === 0) return mid;
      else {
        if (c < 0) {
          lo = mid + 1;
        } else if (c > 0) {
          // key < keys[mid]
          chosen = mid;
          hi = mid;
        } else {
          // c is NaN or otherwise invalid
          if (key === key)
            // at least the search key is not NaN
            return length;
          else throw new Error("GeoHashTree: NaN was used as a key");
        }
      }
      mid = (lo + hi) >> 1;
    }
    if (leaf && !leafNodeFound) {
      throw new Error(`GeoHashTree: Key ${key} not found in db`);
    }
    return chosen;
  };

  getNode(key: string) {
    let gTreeData: GTree | GTreeBox = this.geohashTree;
    let gTreeDataLength = this.geohashTree.dataLength();
    let precision = this.geohashTree.precision();
    let currentPrecision = this.geohashTree.precision();

    let gTreeBoxData;

    let foundNode = null;

    while (!foundNode && currentPrecision > 0) {
      const searchKey = key.substring(0, precision - currentPrecision + 1);

      const indexOf = (
        length: number,
        key: string,
        leaf: boolean,
        cmp = defaultComparator
      ): number => {
        var lo = 0,
          hi = length,
          mid = hi >> 1,
          chosen = 0;

        let leafNodeFound = false;

        while (lo < hi) {
          var c = cmp(gTreeData.data(mid)?.key(), key);

          if (c === 0) return mid;
          else {
            if (c < 0) {
              lo = mid + 1;
            } else if (c > 0) {
              // key < keys[mid]
              chosen = mid;
              hi = mid;
            } else {
              // c is NaN or otherwise invalid
              if (key === key)
                // at least the search key is not NaN
                return length;
              else throw new Error("GeoHashTree: NaN was used as a key");
            }
          }
          mid = (lo + hi) >> 1;
        }
        if (leaf && !leafNodeFound) {
          throw new Error(`GeoHashTree: Key ${key} not found in db`);
        }
        return chosen;
      };

      const index = indexOf(gTreeDataLength, searchKey, gTreeDataLength <= 0);

      gTreeDataLength = gTreeData.data(index)?.dataLength() as number;

      if (gTreeDataLength) {
        gTreeData = gTreeData.data(index) as GTreeBox;
      } else {
        foundNode = (gTreeData as GTreeBox).data(index)?.values(0);
      }

      --currentPrecision;
    }

    return foundNode;
  }

  createNode(key: string) {
    const keyNode = this.getNode(key);

    const keyNodeDistance = [];
    const keyNodePointsTo = [];
    for (
      let index = 0;
      index < (keyNode as GTreeNode)?.distanceLength();
      index++
    ) {
      keyNodeDistance.push(keyNode?.distance(index));
      keyNodePointsTo.push(keyNode?.pointsTo(index));
    }

    const ghash = geohash.decode(keyNode?.id() as string);

    const node = new Node({
      id: keyNode?.id() as unknown as string,
      lat: ghash.latitude,
      lon: ghash.longitude,
      distance: keyNodeDistance as number[],
      pointsTo: keyNodePointsTo as unknown as string[],
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
      openedSet.splice(lowestFIndex, 1); // 0,1,2,1,2,1,2,3,2
      openedSet = openedSet;

      closedSet.push(current.node); // 1,1,1,2,2,3,3,3,4

      // generate q's 8 successors and set their parents to q
      for (const i in current.node.pointsTo) {
        const n = current.node.pointsTo[i];

        const newNode = this.createNode(String((n as Node)?.id || n));

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
