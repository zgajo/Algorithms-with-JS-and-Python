import { Node } from "./graph/Node";

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

export class AStar {
  constructor() {}

  search(start: Node, end: Node) {
    let openedSet: SearchNode[] = [];
    let closedSet: Node[] = [];
    let path = [];
    let current;

    const startNode = new SearchNode(start);

    openedSet.push(startNode);

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

      current = openedSet[lowestFIndex];

      if (current.node === end) {
        console.log("Done!", current, end);
        break;
      }

      openedSet = removeFromArray(openedSet, current.node);
      closedSet.push(current.node);

      // generate q's 8 successors and set their parents to q
      for (const n of current.node.pointsTo) {
        const neighbor = new SearchNode(n);

        if (!closedSet.includes(neighbor.node)) {
          let tempG = current.gScore + 1;

          let newPath = false;

          if (openedSet.includes(neighbor)) {
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
            neighbor.hScore = diagonal(neighbor.node, end);
            neighbor.fScore = neighbor.gScore + neighbor.hScore;
          }
        }
      }
    }

    let temp = current;

    console.log("openedSet", openedSet.length, openedSet);
    console.log("closedSet", closedSet.length);

    path = [temp];

    console.log("object");

    while (temp?.previous) {
      if (temp?.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }
    }

    // console.log(path);
    // console.log(closedSet);

    return {
      route: path.map((sn) => [sn?.node.lat, sn?.node.lon]) as [number[]],
      visitedNodes: closedSet.map((node) => [node.lat, node.lon]),
    };
  }
}
