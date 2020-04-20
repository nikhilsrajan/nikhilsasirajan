var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = 'black';

var c = canvas.getContext('2d');

var clearCanvas = function() {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize',
    function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
)

// -----------------------------------------------

function Polygon() {
    this.p = [];                // Transformed points
    this.pos = { x:0, y:0 };    // Position of the shape
    this.angle;                 // Direction of the shape
    this.o = [];                // "Model" of the shape
    this.overlap = false;       // Flag to indicate if overlap has occured
}

var shapes = [];

function CreatePolygon(n, pos, radius) {
    let poly = new Polygon();
    let f_theta = Math.PI * 2 / n;
    poly.pos = pos;
    poly.angle = 0;
    let i = 0;
    for(; i < n; ++i) {
        let x = radius * Math.cos(f_theta * i);
        let y = radius * Math.sin(f_theta * i);
        poly.o.push({x: x, y: y});
        poly.p.push({x: x, y: y});
    }
    return poly;
}

function CreateShapes() {
    shapes.push(CreatePolygon(5, {x: 100, y: 100}, 30));
    shapes.push(CreatePolygon(3, {x: 200, y: 150}, 20));
    let s3 = new Polygon();
    s3.pos = {x: 50, y: 200};
    s3.angle = 0;
    s3.o.push({x: -30, y: -30});
    s3.o.push({x: -30, y: 30});
    s3.o.push({x: 30, y: 30});
    s3.o.push({x: 30, y: -30});
    s3.p.push({x: -30, y: -30});
    s3.p.push({x: -30, y: 30});
    s3.p.push({x: 30, y: 30});
    s3.p.push({x: 30, y: -30});
    shapes.push(s3);
}

function DrawShape(r) {
    // Draw boundary
    c.beginPath();
    c.moveTo(r.p[0].x, r.p[0].y);
    let i;
    for(i = 1; i < r.p.length; ++i) {
        c.lineTo(r.p[i].x, r.p[i].y);
    }
    c.lineTo(r.p[0].x, r.p[0].y);
    if(r.overlap) {
        c.strokeStyle = 'red';
    } else {
        c.strokeStyle = 'white';
    }
    c.stroke();

    // Draw Direction
    c.beginPath();
    c.moveTo(r.p[0].x, r.p[0].y);
    c.lineTo(r.pos.x, r.pos.y);
    if(r.overlap) {
        c.strokeStyle = 'red';
    } else {
        c.strokeStyle = 'white';
    }
    c.stroke();
}

function DrawShapes() {
    for(shape of shapes) {
        DrawShape(shape);
    }
}

function UpdateShape(r) {
    let i;
    for(i = 0; i < r.o.length; ++i) {
        r.p[i].x = r.o[i].x * Math.cos(r.angle)
                    - r.o[i].y * Math.sin(r.angle)
                    + r.pos.x;
        r.p[i].y = r.o[i].x * Math.sin(r.angle)
                    + r.o[i].y * Math.cos(r.angle)
                    + r.pos.y;
    }
    r.overlap = false;
    return r;
}

function UpdateShapes() {
    let i;
    for(i = 0; i < shapes.length; ++i) {
        shapes[i] = UpdateShape(shapes[i]);
    }

    i = 0;
    let j;
    for(; i < shapes.length; ++i) {
        let overlap = false;
        for(j = i + 1; j < shapes.length && !overlap; ++j) {
            overlap = ShapeOverlap_SAT(shapes[i], shapes[j])
        }
        if(overlap) {
            shapes[i].overlap = overlap;
            shapes[j-1].overlap = overlap;
        }
    }
}

var time_delay = 0.01;

