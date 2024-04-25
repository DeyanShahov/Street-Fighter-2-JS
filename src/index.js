import { drawKen, updateKen } from './Ken.js';
import { drawBackgroundKen } from './stage.js';
import { drawRyu, updateRyu} from './Ryu.js';

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
        updateRyu(context);
        
        drawBackgroundKen(context);

        drawKen(context);
        drawRyu(context);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
}