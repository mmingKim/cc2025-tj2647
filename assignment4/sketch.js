let sushis = [];
let plateX, plateY;
let plateRadius = 250;
//I keep all sushi in a list so each click makes a new one and draw() can show all

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  noStroke();

  plateX = width / 2;
  plateY = height / 2;
  //I put the plate in the center to make position control easier
}

function draw() {
  background("rgba(220, 235, 240, 1)"); //soft color to make sushi colors pop

  fill("rgb(180,200,190)");
  ellipse(plateX, plateY, 500, 500);
  fill("rgba(255,255,255,0.25)");
  ellipse(plateX, plateY, 480, 480);
  //two circles make the plate look layered but simple

  for (let i = 0; i < sushis.length; i++) {
    sushis[i].display(); //each sushi knows how to draw itself
  }
}

function mousePressed() {
  let d = dist(mouseX, mouseY, plateX, plateY);
  if (d <= plateRadius) {
    //check if click is inside plate so sushi stays on it
    let types = ["salmon", "tuna", "egg"];
    let t = random(types);
    sushis.push(new Sushi(mouseX, mouseY, t));
    //make a new sushi at mouse position with a random type
  }
}

class Sushi {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    //save where this sushi is and what kind it is

    this.riceGrains = [];
    //I make many small ovals once so rice looks natural and doesn’t flicker
    for (let i = 0; i < 100; i++) {
      this.riceGrains.push({
        x: random(-40, 40),
        y: random(-15, 15),
        w: random(5, 8),
        h: random(3, 4),
        r: random(-15, 15)
      });
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rectMode(CENTER);
    noStroke();
    //I move the drawing center to the sushi position so each piece is independent

    fill("rgb(255,255,255)");
    rect(0, 0, 100, 40, 17);
    //rounded shape feels softer like real rice

    for (let g of this.riceGrains) {
      push();
      translate(g.x, g.y);
      rotate(radians(g.r));
      fill("rgb(235,235,235)");
      ellipse(0, 0, g.w, g.h);
      pop();
      //each grain has small random offset and rotation to feel organic
    }

    if (this.type === "salmon") {
      this.drawSalmon();
    } else if (this.type === "tuna") {
      this.drawTuna();
    } else if (this.type === "egg") {
      this.drawTamago();
    }
    //different toppings use same base logic but different drawing details

    pop();
    //reset all settings so next sushi is not affected
  }

  drawSalmon() {
    fill("rgb(255,140,90)");
    rect(0, -15, 105, 25, 18);
    //I move it slightly up so it looks like sitting on the rice

    stroke("rgba(255,255,255,0.5)");
    strokeWeight(2);
    for (let i = -40; i < 40; i += 20) {
      line(i, -25, i + 10, -5);
      //simple repeating lines make salmon texture without complex shapes
    }
    noStroke();
  }

  drawTuna() {
    push();
    translate(0, -10);
    noStroke();

    fill("rgb(220,80,100)");
    rect(0, 0, 105, 30, 18);
    //slightly thicker to feel heavier than salmon

    fill("rgba(255,170,180,0.5)");
    ellipse(0, -5, 100, 20);
    //soft highlight gives a shiny look like real fish

    stroke("rgba(255,255,255,0.4)");
    strokeWeight(2);
    line(-35, -4, -20, 4);
    line(-10, -6, 10, 6);
    line(25, -4, 40, 4);
    //thin white lines for gentle texture
    noStroke();

    pop();
  }

  drawTamago() {
    fill("rgb(255,230,120)");
    rect(0, -15, 100, 25, 12);
    fill("rgb(250,220,100)");
    rect(0, -20, 100, 5, 5);
    fill("rgb(240,210,90)");
    rect(0, -10, 100, 5, 5);
    //three layers of yellow make the egg look soft and cooked

    fill("rgba(40,50,30,0.7)");
    rect(0, 0, 20, 45, 5);
    fill("rgba(60,70,40,0.4)");
    rect(-3, 0, 6, 43, 2);
    //the seaweed band goes vertically to make it feel realistic
  }
}

