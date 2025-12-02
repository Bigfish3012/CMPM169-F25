// set up source from: https://editor.p5js.org/hirofumimatsuzaki/sketches/ByHZs4ryV
const mappa = new Mappa('Leaflet');

// emoji list from: https://editor.p5js.org/Scatropolis/sketches/NxJZn8UbX
let random_emoji = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", 
                    "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", 
                    "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", 
                    "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", 
                    "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", 
                    "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", 
                    "🧐", "😕", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "😦", 
                    "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", 
                    "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", 
                    "💀", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", 
                    "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", 
                    "🙊", "💋", "💌", "💘", "💝", "💕", "💟", "💔", "🧡", "💛"];

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
        const emoji = data.emoji;
        const description = data.description;
        const user_image = data.user_image || 'N/A';
        
        console.log({
          "lat": lat,
          "lng": lng,
          "timestamp": data.timestamp,
          "emoji": emoji,
          "image": user_image,
          "description": description
        });
        
        return new Pin(lat, lng, emoji, description, user_image);
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
  
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height) {
    return;
  }
  
  if (!isDragging) {
    let clickedPin = null;
    for (let pin of pins) {
      if (pin.isClicked()) {
        clickedPin = pin;
        break;
      }
    }
    
    if (clickedPin) {
      displayPinInfo(clickedPin);
    } else {
      const location_map = myMap.pixelToLatLng(mouseX, mouseY);
      const emoji = random_emoji[Math.floor(Math.random() * random_emoji.length)];
      const description = "Don't forget to add your description!";
      const user_image = 'N/A';
      const pin = new Pin(location_map.lat, location_map.lng, emoji, description, user_image);
      pins.push(pin);
      showInputBox(pin);
    }
  }
  
  isDragging = false;
}

async function add_pin(pin) {
  const toSave = {
    lat: pin.lat,
    lng: pin.lng,
    emoji: pin.emoji || '', 
    description: pin.description || '',
    user_image: pin.user_image || '',
  };
  await saveData.saveOne(toSave);
}

// AI generated function to display pin information
function displayPinInfo(pin) {
  const infoSection = document.getElementById('info-section');
  const oldP = infoSection.querySelector('p');
  if (oldP) {
    oldP.remove();
  }
  const oldInfo = document.getElementById('pin-info');
  if (oldInfo) {
    oldInfo.remove();
  }
  
  const infoDiv = document.createElement('div');
  infoDiv.id = 'pin-info';
  infoDiv.innerHTML = `
    <p style="font-family: 'kindergarten'; font-size: 20px;"><strong>Emoji:</strong> ${pin.emoji}</p>
    <p style="font-family: 'kindergarten'; font-size: 20px;"><strong>Location:</strong> Lat: ${pin.lat.toFixed(4)}, Lng: ${pin.lng.toFixed(4)}</p>
    <p style="font-family: 'kindergarten'; font-size: 20px;"><strong>Description:</strong> <br>${pin.description}</p>
  `;
  
  infoSection.appendChild(infoDiv);
}

// Based on the above AI generated function(displayPinInfo), I modified it to show input box for new pin
function showInputBox(pin) {
  const infoSection = document.getElementById('info-section');
  const oldP = infoSection.querySelector('p');
  if (oldP) {
    oldP.remove();
  }
  const oldInfo = document.getElementById('pin-info');
  if (oldInfo) {
    oldInfo.remove();
  }

  const infoDiv = document.createElement('div');
  infoDiv.id = 'pin-info';
  
  // emoji event part is AI generated, the description part the cancel button is what I modified.
  let emojiButtonsHTML = '';
  for (let emoji of random_emoji) {
    emojiButtonsHTML += `<button class="emoji-btn" data-emoji="${emoji}">${emoji}</button>`;
  }
  
  infoDiv.innerHTML = `
    <p><strong>Location:</strong> Lat: ${pin.lat.toFixed(4)}, Lng: ${pin.lng.toFixed(4)}</p>
    <p><strong>Select emoji:</strong></p>
    <div id="emoji-list">${emojiButtonsHTML}</div>
    <p><strong>Or enter your own emoji:</strong></p>
    <input type="text" id="emoji_input" placeholder="Enter emoji..." value="${pin.emoji}">
    <p><strong>Current emoji:</strong> <span id="current-emoji">${pin.emoji}</span></p>
    <p><strong>Enter description:</strong></p>
    <textarea id="description_input" class="desc-input " placeholder="Enter your description...">${pin.description}</textarea>
    <br>
    <button id="save_button">Save</button>
    <button id="cancel_button">Cancel</button>
  `;
  
  infoSection.appendChild(infoDiv);
  

  const emojiBtns = document.querySelectorAll('.emoji-btn');
  emojiBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const emoji = this.getAttribute('data-emoji');
      pin.emoji = emoji;
      document.getElementById('current-emoji').textContent = emoji;
      document.getElementById('emoji_input').value = emoji;
    });
  });
  
  document.getElementById('emoji_input').addEventListener('input', function() {
    pin.emoji = this.value;
    document.getElementById('current-emoji').textContent = this.value;
  });
  
  document.getElementById('save_button').addEventListener('click', function() {
    const description = document.getElementById('description_input').value;
    const emoji = document.getElementById('emoji_input').value;
    pin.description = description;
    pin.emoji = emoji;
    add_pin(pin);
    displayPinInfo(pin);
  });
  
  document.getElementById('cancel_button').addEventListener('click', function() {
    const pinIndex = pins.indexOf(pin);
    if (pinIndex > -1) {
      pins.splice(pinIndex, 1);
    }
    
    const infoSection = document.getElementById('info-section');
    const oldInfo = document.getElementById('pin-info');
    if (oldInfo) {
      oldInfo.remove();
    }
    const defaultP = document.createElement('p');
    defaultP.textContent = 'balabala, INCOMPLETE';
    infoSection.appendChild(defaultP);
  });
  
  document.getElementById('description_input').focus();
}