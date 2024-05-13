import { Ken } from './entities/fighters/Ken.js';
import { Ryu } from './entities/fighters/Ryu.js';
import { Stage } from './entities/Stage.js';
import { FpsCounter } from './entities/FpsCounter.js'
import { STAGE_FLOOR } from './constants/stage.js';
import { FighterDirection } from './constants/fighters.js';
import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from './InputHandler.js';
import { Shadow } from './entities/fighters/Shadow.js';
import { StatusBar } from './entities/overlays/StatusBar.js';
import { Camera } from './Camera.js';

export class StreetFighterGame{
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ryu(180, STAGE_FLOOR, FighterDirection.RIGHT, 1),
            new Ken(280, STAGE_FLOOR, FighterDirection.LEFT, 0),
        ];

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];

        this.camera = new Camera(448, 16, this.fighters);
        
        this.entities = [
            new Stage(), 
            ...this.fighters.map(fighter => new Shadow(fighter)),
            ...this.fighters, 
            new FpsCounter(),
            new StatusBar(this.fighters),
        ];
        
        this.frameTime = {
            previous: 0,
            secondsPassed: 0,
        };
    }

    getContext() {
        const canvasEL = document.querySelector('canvas');
        const context = canvasEL.getContext('2d');

        context.imageSmoothingEnabled = false;

        return context;
    }

    update() { 
        this.camera.update(this.frameTime, this.context);

        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context, this.camera);
        }
    }

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context, this.camera);
        }
    }


    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            secondsPassed: ( time - this.frameTime.previous) / 1000,
            previous: time,
        }

        pollGamepads();
        this.update();
        this.draw();     
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