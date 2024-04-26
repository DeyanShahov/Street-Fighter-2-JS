import { Ken } from './entities/fighters/Ken.js';
import { Ryu } from './entities/fighters/Ryu.js';
import { Stage } from './entities/Stage.js';
import { FpsCounter } from './entities/FpsCounter.js'

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.addEventListener('load', function() {
    const canvasEL = document.querySelector('canvas');
    const context = canvasEL.getContext('2d');

    canvasEL.width = GameViewport.WIDTH;
    canvasEL.height = GameViewport.HEIGHT;

    const entities = [
        new Stage(),
        new Ken(80, 110, 150),
        new Ryu(80, 110, -150),
        new FpsCounter()
    ];

    let previousTime = 0;
    let secondsPassed = 0;

    function frame(time) {
        window.requestAnimationFrame(frame);

        secondsPassed = ( time - previousTime) / 1000;
        previousTime = time;

        for (const entity of entities) {
            entity.update(secondsPassed, context);
        }

        for (const entity of entities) {
            entity.draw(context);
        }
    }

    window.requestAnimationFrame(frame);
});