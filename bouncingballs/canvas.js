var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = 'black';

var c = canvas.getContext('2d');

function clearCanvas() {
    c.clearRect(0, 0,  canvas.width, canvas.height);
}

function Circle(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.g = 1;

    this.draw = function() { 
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = 'rgba(255, 50, 50, 0.3)';
        c.stroke();
        c.fillStyle = c.strokeStyle;
        c.fill();
    }
    this.update = function() {
        if(this.x + this.radius > canvas.width 
            || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if(this.y + this.radius > canvas.height) {
            this.dy = -this.dy;
            this.y = canvas.height - this.radius;
        }
        this.x += this.dx;

        this.dy += this.g;
        this.y += this.dy;
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
    return Math.random() * (canvas.height - 2*radius) + radius;
}
dy = function() {
    return [-1, 1][Math.round(Math.random())] * (Math.random() + 1);
}

circles_array = new CirclesArray();

for (var i = 0; i < 50; i++) { 
    circles_array.push(new Circle(x(), y(), radius, dx(), dy()));
}

console.log(circles_array);

function animate() {
    requestAnimationFrame(animate);
    clearCanvas();
    circles_array.draw();
    circles_array.update();
}

animate();