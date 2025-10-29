//Blood animation made with expanding blobs and explosion particles.
//Each blob grows until it bursts into smaller pieces.

let bloodBlobs = []; //List of growing blood blobs
let burstParticles = []; //Explosion particle list
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
  if (bloodBlobs.length < maxBlobs && random(1) < 0.4) {
    bloodBlobs.push(makeBlob());
  }

  //Update blob growth and movement
  for (let i = bloodBlobs.length - 1; i >= 0; i--) {
    let blob = bloodBlobs[i];
    blob.blobSize += 0.2; //Blob expands slowly

    //Directional movement outward
    blob.blobX += cos(blob.blobAngle) * 0.4;
    blob.blobY += sin(blob.blobAngle) * 0.4;

    //Collision push to avoid overlap
    for (let j = 0; j < bloodBlobs.length; j++) {
      if (i !== j) {
        let otherBlob = bloodBlobs[j];
        let distance = dist(blob.blobX, blob.blobY, otherBlob.blobX, otherBlob.blobY);
        let minDistance = (blob.blobSize + otherBlob.blobSize) / 2;
        if (distance < minDistance) {
          let pushAngle = atan2(blob.blobY - otherBlob.blobY, blob.blobX - otherBlob.blobX);
          blob.blobX += cos(pushAngle) * 0.6;
          blob.blobY += sin(pushAngle) * 0.6;
        }
      }
    }

    //Draw the blob as a semi-transparent red circle
    fill(210, 0, 0, 160);
    ellipse(blob.blobX, blob.blobY, blob.blobSize);

    //Blob bursts when becoming too large
    if (blob.blobSize > blob.maxBlobSize) {
      explode(blob.blobX, blob.blobY);
      bloodBlobs.splice(i, 1);
    }
  }

  //Draw explosion particles and fade them out
  for (let p = burstParticles.length - 1; p >= 0; p--) {
    let particle = burstParticles[p];

    fill(210, 0, 0, particle.alpha);
    ellipse(particle.particleX, particle.particleY, particle.particleRadius);

    particle.particleX += particle.particleVX;
    particle.particleY += particle.particleVY;
    particle.alpha -= 4; //Fade out slowly

    if (particle.alpha <= 0) burstParticles.splice(p, 1);
  }
}

//Create a new blob starting at the center
function makeBlob() {
  return {
    blobX: width / 2,
    blobY: height / 2,
    blobSize: random(5, 10), //Initial size
    maxBlobSize: random(25, 45), //Burst threshold
    blobAngle: random(TWO_PI) //Spread direction
  };
}

//Generate explosion particles when a blob bursts
function explode(originX, originY) {
  for (let i = 0; i < 30; i++) {
    let angleDir = random(TWO_PI);
    let speedLevel = random(1, 4);
    burstParticles.push({
      particleX: originX,
      particleY: originY,
      particleVX: cos(angleDir) * speedLevel, //Movement direction
      particleVY: sin(angleDir) * speedLevel,
      particleRadius: random(2, 5), //Particle size
      alpha: 255 //Start fully visible
    });
  }
}











