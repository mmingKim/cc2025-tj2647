//I originally wanted to make my pet gecko, but getting the crawling motion right was way too hard for my current coding skills.
//So I switched to another pet I used to have—a jumping spider. I used abstract circles and lines to represent its body and legs.
//For the body, I used a cluster of floating dots to simulate a "fuzzy ball" texture, and placed a rotating, breathing flower shape in the center as a cute, slightly fantasy-style head.
//Visually, I wanted it to look like a mix between a spider and a glowing sprite, drifting gently across the screen.
//For now, I'm using the mouse position as the target. The focus this week is on the "spider appearance" and the "leg stepping logic".
//Later, I plan to switch to hand-gesture control using a camera library like ml5.handpose.


let spider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    //Instantiate the spider in the center. All the movement and drawing logic happens inside this class.
    spider = new Spider(width / 2, height / 2);
}

function draw() {
    //I used a background with transparency here to create a "trail/afterimage" effect.
    //It makes the spider look a bit ghostly when it moves.
    background(10, 10, 15, 100);

    //Right now the target is the mouse, but I prepared this as a vector so I can easily swap it for hand coordinates later.
    let target = createVector(mouseX, mouseY);
    spider.update(target);
    spider.display();
}

function windowResized() {
    //Just making sure the canvas resizes if the window changes, so the spider doesn't get lost.
    resizeCanvas(windowWidth, windowHeight);
}

//Spider Class
class Spider {
    constructor(x, y) {
        //Physics properties for the body: pos, vel, acc.
        //I use these to make it "float" towards the mouse instead of just snapping to it.
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        //bodyParticles are the little dots floating around the center to make it look fuzzy and glowing.
        this.bodyParticles = [];
        for (let i = 0; i < 30; i++) {
            this.bodyParticles.push(new BodyParticle());
        }

        //The legs array holds the 8 leg objects. Each one has its own ideal angle and walking state.
        this.legs = [];
        let legCount = 8;

        //I need to split the legs into left and right groups.
        //I used map() to spread them out in a fan shape on both sides of the body.
        for (let i = 0; i < legCount; i++) {
            let baseAngle;
            if (i < legCount / 2) {
                //Left side legs: mapped from top-left to bottom-left (-PI/2 to -1.2*PI).
                baseAngle = map(i, 0, legCount / 2 - 1, -PI / 2, -PI * 1.2);
            } else {
                //Right side legs: mapped from top-right to bottom-right (PI/2 to 1.2*PI).
                baseAngle = map(i, legCount / 2, legCount - 1, PI / 2, PI * 1.2);
            }
            //Initialize each leg with a reference to this spider, its ideal angle, and how long it should reach.
            this.legs.push(new Leg(this, baseAngle, 70));
        }
    }

    update(target) {
        //Calculate the direction from the body to the target (mouse).
        let dir = p5.Vector.sub(target, this.pos);
        let d = dir.mag();
        dir.normalize();

        //If the target is far away, apply acceleration to move towards it smoothly.
        if (d > 10) {
            //Scale the direction vector to control the force.
            dir.mult(0.5);
            this.acc = dir;
            this.vel.add(this.acc);
            //Limit max speed so it doesn't fly off too fast.
            this.vel.limit(4);
            this.pos.add(this.vel);
            //Multiply by 0.9 to simulate friction/drag, so it doesn't slide forever.
            this.vel.mult(0.9);
        } else {
            //When very close to the target, stop slowly.
            this.vel.mult(0.95);
        }

        //Gait Control Logic (The tricky part):
        //I check if any legs are currently moving. If one is moving, I generally wait before moving another
        //so they don't all lift up at once and look like it's floating.
        let movingLegs = this.legs.filter(l => l.isMoving);
        if (movingLegs.length === 0) {
            //Find the leg that is most "uncomfortable" (furthest from its ideal spot).
            let bestLeg = null;
            let maxDist = 25; //Threshold for when a leg needs to step.

            for (let leg of this.legs) {
                let dist = leg.getDistToIdeal();
                if (dist > maxDist) {
                    maxDist = dist;
                    bestLeg = leg;
                }
            }
            //If we found a leg that's stretched too far, trigger a step.
            if (bestLeg) bestLeg.startStep();
        }

        //Update all legs (animation and position calculations).
        for (let leg of this.legs) leg.update();
    }

    display() {
        //Add a glow effect to the whole creature.
        drawingContext.shadowBlur = 35;
        drawingContext.shadowColor = "rgba(255,255,255,0.7)";

        //Draw legs first so they appear "under" the body.
        for (let leg of this.legs) leg.display();

        push();
        translate(this.pos.x, this.pos.y);

        //Make the body glow even stronger.
        drawingContext.shadowBlur = 60;
        drawingContext.shadowColor = "rgba(255,255,255,1)";

        noStroke();
        //Draw the fuzzy particles. They jitter slightly to look alive.
        for (let p of this.bodyParticles) {
            p.update();
            p.display();
        }

        //Draw the flower shape on top. It rotates to look like a magical creature's head.
        this.drawFlowerHead();

        pop();

        //Reset shadow so it doesn't mess up other drawings.
        drawingContext.shadowBlur = 0;
    }

    drawFlowerHead() {
        push();
        //Pale pink with transparency for the petals.
        fill(255, 240, 250, 150);
        //Slow rotation based on frameCount.
        rotate(frameCount * 0.03);

        //Using polar coordinates and a sine wave to draw a "wavy" flower shape.
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.05) {
            //The radius changes with a sine wave to make the petals bump in and out.
            let rad = 12 + 5 * sin(6 * a + frameCount * 0.05);
            vertex(rad * cos(a), rad * sin(a));
        }
        endShape(CLOSE);

