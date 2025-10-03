String message_1 = "CONGRATULATIONS!"; 
String message_2 = "YOU ARE STILL ALIVE!!!";
String message_3 = "GOOD JOB!!!";
int W = 800, H = 600;

void settings(){
  size(W, H);
}

void setup(){
  textAlign(CENTER, CENTER);
}

void draw(){
  background(230, 245, 255);
  fill(#DC143C);
  textSize(48);
  text(message_1, W/2, H/2 - 150);

  // Line 2
  textSize(28);
  fill(10, 80, 160);
  text(message_2, W/2, H/2-100);

  // Line 3
  textSize(32);
  fill(20, 150, 90);
  text(message_3, W/2, H/2 - 50);  
}
