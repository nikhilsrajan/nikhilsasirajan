var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = 'black';

console.log(window.innerWidth);

window.addEventListener('resize',
    function(e) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        circles_array.reset();
    }
);

var c = canvas.getContext('2d');

function clearCanvas() {
    c.clearRect(0, 0,  canvas.width, canvas.height);
}

var frame_rate = 1/40; // seconds
var frame_delay = frame_rate * 1000; // ms

