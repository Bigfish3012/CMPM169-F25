// Generative Floor Lamp - p5.js Implementation
// All parameters with validation and constraints

// Global parameters with defaults
let params = {
  seed: 12345,
  baseRadius_cm: 18,
  baseShape: 'trapezoid',
  mainHeight_m: 1.7,
  mainRadius_cm: 5,
  branchCount: 3,
  branchLength_cm: 35,
  branchRadius_cm: 2,
  bulbDiameter_cm: 10
};

// Store branch lengths for each branch
let branchLengths = [];

// Store branch positions (pre-calculated)
let branchPositions = [];

// Lamp power state
let lampIsOn = true;

// Individual bulb states (on/off for each bulb)
let bulbStates = [];

// Bulb hit boxes for click detection
let bulbHitBoxes = [];

// Switch button dimensions and position
let switchButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

// Canvas and scaling
let canvasWidth = 800;
let canvasHeight = 800;
let scalePxPerMeter = 300; // Fixed scale: 300 pixels per meter
let lampCenterX = canvasWidth / 2;

// UI elements
let uiElements = {};

// Random generator for deterministic results (using p5's global functions)

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  // Create UI elements
  createUI();
  
  // Generate initial lamp
  generateLamp();
}

function draw() {
  background(240);
  
  // Draw ground line
  stroke(100);
  strokeWeight(2);
  let groundY = height - 80;
  line(0, groundY, width, groundY);
  
  // Draw lamp
  drawLamp();
  
  // Draw UI info
  drawInfo();
}

// Removed: using fixed scale instead of dynamic scaling

function cmToPx(cm) {
  return (cm / 100) * scalePxPerMeter;
}

function mToPx(m) {
  return m * scalePxPerMeter;
}

