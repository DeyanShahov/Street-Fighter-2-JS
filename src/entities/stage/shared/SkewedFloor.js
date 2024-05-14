import {STAGE_WIDTH, STAGE_PADDING} from '../../../constants/stage.js';

export class SkewedFloor {
    constructor(image, dimension) {
        this.image = image;
        this.dimension = dimension;
    }

    draw(context, camera, y) {
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.dimension;

        context.save();

        context.setTransform(
            1, 0, -5.15 - ((camera.position.x - (STAGE_WIDTH + STAGE_PADDING)) / 112),
            1, 33 - camera.position.x / 1.55, y - camera.position.y,
        );

        context.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, sourceWidth, sourceHeight,
        );

        context.restore();
    }
}