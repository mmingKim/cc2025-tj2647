
//Concept: Each click is like a breath. When I click, the lips "exhale" the current time,
//and the text falls naturally using Matter.js physics. The background color changes softly like breathing.

//basic Matter.js setup
//https://editor.p5js.org/cef/sketches/WXaauWYdg
let Engine = Matter.Engine;
let World = Matter.World;
let Bodies = Matter.Bodies;

let engine;
let world;
let ground;
let boxes = [];

let t = 0;               //breathing phase
let baseSpeed = 0.02;    //constant breathing speed

function setup() {
createCanvas(windowWidth, windowHeight);
colorMode(HSB, 360, 100, 100);
noStroke();
textAlign(CENTER, CENTER);
textSize(14);

//create physics world
engine = Engine.create();
world = engine.world;
Engine.run(engine);

//ground for the text to land on
let options = { isStatic: true };
ground = Bodies.rectangle(width / 2, height - 10, width, 20, options);
World.add(world, ground);
}

function draw() {
//soft background color that moves with time 
let hueFlow = (millis() * 0.01) % 360;
let bri = 15 + 10 * sin(t * 0.5);
fill(hueFlow, 40, bri);
rect(0, 0, width, height);

//breathing lips animation 
t = t + baseSpeed;
let openAmount = map(sin(t), -1, 1, 10, 50);

//lips color
fill((hueFlow + 40) % 360, 85, 80, 0.85);
push();
translate(width / 2, height / 2);
noStroke();

//upper lip
beginShape();
vertex(-100, 0);
bezierVertex(-60, -50, -20, -60, 0, -40);
bezierVertex(20, -60, 60, -50, 100, 0);
bezierVertex(60, -openAmount * 0.5, -60, -openAmount * 0.5, -100, 0);
endShape(CLOSE);

//lower lip
beginShape();
vertex(-100, 0);
bezierVertex(-60, 70, 60, 70, 100, 0);
bezierVertex(60, openAmount * 0.5, -60, openAmount * 0.5, -100, 0);
endShape(CLOSE);
pop();

//draw falling time boxes
fill(0, 0, 100);
textSize(12);

for (let i = 0; i < boxes.length; i++) {
let b = boxes[i];
let pos = b.body.position; 
let angle = b.body.angle;

 push();
 translate(pos.x, pos.y);
 rotate(angle);
 text(b.label, 0, 0);
pop();
  }
}

//when I click, release one "time" from lips
function mousePressed() {
let hh = hour(); if (hh < 10) hh = "0" + hh;
let mm = minute(); if (mm < 10) mm = "0" + mm;
let ss = second(); if (ss < 10) ss = "0" + ss;
let nowStr = year() + " " + hh + ":" + mm + ":" + ss;

//create a falling body with text
let body = Bodies.rectangle(width / 2 + random(-30, 30), height / 2, 100, 20, {
 friction: 0.4,
 restitution: 0.4,
 angle: random(-0.5, 0.5)
  });
    World.add(world, body);

//save info into simple list 
boxes.push({ body: body, label: nowStr });
}
