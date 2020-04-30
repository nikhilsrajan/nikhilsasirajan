var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

function clearCanvas() {
    c.clearRect(0, 0,  canvas.width, canvas.height);
}

// ---------------------------------------------------

var frame_rate = 1/40; // seconds
var frame_delay = frame_rate * 1000; // ms
var gravity = 9.8; // m / s^2

// ---------------------------------------------------

class ball {
    constructor(radius, mass, position, velocity) {
        this.radius = radius;
        this.mass = mass;
        this.pos = {x: position.x, y: position.y};
        this.vel = {x: velocity.x, y: velocity.y};
    }
};

// ---------------------------------------------------

function draw(ball) {
    c.beginPath();
    c.arc(ball.pos.x, ball.pos.y, ball.pos.radius, 0, Math.PI * 2, true);
    c.strokeStyle = 'rgba(255, 50, 50, 0.5)';
    c.stroke();
    c.fillStyle = c.strokeStyle;
    c.fill();
}

// ---------------------------------------------------
