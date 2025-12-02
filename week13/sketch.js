//This week I took my spider to the next level! I added a generative spider web background that reacts to the spider's movement.
//I also finally implemented the hand gesture control I planned. Now, my right hand guides the spider (Index Finger), and if I pinch (Thumb + Index), it jumps!
//I also added a fun "God Mode" feature if I show my left hand, I can summon rain, which makes the web heavy and the spider slip down.
//It feels much more interactive now.


let spider;
// I need an array to store all the points (nodes) of the web so I can animate them individually.
let webNodes = [];
let numRings;
let numSpokes = 24; // This defines how many "slices" the web has.
let ringSpacing = 40; // How far apart the rings are.

// Hand Tracking Variables
// These are for the ml5.js library.
let handPose;
let video;
let hands = []; // This array will hold the data of any hands detected by the camera.

// Weather Variables
// I added these to control the rain mechanic.
let isRaining = false;
let rainDrops = []; // Stores all the active rain particles.
let rainTimer = 0; // A timer to smooth out the transition when I move my hand away.

function preload() {
    // Load the machine learning model.
    // I'm using "handPose" because it gives me keypoints for fingers (tips, knuckles, etc.).
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Set up the webcam.
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide(); // Important! I hide the default HTML video element because I want to draw the video manually on the canvas.

    // Start the detection loop.
    // "gotHands" is the callback function that runs every time the AI sees a hand.
    handPose.detectStart(video, gotHands);

    // Generate the web structure.
    initWeb();

    // Instantiate the spider in the center. All the movement and drawing logic happens inside this class.
    spider = new Spider(width / 2, height / 2);
}

function draw() {
    // Drawing the Background
    push();
    // I translate to the width and scale by -1 to FLIP the video horizontally.
    // This creates a "mirror" effect. Without this, moving my hand right would make the spider go left, which is super confusing.
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // I used a background with transparency here to create a "trail/afterimage" effect.
    // It makes the spider look a bit ghostly when it moves.
    // I made it darker (opacity 230) so the web stands out against the video.
    background(5, 5, 8, 230);

    // Hand Logic (Control & Weather)
    // Right now the target is the mouse, but I prepared this as a vector so I can easily swap it for hand coordinates later.
    let target = createVector(mouseX, mouseY); 
    let pinchDistance = 999;
    let rainHandDetected = false;
    let controlHand = null;

    

    // Loop through all detected hands to classify them.
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        
        // ML5 tells me if a hand is "Left" or "Right".
        // Note It sees it from the person's perspective.
        if (hand.handedness === 'Left') {
            rainHandDetected = true; // Left hand found -> Rain Mode active.
        } else if (hand.handedness === 'Right') {
            controlHand = hand; // Right hand found -> Control Mode active.
        }
    }

    // Rain Logic
    if (rainHandDetected) {
        isRaining = true;
        rainTimer = 60; // Keep raining for ~1 second after hand leaves so it doesn't flicker.
    } else {
        if (rainTimer > 0) {
            rainTimer--;
        } else {
            isRaining = false;
        }
    }

    // Control Logic
    if (controlHand) {
        // Keypoint 8 is the Index Finger Tip.
        let indexFinger = controlHand.keypoints[8];
        // Keypoint 4 is the Thumb Tip.
        let thumb = controlHand.keypoints[4];

        // I have to map the coordinates because the video is 640x480 but my window might be larger.
        let tx = map(indexFinger.x, 0, video.width, width, 0);
        let ty = map(indexFinger.y, 0, video.height, 0, height);
        
        // If it's NOT raining, the spider obeys the hand. 
        if (!isRaining) {
            target = createVector(tx, ty);
        }

        let thumbX = map(thumb.x, 0, video.width, width, 0);
        let thumbY = map(thumb.y, 0, video.height, 0, height);
        
        // Calculate distance for the pinch gesture.
        pinchDistance = dist(tx, ty, thumbX, thumbY);

        // Visual debug circles.
        noStroke();
        fill(0, 255, 0, 100); 
        circle(tx, ty, 10);
        fill(255, 0, 0, 100); 
        circle(thumbX, thumbY, 10);
    } else if (hands.length > 0 && !rainHandDetected) {
        // Fallback If only one hand is visible and it's not the left one, assume it's the controller.
        let hand = hands[0];
        let indexFinger = hand.keypoints[8];
        let tx = map(indexFinger.x, 0, video.width, width, 0);
        let ty = map(indexFinger.y, 0, video.height, 0, height);
        if (!isRaining) target = createVector(tx, ty);
    }

    // Rain System
    if (isRaining) {
        // Add new drops every other frame.
        if (frameCount % 2 === 0) {
            for (let i = 0; i < 8; i++) { 
                rainDrops.push(new RainDrop());
            }
        }
    }

    // Update rain drops
    for (let i = rainDrops.length - 1; i >= 0; i--) {
        let drop = rainDrops[i];
        drop.update();
        drop.display();
        if (drop.pos.y > height) {
            rainDrops.splice(i, 1);
        }
    }

    // Draw the Elastic Web
    drawingContext.shadowBlur = 0;
    stroke(255, 255, 255, 40);
    strokeWeight(1);

    let sx = spider.pos.x;
    let sy = spider.pos.y;
    // This defines the radius of the "shockwave" the spider creates on the web.
    let repulsionRadiusSq = 14400; 
    
    // If the spider just landed from a jump, I make the radius HUGE for a dramatic impact effect.
    if (spider.justLanded) {
        repulsionRadiusSq = 40000; 
    } else if (spider.z > 10) {
        repulsionRadiusSq = 0; // If jumping in the air, don't touch the web.
    }

    for (let r = 0; r < webNodes.length; r++) {
        let currentRing = webNodes[r];
        for (let s = 0; s < currentRing.length; s++) {
            let node = currentRing[s];
            
            // Pass the 'isRaining' flag to the node. If it's true, the node gets heavy and sags.
            node.update(sx, sy, repulsionRadiusSq, isRaining);

            // Draw lines between nodes
            let nextS = (s + 1) % currentRing.length;
            let neighborRing = currentRing[nextS];
            line(node.pos.x, node.pos.y, neighborRing.pos.x, neighborRing.pos.y);

            if (r < webNodes.length - 1) {
                let neighborRadial = webNodes[r + 1][s];
                line(node.pos.x, node.pos.y, neighborRadial.pos.x, neighborRadial.pos.y);
            }
        }
    }
    
    // Reset the landing flag after one frame.
    if (spider.justLanded) spider.justLanded = false;

    // Jump Trigger
    // If pinch distance is small (< 40) AND not jumping AND not raining... Jump!
    if (pinchDistance < 40 && !spider.isJumping && !isRaining) {
        spider.jump();
    }

    spider.update(target, isRaining);
    spider.display();
}

