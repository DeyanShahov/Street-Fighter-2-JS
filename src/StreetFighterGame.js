import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from './engine/InputHandler.js';
import { getContext } from './utils/context.js';
import { BattleScene } from './scenes/BattleScene.js';
import { handleBlockStyleClick, handleDebugBoxClick, handleDebugLogClick } from './utils/gameUiSettings.js';

export class StreetFighterGame {
    context = getContext();
    debug = true;

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
            secondsPassed: (time - this.frameTime.previous) / 1000,
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

    handleDebugBox() {
        const debugCheckbox = document.getElementById('debugBox');
        if (debugCheckbox) {
            window.addEventListener('click', () => handleDebugBoxClick(debugCheckbox));
        }
    }

    handleDebugLog() {
        const debugCheckbox = document.getElementById('debugLog');
        if (debugCheckbox) {
            window.addEventListener('click', () => handleDebugLogClick(debugCheckbox));
        }
    }
    
    handleBlockStyle() {
        const blockTypeBox = document.getElementById('block');
        if (blockTypeBox) {
            window.addEventListener('click', () => handleBlockStyleClick(blockTypeBox));
        }
    }



    start() {
        //document.addEventListener('submit', this.handleFormSubmit.bind(this));

        this.handleDebugBox();
        this.handleDebugLog();
        this.handleBlockStyle();

        registerKeyboardEvents();
        registerGamepadEvents();

        window.requestAnimationFrame(this.frame.bind(this));
    }
};

