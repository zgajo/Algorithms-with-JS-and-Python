export const astar = () => {
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

        let newPath = false;
        if (openedSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          newPath = true;
          neighbor.g = tempG;
          openedSet.push(neighbor);
        }

        // update neighbourgh only if g is better than previous one
        if (newPath) {
          neighbor.previous = current;
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }
  }
};
