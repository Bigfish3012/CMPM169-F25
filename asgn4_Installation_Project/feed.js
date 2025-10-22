// here is the feed class
class FishFeed {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-3, 3), random(-3, 3));
    this.size = random(3, 6);
    this.eaten = false;
    this.sinkSpeed = random(0.1, 0.3);
    this.wobble = random(TWO_PI);
    this.wobbleSpeed = random(0.05, 0.1);
  }
  
  // Update fish feed position
  update() {
    this.wobble += this.wobbleSpeed;
    this.pos.x += sin(this.wobble) * 0.5;
    this.pos.y += this.sinkSpeed;
    
    this.vel.mult(0.95);
    this.pos.add(this.vel);
  }
  
  // Draw the fish feed
  display() {
    if (!this.eaten) {
      fill("#8AA624");
      noStroke();
      circle(this.pos.x, this.pos.y, this.size);
      
      // Add a small highlight
      fill("#4DFFBE");
      circle(this.pos.x - this.size * 0.2, this.pos.y - this.size * 0.2, this.size * 0.4);
    }
  }
  
  // Check if fish feed is off screen or eaten
  isDead() {
    return this.eaten || this.pos.y > height + 10;
  }
}