function gotHands(results) {
    hands = results;
}

function windowResized() {
    // Just making sure the canvas resizes if the window changes, so the spider doesn't get lost.
    resizeCanvas(windowWidth, windowHeight);
    initWeb(); // Re-generate the web to fit the new size.
}

function initWeb() {
    webNodes = [];
    let cx = width / 2;
    let cy = height / 2;
    let maxDist = dist(0, 0, cx, cy);
    numRings = ceil(maxDist / ringSpacing);

    for (let r = 1; r <= numRings; r++) {
        let ringNodes = [];
        let currentRadius = r * ringSpacing;
        for (let s = 0; s < numSpokes; s++) {
            let angle = map(s, 0, numSpokes, 0, TWO_PI);
            let x = cx + cos(angle) * currentRadius;
            let y = cy + sin(angle) * currentRadius;
            // Add randomness so it looks organic.
            x += random(-1.5, 1.5);
            y += random(-1.5, 1.5);
            ringNodes.push(new WebNode(x, y));
        }
        webNodes.push(ringNodes);
    }
}

// RainDrop Class
class RainDrop {
    constructor() {
        this.pos = createVector(random(width), -10);
        this.vel = createVector(random(-1, 1), random(10, 20));
        this.len = random(10, 20);
        this.alpha = random(100, 200);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.y += 0.2; // Gravity
    }

    display() {
        stroke(200, 230, 255, this.alpha);
        strokeWeight(1.5);
        line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 0.5, this.pos.y - this.len);
    }
}

// WebNode Class
class WebNode {
    constructor(x, y) {
        this.origin = createVector(x, y); // Remember where this node SHOULD be.
        this.pos = this.origin.copy();    // Where it ACTUALLY is.
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.isSleeping = true; // Optimization.
    }

