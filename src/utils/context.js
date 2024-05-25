import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/game.js';

export function getContext() {
    const canvasEL = document.querySelector('canvas');
    const context = canvasEL.getContext('2d');

    context.imageSmoothingEnabled = false;
    context.canvas.width = SCREEN_WIDTH;
    context.canvas.height = SCREEN_HEIGHT;

    return context;
}


export function drawFrameBase(context, image, dimensions, x, y, direction = 1) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = dimensions;

    context.scale(direction, 1);
    context.drawImage(
        image,
        sourceX, sourceY, sourceWidth, sourceHeight,
        x * direction, y, sourceWidth, sourceHeight,
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
}