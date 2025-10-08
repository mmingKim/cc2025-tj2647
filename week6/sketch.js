let x =0
let y =0
let d =20
let speed=5
let hue= 20
let opacity =120

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100,34,56)
  x= width/2
  y= height/2
  colorMode(HSB)
harry=new Drunk ()
samantha=
  

function draw() {
  harry.move()
  harry.drawDrunk()
  samantha.move()
  samantha.drawDrunk()
//console.log(millis())

  //millis is about current time
// prevMillis prevSecond

// if(second()!=prevSecond){
   // prevSecond = second()
//lerp()

drawDrunk(9,100,100)

}

function drawDrunk(drunkSpeed,drunkHue,drunkDiameter){
x = x+random(-drunkSpeed,drunkSpeed)
y = y+random(-drunkSpeed,drunkSpeed)
fill(drunkHue,70,100,opacity)
circle(x,y,drunkDiameter)



}
class Drunk{
  constructor(x,y,diameter,speed,hue){
    this.x=x
    this.y=y
    this.diameter=diameter
    this speed=speed
    this hue=hue
    this opacity=radom(0,1)
  
  }
  move(){
    this.x=this.x+random(-this.speed,this.speed)
    this.y=this.y+random(-this.speed,this.speed)
  }
  drawDrunk(){
    fill(this)
  }

}//declares a new type of object