function createUI() {
  let container = select('#ui-container');
  
  // Seed input
  let seedGroup = createDiv().addClass('control-group');
  seedGroup.child(createP('Seed').style('margin', '0').style('font-weight', 'bold'));
  uiElements.seedInput = createInput(params.seed.toString());
  uiElements.seedInput.input(() => {
    params.seed = parseInt(uiElements.seedInput.value()) || 12345;
    generateLamp();
  });
  seedGroup.child(uiElements.seedInput);
  container.child(seedGroup);
  
  // Main height slider
  let heightGroup = createDiv().addClass('control-group');
  let heightLabel = createP('Main Height (m)').style('margin', '0').style('font-weight', 'bold');
  heightGroup.child(heightLabel);
  uiElements.heightValue = createSpan(params.mainHeight_m.toFixed(1)).style('color', '#666').style('font-size', '14px');
  heightLabel.child(createSpan(' = ').style('color', '#999'));
  heightLabel.child(uiElements.heightValue);
  uiElements.heightSlider = createSlider(0.7, 2.5, params.mainHeight_m, 0.1);
  uiElements.heightSlider.input(() => {
    params.mainHeight_m = uiElements.heightSlider.value();
    uiElements.heightValue.html(params.mainHeight_m.toFixed(1));
    generateLamp();
  });
  heightGroup.child(uiElements.heightSlider);
  container.child(heightGroup);
  
  // Main radius slider
  let radiusGroup = createDiv().addClass('control-group');
  let radiusLabel = createP('Main Radius (cm)').style('margin', '0').style('font-weight', 'bold');
  radiusGroup.child(radiusLabel);
  uiElements.radiusValue = createSpan(params.mainRadius_cm.toFixed(1)).style('color', '#666').style('font-size', '14px');
  radiusLabel.child(createSpan(' = ').style('color', '#999'));
  radiusLabel.child(uiElements.radiusValue);
  uiElements.radiusSlider = createSlider(1, 10, params.mainRadius_cm, 0.5);
  uiElements.radiusSlider.input(() => {
    params.mainRadius_cm = uiElements.radiusSlider.value();
    uiElements.radiusValue.html(params.mainRadius_cm.toFixed(1));
    generateLamp();
  });
  radiusGroup.child(uiElements.radiusSlider);
  container.child(radiusGroup);
  
  // Base radius slider
  let baseRadiusGroup = createDiv().addClass('control-group');
  let baseRadiusLabel = createP('Base Radius (cm)').style('margin', '0').style('font-weight', 'bold');
  baseRadiusGroup.child(baseRadiusLabel);
  uiElements.baseRadiusValue = createSpan(params.baseRadius_cm.toFixed(0)).style('color', '#666').style('font-size', '14px');
  baseRadiusLabel.child(createSpan(' = ').style('color', '#999'));
  baseRadiusLabel.child(uiElements.baseRadiusValue);
  uiElements.baseRadiusSlider = createSlider(10, 30, params.baseRadius_cm, 1);
  uiElements.baseRadiusSlider.input(() => {
    params.baseRadius_cm = uiElements.baseRadiusSlider.value();
    uiElements.baseRadiusValue.html(params.baseRadius_cm.toFixed(0));
    generateLamp();
  });
  baseRadiusGroup.child(uiElements.baseRadiusSlider);
  container.child(baseRadiusGroup);
  
  // Branch count slider
  let branchCountGroup = createDiv().addClass('control-group');
  let branchCountLabel = createP('Branch Count').style('margin', '0').style('font-weight', 'bold');
  branchCountGroup.child(branchCountLabel);
  uiElements.branchCountValue = createSpan(params.branchCount.toFixed(0)).style('color', '#666').style('font-size', '14px');
  branchCountLabel.child(createSpan(' = ').style('color', '#999'));
  branchCountLabel.child(uiElements.branchCountValue);
  uiElements.branchCountSlider = createSlider(2, 20, params.branchCount, 1);
  uiElements.branchCountSlider.input(() => {
    params.branchCount = uiElements.branchCountSlider.value();
    uiElements.branchCountValue.html(params.branchCount.toFixed(0));
    generateLamp();
  });
  branchCountGroup.child(uiElements.branchCountSlider);
  container.child(branchCountGroup);
  
  // Branch length slider
  let branchLengthGroup = createDiv().addClass('control-group');
  let branchLengthLabel = createP('Branch Length Max (cm)').style('margin', '0').style('font-weight', 'bold');
  branchLengthGroup.child(branchLengthLabel);
  uiElements.branchLengthValue = createSpan(params.branchLength_cm.toFixed(0)).style('color', '#666').style('font-size', '14px');
  branchLengthLabel.child(createSpan(' = ').style('color', '#999'));
  branchLengthLabel.child(uiElements.branchLengthValue);
  uiElements.branchLengthSlider = createSlider(15, 100, params.branchLength_cm, 1);
  uiElements.branchLengthSlider.input(() => {
    params.branchLength_cm = uiElements.branchLengthSlider.value();
    uiElements.branchLengthValue.html(params.branchLength_cm.toFixed(0));
    generateLamp();
  });
  branchLengthGroup.child(uiElements.branchLengthSlider);
  container.child(branchLengthGroup);
  
  // Bulb diameter slider
  let bulbDiameterGroup = createDiv().addClass('control-group');
  let bulbDiameterLabel = createP('Bulb Diameter (cm)').style('margin', '0').style('font-weight', 'bold');
  bulbDiameterGroup.child(bulbDiameterLabel);
  uiElements.bulbDiameterValue = createSpan(params.bulbDiameter_cm.toFixed(1)).style('color', '#666').style('font-size', '14px');
  bulbDiameterLabel.child(createSpan(' = ').style('color', '#999'));
  bulbDiameterLabel.child(uiElements.bulbDiameterValue);
  uiElements.bulbDiameterSlider = createSlider(5, 50, params.bulbDiameter_cm, 0.5);
  uiElements.bulbDiameterSlider.input(() => {
    params.bulbDiameter_cm = uiElements.bulbDiameterSlider.value();
    uiElements.bulbDiameterValue.html(params.bulbDiameter_cm.toFixed(1));
    generateLamp();
  });
  bulbDiameterGroup.child(uiElements.bulbDiameterSlider);
  container.child(bulbDiameterGroup);
  
  // Buttons
  let buttonGroup = createDiv().addClass('control-group');
  uiElements.generateButton = createButton('Generate');
  uiElements.generateButton.mousePressed(() => {
    // Generate new random seed
    params.seed = floor(random(1, 1000000));
    generateLamp();
  });
  uiElements.saveButton = createButton('Save PNG');
  uiElements.saveButton.addClass('secondary');
  uiElements.saveButton.mousePressed(savePNG);
  buttonGroup.child(uiElements.generateButton);
  buttonGroup.child(uiElements.saveButton);
  container.child(buttonGroup);
}

