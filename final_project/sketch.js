// set up source from: https://editor.p5js.org/hirofumimatsuzaki/sketches/ByHZs4ryV
const mappa = new Mappa('Leaflet');

let myMap;

// map options
const options = {
  // coordinates of UCSC from GPT
  lat: 36.9914,
  lng: -122.0609,
  zoom: 15,    
  pitch:0,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
}


function setup(){
  canvas = createCanvas(1200, 600); 

  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas);
}

function draw(){
    clear();
  const itoshima = myMap.latLngToPixel(36.9914, -122.0609); 
  ellipse(itoshima.x, itoshima.y, 10, 10);
}