    update(sx, sy, rSq, isRaining) {
        // Special Physics If it's raining, the web gets heavy and sags.
        if (isRaining) {
            this.isSleeping = false;
            this.acc.y += 0.3; // Gravity from water.
            this.acc.x += random(-0.2, 0.2);
            
            this.vel.add(this.acc);
            this.vel.mult(0.95);
            this.pos.add(this.vel);
            this.acc.mult(0);
            return;
        }

        // Normal Elastic Logic
        let dx = this.pos.x - sx;
        let dy = this.pos.y - sy;
        let distSq = dx * dx + dy * dy;
        let distToHomeSq = Math.pow(this.origin.x - this.pos.x, 2) + Math.pow(this.origin.y - this.pos.y, 2);

        if (distSq < rSq || distToHomeSq > 1 || !this.isSleeping) {
            this.isSleeping = false;

            // Repulsion Spider pushes web.
            if (distSq < rSq) {
                let d = Math.sqrt(distSq);
                let maxDist = Math.sqrt(rSq); 
                let force = map(d, 0, maxDist, 12, 0);
                if (d > 0) {
                    this.acc.x += (dx / d) * force;
                    this.acc.y += (dy / d) * force;
                }
            }

            // Spring Force Pull back to origin.
            let hx = this.origin.x - this.pos.x;
            let hy = this.origin.y - this.pos.y;

            this.acc.x += hx * 0.08;
            this.acc.y += hy * 0.08;

            this.vel.x += this.acc.x;
            this.vel.y += this.acc.y;
            this.vel.x *= 0.85; // Friction
            this.vel.y *= 0.85;
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
            this.acc.x = 0;
            this.acc.y = 0;

            if ((this.vel.x * this.vel.x + this.vel.y * this.vel.y) < 0.01 &&
                (hx * hx + hy * hy) < 0.01) {
                this.pos.set(this.origin);
                this.vel.set(0, 0);
                this.isSleeping = true;
            }
        }
    }
}

// Spider Class
class Spider {
    constructor(x, y) {
        // Physics properties for the body: pos, vel, acc.
        // I use these to make it "float" towards the mouse instead of just snapping to it.
        this.pos = createVector(x, y);
        this.originalPos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        // Z-axis simulation variables for jumping.
        this.z = 0;       
        this.vz = 0;      
        this.gravity = 0.8; 
        this.jumpForce = 25; 
        this.isJumping = false;
        this.justLanded = false; 

        // bodyParticles are the little dots floating around the center to make it look fuzzy and glowing.
        this.bodyParticles = [];
        for (let i = 0; i < 30; i++) {
            this.bodyParticles.push(new BodyParticle());
        }

        // The legs array holds the 8 leg objects. Each one has its own ideal angle and walking state.
        this.legs = [];
        let legCount = 8;

        // I need to split the legs into left and right groups.
        // I used map() to spread them out in a fan shape on both sides of the body.
        for (let i = 0; i < legCount; i++) {
            let baseAngle;
            if (i < legCount / 2) {
                // Left side legs: mapped from top-left to bottom-left (-PI/2 to -1.2*PI).
                baseAngle = map(i, 0, legCount / 2 - 1, -PI / 2, -PI * 1.2);
            } else {
                // Right side legs: mapped from top-right to bottom-right (PI/2 to 1.2*PI).
                baseAngle = map(i, legCount / 2, legCount - 1, PI / 2, PI * 1.2);
            }
            // Initialize each leg with a reference to this spider, its ideal angle, and how long it should reach.
            this.legs.push(new Leg(this, baseAngle, 105));
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.vz = this.jumpForce; // Upward force
        }
    }

    update(target, isRaining) {
        // Scenario A Rain Physics (Falling)
        // If it rains, the spider slips down the screen.
        if (isRaining) {
            this.acc.y += 0.5; // Gravity
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
            
            // Floor collision
            if (this.pos.y > height - 50) {
                this.pos.y = height - 50;
                this.vel.y *= -0.3; // Bounce
                this.vel.x *= 0.9;
            }
            
            // Make legs twitch
            for (let leg of this.legs) {
                leg.struggle();
            }
            return;
        }

        // Scenario B Jump Physics
        if (this.isJumping) {
            this.z += this.vz;
            this.vz -= this.gravity;

            if (this.z <= 0) {
                this.z = 0;
                this.vz = 0;
                this.isJumping = false;
                this.justLanded = true; // Trigger web ripple
            }
        }

        // Calculate the direction from the body to the target (mouse).
        let dir = p5.Vector.sub(target, this.pos);
        let d = dir.mag();
        dir.normalize();

        let speedLimit = this.isJumping ? 6 : 4;
        if (d > 100) speedLimit = 8; // Run faster if far away

        // If the target is far away, apply acceleration to move towards it smoothly.
        if (d > 10) {
            // Scale the direction vector to control the force.
            dir.mult(0.5);
            this.acc = dir;
            this.vel.add(this.acc);
            // Limit max speed so it doesn't fly off too fast.
            this.vel.limit(speedLimit);
            this.pos.add(this.vel);
            // Multiply by 0.9 to simulate friction/drag, so it doesn't slide forever.
            this.vel.mult(0.9);
        } else {
            // When very close to the target, stop slowly.
            this.vel.mult(0.95);
        }

        // Gait Control Logic (The tricky part):
        // I check if any legs are currently moving. If one is moving, I generally wait before moving another
        // so they don't all lift up at once and look like it's floating.
        let movingLegs = this.legs.filter(l => l.isMoving);
        
        // Don't step if jumping.
        if (movingLegs.length === 0 && !this.isJumping) {
            // Find the leg that is most "uncomfortable" (furthest from its ideal spot).
            let bestLeg = null;
            let maxDist = 25; // Threshold for when a leg needs to step.

            for (let leg of this.legs) {
                let dist = leg.getDistToIdeal();
                if (dist > maxDist) {
                    maxDist = dist;
                    bestLeg = leg;
                }
            }
            // If we found a leg that's stretched too far, trigger a step.
            if (bestLeg) bestLeg.startStep();
        }

        // Update all legs (animation and position calculations).
        for (let leg of this.legs) leg.update(this.isJumping);
    }