function validateAndClampParams() {
  // Hard limits enforcement
  params.mainHeight_m = constrain(params.mainHeight_m, 0.7, 2.5);
  params.mainRadius_cm = constrain(params.mainRadius_cm, 1, 10);
  params.bulbDiameter_cm = constrain(params.bulbDiameter_cm, 5, 50); // Increased max to 50
  params.branchCount = constrain(params.branchCount, 2, 20);
  params.branchLength_cm = constrain(params.branchLength_cm, 15, 100);
  params.baseRadius_cm = constrain(params.baseRadius_cm, 10, 30);
  params.branchRadius_cm = constrain(params.branchRadius_cm, 0.7, 5);
  
  // Soft constraints
  if (params.branchCount >= 6 || params.bulbDiameter_cm >= 8) {
    let minBaseRadius = max(12, 0.12 * params.mainHeight_m * 100);
    params.baseRadius_cm = max(params.baseRadius_cm, minBaseRadius);
  }
  
  params.branchLength_cm = min(params.branchLength_cm, 0.6 * params.mainHeight_m * 100);
  
  // Ensure at least 2 bulbs
  params.branchCount = max(params.branchCount, 2);
}

function generateLamp() {
  validateAndClampParams();
  
  // Set up deterministic random
  randomSeed(params.seed);
  
  // Generate random branch lengths for each branch
  branchLengths = [];
  // Use params.branchLength_cm as the maximum length
  let maxBranchLength = params.branchLength_cm;
  let minBranchLength = max(15, maxBranchLength * 0.6); // Minimum is 60% of max, but at least 15cm
  for (let i = 0; i < params.branchCount; i++) {
    branchLengths.push(random(minBranchLength, maxBranchLength));
  }
  
  // Pre-calculate branch positions (heights and angles)
  branchPositions = [];
  let minSeparation = TWO_PI / params.branchCount * 0.3; // Minimum angular separation
  
  for (let i = 0; i < params.branchCount; i++) {
    let heightRatio = random(0.2, 0.8); // Random height between 20% and 80% of trunk
    
    // Calculate angle with separation
    let angle;
    if (i === 0) {
      angle = random(0, TWO_PI);
    } else {
      let attempts = 0;
      let tempAngle;
      do {
        tempAngle = random(0, TWO_PI);
        attempts++;
      } while (attempts < 50 && branchPositions.some(pos => 
        abs(tempAngle - pos.angle) < minSeparation && abs(heightRatio - pos.heightRatio) < 0.1
      ));
      angle = tempAngle;
    }
    
    branchPositions.push({heightRatio: heightRatio, angle: angle});
  }
  
  // Initialize bulb states (all on by default)
  bulbStates = [];
  bulbHitBoxes = [];
  for (let i = 0; i < params.branchCount; i++) {
    bulbStates.push(true); // All bulbs start on
    bulbHitBoxes.push({ x: 0, y: 0, radius: 0 }); // Will be updated during drawing
  }
  
  // Update UI values
  updateUIValues();
}

function updateUIValues() {
  if (uiElements.seedInput) uiElements.seedInput.value(params.seed);
  
  if (uiElements.heightSlider) uiElements.heightSlider.value(params.mainHeight_m);
  if (uiElements.heightValue) uiElements.heightValue.html(params.mainHeight_m.toFixed(1));
  
  if (uiElements.radiusSlider) uiElements.radiusSlider.value(params.mainRadius_cm);
  if (uiElements.radiusValue) uiElements.radiusValue.html(params.mainRadius_cm.toFixed(1));
  
  if (uiElements.baseRadiusSlider) uiElements.baseRadiusSlider.value(params.baseRadius_cm);
  if (uiElements.baseRadiusValue) uiElements.baseRadiusValue.html(params.baseRadius_cm.toFixed(0));
  
  if (uiElements.branchCountSlider) uiElements.branchCountSlider.value(params.branchCount);
  if (uiElements.branchCountValue) uiElements.branchCountValue.html(params.branchCount.toFixed(0));
  
  if (uiElements.branchLengthSlider) uiElements.branchLengthSlider.value(params.branchLength_cm);
  if (uiElements.branchLengthValue) uiElements.branchLengthValue.html(params.branchLength_cm.toFixed(0));
  
  if (uiElements.bulbDiameterSlider) uiElements.bulbDiameterSlider.value(params.bulbDiameter_cm);
  if (uiElements.bulbDiameterValue) uiElements.bulbDiameterValue.html(params.bulbDiameter_cm.toFixed(1));
}

