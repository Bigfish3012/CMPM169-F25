// here is the fish class
//source: https://editor.p5js.org/alecardena/sketches/e-g9BJnsm

class Fish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.size = random(30, 60);
    this.tailAngle = 0;
    this.tailSpeed = random(0.1, 0.2);
    this.color = color(random(200, 255), random(100, 150), random(0, 50), 180);
    this.wanderTheta = random(TWO_PI);
  }
  
  // Random wandering behavior
  wander() {
    let wanderR = 25;
    let wanderD = 80;
    let change = 0.3;
    
    this.wanderTheta += random(-change, change);
    
    let circlePos = this.vel.copy();
    circlePos.normalize();
    circlePos.mult(wanderD);
    circlePos.add(this.pos);
    
    let circleOffset = createVector(wanderR * cos(this.wanderTheta), wanderR * sin(this.wanderTheta));
    let target = p5.Vector.add(circlePos, circleOffset);
    
    let steer = p5.Vector.sub(target, this.pos);
    steer.setMag(0.05);
    this.vel.add(steer);
    this.vel.limit(2);
  }
  
  // Update fish position and tail animation
  update() {
    this.wander();
    this.pos.add(this.vel);
    
    // Wrap around edges - fish can swim freely and reappear on the other side
    if (this.pos.x < -this.size) this.pos.x = width + this.size;
    if (this.pos.x > width + this.size) this.pos.x = -this.size;
    if (this.pos.y < -this.size) this.pos.y = height + this.size;
    if (this.pos.y > height + this.size) this.pos.y = -this.size;
    
    // Update tail animation
    this.tailAngle += this.tailSpeed;
  }
  
  // Draw the fish
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Rotate fish to face movement direction
    let angle = this.vel.heading();
    rotate(angle);
    
    // Draw fish body
    fill(this.color);
    stroke(0);
    strokeWeight(2);
    ellipse(0, 0, this.size, this.size * 0.6);
    
    // Draw fish eye
    fill(255);
    circle(this.size * 0.25, -this.size * 0.1, this.size * 0.15);
    fill(0);
    circle(this.size * 0.28, -this.size * 0.1, this.size * 0.08);
    
    // Draw animated tail
    let tailWave = sin(this.tailAngle) * 0.3;
    fill(this.color);
    
    // Tail fin
    beginShape();
    vertex(-this.size * 0.5, 0);
    vertex(-this.size * 0.8, -this.size * 0.3 + tailWave * this.size);
    vertex(-this.size * 0.9, 0 + tailWave * this.size);
    vertex(-this.size * 0.8, this.size * 0.3 + tailWave * this.size);
    vertex(-this.size * 0.5, 0);
    endShape(CLOSE);
    
    // Dorsal fin
    beginShape();
    vertex(-this.size * 0.2, -this.size * 0.3);
    vertex(-this.size * 0.1, -this.size * 0.5);
    vertex(0, -this.size * 0.3);
    endShape(CLOSE);
    
    pop();
  }
}
