// here is the fish class
class Fish {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
    this.size = random(40, 60);
    this.tailAngle = 0;
    this.tailSpeed = random(0.05, 0.1);
    this.finAngle = 0;
    this.finSpeed = random(0.08, 0.1);
    this.color = color(random(200, 255), random(100, 150), random(0, 50));
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
    steer.setMag(0.02);
    this.vel.add(steer);
    this.vel.limit(1);
  }
  
  // Flee from nearby noises
  fleeFromNoise(noises) {
    for (let noise of noises) {
      let d = p5.Vector.dist(this.pos, noise.pos);
      
      if (d < noise.scareRadius) {
        let flee = p5.Vector.sub(this.pos, noise.pos);
        flee.setMag(2);
        let steer = p5.Vector.sub(flee, this.vel);
        steer.limit(0.3);
        this.vel.add(steer);
        this.vel.limit(2);
        return true;
      }
    }
    return false;
  }
  
  // Find and move towards nearest food
  seekFood(fishFeeds) {
    let closestFood = null;
    let closestDist = 400;
    
    for (let food of fishFeeds) {
      if (!food.eaten) {
        let d = p5.Vector.dist(this.pos, food.pos);
        if (d < closestDist) {
          closestDist = d;
          closestFood = food;
        }
      }
    }
    
    if (closestFood) {
      // Steer towards food
      let desired = p5.Vector.sub(closestFood.pos, this.pos);
      desired.setMag(1.5);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(0.1);
      this.vel.add(steer);
      
      // Eat food if close enough
      if (closestDist < this.size * 0.5) {
        closestFood.eaten = true;
      }
      
      return true;
    }
    return false;
  }
  
  // Update fish position and animations
  update(fishFeeds, noises) {
    let isScared = this.fleeFromNoise(noises);
    
    if (!isScared) {
      let foundFood = this.seekFood(fishFeeds);
      if (!foundFood) {
        this.wander();
      }
    }
    
    this.pos.add(this.vel);
    
    // Wrap around edges
    if (this.pos.x < -this.size) this.pos.x = width + this.size;
    if (this.pos.x > width + this.size) this.pos.x = -this.size;
    if (this.pos.y < -this.size) this.pos.y = height + this.size;
    if (this.pos.y > height + this.size) this.pos.y = -this.size;
    
    // Update tail and fin animations
    this.tailAngle += this.tailSpeed;
    this.finAngle += this.finSpeed;
  }
  
  // Draw the fish
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Rotate fish to face movement direction
    let angle = this.vel.heading();
    rotate(angle);
    
    fill(this.color);
    stroke(0);
    strokeWeight(2);
    
    // Draw fish body
    beginShape();
    vertex(this.size * 0.5, 0);
    bezierVertex(this.size * 0.5, -this.size * 0.25, 
                 this.size * 0.2, -this.size * 0.3, 
                 0, -this.size * 0.3);
    vertex(-this.size * 0.5, -this.size * 0.2);
    vertex(-this.size * 0.7, -this.size * 0.1);
    vertex(-this.size * 0.7, 0);
    vertex(-this.size * 0.7, this.size * 0.1);
    vertex(-this.size * 0.5, this.size * 0.2);
    vertex(0, this.size * 0.3);
    bezierVertex(this.size * 0.2, this.size * 0.3, 
                 this.size * 0.5, this.size * 0.25, 
                 this.size * 0.5, 0);
    endShape(CLOSE);
    
    // Draw two eyes
    fill(0);
    ellipse(this.size * 0.25, -this.size * 0.22, this.size * 0.15, this.size * 0.1);
    ellipse(this.size * 0.25, this.size * 0.22, this.size * 0.15, this.size * 0.1);
    
    // Draw dorsal fin
    fill(this.color);
    let dorsalSwing = sin(this.finAngle) * 0.5;
    
    let dorsalStart = createVector(this.size * 0.15, 0);
    let dorsalEnd = createVector(-this.size * 0.5, 0);
    let dorsalMidX = (dorsalStart.x + dorsalEnd.x) / 2;
    let dorsalMidY = dorsalSwing * this.size * 0.25;
    
    beginShape();
    vertex(dorsalStart.x, dorsalStart.y);
    vertex(dorsalMidX, dorsalMidY);
    vertex(dorsalEnd.x, dorsalEnd.y);
    endShape();
    
    // Draw pectoral fins
    fill(this.color);
    let finSwing = sin(this.finAngle) * 0.15;
    
    // Left fin
    push();
    translate(0, -this.size * 0.3);
    rotate(-finSwing);
    beginShape();
    vertex(0, 0);
    vertex(-this.size * 0.2, -this.size * 0.2);
    vertex(-this.size * 0.35, -this.size * 0.05);
    endShape(CLOSE);
    pop();
    
    // Right fin
    push();
    translate(0, this.size * 0.3);
    rotate(finSwing);
    beginShape();
    vertex(0, 0);
    vertex(-this.size * 0.2, this.size * 0.2);
    vertex(-this.size * 0.35, this.size * 0.05);
    endShape(CLOSE);
    pop();
    
    // Draw animated tail
    let tailSwing = sin(this.tailAngle) * 0.4;
    fill(this.color);
    
    push();
    translate(-this.size * 0.7, 0);
    rotate(tailSwing);
    
    // Tail fin
    beginShape();
    vertex(0, 0);
    vertex(-this.size * 0.3, -this.size * 0.3);
    vertex(-this.size * 0.2, 0);
    vertex(-this.size * 0.3, this.size * 0.3);
    vertex(0, 0);
    endShape(CLOSE);
    
    pop();
    
    pop();
  }
}
