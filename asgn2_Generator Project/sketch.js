let params = {
  seed: 12345,
  baseRadius_cm: 18,
  mainHeight_m: 1.7,
  mainRadius_cm: 5,
  branchCount: 3,
  branchLength_cm: 35,
  branchRadius_cm: 2,
  bulbDiameter_cm: 10
};
let branchLengths = [];
let branchPositions = [];
let lampIsOn = true;
let bulbStates = [];
let bulbHitBoxes = [];
let switchButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

// Canvas and scaling
let canvasWidth = 800;
let canvasHeight = 800;
let scalePxPerMeter = 300;
let lampCenterX = canvasWidth / 2;

let uiElements = {};

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  createUI();
  
  generateLamp();
}

function draw() {
  background(240);
  
  stroke(100);
  strokeWeight(2);
  let groundY = height - 80;
  line(0, groundY, width, groundY);
  
  drawLamp();
  
  drawInfo();
}


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
  //limits
  params.mainHeight_m = constrain(params.mainHeight_m, 0.7, 2.5);
  params.mainRadius_cm = constrain(params.mainRadius_cm, 1, 10);
  params.bulbDiameter_cm = constrain(params.bulbDiameter_cm, 5, 50);
  params.branchCount = constrain(params.branchCount, 2, 20);
  params.branchLength_cm = constrain(params.branchLength_cm, 15, 100);
  params.baseRadius_cm = constrain(params.baseRadius_cm, 10, 30);
  params.branchRadius_cm = constrain(params.branchRadius_cm, 0.7, 5);
  
  //constraints
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
  
  randomSeed(params.seed);
  
  branchLengths = [];
  let maxBranchLength = params.branchLength_cm;
  let minBranchLength = max(15, maxBranchLength * 0.6);
  for (let i = 0; i < params.branchCount; i++) {
    branchLengths.push(random(minBranchLength, maxBranchLength));
  }
  
  branchPositions = [];
  let minSeparation = TWO_PI / params.branchCount * 0.3;
  
  for (let i = 0; i < params.branchCount; i++) {
    let heightRatio = random(0.2, 0.8);
    
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
  
  bulbStates = [];
  bulbHitBoxes = [];
  for (let i = 0; i < params.branchCount; i++) {
    bulbStates.push(true);
    bulbHitBoxes.push({ x: 0, y: 0, radius: 0 });
  }
  
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
  
  let groundY = height - 80;
  let baseHeight = cmToPx(params.baseRadius_cm * 0.8);
  let baseBottomY = groundY;
  let baseTopY = baseBottomY - baseHeight;
  let trunkHeight = mToPx(params.mainHeight_m);
  let trunkTopY = baseTopY - trunkHeight;
  
  drawBase(lampCenterX, baseBottomY, baseHeight);
  
  drawTrunk(lampCenterX, baseTopY, trunkTopY);
  
  drawBranches(lampCenterX, baseTopY, trunkTopY);
  
  drawMainSwitch(lampCenterX, baseBottomY);
  
  pop();
}

function drawBase(x, bottomY, baseHeight) {
  push();
  translate(x, bottomY);
  
  fill(80, 60, 40);
  stroke(60, 40, 20);
  strokeWeight(2);
  
  let baseWidth = cmToPx(params.baseRadius_cm * 2);
  let baseTopWidth = baseWidth * 0.6;
  
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
  
  fill(120, 100, 80);
  stroke(100, 80, 60);
  strokeWeight(1);
  
  rectMode(CENTER);
  let trunkWidth = cmToPx(params.mainRadius_cm * 2);
  let trunkHeight = baseY - topY;
  
  rect(x, (baseY + topY) / 2, trunkWidth, trunkHeight);
  
  pop();
}

function drawBranches(x, baseY, topY) {
  let trunkHeight = baseY - topY;
  
  for (let i = 0; i < branchPositions.length; i++) {
    let pos = branchPositions[i];
    let branchY = topY + trunkHeight * pos.heightRatio;
    drawBranch(x, branchY, pos.angle, i);
  }
}

function drawBranch(trunkX, branchY, angle, branchIndex) {
  push();
  
  let branchLength = cmToPx(branchLengths[branchIndex]);
  let endX = trunkX + cos(angle) * branchLength;
  let endY = branchY + sin(angle) * branchLength;
  
  fill(100, 80, 60);
  stroke(80, 60, 40);
  strokeWeight(2);
  
  let branchRadius = cmToPx(params.branchRadius_cm);
  
  strokeWeight(branchRadius * 2);
  line(trunkX, branchY, endX, endY);
  
  drawBulb(endX, endY, branchIndex);
  
  pop();
}

function drawBulb(x, y, bulbIndex) {
  push();
  
  let bulbRadius = cmToPx(params.bulbDiameter_cm / 2);
  
  if (bulbIndex < bulbHitBoxes.length) {
    bulbHitBoxes[bulbIndex].x = x;
    bulbHitBoxes[bulbIndex].y = y;
    bulbHitBoxes[bulbIndex].radius = bulbRadius;
  }
  
  let isBulbOn = lampIsOn && bulbStates[bulbIndex];
  
  if (isBulbOn) {
    fill(255, 255, 200, 50);
    noStroke();
    circle(x, y, bulbRadius * 2.4);
    
    fill(255, 255, 200);
    stroke(200, 200, 150);
    strokeWeight(1);
    circle(x, y, bulbRadius * 2);
  } else {
    fill(100, 100, 100);
    stroke(70, 70, 70);
    strokeWeight(1);
    circle(x, y, bulbRadius * 2);
  }
  
  pop();
}

function drawMainSwitch(x, baseBottomY) {
  push();
  
  let switchSize = cmToPx(4);
  let switchX = x;
  let switchY = baseBottomY - switchSize / 2;
  
  switchButton.x = switchX - switchSize / 2;
  switchButton.y = switchY - switchSize / 2;
  switchButton.width = switchSize;
  switchButton.height = switchSize;

  if (lampIsOn) {
    fill(60, 200, 60);
    stroke(40, 150, 40);
  } else {
    fill(200, 60, 60);
    stroke(150, 40, 40);
  }
  strokeWeight(2);
  
  ellipseMode(CENTER);
  circle(switchX, switchY, switchSize);
  
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
  if (mouseX >= switchButton.x && 
      mouseX <= switchButton.x + switchButton.width &&
      mouseY >= switchButton.y && 
      mouseY <= switchButton.y + switchButton.height) {
    lampIsOn = !lampIsOn;
    return;
  }
  
  for (let i = 0; i < bulbHitBoxes.length; i++) {
    let bulb = bulbHitBoxes[i];
    let distance = dist(mouseX, mouseY, bulb.x, bulb.y);
    
    if (distance <= bulb.radius) {
      bulbStates[i] = !bulbStates[i];
      return;
    }
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    generateLamp();
  } else if (key === 's' || key === 'S') {
    savePNG();
  }
}

function savePNG() {
  save('generative-floor-lamp.png');
  }