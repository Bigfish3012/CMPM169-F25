let dataLoader;
let visualizer;
let uiManager;

let animationProgress = 0;
let animationSpeed = 0.02;
let animationComplete = false;

function preload() {
  dataLoader = new DataLoader();
  dataLoader.loadDataSource('final_rankings');
}

function setup() {
  createCanvas(1400, 2250);
  textFont('Arial');
  frameRate(60);
  
  visualizer = new Visualizer();
  uiManager = new UIManager();
  
  updateCanvasSize();
}

function updateCanvasSize() {
  let startY = 205;
  let rowHeight = dataLoader.currentDataSource === 'final_rankings' ? 135 : 240;
  let requiredHeight = startY + (dataLoader.teamsData.length * rowHeight) + 100;
  
  requiredHeight = max(requiredHeight, 1000);
  
  if (height !== requiredHeight) {
    resizeCanvas(1400, requiredHeight);
  }
}

function draw() {
  background(250);
  
  if (!animationComplete && dataLoader.teamsData.length > 0) {
    animationProgress += animationSpeed;
    if (animationProgress >= 1) {
      animationProgress = 1;
      animationComplete = true;
    }
  }
  
  // Check if data is loaded
  if (dataLoader.errorMessage !== '') {
    textSize(20);
    textAlign(CENTER);
    fill(255, 0, 0);
    text(dataLoader.errorMessage, width / 2, height / 2);
    text('error: data not loaded', width / 2, height / 2 + 30);
    return;
  }
  
  if (dataLoader.teamsData.length === 0) {
    textSize(20);
    textAlign(CENTER);
    fill(100);
    text('Loading data...', width / 2, height / 2);
    return;
  }
  
  // Draw UI components
  visualizer.drawTitle(dataLoader.currentDataSource);
  uiManager.drawButtons(dataLoader.currentDataSource);
  visualizer.drawLegend(dataLoader.currentDataSource);
  
  // Draw data visualization
  let startY = 205;
  let rowHeight = dataLoader.currentDataSource === 'final_rankings' ? 135 : 240;
  let leftMargin = 50;
  let rankWidth = 40;
  let teamNameWidth = 200;
  let chartStartX = leftMargin + rankWidth + teamNameWidth + 20;
  let chartWidth = width - chartStartX - 150;
  
  for (let i = 0; i < dataLoader.teamsData.length; i++) {
    let y = startY + i * rowHeight;
    visualizer.drawTeamRow(
      dataLoader.teamsData[i], 
      y, 
      leftMargin, 
      rankWidth, 
      chartStartX, 
      chartWidth,
      dataLoader.currentDataSource,
      animationProgress,
      dataLoader.maxValue,
      dataLoader.maxKills,
      dataLoader.maxDamage,
      dataLoader.maxAssists,
      dataLoader.maxAvgDmg,
      dataLoader.maxLongestKill,
      dataLoader.maxTimeSurvived,
      dataLoader.maxDisMoved
    );
  }
  
  // Draw column headers
  textSize(14);
  textAlign(LEFT);
  fill(0);
  text('Rank', leftMargin, startY - 10);
  
  if (dataLoader.currentDataSource === 'player_stats') {
    text('Player / Team', leftMargin + rankWidth + 10, startY - 10);
  } else {
    text('Team Name', leftMargin + rankWidth + 10, startY - 10);
  }
  
  let headerText = dataLoader.currentDataSource === 'final_rankings' ? 'Points Breakdown' : 'Statistics';
  text(headerText, chartStartX, startY - 10);
}

function mousePressed() {
  // Check if clicking on a button
  let clickedSource = uiManager.checkButtonClick(mouseX, mouseY);
  if (clickedSource && clickedSource !== dataLoader.currentDataSource) {
    animationProgress = 0;
    animationComplete = false;
    
    dataLoader.loadDataSource(clickedSource, () => {
      // Update canvas size when new data loads
      updateCanvasSize();
    });
  }
}
