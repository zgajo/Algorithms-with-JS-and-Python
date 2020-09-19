import p5 from "p5";
import { latMax, latMin, lonMax, lonMin, ways, nodes } from "./data";
import { Way } from "./r-tree";

console.log(ways);
const p5Instance = new p5(() => {});

const mapLat = (lat: number) =>
  p5Instance.map(lat, latMin, latMax, 0, p5Instance.width);
const mapLon = (lon: number) =>
  p5Instance.map(lon, lonMin, lonMax, 0, p5Instance.height);

p5Instance.setup = function setup() {
  p5Instance.createCanvas(800, 800);
};

p5Instance.draw = function draw() {
  p5Instance.background(0);

  // *[bbox=13.707472,45.105678,13.721853,45.113032]
  p5Instance.stroke(255);

  p5Instance.strokeWeight(3);

  for(let way of ways){

    for (let i = 1; i < way.nd.length; i++) {
      
      const prevLat = mapLat(way.nodes[i - 1].lat);
      const prevLon = mapLon(way.nodes[i - 1].lon);
  
      let latOut = mapLat(way.nodes[i].lat);
      let lonOut = mapLon(way.nodes[i].lon);
  
      p5Instance.line(prevLon, prevLat, lonOut, latOut);
    }
  }
  

  // p5Instance.strokeWeight(1);
  // for (let r of relations) {
  //   for (let i = 1; i < r.nodes.length; i++) {
  //     const prevLat = mapLat(r.nodes[i - 1].lat);
  //     const prevLon = mapLon(r.nodes[i - 1].lon);

  //     let latOut = mapLat(r.nodes[i].lat);
  //     let lonOut = mapLon(r.nodes[i].lon);

  //     p5Instance.line(prevLon, prevLat, lonOut, latOut);
  //   }
  // }

  // p5Instance.line(200, 350, 500, 200);

  // // p5Instance.strokeWeight();
  // p5Instance.line(200, 250, 200, 400);
  // // p5Instance.line(100, 200, 300, 400);
  // p5Instance.strokeWeight(5);
  // p5Instance.line(300, 300, 320, 500);

  // p5Instance.rect(150, 350, 30, 30);
  // p5Instance.rect(150, 300, 30, 30);

  // p5Instance.fill(0);
  // p5Instance.rect(220, 280, 30, 30);

  // p5Instance.rect(180, 180, 30, 30);
};
