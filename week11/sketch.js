
let handpose;
let video;
let predictions = [];
let lizardScaled = [];
let lizardX = 400;
let lizardY = 400;
let angle = 0;
let targetX = 400;
let targetY = 400;
let stopDistance = 120;

function setup() {
  createCanvas(800, 800);
  video = createCapture(VIDEO);
  video.size(800, 800);
  video.hide();
  
  handpose = ml5.handpose(video, () => {
    console.log("handpose model loaded");
  });
  handpose.on("predict", (results) => {
    predictions = results;
  });
  
  scaleLizard();
}

function draw() {
  background(255);
  
  // 全屏摄像头
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, 800, 800);
  pop();
  
  if (predictions.length > 0) {
    let hand = predictions[0];
    let indexTip = hand.annotations.indexFinger[3];
    targetX = width - indexTip[0];
    targetY = indexTip[1];
  }
  
  let d = dist(lizardX, lizardY, targetX, targetY);
  
  if (d > stopDistance) {
    let speed = map(d, 0, 600, 0.4, 1.5);
    let dir = atan2(targetY - lizardY, targetX - lizardX);
    lizardX += cos(dir) * speed;
    lizardY += sin(dir) * speed;
  }
  
  angle = atan2(targetY - lizardY, targetX - lizardX) + PI / 2;
  
  drawLizard();
}

function drawLizard() {
  push();
  translate(lizardX, lizardY);
  rotate(angle);
  
  // 绘制身体
  drawingContext.shadowBlur = 40;
  drawingContext.shadowColor = "rgba(160,120,255,0.6)";
  stroke(120, 70, 255);
  strokeWeight(2);
  fill(200, 150, 255, 180);
  
  beginShape();
  for (let i = 0; i < lizardScaled.length; i++) {
    let p = lizardScaled[i];
    curveVertex(p.x, p.y);
  }
  endShape(CLOSE);
  
  pop();
}

function scaleLizard() {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let p of lizard) {
    minX = min(minX, p.x);
    maxX = max(maxX, p.x);
    minY = min(minY, p.y);
    maxY = max(maxY, p.y);
  }
  let w = maxX - minX;
  let h = maxY - minY;
  let cx = minX + w / 2;
  let cy = minY + h / 2;
  let scaleFactor = 250 / h;
  lizardScaled = lizard.map((p) => ({
    x: (p.x - cx) * scaleFactor,
    y: (p.y - cy) * scaleFactor
  }));
}