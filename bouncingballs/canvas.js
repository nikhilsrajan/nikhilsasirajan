var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = 'black';

var c = canvas.getContext('2d');

var frame_rate = 1/40; // seconds
var frame_delay = frame_rate * 1000; // ms

var num_of_circles = 100 * canvas.width / 1396;
var gravity = 0.25;
var tol_y = 0;
var tol_dy = 0;

function clearCanvas() {
    c.clearRect(0, 0,  canvas.width, canvas.height);
}

function Circle(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.dy_overflow = 0;
    this.elasticity = 0.75;
    this.overflow = false;

    this.draw = function() { 
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'rgba(255, 50, 50, 0.5)';
        c.stroke();
        c.fillStyle = c.strokeStyle;
        c.fill();
    }
    this.update = function() {
        if(Math.abs(this.dy) > tol_dy || (this.y <= canvas.height - this.radius - tol_y)) {
            if(this.y + this.dy <= canvas.height - this.radius) {
                this.y += this.dy;
                this.dy += gravity;
            } else {
                let t_to_collision = (canvas.height - this.radius - this.y) / this.dy;
                let t_since_collision = 1 - t_to_collision; 
                this.dy *= -this.elasticity;
                this.y = canvas.height - this.radius + this.dy  * (1 - t_to_collision) + 0.5 * gravity * t_since_collision * t_since_collision;
                this.dy += gravity * (1 - t_to_collision);
                // console.log(`H  = ${canvas.height - this.radius}\ny  = ${this.y}\ndy = ${this.dy}\nt = ${t_to_collision}`);
            }
        } else {
            this.y = canvas.height - this.radius;
            this.dy = 0;
        }
    }
}

function CirclesArray() {
    this.circles_array = [];
    this.push = function(circle) {
        this.circles_array.push(circle);
    }
    this.draw = function() {
        for(circle of this.circles_array) {
            circle.draw();
        }
    }
    this.update = function() {
        for(circle of this.circles_array) {
            circle.update();
        }
    }
}

radius = 30;
x = function() {
    return Math.random() * (canvas.width - 2*radius) + radius;
}
dx = function() {
    return [-1, 1][Math.round(Math.random())] * (Math.random() + 1);
}
y = function() {
    return Math.random() * (canvas.height - 2*radius) * 3/4 + radius;
    // return canvas.height - radius - 600;
}
dy = function() {
    return [-1, 1][Math.round(Math.random())] * (Math.random() + 1);
    // return 0;
}

circles_array = new CirclesArray();

for (var i = 0; i < num_of_circles; i++) { 
    circles_array.push(new Circle(x(), y(), radius, dx(), dy()));
}

function animate() {
    requestAnimationFrame(animate);
    clearCanvas();
    circles_array.draw();
    circles_array.update();
}

animate();