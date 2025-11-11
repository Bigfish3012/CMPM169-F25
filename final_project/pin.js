class Pin {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    show() {
        noStroke();
        fill(this.color);
        const pixel = myMap.latLngToPixel(this.x, this.y);
        ellipse(pixel.x, pixel.y, this.radius, this.radius);
    }
}