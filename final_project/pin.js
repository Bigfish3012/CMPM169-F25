// reference: https://fablab.ruc.dk/interactive-maps/

class Pin {
    constructor(lat, lng, emoji, description, user_image) {
        this.lat = lat;
        this.lng = lng;
        this.radius = 25;
        this.originalRadius = 25;
        this.emoji = emoji;
        this.description = description;
        this.user_image = user_image;
    }

    show() {
        const pixel = myMap.latLngToPixel(this.lat, this.lng);
        
        textAlign(CENTER, CENTER);
        textSize(this.radius);
        text(this.emoji, pixel.x, pixel.y);
    }

    mouseOver(){
        const pixel = myMap.latLngToPixel(this.lat, this.lng);
        const distance = dist(mouseX, mouseY, pixel.x, pixel.y);
        if (distance < this.originalRadius / 2) {
            this.radius = this.originalRadius * 3;
            return true;
        } else {
            this.radius = this.originalRadius;
            return false;
        }
    }

    isClicked() {
        const pixel = myMap.latLngToPixel(this.lat, this.lng);
        const distance = dist(mouseX, mouseY, pixel.x, pixel.y);
        return distance < this.originalRadius / 2;
    }
}