function setup() {
  createCanvas(windowWidth, windowHeight);
  
}
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
function draw() {
  
  //background 4 rect
  background("rgba(173, 136, 177, 1)");
  
  fill("rgba(176, 147, 184, 1)");
  noStroke();
  rect(0,0,width,height*1/4);

  fill("rgba(176, 147, 184, 1)");
  noStroke();
  rect(0,height*2/4,width,height*3/4);

  fill("rgba(173, 136, 177, 1)");
  noStroke();
  rect(0,height*3/4,width);

  //3 square
  fill("rgba(32, 93, 58, 1)");
  noStroke();
  rect(width*1/10,height*2/12,width*1/8);

  fill("rgba(28, 88, 173, 1)");
  noStroke();
  rect(width*8/10,height*2/12,width*1/8);

  fill("rgba(212, 210, 210, 1)");
  noStroke();
  rect(width*8/12, height*3/4 - height*0.015, width*1/11, width*1/11);
  
  //2 rect
  fill("rgba(207, 191, 98, 1)");
  noStroke();
  rect(width*1/10,height*7/12,width*1/10 + width*0.023, height*3/10 - height*0.030);
  fill("rgba(79, 73, 80, 1)");
  noStroke();
  rect(width*8/12 + width*0.034, height*3/4, width*1/10 + width*0.016, height*3/10);
  
  //two straight parallel lines 
  stroke("rgba(60, 111, 65, 1)");
  strokeWeight(5);
  line(width*1/20,0,width*1/20,height*1/2+height*1/40);
  stroke("rgba(12, 68, 10, 1)");
  strokeWeight(5);
  line(width*1/20+width*1/40,0,width*1/20+width*1/40,height*1/2+height*1/40);
  
  let linex1=width*1/20;
  
  stroke("rgba(12, 68, 10, 1)");
  strokeWeight(5);
  line(linex1 - width*0.011, height, linex1 - width*0.011, height*1/2);  
  stroke("rgba(60, 111, 65, 1)");
  strokeWeight(5);
  
  // two slanted parallel lines
  stroke("rgba(60, 111, 65, 1)");
  strokeWeight(5);
  line(width,0,width*19/20,height*1/2);
  line(linex1 - width*0.011 - width*1/40, height, linex1 - width*0.011 - width*1/40, height*1/2);


  stroke("rgba(12, 68, 10, 1)");
  strokeWeight(5);
  line(width-width*1/40,0,width*19/20-width*1/40,height*1/2);

  stroke("rgba(60, 111, 65, 1)");
  strokeWeight(5);
  line(width,height,width*19/20-width*1/40,height*1/2);
 
  stroke("rgba(12, 68, 10, 1)");
  strokeWeight(5);
  line(width- width*1/40,height,width*19/20-width*2/40,height*1/2);
 
  //4 cut-corner rect
  fill("rgba(53, 78, 131, 1)");
  noStroke();
  beginShape();
  vertex(width*4/6,height*1/12);
  vertex(width*4/6,height*4/12);
  vertex(width*5/6,height*4/12);
  vertex(width*5/6,height*1/12+ height*0.103);
  endShape();

  fill("rgba(78, 74, 80, 1)");
  noStroke();
  beginShape();
  vertex(width*9/12,height*4/12);
  vertex(width*7/12,height*5/12);
  vertex(width*7/12,height*7/12);
  vertex(width*9/12,height*7/12);
  endShape();
  //calculated the position based on the relationship between the shapes
  
  // When I had more shapes, figuring out the positions got harder, so I searched for how to show the mouse coordinates.
  fill(0)  ;
  text(mouseX + "," + mouseY, 20, 70);
  //Then I converted the values according to the size of the preview canvas. 441×678

  fill("rgba(151, 99, 155, 1)");
  noStroke()
  beginShape()
  vertex(width*0.889, height*0.512);  // 392,347
  vertex(width*0.748, height*0.587);  // 330,398
  vertex(width*0.746, height*0.786);  // 329,533
  vertex(width*0.930, height*0.788);  
  endShape()

  fill("rgba(99, 155, 149, 1)")
  noStroke()
  beginShape()
  vertex(width*0.646, height*0.802);  // 285,544
  vertex(width*0.565, height*0.801);  // 249,543
  vertex(width*0.521, height*0.932);  // 230,632
  vertex(width*0.612, height*1.0);    // 270,height
  vertex(width*0.639, height*1.0);    // 282,height
  endShape()

  //the upper and lower curves
  stroke("rgba(63, 96, 165, 1)");
  strokeWeight(6.5);
  noFill()
  beginShape();
  vertex(0, height*0.010);                       
  quadraticVertex(width*1/3, height*1/13,width,0);
  endShape();

  stroke("rgba(64, 96, 165, 1)");
  strokeWeight(6.5);
  noFill()
  beginShape();
  vertex(0, height - height*0.007);
  quadraticVertex(width*0.626, height*0.915, width, height);
  endShape();

  // the middle curves
  stroke("rgba(203, 161, 216, 1)");
  strokeWeight(6);
  noFill()
  beginShape();
  vertex(width/2,0);
  quadraticVertex(width/2 + width*0.159,height*1/2,width*1/2,height);
  endShape();

  // two triangle with curves
  stroke("rgba(200, 200, 208, 1)");
  strokeWeight(2);
  fill("rgba(198, 144, 75, 1)")
  beginShape();
  vertex(width*0.506, height*0.047);
  vertex(width*0.175, height*0.310);
  quadraticVertex(width*0.420, height*0.413, width*0.571, height*0.556);
  quadraticVertex(width*0.576, height*0.302, width*0.506, height*0.047);
  endShape();
  
  stroke("rgba(200, 200, 208, 1)");
  strokeWeight(2);
  fill("rgba(198, 144, 75, 1)");
  beginShape();
  vertex(width*0.506, height*0.953);
  vertex(width*0.175, height*0.690);
  quadraticVertex(width*0.420, height*0.587, width*0.571, height*0.444);
  quadraticVertex(width*0.576, height*0.698, width*0.506, height*0.953);
  endShape();

  // detial
  stroke("rgba(186, 186, 190, 1)");
  strokeWeight(1);
  beginShape()
  vertex(width*0.504, height*0.502);
  quadraticVertex(width*0.551, height*0.534, width*0.569, height*0.565);
  endShape() ;


  
 



  
}

//After the last tweaks, I turned the added or subtracted numbers into ratios
//For the colors, I  chose complementary ones.


