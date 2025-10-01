
function setup() {
  createCanvas(windowWidth, windowHeight); 
  rectMode(CENTER); 
  //draw rectangles from their center point 
  //this makes it easy to rotate a square around its own center
  noStroke(); 
  colorMode(HSB, 360, 100, 100); 
  //use HSB color mode.In this sketch: hue is fixed, mouseY changes saturation, row (y) changes brightness

}

function draw() {
  background(0, 0, 95); 

  let Size = 100;  
  //base cell size (each grid cell is 100×100)
  //using a variable here makes it easy to change the grid later

  for (let y = 0; y < height; y += Size) { 
  //outer loop: go down the screen in steps of Size
  for (let x = 0; x < width; x += Size) {  
  //inner loop: go across the screen in steps of Size

  push(); 
  translate(x + Size/2, y + Size/2); 
  //center of each grid cell
  //move the origin to the center of this grid cell
  //now (0,0) is the middle of the square we will draw

  let bigsize = Size * (1 + y/height); 
  //square size grows with Y
  // y/height gives a 0..1 ratio (top=0, bottom=1)
  //top row - 1×Size, bottom row - 2×Size

  let angle = (y/height) * PI/4; 
  //rotation grows with Y
  //top row - 0°, bottom row - 45° (PI/4)
  //rotation happens around the translated origin (the cell center)

      
  rotate(angle);
  //apply the rotation before drawing the squares

  let hole = map(mouseY, 0, width, 10, bigsize * 0.7); 
  //hole size depends on mouse Y
  //mouse at top to small hole (10)
  //mouse at bottom to large hole (70% of the outer square）

  let hue = 200; //fixed blue
  let sat = map(mouseY, 0, height, 10, 100); 
  //saturation depends on mouse Y
  //up = low saturation (grayish), down = high saturation (strong color)

  let bri = map(y, 0, height, 100, 60); 
  //brightness decreases with Y
  //brightness decreases with row:
  //top row bright (100), bottom row darker (60)


  fill(hue, sat, bri); 
  rect(0, 0, bigsize, bigsize);
  //outer square,drawn at the cell center, with rotation already applied
  


  fill(0, 0, 95); 
  rect(0, 0, hole, hole); // inner square hole
  //draw with the same center so it cuts out the middle
  //use the background color to fake a hollow effect

  pop();
    }
  }
}
//I want to keep the outer square fixed and use the inner square to create the hollow variation effect
//I spent a long time organizing the logic of its changes, and I found that using let helps me see more clearly which variations I’m working with.