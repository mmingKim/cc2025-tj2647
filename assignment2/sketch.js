
function setup() {
  createCanvas(windowWidth, windowHeight); 
  rectMode(CENTER); 
  //draw rects from center
  noStroke(); 
  colorMode(HSB, 360, 100, 100); 
  //HSB color mode
}

function draw() {
  background(0, 0, 95); 

  let Size = 100; //base cell size

  for (let y = 0; y < height; y += Size) { 
  //loop rows
  for (let x = 0; x < width; x += Size) {  //    cols

  push(); 
  translate(x + Size/2, y + Size/2); 
  //center of each grid cell

  let bigsize = Size * (1 + y/height); 
  //square size grows with Y

  let angle = (y/height) * PI/4; 
  //rotation grows with Y
      
  rotate(angle);

  let hole = map(mouseY, 0, width, 10, bigsize * 0.7); 
  //hole size depends on mouse Y

  let hue = 200; //fixed blue
  let sat = map(mouseY, 0, height, 10, 100); 
  //saturation depends on mouse Y
  let bri = map(y, 0, height, 100, 60); 
  //brightness decreases with Y

  fill(hue, sat, bri); 
  rect(0, 0, bigsize, bigsize); // outer square

  fill(0, 0, 95); 
  rect(0, 0, hole, hole); // inner square hole

  pop();
    }
  }
}
