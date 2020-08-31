let cols = 25;
let rows = 25;

let openedSet = [];
let closedSet = [];
let path = [];
let current;

let start;
let end;
// using for p5 rect func
let w, h;

function removeFromArray(arr, el) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == el) {
      arr.splice(i, 1);
    }
  }

  return arr;
}

function heuristic(a, b) {
  // euclidian distance
  return abs(a.row - b.row) + abs(a.col - b.col);
}

class Node {
  constructor(row, col) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.previous;
    this.wall = false;

    if (Math.random(1) < 0.1) {
      this.wall = true;
    }

    this.row = row;
    this.col = col;
  }

  show(color) {
    fill(color);
    noStroke();

    if (this.wall) {
      fill(0);
    }
    //rect(x, y, w, h, [detailX], [detailY])
    /**
     * x Number: x-coordinate of the rectangle.
     * y Number: y-coordinate of the rectangle.
     */
    rect(this.col * h, this.row * w, w - 1, h - 1);
  }

  /**
0,0  0,1  0,2  0,3  0,4
1,0  1,1  1,2  1,3  1,4
2,0  2,1  2,2  2,3  2,4
3,0  3,1  3,2  3,3  3,4
4,0  4,1  4,2  4,3  4,4
     */
  getNeighbors() {
    let neighbors = [];

    for (let i = this.row - 1; i <= this.row + 1; i++) {
      // check if first row is less than lowest
      // or higher than max row
      if (i >= 0 && i <= rows - 1) {
        // check if first row is less than lowest
        // or higher than column

        for (let j = this.col - 1; j <= this.col + 1; j++) {
          // if same node position, skip this position
          if (i === this.row && j === this.col) {
            continue;
          }

          if (j >= 0 && j <= cols - 1) {
            neighbors.push(grid.items[i][j]);
          }
        }
      }
    }

    return neighbors;
  }
}

class Grid {
  constructor() {
    // Creates 2d array of where every 2d item is Node
    this.items = Array.from(new Array(rows), (_, rowIndex) => {
      return Array.from(
        new Array(cols),
        (_, colIndex) => new Node(rowIndex, colIndex)
      );
    });
  }
}

let grid = new Grid();

// p5 start function
function setup() {
  createCanvas(400, 400);
  console.log("A*");

  // width and height are from p5 canvas data, which is set  above
  w = width / cols;
  h = height / rows;

  start = grid.items[0][0];
  end = grid.items[rows - 1][cols - 1];
  end.wall = false;
  start.wall = false;
  openedSet.push(start);
}

function draw() {
  while (openedSet.length) {
    // search node
    let lowestFIndex = 0;

    // openedSet should be imlemented as priority queue
    //find the node with the least f on  the open list, call it "q"
    // pop q off the open list
    for (index in openedSet) {
      if (openedSet[index].f < openedSet[lowestFIndex].f) {
        lowestFIndex = index;
      }
    }

    current = openedSet[lowestFIndex];

    if (current === end) {
      console.log("Done!", current, end);
      noLoop();
      break;
    }

    openedSet = removeFromArray(openedSet, current);
    closedSet.push(current);

    // generate q's 8 successors and set their parents to q
    for (neighbor of current.getNeighbors()) {
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + 1;

        if (openedSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openedSet.push(neighbor);
        }

        neighbor.previous = current;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
      }
    }
  }

  background(0);

  //for debugging

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid.items[i][j].show(255);
    }
  }

  for (node of closedSet) {
    node.show(color(255, 0, 0));
  }

  for (node of openedSet) {
    node.show(color(0, 255, 0));
  }

  let temp = current;
  console.log(closedSet);
  path = [temp];
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (p of path) {
    p.show(color(0, 0, 255));
  }
}
