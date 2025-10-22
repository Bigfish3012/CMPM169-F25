// here is the main sketch
let fishes = [];
let numFishes = 20;
let fishFeeds = [];
let leaves = [];
let ripples = [];
let stones = [];
let ripplePositions = []; // Store fixed positions for background ripples

function setup() {
  createCanvas(1600, 800);
  
  // Create stones at bottom of pond for realistic effect
  for (let i = 0; i < 800; i++) {
    stones.push(new Stone(random(width), random(height)));
  }
  
  // Create multiple fish
  for (let i = 0; i < numFishes; i++) {
    fishes.push(new Fish(random(100, width - 100), random(100, height - 100)));
  }
  
  // Create initial leaves
  for (let i = 0; i < 5; i++) {
    leaves.push(new Leaf(random(width), random(-200, -50)));
  }
  
  // Generate fixed random positions for background ripples
  for (let i = 0; i < 5; i++) {
    ripplePositions.push({
      x: random(width),
      y: random(height)
    });
  }
}

function draw() {
  drawWaterPool();
  // Display stones at bottom of pond
  for (let stone of stones) {
    stone.display();
  }
  drawRipples();
  // Update and display ripples from leaves
  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].display();
    
    if (ripples[i].isDead()) {
      ripples.splice(i, 1);
    }
  }
  
  // Update and display fish feed
  for (let i = fishFeeds.length - 1; i >= 0; i--) {
    fishFeeds[i].update();
    fishFeeds[i].display();
    
    // Remove dead fish feed
    if (fishFeeds[i].isDead()) {
      fishFeeds.splice(i, 1);
    }
  }
  
  // Update and display all fish
  for (let fish of fishes) {
    fish.update(fishFeeds);
    fish.display();
  }
  
  // Update and display leaves
  for (let i = leaves.length - 1; i >= 0; i--) {
    let hitWater = leaves[i].update();
    
    // Create ripple when leaf hits water
    if (hitWater && !leaves[i].hasCreatedRipple) {
      ripples.push(new Ripple(leaves[i].pos.x, leaves[i].pos.y));
      leaves[i].hasCreatedRipple = true;
    }
    
    leaves[i].display();
    
    // Remove leaves that drifted off screen
    if (leaves[i].isDead()) {
      leaves.splice(i, 1);
    }
  }
  
  // Randomly add new leaves
  if (random() < 0.01 && leaves.length < 15) {
    leaves.push(new Leaf(random(width), -30));
  }
}

function mousePressed() {
  // Spawn multiple fish feed at mouse position
  for (let i = 0; i < 12; i++) {
    fishFeeds.push(new FishFeed(mouseX, mouseY));
  }
}

// Draw water pool with gradient effect
function drawWaterPool() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color("#37353E"), color("#44444E"), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Draw animated water ripples
function drawRipples() {
  noFill();
  strokeWeight(5);
  
  for (let i = 0; i < ripplePositions.length; i++) {
    let offset = (frameCount * 2 + i * 500) % 400;
    let alpha = map(offset, 0, 400, 150, 0);
    stroke(255, 255, 255, alpha);
    let x = ripplePositions[i].x;
    let y = ripplePositions[i].y;
    circle(x, y, offset);
  }
}