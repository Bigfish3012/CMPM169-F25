class MetricButtonManager {
  constructor(canvasWidth) {
    this.canvasWidth = canvasWidth;
    this.metricButtons = []; // Store metric button positions for click detection
  }
  
  // Draw metric filter buttons as legend
  drawMetricButtons(dataSource) {
    let legendY = 135;
    
    textSize(12);
    textAlign(LEFT);
    
    // Clear previous buttons
    this.metricButtons = [];
    
    if (dataSource === 'final_rankings') {
      this.drawFinalRankingsButtons(legendY);
    } else {
      this.drawStatsButtons(legendY);
    }
  }
  
  // Draw buttons for final rankings view
  drawFinalRankingsButtons(legendY) {
    let buttonWidth = 140;
    let buttonHeight = 22;
    let spacing = 150;
    let startX = this.canvasWidth - 650;
    
    // Define all metrics with their properties
    let metrics = [
      { x: startX, y: legendY, color: '#8FA31E', label: 'Total Points', metric: 'totalPoints' },
      { x: startX + spacing, y: legendY, color: '#58A0C8', label: 'Placement Points', metric: 'placementPoints' },
      { x: startX + spacing * 2, y: legendY, color: '#E43636', label: 'Kills', metric: 'kills' },
      { x: startX + spacing * 3, y: legendY, color: '#EF7722', label: 'WWCD', metric: 'wwcd' }
    ];
    
    for (let m of metrics) {
      this.drawButton(m, buttonWidth, buttonHeight);
    }
    
    let showAllX = startX + spacing * 1.5;
    let showAllY = legendY + 30;
    this.drawShowAllButton(showAllX, showAllY, buttonWidth, buttonHeight);
  }
  
  // Draw buttons for stats views (team/player)
  drawStatsButtons(legendY) {
    let legendY1 = legendY;
    let legendY2 = legendY + 30;
    let buttonWidth = 125;
    let buttonHeight = 22;
    let spacing2 = 135;
    let startX = this.canvasWidth - 555;
    
    // Define all metrics with their properties
    let metrics = [
      // Row 1
      { x: startX, y: legendY1, color: '#E43636', label: 'Kills(HS)', metric: 'kills' },
      { x: startX + spacing2, y: legendY1, color: '#B1AB86', label: 'Damage', metric: 'dmgDealt' },
      { x: startX + spacing2 * 2, y: legendY1, color: '#7965C1', label: 'Assists', metric: 'assists' },
      { x: startX + spacing2 * 3, y: legendY1, color: '#F79B72', label: 'AVG Damage', metric: 'avgDmg' },
      // Row 2
      { x: startX, y: legendY2, color: '#B5828C', label: 'Longest Kill', metric: 'longestKill' },
      { x: startX + spacing2, y: legendY2, color: '#F5C45E', label: 'Time Survived', metric: 'timeSurvived' },
      { x: startX + spacing2 * 2, y: legendY2, color: '#006A71', label: 'Dist Moved', metric: 'disMoved' }
    ];
    
    for (let m of metrics) {
      this.drawButton(m, buttonWidth, buttonHeight);
    }
    
    let showAllX = startX + spacing2 * 3;
    let showAllY = legendY2;
    this.drawShowAllButton(showAllX, showAllY, buttonWidth, buttonHeight);
  }
  
  drawButton(metricConfig, buttonWidth, buttonHeight) {
    let isSelected = (selectedMetric === metricConfig.metric);
    let isHover = mouseX > metricConfig.x && mouseX < metricConfig.x + buttonWidth && 
                  mouseY > metricConfig.y && mouseY < metricConfig.y + buttonHeight;
    
    if (isSelected) {
      fill(color(metricConfig.color));
      stroke(0);
      strokeWeight(3);
    } else if (isHover) {
      fill(220);
      stroke(color(metricConfig.color));
      strokeWeight(2);
    } else {
      fill(240);
      stroke(150);
      strokeWeight(1);
    }
    rect(metricConfig.x, metricConfig.y, buttonWidth, buttonHeight, 3);
    
    // Draw color indicator box
    noStroke();
    fill(color(metricConfig.color));
    let indicatorSize = 12;
    rect(metricConfig.x + 5, metricConfig.y + (buttonHeight - indicatorSize) / 2, indicatorSize, indicatorSize);
    
    // Draw button text
    fill(isSelected ? 255 : 0);
    textSize(11);
    textAlign(LEFT, CENTER);
    text(metricConfig.label, metricConfig.x + 5 + indicatorSize + 5, metricConfig.y + buttonHeight / 2);
    
    // Store button info for click detection
    this.metricButtons.push({
      x: metricConfig.x,
      y: metricConfig.y,
      width: buttonWidth,
      height: buttonHeight,
      metric: metricConfig.metric
    });
  }
  
  drawShowAllButton(x, y, buttonWidth, buttonHeight) {
    let isAllSelected = (selectedMetric === 'all');
    let isAllHover = mouseX > x && mouseX < x + buttonWidth && 
                     mouseY > y && mouseY < y + buttonHeight;
    
    if (isAllSelected) {
      fill(100, 150, 200);
      stroke(0);
      strokeWeight(3);
    } else if (isAllHover) {
      fill(220);
      stroke(100, 150, 200);
      strokeWeight(2);
    } else {
      fill(240);
      stroke(150);
      strokeWeight(1);
    }
    rect(x, y, buttonWidth, buttonHeight, 3);
    
    fill(isAllSelected ? 255 : 0);
    textSize(11);
    textAlign(CENTER, CENTER);
    noStroke();
    text('Show All', x + buttonWidth / 2, y + buttonHeight / 2);
    
    this.metricButtons.push({
      x: x,
      y: y,
      width: buttonWidth,
      height: buttonHeight,
      metric: 'all'
    });
  }
  
  // Check if a metric button was clicked
  checkButtonClick(mx, my) {
    for (let btn of this.metricButtons) {
      if (mx > btn.x && mx < btn.x + btn.width && 
          my > btn.y && my < btn.y + btn.height) {
        return btn.metric;
      }
    }
    return null;
  }
}

