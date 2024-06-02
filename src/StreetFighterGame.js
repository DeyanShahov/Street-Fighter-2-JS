import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from './engine/InputHandler.js';
import { getContext } from './utils/context.js';
import { BattleScene } from './scenes/BattleScene.js';
import { DEBUG_ENABLE } from './constants/game.js';

export class StreetFighterGame{
    context = getContext();

    frameTime = {
        previous: 0,
        secondsPassed: 0,
    };

    constructor() {
        this.scene = new BattleScene();
    }


    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            secondsPassed: ( time - this.frameTime.previous) / 1000,
            previous: time,
        };

        pollGamepads();
        this.scene.update(this.frameTime, this.context);
        this.scene.draw(this.context);     
    }

    // handleFormSubmit(event) {
    //     event.preventDefault();

    //     const selectedCheckboxes = Array
    //         .from(event.target.querySelectorAll('input:checked'))
    //         .map(checkbox => checkbox.value);

    //     const options = event.target.querySelector('select');

    //     this.fighters.forEach(fighter => {
    //         if(selectedCheckboxes.includes(fighter.name)) {
    //             fighter.changeState(options.value);
    //         }
    //     });
    // }

    start() {
        //document.addEventListener('submit', this.handleFormSubmit.bind(this));

        registerKeyboardEvents();
        registerGamepadEvents();

        window.requestAnimationFrame(this.frame.bind(this));
    }
};