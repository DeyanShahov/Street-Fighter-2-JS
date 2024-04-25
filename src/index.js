import { Ken } from './Ken.js';
import { Ryu } from './Ryu.js';
import { Stage } from './Stage.js';

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.onload = function(){
    const canvasEL = document.querySelector('canvas');
    const context = canvasEL.getContext('2d');

    canvasEL.width = GameViewport.WIDTH;
    canvasEL.height = GameViewport.HEIGHT;

    const ken = new Ken(80, 110, 2);
    const ryu = new Ryu(80, 110, -2);
    const stage = new Stage();

    function frame() {
        
        ken.update(context);
        ryu.update(context);
        
        stage.draw(context);

        ken.draw(context);
        ryu.draw(context);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
}