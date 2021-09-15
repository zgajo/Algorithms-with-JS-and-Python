// as a CommonJS module
const RBush = require("rbush");
var knn = require("rbush-knn");

const tree = new RBush(1);

function someData(n) {
  const data = [];
  for (let i = 0; i < n; i++) {
    data.push({ minX: i, minY: i, maxX: i, maxY: i });
  }
  return data;
}

tree.load(someData(20));
tree.insert({ minX: 0, minY: 0, maxX: 1, maxY: 1 });
tree.insert({ minX: 0, minY: 1, maxX: 1, maxY: 1 });

const treeData = tree.toJSON();
console.log(JSON.stringify(treeData));
// var neighbors = knn(tree, 40, 40, 10); // return 10 nearest items around point [40, 40]
// console.log(neighbors);
