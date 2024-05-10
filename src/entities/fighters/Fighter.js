import * as control from '../../InputHandler.js';
import { FighterDirection, FighterState } from '../../constants/fighters.js';
import { STAGE_FLOOR } from '../../constants/stage.js';


export class Fighter {
    constructor(name, x, y, direction, playerId){
        this.name = name;
        this.playerId = playerId;

        this.position = {x, y};
        this.velocity = {x: 0, y: 0};
        this.initialVelocity = {};
        this.direction = direction;
        this.gravity = 0;

        this.frames = new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};
        
        this.image = new Image();

        this.opponent;

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_DOWN, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                ],
            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_BACKWARD
                ],
            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD
                ],
            },
            [FighterState.JUMP_START]: {
                init: this.handleJumpStartInit.bind(this),
                update: this.handleJumpStartState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.JUMP_LAND,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                ],
            },
            [FighterState.JUMP_UP]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START
                ],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START
                ],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [
                    FighterState.JUMP_START
                ],
            },
            [FighterState.JUMP_LAND]: {
                init: this.handleJumpLandInit.bind(this),
                update: this.handleJumpLandState.bind(this),
                validFrom: [
                    FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                ],
            },
            [FighterState.CROUCH]: {
                init: () => { },
                update: this.handleCrouchState.bind(this),
                validFrom: [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN],
            },
            [FighterState.CROUCH_DOWN]: {
                init: this.handleCrouchDownInit.bind(this),
                update: this.handleCrouchDownState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH_UP]: {
                init: () => { },
                update: this.handleCrouchUpState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.IDLE_TURN]: {
                init: () => { },
                update: this.handleIdleTurnState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.JUMP_LAND, 
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ],
            },
            [FighterState.CROUCH_TURN]: {
                init: () => { },
                update: this.handleCrouchTurnState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
        };
        
        this.changeState(FighterState.IDLE);
    }

    getDirections = () => this.position.x >= this.opponent.position.x ? FighterDirection.LEFT : FighterDirection.RIGHT;

    changeState(newState) {        
        if (newState === this.currentState ) return;
        // TO DO: проверката за състояние произлизащо от друго състояние не работи, this.currentState в момента е NULL и дава грешка!!!
        //if ( !this.states[newState].validFrom.includes(this.currentState)) return;
        
        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init();
    }

    handleIdleInit() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }


    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }


    handleCrouchDownInit(){
        this.handleIdleInit();
    }


    handleCrouchDownState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.CROUCH);
        }
    }

    handleCrouchUpState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.IDLE);
        }
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleJumpStartInit() {
        this.handleIdleInit();
    }

    handleJumpLandInit() {
        this.handleIdleInit();
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND);
        }
    }

    handleJumpStartState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            if (control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARD);
            } else if (control.isForward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD)
            } else {
                this.changeState(FighterState.JUMP_UP);
            }
        }
    }

    handleJumpLandState() {
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLE;

        if(!control.isIdle(this.playerId)) {
            this.direction = this.getDirections();

            this.handleIdleState();
        } else {
            const newDirection = this.getDirections();

            if (newDirection !== this.direction){
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            } else {
                if (this.animations[this.currentState][this.animationFrame][1] !== -2) return;
            }
        }

        this.changeState(newState);
    }

    handleIdleState() {
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
        if (control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.WALK_BACKWARD);
        if (control.isForward(this.playerId, this.direction)) this.changeState(FighterState.WALK_FORWARD);

        const newDirection = this.getDirections();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN);
        }
    }

    handleWalkForwardState() {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        this.direction = this.getDirections();
    }

    handleWalkBackwardState() {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        this.direction = this.getDirections();
    }


    handleCrouchState() {
        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP);

        const newDirection = this.getDirections();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN);
        }
    }


    handleIdleTurnState() {
        this.handleIdleState();

        if (this.animations[this.currentState][this.animationFrame][1] !== -2) return;
        this.changeState(FighterState.IDLE);
    }


    handleCrouchTurnState() {
        this.handleCrouchState();

        if (this.animations[this.currentState][this.animationFrame][1] !== -2) return;
        this.changeState(FighterState.CROUCH);
    }



    updateStageContrains(context) {
        const WIDTH = 32;

        if(this.position.x > context.canvas.width - WIDTH) { 
            this.position.x = context.canvas.width - WIDTH;
        }

        if(this.position.x < WIDTH ) {           
            this.position.x = WIDTH;
        }
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous > this.animationTimer + frameDelay) {
            this.animationTimer = time.previous;

            if (frameDelay > 0) {
                this.animationFrame++;
            }

            if (this.animationFrame >= animation.length) {
                this.animationFrame = 0;
            }
        };
    }

    update(time, context) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;  
        this.position.y += this.velocity.y * time.secondsPassed;   

        // if ([FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD].includes(this.currentState)) {
        //     this.direction = this.getDirections();
        // }
        
        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageContrains(context);
    }

    drawDebug(context) {
        context.lineWidth = 1;

        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x) - 4.5, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x) + 4.5, Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x), Math.floor(this.position.y) - 4.5);
        context.lineTo(Math.floor(this.position.x), Math.floor(this.position.y) + 4.5);
        context.stroke();
    }

    draw(context) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];

        const [
            [x, y, width, height],
            [originX, originY],
        ] = this.frames.get(frameKey);

        context.scale(this.direction, 1);

        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y - originY),
            width, height
        );

        context.setTransform(1, 0, 0, 1, 0, 0);

        this.drawDebug(context);
    }
}