function OnUserUpdate(e) {
    let key = e.key;

    // Shape1
    if(key == 'ArrowLeft') { shapes[0].angle -= 2 * time_delay; }
    if(key == 'ArrowRight') { shapes[0].angle += 2 * time_delay; }
    if(key == 'ArrowUp') {
        shapes[0].pos.x += Math.cos(shapes[0].angle) * 60 * time_delay;
        shapes[0].pos.y += Math.sin(shapes[0].angle) * 60 * time_delay;
    }
    if(key == 'ArrowDown') {
        shapes[0].pos.x -= Math.cos(shapes[0].angle) * 60 * time_delay;
        shapes[0].pos.y -= Math.sin(shapes[0].angle) * 60 * time_delay;
    }

    // Shape2
    if(key == 'a' || key == 'A') { shapes[1].angle -= 2 * time_delay; }
    if(key == 'd' || key == 'D') { shapes[1].angle += 2 * time_delay; }
    if(key == 'w' || key == 'W') {
        shapes[1].pos.x += Math.cos(shapes[1].angle) * 60 * time_delay;
        shapes[1].pos.y += Math.sin(shapes[1].angle) * 60 * time_delay;
    }
    if(key == 's' || key == 'S') {
        shapes[1].pos.x -= Math.cos(shapes[1].angle) * 60 * time_delay;
        shapes[1].pos.y -= Math.sin(shapes[1].angle) * 60 * time_delay;
    }

    UpdateShapes();
}

// -----------------------------------------------

function ShapeOverlap_SAT(r1, r2) {
    let poly1 = r1;
    let poly2 = r2;

    let shape = 0;
    for(; shape < 2; ++shape) {
        if(shape == 1) {
            poly1 = r2;
            poly2 = r1;
        }

        let a = 0;
        for(; a < poly1.p.length; ++a) {
            let b = (a + 1) % poly1.p.length;

            // Subtracting the coordinates to get the edge vector
            // And the performing transformation to get the normal to the edge vector
            // (x, y) -> (-y, x)
            let axis_proj = { x: -(poly1.p[b].y - poly1.p[a].y),
                            y:   poly1.p[b].x - poly1.p[a].x }
            
            // Work out min and max 1D points for poly1
            let min_poly1 = undefined;
            let max_poly1 = undefined;
            let p = 0;
            for(; p < poly1.p.length; ++p) {
                // Dot product between a point and the axis of projection
                let q = poly1.p[p].x * axis_proj.x + poly1.p[p].y * axis_proj.y;
                if(min_poly1 == undefined || min_poly1 > q) {
                    min_poly1 = q;
                }
                if(max_poly1 == undefined || max_poly1 < q) {
                    max_poly1 = q;
                }
            }

            // Work out min and max 1D points for poly2
            let min_poly2 = undefined;
            let max_poly2 = undefined;
            p = 0;
            for(; p < poly2.p.length; ++p) {
                // Dot product between a point and the axis of projection
                let q = poly2.p[p].x * axis_proj.x + poly2.p[p].y * axis_proj.y;
                if(min_poly2 == undefined || min_poly2 > q) {
                    min_poly2 = q;
                }
                if(max_poly2 == undefined || max_poly2 < q) {
                    max_poly2 = q;
                }
            }

            // Checking if the extents overlap
            // If at any point they dont, we terminate and return false
            if (!(max_poly2 >= min_poly1 && max_poly1 >= min_poly2)) {
                return false;
            }
        }
    }
    return true;
}








// -----------------------------------------------

function loop(e) {
    clearCanvas();
    OnUserUpdate(e);
    DrawShapes();
}

function init() {
    CreateShapes();
    UpdateShapes();
    DrawShapes();
}

init();

var interval;
var keydown = false;
window.addEventListener('keydown',
    function(e) {
        if(keydown == false) {
            console.log('keydown');
            interval = setInterval(function() {
                loop(e)
            }, time_delay);
            keydown = true;
        }
    }
);
window.addEventListener('keyup', 
    function(e) {
        keydown = false;
        console.log('keyup');
        this.clearInterval(interval);
    }
);
window.addEventListener('resize', loop);