    display() {
        push(); 
        translate(this.pos.x, this.pos.y);
        // Scale based on Z to simulate jumping towards the camera.
        let scaleFactor = 1 + this.z * 0.015; 
        scale(scaleFactor);
        translate(-this.pos.x, -this.pos.y);

        // Add a glow effect to the whole creature.
        drawingContext.shadowBlur = 35;
        drawingContext.shadowColor = "rgba(255,255,255,0.7)";

        // Draw legs first so they appear "under" the body.
        for (let leg of this.legs) leg.display();

        push();
        translate(this.pos.x, this.pos.y);

        // Make the body glow even stronger.
        drawingContext.shadowBlur = 60;
        drawingContext.shadowColor = "rgba(255,255,255,1)";

        noStroke();
        // Draw the fuzzy particles. They jitter slightly to look alive.
        for (let p of this.bodyParticles) {
            p.update();
            p.display();
        }

        // Draw the flower shape on top. It rotates to look like a magical creature's head.
        this.drawFlowerHead();

        pop();

        // Reset shadow so it doesn't mess up other drawings.
        drawingContext.shadowBlur = 0;
        pop();
    }

    drawFlowerHead() {
        push();
        // Pale pink with transparency for the petals.
        fill(255, 240, 250, 150);
        // Slow rotation based on frameCount.
        rotate(frameCount * 0.03);

        // Using polar coordinates and a sine wave to draw a "wavy" flower shape.
        beginShape();
        for (let a = 0; a < TWO_PI; a += 0.05) {
            // The radius changes with a sine wave to make the petals bump in and out.
            let rad = 18 + 7.5 * sin(6 * a + frameCount * 0.05);
            vertex(rad * cos(a), rad * sin(a));
        }
        endShape(CLOSE);

        // Red dot in the center for an eye or core.
        fill(255, 0, 0, 200);
        circle(0, 0, 12);

        pop();
    }
}


class Leg {
    constructor(spider, idealAngle, reach) {
        this.spider = spider;
        // idealAngle is where the leg "wants" to be relative to the body.
        this.idealAngle = idealAngle;
        // reach is how far the leg sticks out.
        this.reach = reach;

        // currentPos is where the foot actually is on the ground.
        this.currentPos = p5.Vector.add(
            this.spider.pos,
            p5.Vector.fromAngle(idealAngle).mult(reach)
        );

        // Variables for the stepping animation (start, target, progress).
        this.stepTarget = this.currentPos.copy();
        this.stepStart = this.currentPos.copy();
        this.isMoving = false;
        this.stepProgress = 1; // 0 to 1
        this.stepDuration = 6; // How many frames a step takes (lower = faster).
        this.stepCounter = 0;
    }

    getDistToIdeal() {
        // Calculate where the foot SHOULD be if the spider was standing perfectly still.
        let idealPos = p5.Vector.add(
            this.spider.pos,
            p5.Vector.fromAngle(this.idealAngle).mult(this.reach)
        );
        // Return distance between current foot pos and that ideal pos.
        return p5.Vector.dist(this.currentPos, idealPos);
    }

    startStep() {
        // Trigger the moving state.
        this.isMoving = true;
        this.stepStart = this.currentPos.copy();

        // Re-calculate ideal position based on current body position.
        let idealPos = p5.Vector.add(
            this.spider.pos,
            p5.Vector.fromAngle(this.idealAngle).mult(this.reach)
        );
        // Prediction Logic:
        // I add a bit of the spider's current velocity to the target.
        // This makes the leg step *ahead* of the movement, which looks much more realistic than stepping to where the body currently is.
        let lead = this.spider.vel.copy().mult(12);
        this.stepTarget = p5.Vector.add(idealPos, lead);

        this.stepProgress = 0;
        this.stepCounter = 0;
    }

