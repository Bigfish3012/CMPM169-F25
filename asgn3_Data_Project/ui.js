class UIManager {
  constructor() {
    this.buttons = [];
    this.createButtons();
  }
  
  createButtons() {
    let buttonY = 80;
    let buttonWidth = 220;
    let buttonHeight = 35;
    let spacing = 20;
    let canvasWidth = 1400;
    let totalWidth = 3 * buttonWidth + 2 * spacing;
    let startX = (canvasWidth - totalWidth) / 2; // Center the buttons
    
    this.buttons = [
      {
        x: startX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        label: 'Final Rankings',
        dataSource: 'final_rankings'
      },
      {
        x: startX + buttonWidth + spacing,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        label: 'Team Kill Rankings',
        dataSource: 'team_stats'
      },
      {
        x: startX + (buttonWidth + spacing) * 2,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        label: 'Player Kill Rankings',
        dataSource: 'player_stats'
      }
    ];
  }
  
  drawButtons(currentDataSource) {
    for (let btn of this.buttons) {
      let isActive = btn.dataSource === currentDataSource;
      let isHover = mouseX > btn.x && mouseX < btn.x + btn.width && 
                    mouseY > btn.y && mouseY < btn.y + btn.height;
      
      // Button background
      if (isActive) {
        fill(80, 120, 200);
      } else if (isHover) {
        fill(120, 160, 230);
      } else {
        fill(200);
      }
      stroke(100);
      strokeWeight(2);
      rect(btn.x, btn.y, btn.width, btn.height, 5);
      
      // Button text
      fill(isActive ? 255 : 0);
      noStroke();
      textSize(14);
      textAlign(CENTER, CENTER);
      text(btn.label, btn.x + btn.width / 2, btn.y + btn.height / 2);
    }
  }
  
  checkButtonClick(mx, my) {
    for (let btn of this.buttons) {
      if (mx > btn.x && mx < btn.x + btn.width && 
          my > btn.y && my < btn.y + btn.height) {
        return btn.dataSource;
      }
    }
    return null;
  }
}

