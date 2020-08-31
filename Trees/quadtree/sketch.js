let qtree;

// p5 start function
function setup() {
  createCanvas(400, 400);
  console.log("QuadTree");

  let boundary = new Rectangle(200, 200, 200, 200);
  qtree = new QuadTree(boundary);

  for (let i = 0; i < 100; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);

    qtree.insert(p);
  }
}

function draw() {
  background(0);
  qtree.show();

  stroke(0, 255, 0);
  rectMode(CENTER);

  let range = new Rectangle(mouseX, mouseY, 45, 45);
  rect(range.x, range.y, range.w * 2, range.h * 2);

  let points = qtree.query(range);

  for (let p of points) {
    strokeWeight(4);
    point(p.x, p.y);
  }
}
