var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

var clearCanvas = function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

var mouse = {
    x: undefined,
    y: undefined
};

function updateMouseXY(event) {
    mouse.x = event.x;
    mouse.y = event.y;
};

window.addEventListener('mousemove', updateMouseXY);
window.addEventListener('touchmove', updateMouseXY);

var num_of_circles = 1000;
var radius = 10;
var radius_of_influence = 30;  
var multiplier = 5;
var increase_rate = 5;
var decrease_rate = 1;
var perform_resize = true;

window.addEventListener('keydown',
    function(e) {   
        if(perform_resize) {
            perform_resize = false;
        } else {
            perform_resize = true;
        }
        console.log(`perform_resize = ${perform_resize}`);
    }
);

var _1_ = 255;
var _0_ = 50;
var opacity = 0.5;

var fillStyles = [
    `rgba(231, 76, 60, ${opacity})`,
    `rgba(236, 240, 241, ${opacity})`,
    `rgba(52, 152, 219, ${opacity})`,
    // `rgba(${_1_}, ${_1_}, ${_0_}, ${opacity})`,
    // `rgba(${_1_}, ${_0_}, ${_1_}, ${opacity})`,
    // `rgba(${_0_}, ${_1_}, ${_1_}, ${opacity})`,
]

function Circle(radius, x, y, dx, dy, fillStyle) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.fillStyle = fillStyle;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.fillStyle;
        c.fill();
    };

    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;

        if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
            if(this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
            } else {
                this.x = this.radius;
            }
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy  = -this.dy;
            if(this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
            } else {
                this.y = this.radius;
            }
        }

        // Interactivity
        if(Math.abs(mouse.x - this.x) < radius_of_influence
            && Math.abs(mouse.y - this.y) < radius_of_influence) {
            if(this.radius < radius * multiplier && perform_resize ) {
                this.radius += increase_rate;
            }
        } else if(this.radius > radius) {
            this.radius -= decrease_rate;
        }
    }
}

function CircleArray() {
    this.circles = [];
    this.push = function(circle) {
        this.circles.push(circle);
    };
    this.draw = function() {
        for(circle of this.circles) {
            circle.draw();
        }
    };
    this.update = function() {
        for(circle of this.circles) {
            circle.update();
        }
    }
}

function x() {
    return Math.random() * (canvas.width - radius*2) + radius;
}
function y() {
    return Math.random() * (canvas.height - radius*2) + radius;
}
function dx() {
    return [1, -1][Math.round(Math.random())] * (Math.random() + 0.5);
}
function dy() {
    return [1, -1][Math.round(Math.random())] * (Math.random() + 0.5);
}

var circles = new CircleArray();

var i = 0;
for(; i < num_of_circles; ++i) {
    circles.push(new Circle(radius, x(), y(), dx(), dy(), fillStyles[i % fillStyles.length]));
}

function animate() {
    clearCanvas();
    requestAnimationFrame(animate);
    circles.draw();
    circles.update();
}

animate();