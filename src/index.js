import { drawKen, updateKen } from './Ken.js';
import { drawBackgroundKen } from './stage.js';

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.onload = function(){
    const canvasEL = document.querySelector('canvas');
    const context = canvasEL.getContext('2d');

    canvasEL.width = GameViewport.WIDTH;
    canvasEL.height = GameViewport.HEIGHT;

    function frame() {
        updateKen(context);
        drawBackgroundKen(context);
        drawKen(context);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
}