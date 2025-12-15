# Creative coding final project：Jump spider 

## Overview
This project is an interactive creature simulation built with **p5.js** and **ml5.js**.  
The player controls a soft, glowing spider that reacts to hand gestures, jumps in fake 3D space, and interacts with a dynamically simulated spider web.  
When the left hand appears, rain begins to fall and the web starts sagging.  
When the right hand appears, the spider follows the index finger.  
A pinch gesture triggers a jump.

I want to create a digital pet version of my jumping spider, where users can interact with it in playful and interesting ways.

---

## Main Features
- Real-time hand tracking (ml5 HandPose)  
- Right-hand control for movement  
- Left-hand activation of rain  
- Pinch gesture triggering a jump  
- Procedural elastic spider web with node-based physics  
- Fake Z-axis scaling for jump effect  
- Independent leg system with stepping logic  
- Organic body particles using noise jitter  
- Camera-feed background with subtle motion trails  

---

## System Structure
sketch.js
preload() → loads ml5 handpose model
setup() → camera, canvas, event listeners, init spider & web
draw() → main simulation loop
gotHands() → handpose callback
initWeb() → generate spider web nodes

Classes:
Spider → body physics, z-jump, glow, gait control
Leg → stepping algorithm & curved IK-like joints
WebNode → elastic physics for web mesh
RainDrop → falling raindrop particles
BodyParticle → jittering glow particles around body


---

## Hand Tracking Logic

The project uses **ml5.handPose()** to detect hands from the webcam.

**Right Hand → Spider Movement**  
The index fingertip becomes the target the spider moves toward.

**Left Hand → Weather System (Rain)**  
Presence of a left hand activates the rain mode.

**Pinch Gesture → Jump**  
Distance between index finger and thumb determines whether a jump is triggered.


---

## Spider Logic

### Smooth Movement
The spider uses vector-based physics:
- acceleration  
- velocity limiting  
- drag/friction  

to avoid snapping behavior and create organic motion.

### Fake Z-Axis Jump
Jump simulation uses:
- `z` height  
- `vz` upward velocity  
- `gravity`  

When `z > 0`, the spider visually scales up to simulate depth.

### Leg System (Stepping & IK-like curves)
Each leg:
- maintains an ideal angle  
- computes its distance from the ideal point  
- takes a step only when stretched too far  
- uses easing curves and a lifted arc  

This results in believable gait animation.

### Body Particles
Glowing particles around the body:
- jitter using Perlin-style noise  
- pulse in size  
- create a breathing, magical appearance  

---

## Web Physics

The web is constructed from concentric rings and spokes.  
Each **WebNode** has:
- spring force pulling it toward its origin  
- repulsion from spider movement and landing  
- friction/damping  
- sleeping optimization when still  

### Rain Effect on Web
When raining:
- nodes gain downward acceleration  
- slight horizontal randomness simulates wind  
- the web visually sags and trembles  

---

## Rain System

Each **RainDrop**:
- falls using gravity  
- has its own velocity & length  
- disappears off-screen  

Left hand → toggles rain mode on.  

---


# References 

## Hand Tracking  
ml5.js HandPose library  
https://github.com/craigfahner/CC2025-cef9489/tree/main/ml5-handpose

---

## p5.Vector Methods Used

- createVector()  
  https://p5js.org/reference/p5/createVector/

- p5.Vector.add()  
  https://p5js.org/reference/p5.Vector/add/

- p5.Vector.sub()  
  https://p5js.org/reference/p5.Vector/sub/

- p5.Vector.mult()  
  https://p5js.org/reference/p5.Vector/mult/

- p5.Vector.limit()  
  https://p5js.org/reference/p5.Vector/limit/

- p5.Vector.normalize()  
  https://p5js.org/reference/p5.Vector/normalize/

- p5.Vector.mag()  
  https://p5js.org/reference/p5.Vector/mag/

- p5.Vector.lerp()  
  https://p5js.org/reference/p5.Vector/lerp/

---

## Math / Physics Functions Used

- dist()  
  https://p5js.org/reference/p5/dist/

- sin()  
  https://p5js.org/reference/p5/sin/

- cos()  
  https://p5js.org/reference/p5/cos/

- pow()  
  https://p5js.org/reference/p5/pow/

- sqrt()  
  https://p5js.org/reference/p5/sqrt/

---

## Misc. p5 Functions Used

- map()  
  https://p5js.org/reference/p5/map/

- noise()  
  https://p5js.org/reference/p5/noise/

- createCapture()  
  https://p5js.org/reference/p5/createCapture/

- image()  
  https://p5js.org/reference/p5/image/

- line()  
  https://p5js.org/reference/p5/line/

- beginShape()  
  https://p5js.org/reference/p5/beginShape/

# Future
I hope to enrich the interaction by adding sound feedback in the future, and eventually exhibit it on a large screen