let blobs = [];
let isMobile = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 3; i++) {
    let x = random(width);
    let y = random(height);
    let radius = random(50, 100);
    let color = randomBlobColor();
    let blob = new Blob(x, y, radius, color);
    blobs.push(blob);
  }


  if (/Mobi|Android/i.test(navigator.userAgent)) {
    isMobile = true;
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }
}

function draw() {
  background(255);
  for (let blob of blobs) {
    if (isMobile) {
      blob.moveMobile();
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

function handleOrientation(event) {
  orientationData = event;
}

class Blob {
  constructor(x, y, radius, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(3));
    this.radius = radius;
    this.color = color;
  }

  move() {
    this.pos.add(this.vel);
  }

  moveMobile() {
    if (orientationData) {
      let dx = map(orientationData.gamma, -90, 90, -5, 5);
      let dy = map(orientationData.beta, -90, 90, -5, 5);
      this.pos.add(createVector(dx, dy));
    } else {
      this.move();
    }
  }

  showBlob() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
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
      let temp = this.vel;
      this.vel = other.vel;
      other.vel = temp;
    }
  }
}