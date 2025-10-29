//Each one is watching the same forbidden point below,
//blinking out of sync like they are thinking on their own.

let eyes = []; //All the creatures hiding in the scene
let totalEyes = 120; //Dense enough to feel uncomfortable
let focusX, focusY; //The abyss they are staring toward
const BLINK_RATE = 3; //Blink speed for every eye is identical

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noStroke();

  focusX = width / 2;
  focusY = height + 100; //A spot deep below the canvas

  //Create eyes using only for loop
  for (let i = 0; i < totalEyes; i++) {
    let e = {
      gazerX: random(20, width - 20),
      gazerY: random(20, height - 20),
      eyeWidth: random(14, 30),
      eyeHeight: random(8, 18),
      blinkOffset: random(1000)
    };

    //Check overlap with existing eyes
    let overlap = false;
    for (let j = 0; j < eyes.length; j++) {
      let other = eyes[j];
      let d = dist(e.gazerX, e.gazerY, other.gazerX, other.gazerY);
      if (d < (e.eyeWidth + other.eyeWidth) * 0.55) {
        overlap = true;
        break;
      }
    }

    if (!overlap) eyes.push(e);
  }
}

function draw() {
  background(5, 0, 10); //Dark void atmosphere

  for (let i = 0; i < eyes.length; i++) {
    let e = eyes[i];

    //They blink quickly but not at the same moment
    let blink = abs(sin(frameCount * BLINK_RATE + e.blinkOffset));
    let currentH = lerp(e.eyeHeight * 0.02, e.eyeHeight, blink);

    //Every eye rotates to stare into the same direction
    let ang = atan2(focusY - e.gazerY, focusX - e.gazerX) + 90;

    push();
    translate(e.gazerX, e.gazerY);
    rotate(ang);
    drawEye(0, 0, e.eyeWidth, currentH, blink);
    pop();
  }
}

//Draw one creepy eye
function drawEye(gazerX, gazerY, eyeWidth, currentH, blink) {
  fill(0);
  ellipse(gazerX, gazerY, eyeWidth * 1.3, currentH * 1.7 + (1 - blink) * eyeWidth * 0.9);

  if (blink < 0.28) return; //Eye completely closed

  fill(220);
  ellipse(gazerX, gazerY, eyeWidth, currentH);

  fill(150, 0, 0, 140);
  ellipse(gazerX, gazerY, eyeWidth * 1.05, currentH * 1.25);

  fill(255, 0, 0);
  ellipse(gazerX, gazerY, eyeWidth * 0.25, currentH * 1.05);

  fill(0);
  ellipse(gazerX, gazerY, eyeWidth * 0.10, currentH * 0.90);
}
