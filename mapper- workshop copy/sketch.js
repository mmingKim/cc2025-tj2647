

let pMapper;
let quadPumpkin, quadEyes, quadBlood;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // initialize projection mapper
  pMapper = createProjectionMapper(this);
  pMapper.load("map.json");

  // create three projection surfaces
  quadPumpkin = pMapper.createQuadMap(400, 400);
  quadEyes = pMapper.createQuadMap(400, 400);
  quadBlood = pMapper.createQuadMap(400, 400);
}

function draw() {
  background(0);

  quadPumpkin.displaySketch(halloweenPumpkins);
  quadEyes.displaySketch(halloweenEyes);
  quadBlood.displaySketch(halloweenBlood);
}


 // 1. Floating Pumpkins

function halloweenPumpkins(pg) {
  pg.angleMode(pg.DEGREES);
  if (!pg.pupuList) pg.pupuList = [];

  pg.background(10, 5, 25);

  if (pg.random(1) < 0.06 && pg.pupuList.length < 60) {
    pg.pupuList.push({
      pupuX: pg.random(50, 350),
      pupuY: pg.height + 30,
      pupuFloat: pg.random(360),
      pupuSpeedY: pg.random(0.6, 1.2),
      pupuSpeedFloat: pg.random(1, 3)
    });
  }

  for (let i = pg.pupuList.length - 1; i >= 0; i--) {
    let p = pg.pupuList[i];
    p.pupuFloat += p.pupuSpeedFloat;
    p.pupuY -= p.pupuSpeedY;
    let floatMove = pg.sin(p.pupuFloat) * 5;

    drawPupuBody(pg, p.pupuX, p.pupuY + floatMove, 70);
    drawPupuFace(pg, p.pupuX, p.pupuY + floatMove, 70);

    if (p.pupuY < -100) pg.pupuList.splice(i, 1);
  }
}

function drawPupuBody(pg, bx, by, s) {
  pg.noStroke();
  pg.fill(255, 130, 10); pg.ellipse(bx, by, s, s * 0.95);
  pg.fill(245, 115, 5); pg.ellipse(bx - s * 0.15, by, s * 0.9, s * 0.93);
  pg.fill(230, 100, 0); pg.ellipse(bx - s * 0.30, by, s * 0.82, s * 0.90);
  pg.fill(210, 80, 0); pg.ellipse(bx - s * 0.45, by, s * 0.70, s * 0.88);
  pg.fill(245, 115, 5); pg.ellipse(bx + s * 0.15, by, s * 0.90, s * 0.93);
  pg.fill(230, 100, 0); pg.ellipse(bx + s * 0.30, by, s * 0.82, s * 0.90);
  pg.fill(210, 80, 0); pg.ellipse(bx + s * 0.45, by, s * 0.70, s * 0.88);
  pg.fill(35, 130, 50); pg.rect(bx, by - s * 0.60, s * 0.12, s * 0.25, 6);
}

function drawPupuFace(pg, px, py, s) {
  let shadowOffset = s * 0.03;
  pg.fill(255, 150, 70, 160);
  let eyeW = s * 0.22;
  pg.triangle(px - eyeW + shadowOffset, py - s * 0.15 + shadowOffset,
    px - s * 0.1 + shadowOffset, py + shadowOffset,
    px - s * 0.35 + shadowOffset, py + shadowOffset);
  pg.triangle(px + eyeW + shadowOffset, py - s * 0.15 + shadowOffset,
    px + s * 0.35 + shadowOffset, py + shadowOffset,
    px + s * 0.1 + shadowOffset, py + shadowOffset);
  pg.fill(0);
  pg.triangle(px - eyeW, py - s * 0.15, px - s * 0.1, py, px - s * 0.35, py);
  pg.triangle(px + eyeW, py - s * 0.15, px + s * 0.35, py, px + s * 0.1, py);
  pg.triangle(px - s * 0.05, py + s * 0.02,
    px + s * 0.05, py + s * 0.02, px, py - s * 0.05);
}


//  2. Eyes Watching the Abyss

