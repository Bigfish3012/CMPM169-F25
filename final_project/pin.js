// reference: https://fablab.ruc.dk/interactive-maps/

class Pin {
    constructor(lat, lng, radius, emoji, description, user_image) {
        this.lat = lat;
        this.lng = lng;
        this.radius = radius;
        this.originalRadius = radius;
        this.emoji = emoji;
        this.description = description;
        this.user_image = user_image;
    }

    show() {
        noStroke();
        fill('red');
        const pixel = myMap.latLngToPixel(this.lat, this.lng);
        ellipse(pixel.x, pixel.y, this.radius, this.radius);
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
}