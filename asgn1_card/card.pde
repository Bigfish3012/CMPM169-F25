String message_1 = "Congraulations!";
String message_2 = "You are still alive!!!";
String message_3 = "Good job!!!";
String message_4 = "Let's eat a cake!";
int W = 800, H = 600;

Cake cake;
Sun sun;

ArrayList<Firework> fireworks = new ArrayList<Firework>();
PVector gravity = new PVector(0, 0.15);

void settings(){
  size(W, H);
}

void setup(){
  textAlign(CENTER, CENTER);
  cake = new Cake(400, 350);
  sun  = new Sun(0, 110, 40, 1);
}

void draw(){
  int topC    = color(#6D94C5);
  int bottomC = color(#F5EFE6);

  Background_G(0, 0, width, height, topC, bottomC);
  
  sun.update();
  sun.draw();
  
  fill(#DC143C);
  textSize(48);
  text(message_1, W/2, H/2 - 250);

  // Line 2
  textSize(28);
  fill(10, 80, 160);
  text(message_2, W/2, H/2 - 200);

  // Line 3
  textSize(32);
  fill(20, 150, 90);
  text(message_3, W/2, H/2 - 150);
  text(message_4, W/2, H/2 - 100);
  
  cake.draw();
  
  if (random(1) < 0.1) {
    fireworks.add(new Firework(random(40, width-40), height));
  }

  for (int i = fireworks.size()-1; i >= 0; i--) {
    Firework f = fireworks.get(i);
    f.update();
    f.show();
    if (f.done()){
      fireworks.remove(i);
    }
  }
}

void Background_G(int x, int y, int w, int h, int cTop, int cBottom) {
  pushStyle();
  noFill();
  for (int i = y; i < y + h; i++) {
    float t = map(i, y, y + h - 1, 0, 1);
    stroke(lerpColor(cTop, cBottom, t));
    line(x, i, x + w, i);
  }
  popStyle();
}
