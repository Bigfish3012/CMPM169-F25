// here is the main sketch
let fishes = [];
let numFishes = 8;

function setup() {
  createCanvas(1800, 800);
  
  // Create multiple fish
  for (let i = 0; i < numFishes; i++) {
    fishes.push(new Fish(random(100, width - 100), random(100, height - 100)));
  }
}

function draw() {
  // Draw water background with gradient
  drawWaterPool();
  
  // Draw water ripples
  drawRipples();
  
  // Update and display all fish
  for (let fish of fishes) {
    fish.update();
    fish.display();
  }
}

// Draw water pool with gradient effect
function drawWaterPool() {
  // Water gradient from light blue at top to darker blue at bottom
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(100, 180, 220), color(20, 100, 160), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Draw animated water ripples
function drawRipples() {
  noFill();
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  
  for (let i = 0; i < 3; i++) {
    let offset = (frameCount * 2 + i * 100) % 400;
    let x = width / 4 + i * width / 4;
    circle(x, height / 3, offset);
  }
}