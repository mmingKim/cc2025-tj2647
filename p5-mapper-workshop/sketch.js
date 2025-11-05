

let pMapper;
let quadPumpkin, quadEyes;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);


  pMapper = createProjectionMapper(this);
  pMapper.load("map.json");

 
  quadPumpkin = pMapper.createQuadMap(400, 400);
  quadEyes = pMapper.createQuadMap(400, 400);

 
  quadPumpkin.moveTo(-300, 0);
  quadEyes.moveTo(150, -400);  
}

function draw() {
  background(0);

  
  quadPumpkin.displaySketch(halloweenPumpkins);
  quadEyes.displaySketch(halloweenEyes);
}


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
  pg.fill(230, 100, 0); pg.ellipse(bx - s * 0.3, by, s * 0.82, s * 0.9);
  pg.fill(210, 80, 0); pg.ellipse(bx - s * 0.45, by, s * 0.7, s * 0.88);
  pg.fill(245, 115, 5); pg.ellipse(bx + s * 0.15, by, s * 0.9, s * 0.93);
  pg.fill(230, 100, 0); pg.ellipse(bx + s * 0.3, by, s * 0.82, s * 0.9);
  pg.fill(210, 80, 0); pg.ellipse(bx + s * 0.45, by, s * 0.7, s * 0.88);
  pg.fill(35, 130, 50); pg.rect(bx, by - s * 0.6, s * 0.12, s * 0.25, 6);
}

function drawPupuFace(pg, px, py, s) {
  let shadowOffset = s * 0.03;
  pg.fill(255, 150, 70, 160);
  let eyeW = s * 0.22;

  // 阴影层
  pg.triangle(px - eyeW + shadowOffset, py - s * 0.15 + shadowOffset,
    px - s * 0.1 + shadowOffset, py + shadowOffset,
    px - s * 0.35 + shadowOffset, py + shadowOffset);
  pg.triangle(px + eyeW + shadowOffset, py - s * 0.15 + shadowOffset,
    px + s * 0.35 + shadowOffset, py + shadowOffset,
    px + s * 0.1 + shadowOffset, py + shadowOffset);

  // 主眼睛与嘴巴
  pg.fill(0);
  pg.triangle(px - eyeW, py - s * 0.15, px - s * 0.1, py, px - s * 0.35, py);
  pg.triangle(px + eyeW, py - s * 0.15, px + s * 0.35, py, px + s * 0.1, py);
  pg.triangle(px - s * 0.05, py + s * 0.02, px + s * 0.05, py + s * 0.02, px, py - s * 0.05);
}



function halloweenEyes(pg) {
  pg.angleMode(pg.DEGREES);
  if (!pg.localFrame) pg.localFrame = 0;
  pg.localFrame++;

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

  pg.background(5, 0, 10, 90);

  for (let e of pg.eyes) {
    let blink = pg.abs(pg.sin(pg.localFrame * 3 + e.blinkOffset));
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
  pg.ellipse(
    gazerX,
    gazerY,
    eyeWidth * 1.3,
    currentH * 1.7 + (1 - blink) * eyeWidth * 0.9
  );

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
