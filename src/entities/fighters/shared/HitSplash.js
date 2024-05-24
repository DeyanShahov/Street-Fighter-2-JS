import { FRAME_TIME } from '../../../constants/game.js';

export class HitSplash {
    constructor(args, time, entityList) {
        const [x, y, playerId] = args;

        this.image = document.querySelector('img[alt="decals"]');
        this.position = { x, y };
        this.playerId = playerId;
        this.entityList = entityList;

        this.frames = [];
        this.animationFrame = 0;
        this.animationTimer = time.previous;
    }

    update(time) {
        if (time.previous < this.animationTimer + 4 * FRAME_TIME) return;
        this.animationFrame += 1;
        this.animationTimer = time.previous;

        if ( this.animationFrame >= 4) this.entityList.remove(this);
    }

    draw(context, camera) {
        const [
            [x, y, width, height], [originalX, originalY], 
        ] = this.frames[this.animationFrame + this.playerId * 4];

        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor(this.position.x - camera.position.x - originalX),
            Math.floor(this.position.y - camera.position.y - originalY),
            width, height,
        );
    }
}