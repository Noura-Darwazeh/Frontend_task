let blobs = [];
let isTouch = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 3; i++) {
    let x = random(width);
    let y = random(height);
    let radius = random(20, 50);     
    let color = randomBlobColor();
    let blob = new Blob(x, y, radius, color);
    blobs.push(blob);
  }
  
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    isTouch = true;
  }
}

function draw() {
  background(255);
  for (let blob of blobs) {
    if (isTouch) {
      blob.moveTouch();
    } else {
      blob.move();
    }
    blob.showBlob();
    blob.checkEdges();
    for (let other of blobs) {
      if (blob !== other) {
        blob.handleCollide(other);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function randomBlobColor() {
  return color(random(255), random(255), random(255));
}

class Blob {
  constructor(x, y, radius, color) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1)).mult(3);
    this.radius = radius;
    this.color = color;
  }

  move() {
    this.pos.add(this.vel);
  }
  
  moveTouch() {
    this.vel = createVector(mouseX - this.pos.x, mouseY - this.pos.y).mult(0.1);
    this.pos.add(this.vel);
  }

  showBlob() {
    noStroke();
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.radius * 2);
  }
  

  checkEdges() {
    if (this.pos.x + this.radius >= width || this.pos.x - this.radius <= 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y + this.radius >= height || this.pos.y - this.radius <= 0) {
      this.vel.y *= -1;
    }
  }

  handleCollide(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.radius + other.radius) {
      let totalRadius = this.radius + other.radius;
      let overlap = totalRadius - d;
      let direction = createVector(other.pos.x - this.pos.x, other.pos.y - this.pos.y).normalize();
      this.pos.sub(direction.copy().mult(overlap * 0.5));
      other.pos.add(direction.copy().mult(overlap * 0.5));
    }
  }
}
