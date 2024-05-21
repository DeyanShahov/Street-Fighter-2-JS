import { FireballState, fireballVelocity } from '../../constants/fireball.js';
import { FRAME_TIME } from '../../constants/game.js';
import { boxOverlap, getActualBoxDimensions } from '../../utils/collisions.js';

const frames = new Map([
    ['hadoken-fireball-1', [[[473, 3699, 43, 32], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-fireball-2', [[[412, 3701, 56, 28], [37, 14]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['hadoken-fireball-3', [[[0, 0, 0, 0], [0, 0]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],

    //['hadoken-fireball-3', [[[374, 3705, 26, 20], []], [], []]],

    ['hadoken-collide-1', [[[374, 3705, 26, 20], [13, 10]], [0, 0, 0, 0]]],
    ['hadoken-collide-2', [[[357, 3701, 15, 25], [9, 13]], [0, 0, 0, 0]]],
    ['hadoken-collide-3', [[[325, 3700, 28, 28], [26, 14]], [0, 0, 0, 0]]],
    //['hadoken-collide-4', [[[288, 3699, 32, 32], [ ??, ??]], [0, 0, 0, 0]]],
]);

const animations = {
    [FireballState.ACTIVE]: [
        ['hadoken-fireball-1', 2],  ['hadoken-fireball-3', 2], 
        ['hadoken-fireball-2', 2],  ['hadoken-fireball-3', 2], 
    ],
    [FireballState.COLLIDED]: [
        ['hadoken-collide-1', 9],  ['hadoken-collide-2', 5], ['hadoken-collide-3', 6], 
    ],
};

export class Fireball {
    image = document.querySelector('img[alt="Ken"]');

    animationFrame = 0;
    state = FireballState.ACTIVE;

    constructor(fighter, strength, time, onEnd) {
        this.fighter = fighter;
        this.onEnd = onEnd;
        this.velocity = fireballVelocity[strength];
        this.direction = this.fighter.direction;
        this.position = {
            x: this.fighter.position.x + (76 * this.direction),
            y: this.fighter.position.y - 57,
        };
        this.animationTimer = time.previous;
    }

    hasCollidedWithOpponent() {
        const [x, y, width, height] = frames.get(animations[this.state][this.animationFrame][0])[1];
        const actualHitBox = getActualBoxDimensions(this.position, this.direction, {x, y, width, height});

        for (const [, hurtBox] of Object.entries(this.fighter.opponent.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.fighter.opponent.position,
                this.fighter.opponent.direction,
                {x, y, width, height},
            );

            if (boxOverlap(actualHitBox, actualOpponentHurtBox)) return true;    
        }

        return false;
    }

    updateMovement(time, camera) {
        if (this.state !== FireballState.ACTIVE) return;

        this.position.x += (this.velocity * this.direction) * time.secondsPassed;

        if (this.position.x - camera.position.x > 384 + 56 || this.position.x - camera.position.x < -56) {
            this.onEnd(this);
        }

        const hasCollided = this.hasCollidedWithOpponent();
        console.log(hasCollided);
        if (!hasCollided) return;

        this.state = FireballState.COLLIDED;
        this.animationFrame = 0;
        this.animationTimer = time.previous + animations[this.state][this.animationFrame][1] * FRAME_TIME;
    }

    updateAnimation(time) {
        if (time.previous < this.animationTimer) return;

        this.animationFrame += 1;

        if (this.animationFrame >= animations[this.state].length) {
            this.animationFrame = 0;
            if (this.state === FireballState.COLLIDED) this.onEnd(this);
        }

        this.animationTimer = time.previous + animations[this.state][this.animationFrame][1] * FRAME_TIME;
    }

    update(time, _, camera) {
        this.updateMovement(time, camera);
        this.updateAnimation(time);
    }

    draw(context, camera) {
        const [frameKey] = animations[this.state][this.animationFrame];
        const [[
            [frameX, frameY, frameWidth, frameHeight],
            [originX, originY],
        ]] = frames.get(frameKey);

        context.scale(this.direction, 1);

        context.drawImage(
            this.image,
            frameX, frameY,
            frameWidth, frameHeight,
            Math.floor((this.position.x - camera.position.x) * this.direction - originX),
            Math.floor(this.position.y - camera.position.y - originY),
            frameWidth, frameHeight
        );

        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}