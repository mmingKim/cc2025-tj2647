
//Concept: I want to connect breath with time. When we breathe, it's like time flows away with the air.
//So when I click, the lips "exhale" the current time.

//At first, I was thinking about how to make the "date" fall smoothly without overlapping each other.
//After meeting with Professor Craig Fahner during office hours,I learned a really good method to make the time fall smoothly.
//It took me quite some time to understand deeply, but now I’m clear about how it works!
//This method is called a basic Matter.js setup.
//Reference: https://editor.p5js.org/cef/sketches/WXaauWYdg
//I first copied this link into my index file to make sure it works.
//<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>

let World = Matter.World;//The engine controls the physics world
let Bodies = Matter.Bodies;//The world holds all the objects
let Engine = Matter.Engine;//Bodies are the shapes that can move or fall
//I’m setting up Matter.js — the physics engine that makes the “time” fall naturally.

//These are my main variables — I’ll use them to build the physics world.
let engine;
let world;
let ground;
let boxes = [];//this will hold all the falling time texts

let t = 0;               //controls the breathing rhythm
let baseSpeed = 0.02;    //constant breathing speed
let currentHue = 0;      //for smooth color change

function setup() {
  createCanvas(windowWidth, windowHeight);//  using HSB color mode to made it easy to change
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
  let openAmount = map(sin(t), -1, 1, 10, 50); //using sin

  //lips color
  fill(currentHue, 85, 80, 0.85); //sames like background color logic
  push();
  translate(width / 2, height / 2);
  noStroke();

  //upper lip
  //The lip uses bezier curves to create smooth shapes
  beginShape();
  vertex(-100, 0);
  bezierVertex(-60, -50, -20, -60, 0, -40);
  bezierVertex(20, -60, 60, -50, 100, 0);
  bezierVertex(60, -openAmount * 0.5, -60, -openAmount * 0.5, -100, 0);
  endShape(CLOSE);
  //https://p5js.org/reference/p5/bezierVertex/

  //lower lip
  beginShape();
  vertex(-100, 0);
  bezierVertex(-60, 70, 60, 70, 100, 0);
  bezierVertex(60, openAmount * 0.5, -60, openAmount * 0.5, -100, 0);
  endShape(CLOSE);
  pop();

  //draw falling date
  //Each “box” is a moment I clicked — a moment that was breathed out.
  fill(0, 0, 100);
  textSize(12);

  for (let i = 0; i < boxes.length; i++) {
    let b = boxes[i];//this is one “time moment”
    let pos = b.body.position; //its current location
    let angle = b.body.angle;//its rotation angle 
//I use push() and pop() so each text moves independently.
    push()
    translate(pos.x, pos.y);//move to the time’s location
    rotate(angle);//rotate it slightly to feel more dynamic
    text(b.label, 0, 0);//draw the time itself
    pop();
  }
}//The loop goes through each one, finds where it is and how it’s rotating,
//then moves and rotates the date so it looks like it’s really falling and spinning.
//like every breath is letting another moment drift down and stay there

//when I click, release one "time" from lips
function mousePressed() {//Here I get the current time. 
  let h = hour(); 
  let m = minute();
  let s = second();
if (m < 10) m = "0" + m;
if (h < 10) h = "0" + h;                  
if (s < 10) s = "0" + s;
  let nowStr = year() + " " + h + ":" + m + ":" + s;//add 0 made the date more like a date

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

