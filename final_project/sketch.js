// set up source from: https://editor.p5js.org/hirofumimatsuzaki/sketches/ByHZs4ryV
const mappa = new Mappa('Leaflet');

let myMap;
let pins = [];
let saveData;
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

  // load persisted pins
  saveData = new SaveData();
  saveData.loadData();
  const loaded = saveData.getData();
  if (Array.isArray(loaded)) {
    pins = loaded.map(d => new Pin(d.x, d.y, d.radius ?? 10, d.color ?? 'red'));
  }
}

function draw(){
  clear();
  for (let pin of pins) {
    pin.show();
  }
}

function mouseClicked() {
  if (mouseButton !== LEFT) return;
  if (abs(movedX) > 2 || abs(movedY) > 2) return;
  const location_map = myMap.pixelToLatLng(mouseX, mouseY);
  const pin = new Pin(location_map.lat, location_map.lng, 10, 'red');
  pins.push(pin);
  persistPins();
}

function persistPins() {
  // Convert Pin instances to plain objects and save
  const toSave = pins.map(p => ({
    x: p.x,
    y: p.y,
    radius: p.radius,
    color: p.color,
  }));
  saveData.setData(toSave);
  saveData.saveData();
}