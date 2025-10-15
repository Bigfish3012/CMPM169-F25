let dataLoader;
let visualizer;
let uiManager;
let metricButtonManager;

let animationProgress = 0;
let animationSpeed = 0.02;
let animationComplete = false;

// Track selected metric for sorting and filtering
let selectedMetric = 'all'; // 'all', 'kills', 'dmgDealt', 'assists', 'avgDmg', 'longestKill', 'timeSurvived', 'disMoved'

function preload() {
  dataLoader = new DataLoader();
  dataLoader.loadDataSource('final_rankings');
}

function setup() {
  createCanvas(1400, 1600);
  textFont('Arial');
  frameRate(60);
  
  visualizer = new Visualizer();
  uiManager = new UIManager();
  metricButtonManager = new MetricButtonManager(1400);
  
  updateCanvasSize();
}

function updateCanvasSize() {
  let startY = 205;
  let rowHeight;
  
  if (dataLoader.currentDataSource === 'final_rankings') {
    // Adjust row height based on selected metric
    rowHeight = (selectedMetric === 'all') ? 135 : 50;
  } else {
    rowHeight = (selectedMetric === 'all') ? 240 : 50;
  }
  
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
  
  // Check if data is not loaded
  if (dataLoader.errorMessage !== '') {
    textSize(20);
    textAlign(CENTER);
    fill(255, 0, 0);
    text(dataLoader.errorMessage, width / 2, height / 2);
    text('error: data not loaded', width / 2, height / 2 + 30);
    return;
  }
  
  // Draw UI components
  visualizer.drawTitle(dataLoader.currentDataSource);
  uiManager.drawButtons(dataLoader.currentDataSource);
  metricButtonManager.drawMetricButtons(dataLoader.currentDataSource);
  
  // Draw data visualization
  let startY = 205;
  let rowHeight;
  
  if (dataLoader.currentDataSource === 'final_rankings') {
    // Adjust row height based on selected metric
    rowHeight = (selectedMetric === 'all') ? 135 : 50;
  } else {
    rowHeight = (selectedMetric === 'all') ? 240 : 50;
  }
  
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
    selectedMetric = 'all'; // Reset metric when switching data source
    
    dataLoader.loadDataSource(clickedSource, () => {
      // Update canvas size when new data loads
      updateCanvasSize();
    });
    return;
  }
  
  // Check if clicking on a metric button
  let clickedMetric = metricButtonManager.checkButtonClick(mouseX, mouseY);
  if (clickedMetric) {
    selectedMetric = clickedMetric;
    animationProgress = 0;
    animationComplete = false;
    
    // Re-sort data based on selected metric
    dataLoader.sortByMetric(selectedMetric);
    updateCanvasSize();
  }
}
