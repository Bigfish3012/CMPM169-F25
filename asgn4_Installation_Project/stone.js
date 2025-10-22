// here is the stone class
class Stone {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(150, 200);
    this.rotation = random(TWO_PI);
    //stone colors
    let colorType = random();
    if (colorType < 0.4) {
      this.color = color(random(100, 140), random(100, 140), random(100, 140));
    } else if (colorType < 0.7) {
      this.color = color(random(120, 160), random(100, 130), random(80, 110));
    } else {
      this.color = color(random(100, 130), random(120, 150), random(90, 120));
    }
    this.vertices = [];
    this.createShape();
    
    this.textureSpots = [];
    for (let i = 0; i < 3; i++) {
      this.textureSpots.push({
        x: random(-this.size * 0.3, this.size * 0.3),
        y: random(-this.size * 0.3, this.size * 0.3),
        size: random(this.size * 0.1, this.size * 0.2)
      });
    }
  }
  
  // Create irregular stone shape
  createShape() {
    let numVertices = int(random(6, 10));
    for (let i = 0; i < numVertices; i++) {
      let angle = map(i, 0, numVertices, 0, TWO_PI);
      let radius = this.size * random(0.4, 0.6);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      this.vertices.push(createVector(x, y));
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    // Draw stone shadow for depth
    fill(0, 0, 0, 40);
    noStroke();
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x + 3, v.y + 3);
    }
    endShape(CLOSE);
    
    // Draw main stone body
    fill(this.color);
    stroke(0, 50);
    strokeWeight(1.5);
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
    
    noStroke();
    fill(0, 0, 0, 30);
    for (let spot of this.textureSpots) {
      ellipse(spot.x, spot.y, spot.size);
    }
    
    fill(255, 255, 255, 40);
    let highlightX = -this.size * 0.2;
    let highlightY = -this.size * 0.2;
    ellipse(highlightX, highlightY, this.size * 0.3, this.size * 0.2);
    
    pop();
  }
}
