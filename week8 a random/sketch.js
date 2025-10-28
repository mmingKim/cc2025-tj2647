//shift+OPTION F 
//flashbak.com
let points = [];
let lineEnd = 0;
let lineStart = 0;

function setup() {
  createCanvas(500, 500);

  points = [
    createVector(0, 0),
    createVector(0, -100),
    createVector(-85, 50),
    createVector(0, 100),
    createVector(-85, -50),
    createVector(85, -50)
  ];
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  stroke(255);
  strokeWeight(5);


  for (let i = 0; i < points.length; i++) {
    point(points[i].x, points[i].y);
  }
  stroke(255, 0, 0);
  line(points[lineStart].x, points[lineStart].y,
       points[lineEnd].x, points[lineEnd].y);

 
  let lineAmount = floor(random(1, 9));
  stroke(255, 100);
  for (let i = 0; i < lineAmount; i++) {
    let start = floor(random(points.length));
    let end = floor(random(points.length));
    line(points[start].x, points[start].y,
         points[end].x, points[end].y);
  }
}

function mousePressed() {
  lineStart = floor(random(points.length));
  lineEnd = floor(random(points.length));
}
