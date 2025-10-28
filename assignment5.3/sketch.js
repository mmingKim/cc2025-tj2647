//Blood animation made with expanding blobs and explosion particles.
//Each blob grows until it bursts into smaller pieces.

let blobs = []; //List of growing blood blobs
let particles = []; //Explosion particle list
let maxBlobs = 60; //Maximum number of blobs on screen

function setup() {
  createCanvas(400, 400);
  background(5, 0, 10); //Dark background for contrast
  noStroke();
}

function draw() {
  //Keep motion trails so the explosion feels more fluid
  background(5, 0, 10, 30);

  //Create new blobs from the center at random times
  if (blobs.length < maxBlobs && random(1) < 0.4) {
    blobs.push(makeBlob());
  }

  //Update blob growth and movement
  for (let i = blobs.length - 1; i >= 0; i--) {
    let b = blobs[i];
    b.size += 0.2; //Blob expands slowly

    //Directional movement outward
    b.x += cos(b.angle) * 0.4;
    b.y += sin(b.angle) * 0.4;

    //Collision push to avoid overlap
    for (let j = 0; j < blobs.length; j++) {
      if (i !== j) {
        let o = blobs[j];
        let d = dist(b.x, b.y, o.x, o.y);
        let minD = (b.size + o.size) / 2;
        if (d < minD) {
          let ang = atan2(b.y - o.y, b.x - o.x);
          b.x += cos(ang) * 0.6;
          b.y += sin(ang) * 0.6;
        }
      }
    }

    //Draw the blob as a semi-transparent red circle
    fill(210, 0, 0, 160);
    ellipse(b.x, b.y, b.size);

    //Blob bursts when becoming too large
    if (b.size > b.maxSize) {
      explode(b.x, b.y);
      blobs.splice(i, 1);
    }
  }

  //Draw explosion particles and fade them out
  for (let p = particles.length - 1; p >= 0; p--) {
    let pr = particles[p];

    fill(210, 0, 0, pr.alpha);
    ellipse(pr.x, pr.y, pr.r);

    pr.x += pr.vx;
    pr.y += pr.vy;
    pr.alpha -= 4; //Fade out slowly

    if (pr.alpha <= 0) particles.splice(p, 1);
  }
}

//Create a new blob starting at the center
function makeBlob() {
  return {
    x: width / 2,
    y: height / 2,
    size: random(5, 10), //Initial size
    maxSize: random(25, 45), //Burst threshold
    angle: random(TWO_PI) //Spread direction
  };
}

//Generate explosion particles when a blob bursts
function explode(x, y) {
  for (let i = 0; i < 30; i++) {
    let a = random(TWO_PI);
    let s = random(1, 4);
    particles.push({
      x: x,
      y: y,
      vx: cos(a) * s, //Movement direction
      vy: sin(a) * s,
      r: random(2, 5), //Particle size
      alpha: 255 //Start fully visible
    });
  }
}