function halloweenEyes(pg) {
  pg.angleMode(pg.DEGREES);
  if (!pg.eyes) {
    pg.totalEyes = 120;
    pg.focusX = pg.width / 2;
    pg.focusY = pg.height + 100;
    pg.eyes = [];

    for (let i = 0; i < pg.totalEyes; i++) {
      let e = {
        gazerX: pg.random(20, pg.width - 20),
        gazerY: pg.random(20, pg.height - 20),
        eyeWidth: pg.random(14, 30),
        eyeHeight: pg.random(8, 18),
        blinkOffset: pg.random(1000)
      };

      let overlap = false;
      for (let other of pg.eyes) {
        let d = pg.dist(e.gazerX, e.gazerY, other.gazerX, other.gazerY);
        if (d < (e.eyeWidth + other.eyeWidth) * 0.55) {
          overlap = true;
          break;
        }
      }

      if (!overlap) pg.eyes.push(e);
    }
  }

  pg.background(5, 0, 10);

  for (let e of pg.eyes) {
    let blink = pg.abs(pg.sin(pg.frameCount * 3 + e.blinkOffset));
    let currentH = pg.lerp(e.eyeHeight * 0.02, e.eyeHeight, blink);
    let ang = pg.atan2(pg.focusY - e.gazerY, pg.focusX - e.gazerX) + 90;

    pg.push();
    pg.translate(e.gazerX, e.gazerY);
    pg.rotate(ang);
    drawEye(pg, 0, 0, e.eyeWidth, currentH, blink);
    pg.pop();
  }
}

function drawEye(pg, gazerX, gazerY, eyeWidth, currentH, blink) {
  pg.fill(0);
  pg.ellipse(gazerX, gazerY, eyeWidth * 1.3, currentH * 1.7 + (1 - blink) * eyeWidth * 0.9);
  if (blink < 0.28) return;
  pg.fill(220);
  pg.ellipse(gazerX, gazerY, eyeWidth, currentH);
  pg.fill(150, 0, 0, 140);
  pg.ellipse(gazerX, gazerY, eyeWidth * 1.05, currentH * 1.25);
  pg.fill(255, 0, 0);
  pg.ellipse(gazerX, gazerY, eyeWidth * 0.25, currentH * 1.05);
  pg.fill(0);
  pg.ellipse(gazerX, gazerY, eyeWidth * 0.10, currentH * 0.90);
}



//3. Blood Blobs and Explosions

function halloweenBlood(pg) {
  if (!pg.bloodBlobs) {
    pg.bloodBlobs = [];
    pg.burstParticles = [];
  }

  pg.background(5, 0, 10, 30);

  if (pg.bloodBlobs.length < 60 && pg.random(1) < 0.4) {
    pg.bloodBlobs.push(makeBlob(pg));
  }

  for (let i = pg.bloodBlobs.length - 1; i >= 0; i--) {
    let blob = pg.bloodBlobs[i];
    blob.blobSize += 0.2;
    blob.blobX += pg.cos(blob.blobAngle) * 0.4;
    blob.blobY += pg.sin(blob.blobAngle) * 0.4;

    for (let j = 0; j < pg.bloodBlobs.length; j++) {
      if (i !== j) {
        let otherBlob = pg.bloodBlobs[j];
        let distance = pg.dist(blob.blobX, blob.blobY, otherBlob.blobX, otherBlob.blobY);
        let minDistance = (blob.blobSize + otherBlob.blobSize) / 2;
        if (distance < minDistance) {
          let pushAngle = pg.atan2(blob.blobY - otherBlob.blobY, blob.blobX - otherBlob.blobX);
          blob.blobX += pg.cos(pushAngle) * 0.6;
          blob.blobY += pg.sin(pushAngle) * 0.6;
        }
      }
    }

    pg.fill(210, 0, 0, 160);
    pg.ellipse(blob.blobX, blob.blobY, blob.blobSize);

    if (blob.blobSize > blob.maxBlobSize) {
      explode(pg, blob.blobX, blob.blobY);
      pg.bloodBlobs.splice(i, 1);
    }
  }

  for (let p = pg.burstParticles.length - 1; p >= 0; p--) {
    let particle = pg.burstParticles[p];
    pg.fill(210, 0, 0, particle.alpha);
    pg.ellipse(particle.particleX, particle.particleY, particle.particleRadius);
    particle.particleX += particle.particleVX;
    particle.particleY += particle.particleVY;
    particle.alpha -= 4;
    if (particle.alpha <= 0) pg.burstParticles.splice(p, 1);
  }
}

function makeBlob(pg) {
  return {
    blobX: pg.width / 2,
    blobY: pg.height / 2,
    blobSize: pg.random(5, 10),
    maxBlobSize: pg.random(25, 45),
    blobAngle: pg.random(pg.TWO_PI)
  };
}

function explode(pg, originX, originY) {
  for (let i = 0; i < 30; i++) {
    let angleDir = pg.random(pg.TWO_PI);
    let speedLevel = pg.random(1, 4);
    pg.burstParticles.push({
      particleX: originX,
      particleY: originY,
      particleVX: pg.cos(angleDir) * speedLevel,
      particleVY: pg.sin(angleDir) * speedLevel,
      particleRadius: pg.random(2, 5),
      alpha: 255
    });
  }
}


function keyPressed() {
  switch (key) {
    case "c": pMapper.toggleCalibration(); break;
    case "f": fullscreen(!fullscreen()); break;
    case "s": pMapper.save("map.json"); break;
    case "l": pMapper.load("map.json"); break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
