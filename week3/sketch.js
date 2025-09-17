let circleSize=125
let redcolor
function setup() {
  //runs once at set up
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
// a grayscale color is denoted as a number 0-255
// an RGB color is denoted as 3 numbers(red green blue) 
// background(127,54,200)
// can use color name add""
background("rgba(228, 163, 163, 1)");
//can also format color rgb




fill("rgba(84, 67, 67, 1)")
noStroke()
rect(0,0,width/2,height/2);
rect(width/2,height/2,width,height);



// background("rgb(0,0,0)")
// stroke and fill change the color of drawn shapes
stroke("rgba(18, 243, 134, 1)");
fill("rgba(133, 67, 67, 1)");

strokeWeight(4);
//noStroke();gets rid of stroke completely
//noFill();              fill
//ccirclec takes 3 parameters x,y and d
circle(175,200,circleSize);

//setting new fill for my rectangle
fill("rgba(226, 94, 94, 1)");
rect(100,300,150,200);
// rect takes 4 parameters;
// x coord of top left,y coord,of left,width,height;
ellipse(150,200,30,20);
//ellipse takes 4 parameters;
//x coord of center,y center,width and height;
line(150,200,100,300);
// line connects two coord:x1y1,x2y2
beginShape();
vertex(30,20);//leftmost coordinate
vertex(85,20);// top right coordinate
vertex(85,75);// bottom-most coordinate
vertex(30,75);
endShape(CLOSE);//CLOSE parameter closes the polygon
// to drow conplex polygons(more than 2 coords)
// create a bs;function;and es function
//any vertex function you place inbetween bs and es
//will be rendered as points in a complete polygom


fill("#99FF99");
circle(width/2,100+50,width*0.15)

ellipse(mouseX,mouseY,mouseX*0.15,30)//all can change mouseXY




circle(width/2,100+50,width*0.15)

ellipse(mouseX,mouseY,mouseX*0.15,30)//all can change mouseXY


arc(width/2,height/2*0.75,100,100,radians(30-mouseX),radians(330),PIE);
//arcs like ellipse,expect they have teo extra parameters
//start and end which are provided in RADIANS format
//youcan convert degrees to radians using the radians() function


}

