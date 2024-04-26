export class Fighter {
    constructor(name, x, y, velocity){
        this.name = name;
        this.image = new Image();
        this.frames = new Map();
        this.position = {x, y};
        this.velocity = velocity;
        this.animationFrame = 1;
    }

    update(secondsPassed, context) {
        const [, , width] = this.frames.get(`forwards-${this.animationFrame}`);

        this.animationFrame++;
        if (this.animationFrame > 6) this.animationFrame = 1;
        
        this.position.x += this.velocity * secondsPassed;
        
        if(this.position.x > context.canvas.width - width || this.position.x < 0) {
            this.velocity = -this.velocity;
        }
    }

    draw(context) {
        const [x, y, width, height] = this.frames.get(`forwards-${this.animationFrame}`);

        context.drawImage(this.image, x, y, width, height, this.position.x, this.position.y, width, height);
    }
}