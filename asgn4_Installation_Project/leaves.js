// here is the leaves class

// Ripple effect when leaf touches water
class Ripple {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 0;
    this.maxRadius = random(60, 100);
    this.alpha = 255;
    this.speed = random(1.5, 2.5);
  }
  
  update() {
    this.radius += this.speed;
    this.alpha = map(this.radius, 0, this.maxRadius, 255, 0);
  }
  
  display() {
    noFill();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
  
  isDead() {
    return this.radius >= this.maxRadius;
  }
}

// Leaf falling and floating on water
class Leaf {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.3, 0.3), random(0.5, 1));
    this.size = random(50, 80);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
    this.swayAngle = random(TWO_PI);
    this.swaySpeed = random(0.02, 0.04);
    this.onWater = false;
    this.waterY = random(height * 0.2, height * 0.95); // Where it will settle
    this.color = color(random(150, 200), random(100, 150), random(50, 100));
    this.hasCreatedRipple = false;
  }
  
  update() {
    if (!this.onWater) {
      // Falling through air
      this.swayAngle += this.swaySpeed;
      this.pos.x += sin(this.swayAngle) * 0.5;
      this.pos.y += this.vel.y;
      this.rotation += this.rotationSpeed;
      
      // Check if leaf reached water surface
      if (this.pos.y >= this.waterY) {
        this.onWater = true;
        this.pos.y = this.waterY;
        this.vel.y = 0;
        return true; // Signal to create ripple
      }
    } else {
      // Floating on water surface
      this.swayAngle += this.swaySpeed * 0.5;
      this.pos.x += sin(this.swayAngle) * 0.3;
      this.pos.y = this.waterY + sin(this.swayAngle * 2) * 2;
      this.rotation += this.rotationSpeed * 0.3;
      
      // Slowly drift
      this.pos.x += random(-0.2, 0.2);
    }
    
    return false;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    fill(this.color);
    stroke(0, 100);
    strokeWeight(1);
    
    // Draw leaf shape from https://editor.p5js.org/maryamalmatrooshi/sketches/8tY74Enmr
    beginShape();
    vertex(0, -this.size / 2);
    bezierVertex(this.size / 4, -this.size / 4, this.size / 2, this.size / 4, 0, this.size / 2);
    bezierVertex(-this.size / 2, this.size / 4, -this.size / 4, -this.size / 4, 0, -this.size / 2);
    endShape(CLOSE);
    
    // Draw leaf vein
    stroke(0, 50);
    strokeWeight(1);
    line(0, -this.size * 0.5, 0, this.size * 0.5);
    
    pop();
  }
  
  isDead() {
    // Remove leaves that drift too far off screen
    return this.pos.x < -this.size * 2 || this.pos.x > width + this.size * 2;
  }
}

