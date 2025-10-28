//Each one is watching the same forbidden point below,
//blinking out of sync like they are thinking on their own.

let eyes = []; //All the creatures hiding in the scene
let totalEyes = 120; //Dense enough to feel uncomfortable
let focusX, focusY; //The abyss they are staring toward
const BLINK_RATE = 3; //Blink speed for every eye is identical

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES); //Rotation using degrees feels more intuitive
  noStroke();

  focusX = width / 2;
  focusY = height + 100; //A spot deep below the canvas

  //Place many eyes while making sure they do not overlap
  while (eyes.length < totalEyes) {
    let e = {
      x: random(20, width - 20), //Eyes appear anywhere on screen
      y: random(20, height - 20),
      w: random(14, 30), //Slight size variations make them feel organic
      h: random(8, 18),
      blinkOffset: random(1000) //Random timing so they never blink together
    };

    let overlap = false; //Collision check
    for (let i = 0; i < eyes.length; i++) {
      let other = eyes[i];
      let d = dist(e.x, e.y, other.x, other.y);
      if (d < (e.w + other.w) * 0.55) {
        overlap = true;
        break;
      }
    }

    if (!overlap) eyes.push(e); //Only add it when there is space
  }
}

function draw() {
  background(5, 0, 10); //Dark void atmosphere

  for (let e of eyes) {

    //They blink quickly but not at the same moment
    let blink = abs(sin(frameCount * BLINK_RATE + e.blinkOffset));
    let currentH = lerp(e.h * 0.02, e.h, blink); //Eye nearly fully closes then opens again

    //Every eye rotates to stare into the same direction
    let ang = atan2(focusY - e.y, focusX - e.x) + 90;

    push();
    translate(e.x, e.y);
    rotate(ang);
    drawEye(0, 0, e.w, currentH, blink);
    pop();
  }
}

//A cat-like slit eye with a corrupted and unsettling look
function drawEye(x, y, w, currentH, blink) {

  //This black shape becomes the eyelid while blinking
  fill(0);
  ellipse(x, y, w * 1.3, currentH * 1.7 + (1 - blink) * w * 0.9);

  if (blink < 0.28) return; //Completely closed phase hides the inner eye

  //Dirty white sclera
  fill(220);
  ellipse(x, y, w, currentH);

  //Dark blood ring around the eye
  fill(150, 0, 0, 140);
  ellipse(x, y, w * 1.05, currentH * 1.25);

  //Vertical red iris
  fill(255, 0, 0);
  ellipse(x, y, w * 0.25, currentH * 1.05);

  //Thin crack-like pupil
  fill(0);
  ellipse(x, y, w * 0.10, currentH * 0.90);
}
