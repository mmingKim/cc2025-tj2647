

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
//  translate  moves the coordinate matrix according to a new set of coordinate
//which become new"
  background("rgba(183, 85, 85, 1)")
  fill("rgba(0, 0, 0, 1)")  ;
  text(mouseX + "," + mouseY, 20, 70);
  fill("rgba(77, 131, 163, 1)")
  push();//push and pop ISOLATE a translation,
  //anything enclosed within push and pop only applites,within that enclosure
  //push indicates the beginning of
  
  circle(100,100,100);
  circle(65,62,30);
  circle(133,61,30);
  translate(width/2,height/2);
   let angle;//map is a function  scales numbers proportionately
  //parameters
  angle=map(mouseX,0,width,0,360);
  scale(2) //if supply two parameters,it scales differently,onX and Y
            //let (scaleFactor)=,scale(scaleFactor)

  

  rotate(radians(angle))
  circle(100,100,100);
  circle(65,62,30);
  circle(133,61,30);


  
  pop();//end of


  
//if(mouseV>width/2&&){} ==. mouseIsPressed
//  else{}
// fill("yellow")




}


//push(
//everything within this push/pop block 
//will be centered ,with 0,0 as the center point
//for(let i=0;i<10;i++)
//i++ adds1 to i
//i+=10 adds 10 to i
//i-- subtracts 1 form i

//randomXDisp=random(-y,y);
//translate(ramdomXdisp,0);
//let ramdomAmount