class Sun{
  float x, y;
  float r;
  float vx;
  
  Sun(float x, float y, float r, float vx) {
    this.x = x; this.y = y;
    this.r = r; this.vx = vx;
  }
  
    void update() {
    x += vx;
    if (x - r > width){
      x = -r;
    }
  }

  void draw() {
    pushStyle();
    noStroke();
    
    int transpar = 80;
    int layers = 100;
    for(int i = 0; i< 10; i++){
      fill(255, 220, 0, transpar);
      circle(x, y, layers);
      transpar -= 10;
      layers-=10;
    }
    
    //sun rays -- from my previous project: https://github.com/IanLiu2603/CMPM147-Final/blob/main/src/background.js
    float rotationAngle    = radians(frameCount / 10);

    stroke(255, 255, 0, 120);
    strokeWeight(10);
    for (int i = 0; i < 20; i++) {
      float a  = (i * PI) / 10 + rotationAngle;
      float x1 = x + cos(a) * 60;
      float y1 = y + sin(a) * 60;
      float x2 = x + cos(a) * 70;
      float y2 = y + sin(a) * 70;
      line(x1, y1, x2, y2);
    }
    
    popStyle();
  }
}
