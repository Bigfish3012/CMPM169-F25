// here is the noise class
class Noise {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 0;
    this.maxRadius = 150;
    this.alpha = 255;
    this.speed = 2;
    this.scareRadius = 200;
  }
  
  // Update noise ripple
  update() {
    this.radius += this.speed;
    this.alpha = map(this.radius, 0, this.maxRadius, 255, 0);
  }
  
  // Display red ripple
  display() {
    noFill();
    stroke(255, 0, 0, this.alpha);
    strokeWeight(4);
    circle(this.pos.x, this.pos.y, this.radius * 2);
    
    stroke(255, 100, 100, this.alpha * 0.6);
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.radius * 2 * 0.7);
  }
  
  isDead() {
    return this.radius >= this.maxRadius;
  }
}