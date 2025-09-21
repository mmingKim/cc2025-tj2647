function setup() {
  createCanvas(windowWidth, windowHeight);

}

function draw() {
  
  //background 4 rect
  background("rgba(173, 136, 177, 1)");
  
  fill("rgba(176, 147, 184, 1)");
  noStroke();
  rect(0,0,width,height/4);

  fill("rgba(176, 147, 184, 1)");
  noStroke();
  rect(0,height*2/4,width,height*3/4);

  fill("rgba(173, 136, 177, 1)");
  noStroke();
  rect(0,height*3/4,width);

  //3 square
  fill("rgba(32, 93, 58, 1)")
  noStroke()
  rect(width*1/10,height*2/12,width*1/8)

  fill("rgba(32, 82, 152, 1)")
  noStroke()
  rect(width*8/10,height*2/12,width*1/8)

  fill("rgba(212, 210, 210, 1)")
  noStroke()
  rect(width*8/12,height*3/4-10,width*1/11)
  
  //2 rect
  fill("rgba(207, 191, 98, 1)")
  noStroke()
  rect(width*1/10,height*7/12,width*1/10+10,height*3/10-20)

  fill("rgba(45, 45, 45, 1)")
  noStroke()
  rect(width*8/12+15,height*3/4,width*1/10+7,height*3/10)
  
  //two straight parallel lines 
  stroke("rgba(120, 173, 125, 1)")
  strokeWeight(5)
  line(width*1/20,0,width*1/20,height*1/2+height*1/40)
  stroke("rgba(192, 187, 187, 1)")
  strokeWeight(5)
  line(width*1/20+width*1/40,0,width*1/20+width*1/40,height*1/2+height*1/40)
  
  let linex1=width*1/20
  
  stroke("rgba(192, 187, 187, 1)")
  strokeWeight(5)
  line(linex1-5,height,linex1-5,height*1/2)
  
  stroke("rgba(120, 173, 125, 1)")
  strokeWeight(5)
  line(linex1 - 5 - width*1/40,height,linex1 - 5 - width*1/40,height*1/2);

  // two slanted parallel lines
  stroke("rgba(120, 173, 125, 1)")
  strokeWeight(5)
  line(width,0,width*19/20,height*1/2)


  stroke("rgba(192, 187, 187, 1)")
  strokeWeight(5)
  line(width-width*1/40,0,width*19/20-width*1/40,height*1/2)

  stroke("rgba(120, 173, 125, 1)")
  strokeWeight(5)
  line(width,height,width*19/20-width*1/40,height*1/2)
 
  stroke("rgba(192, 187, 187, 1)")
  strokeWeight(5);
  line(width- width*1/40,height,width*19/20-width*2/40,height*1/2)
 
  //4 cut-corner rect
  fill("rgba(32, 68, 144, 1)")
  noStroke()
  beginShape()
  vertex(width*4/6,height*1/12)
  vertex(width*4/6,height*4/12)
  vertex(width*5/6,height*4/12)
  vertex(width*5/6,height*1/12+70)
  endShape()

  fill("rgba(54, 55, 56, 1)")
  noStroke()
  beginShape()
  vertex(width*9/12,height*4/12)
  vertex(width*7/12,height*5/12)
  vertex(width*7/12,height*7/12)
  vertex(width*9/12,height*7/12)
  endShape()
  //calculated the position based on the relationship between the shapes
  
  // When I had more shapes, figuring out the positions got harder, so I searched for how to show the mouse coordinates.
  text(mouseX + ", " + mouseY, mouseX+10, mouseY-10)

  fill("rgba(151, 99, 155, 1)")
  noStroke()
  beginShape()
  vertex(392,347)
  vertex(330,398)
  vertex(329,533)
  vertex(410,534)
  endShape()

  fill("rgba(99, 155, 149, 1)")
  noStroke()
  beginShape()
  vertex(285,544)
  vertex(249,543)
  vertex(230,632)
  vertex(270,height)
  vertex(282,height)
  endShape()

  //the upper and lower curves
  stroke("rgba(32, 68, 144, 1)");
  strokeWeight(6.5);
  noFill()
  beginShape();
  vertex(0, 7);                       
  quadraticVertex(width/3, height/13,width,0)
  endShape();

  stroke("rgba(32, 68, 144, 1)");
  strokeWeight(6.5);
  noFill()
  beginShape();
  vertex(0, height-5);                       
  quadraticVertex(276,620,width,height);
  endShape();

  // the middle curves
  stroke("rgba(45, 46, 48, 1)");
  strokeWeight(6);
  noFill()
  beginShape();
  vertex(width/2,0);
  quadraticVertex(width/2+50,height/2,width/2,height)
  endShape()

  // two triangle with curves
  stroke("rgba(45, 46, 48, 1)");
  strokeWeight(6);
  Fill("rgb(0,0,0)")
  beginShape();
  vertex(0,0,0)
  



  






}

