

let bugs = [];
let prevS = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let tempBug = new Bug(random(width), random(height)); // make a new bug, store it in a temporary variable
  bugs.push(tempBug); // add that new bug to my bugs array
  
}

function draw() {
  background(255);

  for(let i = 0; i<bugs.length;i++){
    // starting at zero,
    // repeat the following code
    // incrementing i by one with each loop
    // and ending at the length of the bugs array
    bugs[i].move();
    bugs[i].display();
  }

}

function mousePressed(){ // runs ONCE when the mouse is clicked
  let amIHovering = false;

  for(let i = 0; i<bugs.length;i++){
    if(bugs[i].hovering == true){
      // Array.splice is a method for removing elements from an array
      // parameter one is the element to remove
      // parameter two is how many elements to remove
      bugs.splice(i,1); // erase element i from our array. erase only one element.
      amIHovering = true; // flip the am I hovering variable to true, since the mouse click intersected with a bug
    }
  }
  
  if(amIHovering == false){ // if no hovering was detected in previous for loop...
    let tempBug = new Bug(mouseX,mouseY); // make a new bug at the mouse position, store in temp variable
    bugs.push(tempBug); // push the temp bug into the bugs array
  }

}

class Bug {
  constructor(x,y){ // sets the initial values of "fields" or variables
    // copying over the parameters that have been passed through the "new Bug()" constructor
    // so that they are attached to our new "bug" instance  
    this.x = x;
    this.y = y;
    this.hovering = false; // a variable that will show whether the mouse is hovering over a given bug
    this.noisePositionX = random(1000); // drop into perlin noise space at a random position for X
    this.noisePositionY = random(1000); // drop into perlin noise space at a random position for Y
    this.speed = 0.005; // speed at which to move through perlin noise space
  }

  move(){
    this.x = map(noise(this.noisePositionX),0,1,0,width);
    this.y = map(noise(this.noisePositionY),0,1,0,height);
    this.noisePositionX = this.noisePositionX+this.speed;
    this.noisePositionY = this.noisePositionY+this.speed;
  }

  display(){

    if(dist(mouseX,mouseY,this.x,this.y)<7.5){ // is the mouse hovering over the bug?
      // we are hovering!
      this.hovering = true;
      fill(0);//change fill to black
    } else {
      // we are not hovering!
      this.hovering = false;
      fill(255);
    }

    push();
    translate(this.x,this.y);
    line(0,3,10,3);
    line(0,-3,10,-3);
    line(0,0,10,0);
    line(0,3,-10,3);
    line(0,-3,-10,-3);
    line(0,0,-10,0);  
    circle(0,0,15);
    pop();
  }

}