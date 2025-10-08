
//Concept: I want to connect breath with time. When we breathe, it's like time flows away with the air.
//So when I click, the lips "exhale" the current time.

//At first, I was thinking about how to make the "date" fall smoothly without overlapping each other.
//After having an office hour with professer, I learned such a great method to show it.
//It took me quite some time to understand deeply, but now I’m clear about how it works!
//This method is called a basic Matter.js setup.
//Reference: https://editor.p5js.org/cef/sketches/WXaauWYdg
//I first copied this link into my index file to make sure it works.
//<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>

let World = Matter.World;
let Bodies = Matter.Bodies;
let Engine = Matter.Engine;



let engine;
let world;
let ground;
let boxes = [];

let t = 0;               //breathing phase
let baseSpeed = 0.02;    //constant breathing speed
let currentHue = 0;      //store smooth color value

function setup() {
  createCanvas(windowWidth, windowHeight);// i using HSB color mode to made it easy to change
  colorMode(HSB, 360, 100, 100);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);


// physics world
engine = Engine.create();
world = engine.world;
Engine.run(engine);
//I create the physics engine using Matter.js.
//1.Engine.create() builds a virtual “world” where objects can move, fall, and collide based on gravity and physics rules.
//2.I store that world in the variable world, so I can add objects into it later.
//3.Engine.run(engine) starts the simulation — it keeps calculating motion every frame, just like animation.

//ground for the text to land on
let options = { isStatic: true };
ground = Bodies.rectangle(width / 2, height - 10, width, 20, options);
World.add(world, ground);
//create a “ground” — a flat rectangle at the bottom of the canvas.
//isStatic: true option means it will not move; it just stays fixed so that date can fall and land on it
//Bodies.rectangle() creates a rectangle body, and World.add(world, ground) adds it into the physics world
}

function draw() {
  // background color change based on seconds
  let s = second(); //integer 0–59
  let targetHue = map(s, 0, 59, 0, 360);
  currentHue = lerp(currentHue, targetHue, 0.05); //using  "lerp" change the color in new way
  let bri = 15 + 10 * sin(t * 0.5);
  fill(currentHue, 40, bri);
  rect(0, 0, width, height);

  //breathing lips animation like exhale and inhale
  t = t + baseSpeed;
  let openAmount = map(sin(t), -1, 1, 10, 50); //using

  //lips color
  fill(currentHue, 85, 80, 0.85); //same like background color logic
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

  //draw falling date
  fill(0, 0, 100);
  textSize(12);

  for (let i = 0; i < boxes.length; i++) {
    let b = boxes[i];
    let pos = b.body.position; 
    let angle = b.body.angle;

    push()
    translate(pos.x, pos.y);
    rotate(angle);
    text(b.label, 0, 0);
    pop();
  }
}//The loop goes through each one, finds where it is and how it’s rotating,
//then moves and rotates the date so it looks like it’s really falling and spinning.
//like every breath is letting another moment drift down and stay there

//when I click, release one "time" from lips
function mousePressed() {
  let h = hour(); 
  let m = minute();
  let s = second();
if (m < 10) m = "0" + m;
if (h < 10) h = "0" + h;                  
if (s < 10) s = "0" + s;
  let nowStr = year() + " " + h + ":" + m + ":" + s;//made the date more like a date

  //create a falling date
  let body = Bodies.rectangle(width / 2 + random(-30, 30), height / 2, 100, 20, {
  //defines its position, size, and physical behavior.
  
    friction: 0.4,//controls how much it slows down when sliding
    restitution: 0.4,//how bouncy it is when it hits something
    angle: random(-0.5, 0.5)//gives it a small random rotation, so they don’t all fall perfectly straight
  });
  World.add(world, body);

//save info into simple list
  boxes.push({ body: body, label: nowStr });
}