    // New Function Struggle
    // This makes the legs twitch when it's raining.
    struggle() {
        let idealPos = p5.Vector.add(this.spider.pos, p5.Vector.fromAngle(this.idealAngle).mult(this.reach * 0.5)); 
        // Random jitter
        idealPos.x += random(-5, 5);
        idealPos.y += random(-5, 5);
        this.currentPos.lerp(idealPos, 0.1);
    }

    update(spiderJumping) {
        // If jumping, tuck the legs in slightly.
        if (spiderJumping) {
            let idealPos = p5.Vector.add(this.spider.pos, p5.Vector.fromAngle(this.idealAngle).mult(this.reach * 0.6)); 
            this.currentPos.lerp(idealPos, 0.2);
            this.isMoving = false; 
            return;
        }

        if (this.isMoving) {
            // Update progress 0 -> 1.
            this.stepCounter++;
            this.stepProgress = min(1, this.stepCounter / this.stepDuration);

            let t = this.stepProgress;
            // Easing function: makes the step start slow, go fast, then end slow.
            let easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            // Lerp (linear interpolate) the X/Z position.
            this.currentPos = p5.Vector.lerp(this.stepStart, this.stepTarget, easedT);

            // Lift the leg! Using sin(PI) to create an arc height.
            let liftHeight = sin(easedT * PI) * 20;
            this.currentPos.y -= liftHeight;

            if (this.stepProgress >= 1) {
                this.isMoving = false;
            }
        }
    }

    display() {
        // Calculate the "root" of the leg (where it attaches to the body).
        let root = this.spider.pos.copy();
        let offset = p5.Vector.fromAngle(this.idealAngle).mult(15);
        root.add(offset);

        stroke(255, 255, 255, 100);
        strokeWeight(2);
        noFill();

        // Procedural Knee Bending (Inverse Kinematics-ish):
        // To make it look like a leg, I find the midpoint and push it outwards.
        let midPoint = p5.Vector.lerp(root, this.currentPos, 0.5);
        let legVector = p5.Vector.sub(this.currentPos, root);
        // Get perpendicular vector for the bend direction.
        let bendDir = legVector.copy().rotate(PI / 2).normalize();

        // Flip bend direction based on which side of the body the leg is on.
        let bendAmount = 37.5;
        if (this.idealAngle > 0 && this.idealAngle < PI) bendAmount = -bendAmount;

        // Exaggerate the bend when the leg is lifting up.
        if (this.isMoving) {
            let factor = sin(this.stepProgress * PI);
            bendAmount *= 1 + factor * 0.8;
        }

        midPoint.add(bendDir.mult(bendAmount));

        // Draw the curved leg.
        beginShape();
        vertex(root.x, root.y);
        curveVertex(root.x, root.y);
        curveVertex(midPoint.x, midPoint.y);
        curveVertex(this.currentPos.x, this.currentPos.y);
        curveVertex(this.currentPos.x, this.currentPos.y);
        endShape();

        // Draw a glowing dot for the foot.
        noStroke();
        fill(255, 255, 255, 180);
        circle(this.currentPos.x, this.currentPos.y, 7.5);

        // Draw a smaller dot for the knee.
        fill(255, 255, 255, 100);
        circle(midPoint.x, midPoint.y, 6);
    }
}

// BodyParticle Class
class BodyParticle {
    constructor() {
        // Start at a random offset near the center.
        this.pos = p5.Vector.random2D().mult(random(7.5, 37.5));
        this.originalOffset = this.pos.copy();
        this.size = random(12, 30);
        // Random time offset so they don't all pulse in sync.
        this.oscOffset = random(1000);
    }

    update() {
        let noiseFactor = 0.02;
        // Use Perlin noise to make them float around organically.
        let fx = map(noise(frameCount * noiseFactor + this.oscOffset), 0, 1, -12, 12);
        let fy = map(
            noise(frameCount * noiseFactor + this.oscOffset + 100),
            0,
            1,
            -12,
            12
        );
        this.currentOffset = p5.Vector.add(this.originalOffset, createVector(fx, fy));
    }

    display() {
        // Low alpha for a soft, layered look.
        fill(255, 255, 255, 25);
        // Pulse size with a sine wave.
        let s = this.size + sin(frameCount * 0.05 + this.oscOffset) * 6;
        circle(this.currentOffset.x, this.currentOffset.y, s);
    }
}