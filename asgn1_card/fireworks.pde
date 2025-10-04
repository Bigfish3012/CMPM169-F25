// from Daniel Shiffman :https://editor.p5js.org/michael.lueckl/sketches/Wy8A9Hm6q
class Firework {
  float H_color;
  Particle rocket;
  boolean exploded = false;
  ArrayList<Particle> particles = new ArrayList<Particle>();

  Firework(float sx, float sy) {
    H_color = random(360);
    rocket = new Particle(sx, sy, H_color, true);
  }

  boolean done() {
    return exploded && particles.isEmpty();
  }

  void update() {
    if (!exploded) {
      rocket.applyForce(gravity);
      rocket.update();
      if (rocket.vel.y >= 0) {
        exploded = true;
        explode();
      }
    }
    for (int i = particles.size()-1; i >= 0; i--) {
      Particle p = particles.get(i);
      p.applyForce(gravity);
      p.update();
      if (p.done()) particles.remove(i);
    }
  }

  void explode() {
    for (int i = 0; i < 100; i++) {
      Particle p = new Particle(rocket.pos.x, rocket.pos.y, H_color, false);
      particles.add(p);
    }
  }

  void show() {
    pushStyle();
    colorMode(HSB, 360, 100, 100, 255);
    if (!exploded) rocket.show();
    for (Particle p : particles) p.show();
    popStyle();
  }
}

class Particle {
  PVector pos, vel, acc;
  boolean isRocket;
  float lifespan = 255;
  float H_color;

  Particle(float x, float y, float H_color, boolean isRocket) {
    this.pos = new PVector(x, y);
    this.acc = new PVector(0, 0);
    this.isRocket = isRocket;
    this.H_color = H_color;
    if (isRocket) {
      this.vel = new PVector(0, random(-12, -8));
    } else {
      this.vel = PVector.random2D();
      this.vel.mult(random(5, 10));
    }
  }

  void applyForce(PVector f) { acc.add(f); }

  void update() {
    if (!isRocket) {
      vel.mult(0.9);
      lifespan -= 4;
    }
    vel.add(acc);
    pos.add(vel);
    acc.mult(0);
  }

  boolean done() { 
    return lifespan < 0; 
  }

  void show() {
    if (!isRocket) {
      strokeWeight(5);
      stroke(H_color, 100, 100, lifespan);
    } else {
      strokeWeight(7);
      stroke(H_color, 100, 100, 255);
    }
    point(pos.x, pos.y);
  }
}