function drawLamp() {
  push();
  
  // Fixed positions - base at bottom center of canvas
  let groundY = height - 80; // Ground line position
  let baseHeight = cmToPx(params.baseRadius_cm * 0.8); // Height of trapezoid base
  let baseBottomY = groundY; // Bottom of base at ground level
  let baseTopY = baseBottomY - baseHeight; // Top of base
  let trunkHeight = mToPx(params.mainHeight_m);
  let trunkTopY = baseTopY - trunkHeight;
  
  // Draw base (pass the bottom Y position)
  drawBase(lampCenterX, baseBottomY, baseHeight);
  
  // Draw main trunk (starts from top of base)
  drawTrunk(lampCenterX, baseTopY, trunkTopY);
  
  // Draw branches and bulbs
  drawBranches(lampCenterX, baseTopY, trunkTopY);
  
  // Draw main switch at the base bottom (ground level)
  drawMainSwitch(lampCenterX, baseBottomY);
  
  pop();
}

function drawBase(x, bottomY, baseHeight) {
  push();
  translate(x, bottomY);
  
  fill(80, 60, 40); // Brown color for base
  stroke(60, 40, 20);
  strokeWeight(2);
  
  // Draw trapezoid base
  let baseWidth = cmToPx(params.baseRadius_cm * 2);
  let baseTopWidth = baseWidth * 0.6; // Top is 60% of bottom width
  
  // Draw from bottom (0) to top (-baseHeight)
  beginShape();
  vertex(-baseTopWidth / 2, -baseHeight);
  vertex(baseTopWidth / 2, -baseHeight);
  vertex(baseWidth / 2, 0);
  vertex(-baseWidth / 2, 0);
  endShape(CLOSE);
  
  pop();
}

function drawTrunk(x, baseY, topY) {
  push();
  
  fill(120, 100, 80); // Wood color
  stroke(100, 80, 60);
  strokeWeight(1);
  
  // Draw trunk as rectangle (perfectly straight)
  rectMode(CENTER);
  let trunkWidth = cmToPx(params.mainRadius_cm * 2);
  let trunkHeight = baseY - topY;
  
  rect(x, (baseY + topY) / 2, trunkWidth, trunkHeight);
  
  pop();
}

function drawBranches(x, baseY, topY) {
  let trunkHeight = baseY - topY;
  
  // Use pre-calculated branch positions from generateLamp()
  for (let i = 0; i < branchPositions.length; i++) {
    let pos = branchPositions[i];
    let branchY = topY + trunkHeight * pos.heightRatio;
    drawBranch(x, branchY, pos.angle, i);
  }
}

function drawBranch(trunkX, branchY, angle, branchIndex) {
  push();
  
  // Use random branch length for this specific branch
  let branchLength = cmToPx(branchLengths[branchIndex]);
  let endX = trunkX + cos(angle) * branchLength;
  let endY = branchY + sin(angle) * branchLength;
  
  // Draw branch
  fill(100, 80, 60);
  stroke(80, 60, 40);
  strokeWeight(2);
  
  let branchRadius = cmToPx(params.branchRadius_cm);
  
  // Draw branch as thick line
  strokeWeight(branchRadius * 2);
  line(trunkX, branchY, endX, endY);
  
  // Draw bulb
  drawBulb(endX, endY, branchIndex);
  
  pop();
}

