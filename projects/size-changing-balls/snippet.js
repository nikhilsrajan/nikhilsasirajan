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
        }
    } else {
        this.y = canvas.height - this.radius;
        this.dy = 0;
    }
}