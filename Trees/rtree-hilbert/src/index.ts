import p5 from "p5";

const p5Instance = new p5(() => {});

p5Instance.setup = function setup() {
  p5Instance.createCanvas(600, 600);
};

p5Instance.draw = function draw() {
  p5Instance.background(0);

  p5Instance.strokeWeight(10);
  p5Instance.stroke(255);
  p5Instance.line(100, 150, 200, 250);
  p5Instance.line(200, 350, 500, 200);

  // p5Instance.strokeWeight();
  p5Instance.line(200, 250, 200, 400);
  // p5Instance.line(100, 200, 300, 400);
  p5Instance.strokeWeight(5);
  p5Instance.line(300, 300, 320, 500);

  p5Instance.rect(150, 350, 30, 30);
  p5Instance.rect(150, 300, 30, 30);

  p5Instance.fill(0);
  p5Instance.rect(220, 280, 30, 30);

  p5Instance.rect(180, 180, 30, 30);
};
