// set up source from: https://editor.p5js.org/hirofumimatsuzaki/sketches/ByHZs4ryV
const mappa = new Mappa('Leaflet');
let random_emoji = ['👀', '🤔', '🤨', '🙂', '🙃', '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '🥺', '🤯', '🤠', '🤡'];

let myMap;
let pins = [];
let saveData;
let userLocation = null;

let mouseStartX = 0;
let mouseStartY = 0;
let isDragging = false;

const options = {
  // coordinates of UCSC from GPT
  lat: 36.9914,
  lng: -122.0609,
  zoom: 15,    
  pitch:0,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
}

// Get user's real location reference: https://editor.p5js.org/reachamaatra/sketches/p0HMlPu65
function getUserLocation(position) {
  userLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  
  options.lat = userLocation.lat;
  options.lng = userLocation.lng;
  
  console.log("User location:", userLocation);
  
  if (myMap) {
    myMap.map.setView([userLocation.lat, userLocation.lng], options.zoom);
  }
}


navigator.geolocation.getCurrentPosition(getUserLocation);


function setup(){
  canvas = createCanvas(1200, 600); 
  canvas.parent('map-container');
  // load persisted pins. // reference: https://fablab.ruc.dk/interactive-maps/
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas);

  saveData = new SaveData();
  saveData.loadData().then(() => {
    const loaded = saveData.getData();
    if (Array.isArray(loaded)) {
      pins = loaded.map(data => {
        const lat = data.lat;
        const lng = data.lng;
        const radius = data.radius || 10;
        const emoji = data.emoji || 'N/A';
        const description = data.description || 'N/A';
        const user_image = data.user_image || 'N/A';
        
        console.log({
          "lat": lat,
          "lng": lng,
          "timestamp": data.timestamp,
          "emoji": emoji,
          "image": user_image,
          "description": description
        });
        
        return new Pin(lat, lng, radius, emoji, description, user_image);
      });
    }
  });
}

function draw(){
  clear();
  for (let pin of pins) {
    pin.mouseOver();
    pin.show();
  }
}

function mousePressed() {
  if (mouseButton === LEFT) {
    mouseStartX = mouseX;
    mouseStartY = mouseY;
    isDragging = false;
  }
}

function mouseDragged() {
  if (mouseButton === LEFT) {
    const dragDistance = dist(mouseStartX, mouseStartY, mouseX, mouseY);
    if (dragDistance > 2) {
      isDragging = true;
    }
  }
}

function mouseClicked() {
  if (mouseButton !== LEFT) return;
  
  if (!isDragging) {
    const location_map = myMap.pixelToLatLng(mouseX, mouseY);
    const emoji = random_emoji[Math.floor(Math.random() * random_emoji.length)];
    const description = 'I am here';
    const user_image = 'N/A';
    const pin = new Pin(location_map.lat, location_map.lng, 10, emoji, description, user_image);
    pins.push(pin);
    add_pin(pin);
  }
  
  isDragging = false;
}

async function add_pin(pin) {
  const toSave = {
    lat: pin.lat,
    lng: pin.lng,
    radius: pin.radius || 10,
    emoji: pin.emoji || '', 
    description: pin.description || '',
    user_image: pin.user_image || '',
  };
  await saveData.saveOne(toSave);
}