        //Red dot in the center for an eye or core.
        fill(255, 0, 0, 200);
        circle(0, 0, 8);

        pop();
    }
}


class Leg {
    constructor(spider, idealAngle, reach) {
        this.spider = spider;
        //idealAngle is where the leg "wants" to be relative to the body.
        this.idealAngle = idealAngle;
        //reach is how far the leg sticks out.
        this.reach = reach;

        //currentPos is where the foot actually is on the ground.
        this.currentPos = p5.Vector.add(
            this.spider.pos,
            p5.Vector.fromAngle(idealAngle).mult(reach)
        );

        //Variables for the stepping animation (start, target, progress).
        this.stepTarget = this.currentPos.copy();
        this.stepStart = this.currentPos.copy();
        this.isMoving = false;
        this.stepProgress = 1; //0 to 1
        this.stepDuration = 6; //How many frames a step takes (lower = faster).
        this.stepCounter = 0;
    }

    getDistToIdeal() {
        //Calculate where the foot SHOULD be if the spider was standing perfectly still.
        let idealPos = p5.Vector.add(
            this.spider.pos,
            p5.Vector.fromAngle(this.idealAngle).mult(this.reach)
        );
        //Return distance between current foot pos and that ideal pos.
        return p5.Vector.dist(this.currentPos, idealPos);
    }

    startStep() {
        //Trigger the moving state.
        this.isMoving = true;
        this.stepStart = this.currentPos.copy();

        //Re-calculate ideal position based on current body position.
        let idealPos = p5.Vector.add(
            this.spider.pos,
            p5.Vector.fromAngle(this.idealAngle).mult(this.reach)
        );
        //Prediction Logic:
        //I add a bit of the spider's current velocity to the target.
        //This makes the leg step *ahead* of the movement, which looks much more realistic than stepping to where the body currently is.
        let lead = this.spider.vel.copy().mult(12);
        this.stepTarget = p5.Vector.add(idealPos, lead);

        this.stepProgress = 0;
        this.stepCounter = 0;
    }

    update() {
        if (this.isMoving) {
            //Update progress 0 -> 1.
            this.stepCounter++;
            this.stepProgress = min(1, this.stepCounter / this.stepDuration);

            let t = this.stepProgress;
            //Easing function: makes the step start slow, go fast, then end slow.
            let easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            //Lerp (linear interpolate) the X/Z position.
            this.currentPos = p5.Vector.lerp(this.stepStart, this.stepTarget, easedT);

            //Lift the leg! Using sin(PI) to create an arc height.
            let liftHeight = sin(easedT * PI) * 20;
            this.currentPos.y -= liftHeight;

            if (this.stepProgress >= 1) {
                this.isMoving = false;
            }
        }
    }

    display() {
        //Calculate the "root" of the leg (where it attaches to the body).
        let root = this.spider.pos.copy();
        let offset = p5.Vector.fromAngle(this.idealAngle).mult(10);
        root.add(offset);

        stroke(255, 255, 255, 100);
        strokeWeight(1.5);
        noFill();

        //Procedural Knee Bending (Inverse Kinematics-ish):
        //To make it look like a leg, I find the midpoint and push it outwards.
        let midPoint = p5.Vector.lerp(root, this.currentPos, 0.5);
        let legVector = p5.Vector.sub(this.currentPos, root);
        //Get perpendicular vector for the bend direction.
        let bendDir = legVector.copy().rotate(PI / 2).normalize();

        //Flip bend direction based on which side of the body the leg is on.
        let bendAmount = 25;
        if (this.idealAngle > 0 && this.idealAngle < PI) bendAmount = -bendAmount;

        //Exaggerate the bend when the leg is lifting up.
        if (this.isMoving) {
            let factor = sin(this.stepProgress * PI);
            bendAmount *= 1 + factor * 0.8;
        }

        midPoint.add(bendDir.mult(bendAmount));

        //Draw the curved leg.
        beginShape();
        vertex(root.x, root.y);
        curveVertex(root.x, root.y);
        curveVertex(midPoint.x, midPoint.y);
        curveVertex(this.currentPos.x, this.currentPos.y);
        curveVertex(this.currentPos.x, this.currentPos.y);
        endShape();

        //Draw a glowing dot for the foot.
        noStroke();
        fill(255, 255, 255, 180);
        circle(this.currentPos.x, this.currentPos.y, 5);

        //Draw a smaller dot for the knee.
        fill(255, 255, 255, 100);
        circle(midPoint.x, midPoint.y, 4);
    }
}


class BodyParticle {
    constructor() {
        //Start at a random offset near the center.
        this.pos = p5.Vector.random2D().mult(random(5, 25));
        this.originalOffset = this.pos.copy();
        this.size = random(8, 20);
        //Random time offset so they don't all pulse in sync.
        this.oscOffset = random(1000);
    }

    update() {
        let noiseFactor = 0.02;
        //Use Perlin noise to make them float around organically.
        let fx = map(noise(frameCount * noiseFactor + this.oscOffset), 0, 1, -8, 8);
        let fy = map(
            noise(frameCount * noiseFactor + this.oscOffset + 100),
            0,
            1,
            -8,
            8
        );
        this.currentOffset = p5.Vector.add(this.originalOffset, createVector(fx, fy));
    }

    display() {
        //Low alpha for a soft, layered look.
        fill(255, 255, 255, 25);
        //Pulse size with a sine wave.
        let s = this.size + sin(frameCount * 0.05 + this.oscOffset) * 4;
        circle(this.currentOffset.x, this.currentOffset.y, s);
    }
}