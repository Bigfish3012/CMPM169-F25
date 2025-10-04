class Cake {
  float x, y;
  float[] cx = {-100, -60, -20, 20, 60, 100};
  int[] candleCol;
  Cake(float x, float y) {
    this.x = x; this.y = y;
    candleCol = new int[cx.length];
    for (int i = 0; i < cx.length; i++) {
      candleCol[i] = color((int)random(80,255), (int)random(80,255), (int)random(80,255));
    }
  }
  void draw() {
    pushMatrix();
    translate(x, y);
    rectMode(CENTER);
    //Candle
    for (int i = 0; i < cx.length; i++) {
      fill(candleCol[i]); 
      rect(cx[i], -40, 10, 50, 5);

      stroke(20, 80);
      strokeWeight(2);
      line(cx[i], -65, cx[i], -72);
      drawFlame(cx[i], -72, 10, i);
    }
    fill(#FAB12F);rect(0, 40, 260, 120, 16);
    fill(#FDCFFA);rect(0, 55, 300, 90, 16);
    fill(#73C8D2);rect(0, 70, 350, 60, 16);
    fill(#FFC7A7);rect(0, 160, 390, 140, 16);
    popMatrix();
  }
  
  void drawFlame(float x, float y, float baseSize, int idx) {
    pushStyle();
    noStroke();
    float t = frameCount * 0.05;
    float flicker = map(noise(t + idx * 10.0), 0, 1, 0.75, 1.25);
    float jitterX = map(noise(t + 100 + idx), 0, 1, -1.2, 1.2);
    float jitterY = map(noise(t + 200 + idx), 0, 1, -1.0, 1.0);

    float w = baseSize * 0.8 * flicker;
    float h = baseSize * 1.8 * flicker;

    fill(255, 200, 0, 35);
    ellipse(x + jitterX, y + jitterY, w * 3.2, h * 2.0);

    fill(255, 180, 0, 200);
    ellipse(x + jitterX, y + jitterY, w * 1.6, h * 1.2);

    fill(255, 230, 120, 230);
    ellipse(x + jitterX, y + jitterY - h * 0.12, w, h);

    fill(255, 255, 255, 220);
    ellipse(x + jitterX, y + jitterY - h * 0.28, w * 0.5, h * 0.6);
    popStyle();
  }
}
