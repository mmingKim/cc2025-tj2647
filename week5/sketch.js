
let buttonX = 200;   
let buttonY = 200;   
let buttonD= 80;   

let hovering = false;
let r=0//red
let g=0//green
let b=0  //blue

let ballX = 0
let ballSpeed=0.5
let ballDiameter =30

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  ballX = ballDiameter/2 ;
  
  
}

function draw() {
  
  
  background(0);
  strokeWeight(1);

  fill(300);
  text("X: "+ mouseX+"y:"+mouseY,15,15);
  let distance=dist(mouseX,mouseY,buttonX,buttonY);
  text("dist:"+distance,15,30);

  stroke(255);//white
  noFill()
  
  if(distance<buttonD/2){
  
  hovering = true 
  if(mouseIsPressed){
    strokeWeight(3);
    fill(r,g,b)

  }
  ballX = ballX + ballSpeed
  }else{
    hovering = false
  }
  circle(buttonX,buttonY,buttonD);
  fill("red")
  noStroke()

if(ballX>width-(ballDiameter/2) || ballX < ballDiameter/2){
   ballSpeed = -ballSpeed;

}
  
  circle(ballX,200,30);



}

function mousePressed(){
  //the mousepressed funtion runs enclosed code
  //Once when the mouse is pressed down
  if(hovering == true){
  

  
  r = random(255);
  g = random(255);
  b = random(255);
  }
}