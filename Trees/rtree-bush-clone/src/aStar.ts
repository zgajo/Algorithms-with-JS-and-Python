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

      current = openedSet[lowestFIndex];

      if (current.node === end) {
        // console.log("Done!", current, end);
        break;
      }

      // openedSet = removeFromArray(openedSet, current.node);
      openedSet.splice(lowestFIndex, 1);
      openedSet = openedSet;

      closedSet.push(current.node);

      // generate q's 8 successors and set their parents to q
      for (const i in current.node.pointsTo) {
        const newNode = current.node.pointsTo[i];
        const newSearchNode = openedSet.find((sn) => sn.node === newNode);

        const neighbor =
          newSearchNode || new SearchNode(current.node.pointsTo[i]);
        const neighborDistance = current.node.distance[i];

        if (!closedSet.includes(neighbor.node)) {
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
          .map((node) => node.id)
          .indexOf(sn.node.id);

        distance += sn.previous.node.distance[indexOf];
      }
    });

    console.log("distance", distance);

    return {
      route: path.map((sn) => [sn?.node.lat, sn?.node.lon]) as [number[]],
      visitedNodes: closedSet.map((node) => ({
        ...node,
        pointsTo: node.pointsTo.map((p) => p.id),
        partOfWays: node.partOfWays.map((w) => w.id),
      })),
    };
  }
}