function drawBulb(x, y, bulbIndex) {
  push();
  
  let bulbRadius = cmToPx(params.bulbDiameter_cm / 2);
  
  // Update hit box for this bulb
  if (bulbIndex < bulbHitBoxes.length) {
    bulbHitBoxes[bulbIndex].x = x;
    bulbHitBoxes[bulbIndex].y = y;
    bulbHitBoxes[bulbIndex].radius = bulbRadius;
  }
  
  // Check if main switch is on AND this individual bulb is on
  let isBulbOn = lampIsOn && bulbStates[bulbIndex];
  
  if (isBulbOn) {
    // Bulb is on - bright yellow with glow
    // Draw glow effect first (behind the bulb)
    fill(255, 255, 200, 50);
    noStroke();
    circle(x, y, bulbRadius * 2.4); // Diameter = radius * 2.4
    
    // Draw main bulb
    fill(255, 255, 200);
    stroke(200, 200, 150);
    strokeWeight(1);
    circle(x, y, bulbRadius * 2); // Diameter = radius * 2
  } else {
    // Bulb is off - gray, no glow
    fill(100, 100, 100);
    stroke(70, 70, 70);
    strokeWeight(1);
    circle(x, y, bulbRadius * 2); // Diameter = radius * 2
  }
  
  pop();
}

function drawMainSwitch(x, baseBottomY) {
  push();
  
  // Position switch at the center of the base (on the ground)
  let switchSize = cmToPx(4);
  let switchX = x;
  let switchY = baseBottomY - switchSize / 2;
  
  // Update switch button hitbox for click detection
  switchButton.x = switchX - switchSize / 2;
  switchButton.y = switchY - switchSize / 2;
  switchButton.width = switchSize;
  switchButton.height = switchSize;
  
  // Draw switch button
  if (lampIsOn) {
    fill(60, 200, 60); // Green when on
    stroke(40, 150, 40);
  } else {
    fill(200, 60, 60); // Red when off
    stroke(150, 40, 40);
  }
  strokeWeight(2);
  
  // Draw switch as circle
  ellipseMode(CENTER);
  circle(switchX, switchY, switchSize);
  
  // Draw power symbol
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(switchSize * 0.6);
  text('⏻', switchX, switchY);
  
  pop();
}

function drawInfo() {
  push();
  fill(0);
  noStroke();
  textAlign(LEFT);
  textSize(12);
  
  let infoY = 20;
  text(`Seed: ${params.seed}`, 10, infoY);
  text(`Bulbs: ${params.branchCount}`, 10, infoY + 20);
  text(`Height: ${params.mainHeight_m}m`, 10, infoY + 40);
  
  // Warning if lamp is too tall
  let groundY = height - 80;
  let baseHeight = cmToPx(params.baseRadius_cm * 0.8);
  let baseTopY = groundY - baseHeight;
  let trunkTopY = baseTopY - mToPx(params.mainHeight_m);
  
  if (trunkTopY < 50) {
    fill(255, 0, 0);
    textSize(14);
    textAlign(CENTER);
    text('Lamp too tall for canvas!', width / 2, 30);
  }
  
  pop();
}

function mousePressed() {
  // Check if mouse clicked on the switch button first
  if (mouseX >= switchButton.x && 
      mouseX <= switchButton.x + switchButton.width &&
      mouseY >= switchButton.y && 
      mouseY <= switchButton.y + switchButton.height) {
    // Toggle main lamp power state
    lampIsOn = !lampIsOn;
    return; // Don't check bulbs if switch was clicked
  }
  
  // Check if mouse clicked on any bulb
  for (let i = 0; i < bulbHitBoxes.length; i++) {
    let bulb = bulbHitBoxes[i];
    let distance = dist(mouseX, mouseY, bulb.x, bulb.y);
    
    // Check if click is within the bulb's radius
    if (distance <= bulb.radius) {
      // Toggle this individual bulb's state
      bulbStates[i] = !bulbStates[i];
      return; // Only toggle one bulb per click
    }
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    // Regenerate with current seed
    generateLamp();
  } else if (key === 's' || key === 'S') {
    // Save PNG
    savePNG();
  }
}

function savePNG() {
  save('generative-floor-lamp.png');
  }