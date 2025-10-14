class Visualizer {
  constructor() {
    this.canvasWidth = 1400;
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  // Helper function to draw hover text and border on bars
  drawBarHover(labelText, x, y, width, height) {
    fill(255);
    textSize(13);
    textAlign(CENTER);
    text(labelText, x + width / 2, y + height / 2 + 5);
    
    noFill();
    stroke(0, 200);
    strokeWeight(2);
    rect(x, y, width, height);
    strokeWeight(1);
    noStroke();
  }
  
  drawTitle(dataSource) {
    textSize(24);
    textAlign(CENTER);
    fill(0);
    let title = dataSource === 'final_rankings' ? 'PUBG Tournament Final Rankings' :
                dataSource === 'team_stats' ? 'Team Kill Rankings' : 'Player Kill Rankings';
    text(title, this.canvasWidth / 2, 40);
    
    textSize(12);
    fill(100);
    text('Click buttons to switch data', this.canvasWidth / 2, 60);
  }
  
  drawLegend(dataSource) {
    let legendY = 135;
    let boxSize = 15;
    let spacing = 150;
    
    textSize(12);
    textAlign(LEFT);
    
    if (dataSource === 'final_rankings') {
      let legendX = this.canvasWidth - 650;
      
      // Total Points
      fill(color('#8FA31E'));
      rect(legendX, legendY, boxSize, boxSize);
      fill(0);
      text('Total Points', legendX + boxSize + 5, legendY + boxSize - 3);
      
      // Placement Points
      legendX += spacing;
      fill(color('#58A0C8'));
      rect(legendX, legendY, boxSize, boxSize);
      fill(0);
      text('Placement Points', legendX + boxSize + 5, legendY + boxSize - 3);
      
      // Kills
      legendX += spacing;
      fill(color('#E43636'));
      rect(legendX, legendY, boxSize, boxSize);
      fill(0);
      text('Kills', legendX + boxSize + 5, legendY + boxSize - 3);
      
      // WWCD
      legendX += spacing;
      fill(color('#EF7722'));
      rect(legendX, legendY, boxSize, boxSize);
      fill(0);
      text('WWCD', legendX + boxSize + 5, legendY + boxSize - 3);
    } else {
      // For stats views - 2 rows
      let legendX = this.canvasWidth - 550;
      let legendY1 = legendY;
      let legendY2 = legendY + 25;
      let spacing2 = 140;
      
      // Row 1
      // Kills(HS)
      fill(color('#E43636'));
      rect(legendX, legendY1, boxSize, boxSize);
      fill(0);
      text('Kills(HS)', legendX + boxSize + 5, legendY1 + boxSize - 3);
      
      // Damage
      legendX += spacing2;
      fill(color('#B1AB86'));
      rect(legendX, legendY1, boxSize, boxSize);
      fill(0);
      text('Damage', legendX + boxSize + 5, legendY1 + boxSize - 3);
      
      // Assists
      legendX += spacing2;
      fill(color('#7965C1'));
      rect(legendX, legendY1, boxSize, boxSize);
      fill(0);
      text('Assists', legendX + boxSize + 5, legendY1 + boxSize - 3);
      
      // AVG Damage
      legendX += spacing2;
      fill(color('#F79B72'));
      rect(legendX, legendY1, boxSize, boxSize);
      fill(0);
      text('AVG Damage', legendX + boxSize + 5, legendY1 + boxSize - 3);
      
      // Row 2
      legendX = this.canvasWidth - 550;
      
      // Longest Kill
      fill(color('#B5828C'));
      rect(legendX, legendY2, boxSize, boxSize);
      fill(0);
      text('Longest Kill', legendX + boxSize + 5, legendY2 + boxSize - 3);
      
      // Time Survived
      legendX += spacing2;
      fill(color('#F5C45E'));
      rect(legendX, legendY2, boxSize, boxSize);
      fill(0);
      text('Time Survived', legendX + boxSize + 5, legendY2 + boxSize - 3);
      
      // Distance Moved
      legendX += spacing2;
      fill(color('#006A71'));
      rect(legendX, legendY2, boxSize, boxSize);
      fill(0);
      text('Dist Moved', legendX + boxSize + 5, legendY2 + boxSize - 3);
    }
  }
  
  drawTeamRow(teamData, y, leftMargin, rankWidth, chartStartX, chartWidth, 
              dataSource, animationProgress, maxValue, maxKills, maxDamage, 
              maxAssists, maxAvgDmg, maxLongestKill, maxTimeSurvived, maxDisMoved) {
    let barHeight = 28;
    let barSpacing = 4;
    let numBars = dataSource === 'final_rankings' ? 4 : 7;
    let centerY = y + (numBars * barHeight + (numBars - 1) * barSpacing) / 2;
    
    // Draw rank
    textSize(24);
    textAlign(CENTER);
    fill(0);
    text(teamData.rank, leftMargin + rankWidth / 2, centerY);
    
    // Draw team name or player info
    textSize(20);
    textAlign(LEFT);
    fill(0);
    if (dataSource === 'player_stats') {
      text(teamData.player, leftMargin + rankWidth + 10, centerY - 8);
      textSize(10);
      fill(100);
      text(teamData.team, leftMargin + rankWidth + 10, centerY + 8);
    } else {
      text(teamData.team, leftMargin + rankWidth + 10, centerY);
    }
    
    // Draw bars based on data source
    if (dataSource === 'final_rankings') {
      this.drawFinalRankingBars(teamData, y, chartStartX, chartWidth, barHeight, barSpacing, animationProgress, maxValue);
    } else {
      this.drawStatsBars(teamData, y, chartStartX, chartWidth, 
                        barHeight, barSpacing, animationProgress, 
                        maxKills, maxDamage, maxAssists, maxAvgDmg, 
                        maxLongestKill, maxTimeSurvived, maxDisMoved);
    }
    
    // Draw separator line below this row
    stroke("#5C3E94");
    strokeWeight(3);
    let lineY = y + numBars * (barHeight + barSpacing) + 5;
    line(leftMargin, lineY, chartStartX + chartWidth + 50, lineY);
    noStroke();
  }
  
  drawFinalRankingBars(teamData, y, chartStartX, chartWidth, barHeight, barSpacing, animationProgress, maxValue) {
    let easedProgress = this.easeOutCubic(animationProgress);
    let scale = chartWidth / maxValue;
    let totalPointsWidth = teamData.totalPoints * scale * easedProgress;
    let placementPointsWidth = teamData.placementPoints * scale * easedProgress;
    let killsWidth = teamData.kills * scale * easedProgress;
    let wwcdScale = chartWidth / 5;
    let wwcdWidth = teamData.wwcd * wwcdScale * easedProgress;
    
    // Bar 1: Total Points
    let bar1Y = y;
    let bar1Hover = mouseY > bar1Y && mouseY < bar1Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + totalPointsWidth;
    
    fill(color('#8FA31E'));
    rect(chartStartX, bar1Y, totalPointsWidth, barHeight);
    
    if (bar1Hover) {
      this.drawBarHover('Total Points: ' + teamData.totalPoints, chartStartX, bar1Y, totalPointsWidth, barHeight);
    }
    
    // Bar 2: Placement Points
    let bar2Y = y + barHeight + barSpacing;
    let bar2Hover = mouseY > bar2Y && mouseY < bar2Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + placementPointsWidth;
    
    fill(color('#58A0C8'));
    rect(chartStartX, bar2Y, placementPointsWidth, barHeight);
    
    if (bar2Hover) {
      this.drawBarHover('Placement Points: ' + teamData.placementPoints, chartStartX, bar2Y, placementPointsWidth, barHeight);
    }
    
    // Bar 3: Kills
    let bar3Y = y + (barHeight + barSpacing) * 2;
    let bar3Hover = mouseY > bar3Y && mouseY < bar3Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + killsWidth;
    
    fill(color('#E43636'));
    rect(chartStartX, bar3Y, killsWidth, barHeight);
    
    if (bar3Hover) {
      this.drawBarHover('Kills: ' + teamData.kills, chartStartX, bar3Y, killsWidth, barHeight);
    }
    
    // Bar 4: WWCD
    let bar4Y = y + (barHeight + barSpacing) * 3;
    let bar4Hover = mouseY > bar4Y && mouseY < bar4Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + wwcdWidth;
    
    fill(color("#EF7722"));
    rect(chartStartX, bar4Y, wwcdWidth, barHeight);
    
    if (bar4Hover) {
      this.drawBarHover('WWCD: ' + teamData.wwcd, chartStartX, bar4Y, wwcdWidth, barHeight);
    }
  }
  
  drawStatsBars(teamData, y, chartStartX, chartWidth, barHeight, barSpacing, 
                animationProgress, maxKills, maxDamage, maxAssists, maxAvgDmg, 
                maxLongestKill, maxTimeSurvived, maxDisMoved) {
    let easedProgress = this.easeOutCubic(animationProgress);
    
    // Use independent scales for each metric
    let killsScale = chartWidth / maxKills;
    let dmgScale = chartWidth / maxDamage;
    let assistsScale = chartWidth / maxAssists;
    let avgDmgScale = chartWidth / maxAvgDmg;
    let longestKillScale = chartWidth / maxLongestKill;
    let timeSurvivedScale = chartWidth / maxTimeSurvived;
    let disMovedScale = chartWidth / maxDisMoved;
    
    let killsWidth = teamData.kills * killsScale * easedProgress;
    let dmgWidth = teamData.dmgDealt * dmgScale * easedProgress;
    let assistsWidth = teamData.assists * assistsScale * easedProgress;
    let avgDmgWidth = teamData.avgDmg * avgDmgScale * easedProgress;
    let longestKillWidth = teamData.longestKill * longestKillScale * easedProgress;
    let timeSurvivedWidth = teamData.timeSurvived * timeSurvivedScale * easedProgress;
    let disMovedWidth = teamData.disMoved * disMovedScale * easedProgress;
    
    // Bar 1: Kills(HS)
    let bar1Y = y;
    let bar1Hover = mouseY > bar1Y && mouseY < bar1Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + killsWidth;
    
    fill(color('#E43636'));
    rect(chartStartX, bar1Y, killsWidth, barHeight);
    
    if (bar1Hover) {
      this.drawBarHover('Kills(HS): ' + teamData.kills + '(' + teamData.headshots + ')', chartStartX, bar1Y, killsWidth, barHeight);
    }
    
    // Bar 2: Damage Dealt
    let bar2Y = y + barHeight + barSpacing;
    let bar2Hover = mouseY > bar2Y && mouseY < bar2Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + dmgWidth;
    
    fill(color('#B1AB86'));
    rect(chartStartX, bar2Y, dmgWidth, barHeight);
    
    if (bar2Hover) {
      this.drawBarHover('Damage: ' + teamData.dmgDealtStr, chartStartX, bar2Y, dmgWidth, barHeight);
    }
    
    // Bar 3: Assists
    let bar3Y = y + (barHeight + barSpacing) * 2;
    let bar3Hover = mouseY > bar3Y && mouseY < bar3Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + assistsWidth;
    
    fill(color('#7965C1'));
    rect(chartStartX, bar3Y, assistsWidth, barHeight);
    
    if (bar3Hover) {
      this.drawBarHover('Assists: ' + teamData.assists, chartStartX, bar3Y, assistsWidth, barHeight);
    }
    
    // Bar 4: AVG Damage
    let bar4Y = y + (barHeight + barSpacing) * 3;
    let bar4Hover = mouseY > bar4Y && mouseY < bar4Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + avgDmgWidth;
    
    fill(color('#F79B72'));
    rect(chartStartX, bar4Y, avgDmgWidth, barHeight);
    
    if (bar4Hover) {
      this.drawBarHover('AVG Damage: ' + teamData.avgDmgStr, chartStartX, bar4Y, avgDmgWidth, barHeight);
    }
    
    // Bar 5: Longest Kill
    let bar5Y = y + (barHeight + barSpacing) * 4;
    let bar5Hover = mouseY > bar5Y && mouseY < bar5Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + longestKillWidth;
    
    fill(color('#B5828C'));
    rect(chartStartX, bar5Y, longestKillWidth, barHeight);
    
    if (bar5Hover) {
      this.drawBarHover('Longest Kill: ' + teamData.longestKillStr, chartStartX, bar5Y, longestKillWidth, barHeight);
    }
    
    // Bar 6: Time Survived
    let bar6Y = y + (barHeight + barSpacing) * 5;
    let bar6Hover = mouseY > bar6Y && mouseY < bar6Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + timeSurvivedWidth;
    
    fill(color('#F5C45E'));
    rect(chartStartX, bar6Y, timeSurvivedWidth, barHeight);
    
    if (bar6Hover) {
      this.drawBarHover('Time Survived: ' + teamData.timeSurvivedStr, chartStartX, bar6Y, timeSurvivedWidth, barHeight);
    }
    
    // Bar 7: Distance Moved
    let bar7Y = y + (barHeight + barSpacing) * 6;
    let bar7Hover = mouseY > bar7Y && mouseY < bar7Y + barHeight && mouseX > chartStartX && mouseX < chartStartX + disMovedWidth;
    
    fill(color('#006A71'));
    rect(chartStartX, bar7Y, disMovedWidth, barHeight);
    
    if (bar7Hover) {
      this.drawBarHover('Dist Moved: ' + teamData.disMovedStr, chartStartX, bar7Y, disMovedWidth, barHeight);
    }
  }
}

