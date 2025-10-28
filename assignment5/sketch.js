//Halloween Theme Series
//1. Pumpkins
//2. Eyes
//3. Blood
//Sneaky little pumpkins floating out of the dark.
//I want them to feel alive,
//wobbling up from somewhere spooky underground,
//grinning like they know some Halloween secret.

let pupuList = []; //A bunch of pumpkins waiting to show up

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES); //Using degrees to control the wobble
}

function draw() {
  background(10, 5, 25); //A quiet night sky but something is coming

  //Random chance to create a new pumpkin
  //They appear one by one, like they are sneaking in
  if (random(1) < 0.06 && pupuList.length < 60) {
    pupuList.push({
      pupuX: random(50, 350), //Where it enters horizontally
      pupuY: height + 30, //Pumpkins come from below
      pupuFloat: random(360), //Each one wiggles differently
      pupuSpeedY: random(0.6, 1.2), //Some float faster, some slower
      pupuSpeedFloat: random(1, 3) //Individual wobble speed
    });
  }

  //Make all pumpkins move and draw them
  for (let i = pupuList.length - 1; i >= 0; i--) {
    let p = pupuList[i];
    p.pupuFloat += p.pupuSpeedFloat; //Updating wobble phase
    p.pupuY -= p.pupuSpeedY; //Pumpkin rising movement
    let floatMove = sin(p.pupuFloat) * 5; //Left-right wiggle

    drawPupuBody(p.pupuX, p.pupuY + floatMove, 70); //Body graphics
    drawPupuFace(p.pupuX, p.pupuY + floatMove, 70); //Spooky face

    //Remove pumpkin when it leaves top area
    if (p.pupuY < -100) {
      pupuList.splice(i, 1);
    }
  }
}

//Pumpkin body built with many overlapping ellipses
//It creates the classic pumpkin ridge structure
function drawPupuBody(bx, by, s) {
  noStroke();

  fill(255, 130, 10); ellipse(bx, by, s, s * 0.95);

  fill(245, 115, 5); ellipse(bx - s * 0.15, by, s * 0.9, s * 0.93);
  fill(230, 100, 0); ellipse(bx - s * 0.30, by, s * 0.82, s * 0.90);
  fill(210, 80, 0); ellipse(bx - s * 0.45, by, s * 0.70, s * 0.88);

  fill(245, 115, 5); ellipse(bx + s * 0.15, by, s * 0.90, s * 0.93);
  fill(230, 100, 0); ellipse(bx + s * 0.30, by, s * 0.82, s * 0.90);
  fill(210, 80, 0); ellipse(bx + s * 0.45, by, s * 0.70, s * 0.88);

  fill(35, 130, 50); rect(bx, by - s * 0.60, s * 0.12, s * 0.25, 6); //Stem on top
}

//Face defines the personality of the pumpkin
//Shadow layer first for depth, then pure black features
function drawPupuFace(px, py, s) {
  let shadowOffset = s * 0.03; //Creates a slight 3D look

  fill(255, 150, 70, 160);
  let eyeW = s * 0.22;

  //Shadow eyes
  triangle(px - eyeW + shadowOffset, py - s * 0.15 + shadowOffset,
           px - s * 0.1 + shadowOffset, py + shadowOffset,
           px - s * 0.35 + shadowOffset, py + shadowOffset);
  triangle(px + eyeW + shadowOffset, py - s * 0.15 + shadowOffset,
           px + s * 0.35 + shadowOffset, py + shadowOffset,
           px + s * 0.1 + shadowOffset, py + shadowOffset);

  //Shadow nose
  triangle(px - s * 0.05 + shadowOffset, py + s * 0.02 + shadowOffset,
           px + s * 0.05 + shadowOffset, py + s * 0.02 + shadowOffset,
           px + shadowOffset, py - s * 0.05 + shadowOffset);

  //Shadow smile
  beginShape();
  vertex(px - s * 0.32 + shadowOffset, py + s * 0.11 + shadowOffset);
  bezierVertex(px - s * 0.16 + shadowOffset, py + s * 0.30 + shadowOffset,
               px + s * 0.16 + shadowOffset, py + s * 0.30 + shadowOffset,
               px + s * 0.32 + shadowOffset, py + s * 0.11 + shadowOffset);
  endShape(CLOSE);

  fill(0); //Main facial features

  //Triangle eyes
  triangle(px - eyeW, py - s * 0.15, px - s * 0.1, py, px - s * 0.35, py);
  triangle(px + eyeW, py - s * 0.15, px + s * 0.35, py, px + s * 0.1, py);

  //Triangle nose
  triangle(px - s * 0.05, py + s * 0.02,
           px + s * 0.05, py + s * 0.02,
           px, py - s * 0.05);

  //Curved wicked smile
  beginShape();
  vertex(px - s * 0.32, py + s * 0.11);
  bezierVertex(px - s * 0.16, py + s * 0.30,
               px + s * 0.16, py + s * 0.30,
               px + s * 0.32, py + s * 0.11);
  endShape(CLOSE);

  //Tiny sharp fangs, adding that Halloween attitude
  triangle(px - s * 0.18, py + s * 0.18,
           px - s * 0.15, py + s * 0.28,
           px - s * 0.12, py + s * 0.18);
  triangle(px - s * 0.03, py + s * 0.18,
           px, py + s * 0.28,
           px + s * 0.03, py + s * 0.18);
  triangle(px + s * 0.12, py + s * 0.18,
           px + s * 0.15, py + s * 0.28,
           px + s * 0.18, py + s * 0.18);
}
