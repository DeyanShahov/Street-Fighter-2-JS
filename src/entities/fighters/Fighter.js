import * as control from '../../engine/InputHandler.js';
import {
    FIGHTER_START_DISTANCE,
    FIGHTER_PUSH_FRICTION,
    FIGHTER_HURT_DELAY,
    FIGHTER_DEFAULT_WIDTH,
    FighterAttackStrength,
    FighterAttackType,
    FighterDirection,
    FighterHurtBox,
    FighterState,
    FrameDelay,
    HurtStateValidForm,
    FighterAttackBasaData,
    FighterHurtBy,
    BlockStyle,
    FighterCurrntPosition,
} from '../../constants/fighters.js';
import { DANGER_DISTANCE as DANGER_DISTANCE_TO_OPPONENT, STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from '../../constants/stage.js';
import { boxOverlap, getActualBoxDimensions, getDistanceToOpponet, rectsOverlap } from '../../utils/collisions.js';
import { FRAME_TIME, SCREEN_WIDTH } from '../../constants/game.js';
import { BLOCK_STYLE, DEBUG_BOX_ENABLE, DEBUG_LOG_ENABLE } from '../../utils/gameUiSettings.js'
import { gameState } from '../../state/gameState.js';
import { DEBUG_drawCollisionInfoBoxes, DEBUG_logHit } from '../../utils/fighterDebug.js';
import { playSound, stopSound } from '../../engine/soundHandler.js';
import { hasSpecialMoveBeenExecuted } from '../../engine/controlHistory.js';
import { Control } from '../../constants/control.js';
import { processHit } from '../../utils/hurtBoxChoice.js';


export class Fighter {
    constructor(playerId, onAttackHit) {
        this.frames = new Map();
        this.image = new Image();

        this.playerId = playerId;

        this.animations = {};
        this.animationFrame = 0;
        this.animationTimer = 0;

        this.currentState = FighterState.IDLE;
        this.currentPosition = FighterCurrntPosition.FRONT;
        this.opponent = undefined;
        this.onAttackHit = onAttackHit;

        this.hurtBy = undefined;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.slideVelocity = 0;
        this.slideFriction = 0;


        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
        this.gravity = 0;

        this.attackStruck = false;
        this.isInAttack = false;

        this.boxes = {
            push: { x: 0, y: 0, width: 0, height: 0 },
            hit: { x: 0, y: 0, width: 0, height: 0 },
            hurt: {
                [FighterHurtBox.HEAD]: [0, 0, 0, 0],
                [FighterHurtBox.BODY]: [0, 0, 0, 0],
                [FighterHurtBox.FEET]: [0, 0, 0, 0],
            },
        };

        // FSM States
        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_DOWN, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                    FighterState.LIGHT_PUNCH, FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH,
                    FighterState.LIGHT_KICK, FighterState.MEDIUM_KICK, FighterState.HEAVY_KICK,
                    FighterState.CROUCH_UP, FighterState.UPRIGHT_BLOCK,
                    FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY,
                    FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY,
                ],
            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_BACKWARD, FighterState.UPRIGHT_BLOCK,
                ],
            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardState.bind(this),
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.UPRIGHT_BLOCK,
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
                    FighterState.JUMP_UP_ALL_PUNCH, FighterState.JUMP_MOVEMENT_HEAVY_PUNCH,
                    FighterState.JUMP_MOVEMENT_LIGHT_PUNCH, FighterState.JUMP_MOVEMENT_MEDIUM_PUNCH,
                    FighterState.JUMP_UP_LIGHT_KICK, FighterState.JUMP_UP_MEDIUM_KICK, FighterState.JUMP_UP_HEAVY_KICK,
                    FighterState.JUMP_MOVEMENT_LIGHT_KICK, FighterState.JUMP_MOVEMENT_MEDIUM_KICK, FighterState.JUMP_MOVEMENT_HEAVY_KICK,
                ],
            },
            [FighterState.CROUCH]: {
                init: () => { },
                update: this.handleCrouchState.bind(this),
                validFrom: [
                    FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN,
                    FighterState.CROUCH_LIGHT_PUNCH, FighterState.CROUCH_MEDIUM_PUNCH, FighterState.CROUCH_HEAVY_PUNCH,
                    FighterState.CROUCH_LIGHT_KICK, FighterState.CROUCH_MEDIUM_KICK, FighterState.CROUCH_HEAVY_KICK,
                    FighterState.HURT_CROUCH_LIGHT, FighterState.HURT_CROUCH_MEDIUM, FighterState.HURT_CROUCH_HEAVY,
                    FighterState.CROUCH_BLOCK,
                ],
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
            [FighterState.LIGHT_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleLightPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleMediumPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleMediumPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.LIGHT_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleLightKickState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleMediumKickState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleMediumKickState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HURT_HEAD_LIGHT]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: HurtStateValidForm,
            },
            [FighterState.HURT_HEAD_MEDIUM]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: HurtStateValidForm,
            },
            [FighterState.HURT_HEAD_HEAVY]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: HurtStateValidForm,
            },
            [FighterState.HURT_BODY_LIGHT]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: HurtStateValidForm,
            },
            [FighterState.HURT_BODY_MEDIUM]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: HurtStateValidForm,
            },
            [FighterState.HURT_BODY_HEAVY]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleHurtState.bind(this),
                validFrom: HurtStateValidForm,
            },
            [FighterState.HURT_CROUCH_LIGHT]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleCrouchHurtState.bind(this),
                validFrom: [FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
                    FighterState.CROUCH_TURN, FighterState.CROUCH_BLOCK,
                ],
            },
            [FighterState.HURT_CROUCH_MEDIUM]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleCrouchHurtState.bind(this),
                validFrom: [FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
                    FighterState.CROUCH_TURN, FighterState.CROUCH_BLOCK
                ],
            },
            [FighterState.HURT_CROUCH_HEAVY]: {
                init: this.handleHurtInit.bind(this),
                update: this.handleCrouchHurtState.bind(this),
                validFrom: [FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP,
                    FighterState.CROUCH_TURN, FighterState.CROUCH_BLOCK
                ],
            },
            [FighterState.UPRIGHT_BLOCK]: {
                init: this.handleUprightBlockInit.bind(this),
                update: this.handleUprightBlockState.bind(this),
                validFrom: [FighterState.WALK_BACKWARD, FighterState.UPRIGHT_BLOCK],
            },
            [FighterState.CROUCH_BLOCK]: {
                init: this.handleUprightBlockInit.bind(this),
                update: this.handleCrouchBlockState.bind(this),
                validFrom: [FighterState.CROUCH, FighterState.CROUCH_BLOCK],
            },
            [FighterState.CROUCH_LIGHT_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleCrouchLightPunchState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.CROUCH_MEDIUM_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleCrouchMediumPunchState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.CROUCH_HEAVY_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleCrouchMediumPunchState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.CROUCH_LIGHT_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleCrouchLightKickState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.CROUCH_MEDIUM_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleCrouchMediumKickState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.CROUCH_HEAVY_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleStandartAttackInit.bind(this),
                update: this.handleCrouchMediumKickState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.JUMP_UP_ALL_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_UP],
            },
            [FighterState.JUMP_UP_LIGHT_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_UP],
            },
            [FighterState.JUMP_UP_MEDIUM_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_UP],
            },
            [FighterState.JUMP_UP_HEAVY_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_UP],
            },
            [FighterState.JUMP_MOVEMENT_LIGHT_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD],
            },
            [FighterState.JUMP_MOVEMENT_MEDIUM_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD],
            },
            [FighterState.JUMP_MOVEMENT_HEAVY_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD],
            },
            [FighterState.JUMP_MOVEMENT_LIGHT_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD],
            },
            [FighterState.JUMP_MOVEMENT_MEDIUM_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD],
            },
            [FighterState.JUMP_MOVEMENT_HEAVY_KICK]: {
                attackType: FighterAttackType.KICK,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleJumpUpAllAttackInit.bind(this),
                update: this.handleJumpUpAllAttackState.bind(this),
                validFrom: [FighterState.JUMP_BACKWARD, FighterState.JUMP_FORWARD],
            },
        };
    }

    soundAttacks = {
        [FighterAttackStrength.LIGHT]: document.querySelector('audio#sound-fighter-light-attack'),
        [FighterAttackStrength.MEDIUM]: document.querySelector('audio#sound-fighter-medium-attack'),
        [FighterAttackStrength.HEAVY]: document.querySelector('audio#sound-fighter-heavy-attack'),
    };

    soundHits = {
        [FighterAttackStrength.LIGHT]: {
            [FighterAttackType.PUNCH]: document.querySelector('audio#sound-fighter-light-punch-hit'),
            [FighterAttackType.KICK]: document.querySelector('audio#sound-fighter-light-kick-hit'),
        },
        [FighterAttackStrength.MEDIUM]: {
            [FighterAttackType.PUNCH]: document.querySelector('audio#sound-fighter-medium-punch-hit'),
            [FighterAttackType.KICK]: document.querySelector('audio#sound-fighter-medium-kick-hit'),
        },
        [FighterAttackStrength.HEAVY]: {
            [FighterAttackType.PUNCH]: document.querySelector('audio#sound-fighter-heavy-punch-hit'),
            [FighterAttackType.KICK]: document.querySelector('audio#sound-fighter-heavy-kick-hit'),
        },
    };

    soundLand = document.querySelector('audio#sound-fighter-land');

    hasCollidedWithOpponent = () => rectsOverlap(
        this.position.x + this.boxes.push.x, this.position.y + this.boxes.push.y,
        this.boxes.push.width, this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x,
        this.opponent.position.y + this.opponent.boxes.push.y,
        this.opponent.boxes.push.width, this.opponent.boxes.push.height,
    );

    getDirections() {
        if (this.position.x + this.boxes.push.x + this.boxes.push.width
            <= this.opponent.position.x + this.opponent.boxes.push.x) {
            return FighterDirection.RIGHT;
        } else if (this.position.x + this.boxes.push.x
            >= this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width) {
            return FighterDirection.LEFT;
        }

        return this.direction;
    }

    checkForCrouchState() {
        return [FighterState.CROUCH, FighterState.CROUCH_UP, FighterState.CROUCH_DOWN,
            FighterState.CROUCH_BLOCK, FighterState.CROUCH_LIGHT_PUNCH, FighterState.CROUCH_MEDIUM_PUNCH,
            FighterState.CROUCH_HEAVY_PUNCH, FighterState.CROUCH_LIGHT_KICK, FighterState.CROUCH_MEDIUM_KICK,
            FighterState.CROUCH_HEAVY_KICK,
        ].includes(this.currentState);
    }

    getHitState(attackStrength, hitLocation) {
        const isItCrouching = this.checkForCrouchState();

        switch (attackStrength) {
            case FighterAttackStrength.LIGHT:
                if (isItCrouching) {
                    return FighterState.HURT_CROUCH_LIGHT;
                } else {
                    if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_LIGHT;
                    return FighterState.HURT_BODY_LIGHT;
                }
            case FighterAttackStrength.MEDIUM:
                if (isItCrouching) {
                    return FighterState.HURT_CROUCH_MEDIUM;
                } else {
                    if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_MEDIUM;
                    return FighterState.HURT_BODY_MEDIUM;
                }
            case FighterAttackStrength.HEAVY:
                if (isItCrouching) {
                    return FighterState.HURT_CROUCH_HEAVY;
                } else {
                    if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_HEAVY;
                    return FighterState.HURT_BODY_HEAVY;
                }
        }
    }

    isAnimationCompleted = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    getBoxes(frameKey) {
        const [,
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0, 0, 0, 0], body = [0, 0, 0, 0], feat = [0, 0, 0, 0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],
        ] = this.frames.get(frameKey);

        return {
            push: { x: pushX, y: pushY, width: pushWidth, height: pushHeight },
            hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },
            hurt: {
                [FighterHurtBox.HEAD]: head,
                [FighterHurtBox.BODY]: body,
                [FighterHurtBox.FEET]: feat,
            },
        };
    }


    changeState(newState, time, args) {
        if (!this.states[newState].validFrom.includes(this.currentState)) {
            console.warn(`Illegal transition from "${this.currentState}" to "${newState}"`);
        }
        if (!this.states[newState].validFrom.includes(this.currentState)) return;

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init(time, args);
    }

    resetVelocities() {
        this.velocity = { x: 0, y: 0 };
    }

    resetSlide(transferToOpponent = false) {
        if (transferToOpponent && this.hurtBy === FighterHurtBy.FIGHTER) {
            this.opponent.slideVelocity = this.slideVelocity;
            this.opponent.slideFriction = this.slideFriction;
        }
        this.slideFriction = 0;
        this.slideVelocity = 0;
    }

    handleUprightBlockInit() {
        this.resetVelocities();
    }

    handleUprightBlockState(time) {
        if (BLOCK_STYLE === undefined || BLOCK_STYLE === BlockStyle.ON_ATTACK_BACKWARD) {
            if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        } else {
            if (!control.isControlDown(this.playerId, Control.LIGHT_PUNCH)
                && !control.isControlDown(this.playerId, Control.MEDIUM_PUNCH)
                && !control.isControlDown(this.playerId, Control.HEAVY_PUNCH)) {
                this.changeState(FighterState.IDLE, time);
            }
        }
    }

    handleCrouchBlockState(time) {
        if (!control.isControlDown(this.playerId, Control.LIGHT_PUNCH)
            && !control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.CROUCH, time);
        }    
    }


    handleIdleInit() {
        this.resetVelocities();
        this.currentPosition = FighterCurrntPosition.FRONT;
        this.attackStruck = false;
    }


    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }


    handleCrouchDownInit() {
        this.resetVelocities();
        this.currentPosition = FighterCurrntPosition.BOTTOM;
    }

    handleStandartAttackInit() {
        this.resetVelocities();
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        this.isInAttack = true;
    }

    handleJumpUpAllAttackInit() {
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength]);
        this.isInAttack = true;
    }


    handleCrouchDownState(time) {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.CROUCH, time);
        }

        // Fast recovery from crouch_down if button is released
        if (!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_UP;
            this.animationFrame = this.animations[FighterState.CROUCH_UP][this.animationFrame].length
                - this.animationFrame;
        }
    }

    handleCrouchUpState(time) {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.IDLE, time);
        }
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleJumpStartInit() {
        this.resetVelocities();
        this.currentPosition = FighterCurrntPosition.TOP;
    }

    handleJumpLandInit() {
        this.resetVelocities();
        this.soundLand.play();
    }


    handleHurtInit(time) {
        this.resetVelocities();
        this.hurtShake = 2;
        this.hurtShakeTimer = time.previous + FRAME_TIME;
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND, time);
        }

        if (control.isLightPunch(this.playerId)) {
            this.currentState === FighterState.JUMP_UP
                ? this.changeState(FighterState.JUMP_UP_ALL_PUNCH, time)
                : this.changeState(FighterState.JUMP_MOVEMENT_LIGHT_PUNCH);
        } else if (control.isMediumPunch(this.playerId)) {
            this.currentState === FighterState.JUMP_UP
                ? this.changeState(FighterState.JUMP_UP_ALL_PUNCH, time)
                : this.changeState(FighterState.JUMP_MOVEMENT_MEDIUM_PUNCH);
        } else if (control.isHeavyPunch(this.playerId)) {
            this.currentState === FighterState.JUMP_UP
                ? this.changeState(FighterState.JUMP_UP_ALL_PUNCH, time)
                : this.changeState(FighterState.JUMP_MOVEMENT_HEAVY_PUNCH);
        } else if (control.isLightKick(this.playerId)) {
            this.currentState === FighterState.JUMP_UP
                ? this.changeState(FighterState.JUMP_UP_LIGHT_KICK, time)
                : this.changeState(FighterState.JUMP_MOVEMENT_LIGHT_KICK);
        } else if (control.isMediumKick(this.playerId)) {
            this.currentState === FighterState.JUMP_UP
                ? this.changeState(FighterState.JUMP_UP_MEDIUM_KICK, time)
                : this.changeState(FighterState.JUMP_MOVEMENT_MEDIUM_KICK);
        } else if (control.isHeavyKick(this.playerId)) {
            this.currentState === FighterState.JUMP_UP
                ? this.changeState(FighterState.JUMP_UP_HEAVY_KICK, time)
                : this.changeState(FighterState.JUMP_MOVEMENT_HEAVY_KICK);
        }
    }

    handleJumpStartState(time) {
        if (this.isAnimationCompleted()) {
            if (control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARD, time);
            } else if (control.isForward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD, time)
            } else {
                this.changeState(FighterState.JUMP_UP, time);
            }
        }
    }

    handleJumpLandState(time) {
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLE;

        if (!control.isIdle(this.playerId)) {
            this.direction = this.getDirections();

            this.handleIdleState();
        } else {
            const newDirection = this.getDirections();

            if (newDirection !== this.direction) {
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            } else {
                if (!this.isAnimationCompleted()) return;
            }
        }

        this.changeState(newState, time);
    }


    handleIdleState(time) {
        if (control.isUp(this.playerId)) {
            this.changeState(FighterState.JUMP_START, time);
        } else if (control.isDown(this.playerId)) {
            this.changeState(FighterState.CROUCH_DOWN, time);
        } else if (control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_BACKWARD, time);
        } else if (control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_FORWARD, time);
        } else if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH, time);
        } else if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH, time);
        } else if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH, time);
        } else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK, time);
        } else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK, time);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK, time);
        }

        const newDirection = this.getDirections();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN, time);
        }
    }

    handleWalkForwardState(time) {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START, time);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN, time);


        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH, time);
        } else if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH, time);
        } else if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH, time);
        } else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK, time);
        } else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK, time);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK, time);
        }

        this.direction = this.getDirections();
    }

    checkForBlockMechanics = () => BLOCK_STYLE === BlockStyle.ON_BACKWARD_ANY_PUNCH;

    handleWalkBackwardState(time) {
        if (!this.checkForBlockMechanics()
            && this.opponent.isInAttack
            && this.checkDistanceForBlock()) {
            this.changeState(FighterState.UPRIGHT_BLOCK, time);
        }

        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START, time);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN, time);


        if (control.isLightPunch(this.playerId)) {
            this.checkForBlockMechanics()
                ? this.changeState(FighterState.UPRIGHT_BLOCK, time)
                : this.changeState(FighterState.LIGHT_PUNCH, time);
        } else if (control.isMediumPunch(this.playerId)) {
            this.checkForBlockMechanics()
                ? this.changeState(FighterState.UPRIGHT_BLOCK, time)
                : this.changeState(FighterState.MEDIUM_PUNCH, time);
        } else if (control.isHeavyPunch(this.playerId)) {
            this.checkForBlockMechanics()
                ? this.changeState(FighterState.UPRIGHT_BLOCK, time)
                : this.changeState(FighterState.HEAVY_PUNCH, time);
        } else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK, time);
        } else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK, time);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK, time);
        }

        this.direction = this.getDirections();
    }


    handleCrouchState(time) {   
        if (this.opponent.isInAttack
            && this.checkDistanceForBlock()
            && control.isBackward(this.playerId, this.direction) ) {
            this.changeState(FighterState.CROUCH_BLOCK, time);
        }

        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_UP, time);

        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.CROUCH_LIGHT_PUNCH, time);
        } else if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.CROUCH_MEDIUM_PUNCH, time);
        } else if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.CROUCH_HEAVY_PUNCH, time);
        } else if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.CROUCH_LIGHT_KICK, time);
        } else if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.CROUCH_MEDIUM_KICK, time);
        } else if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.CROUCH_HEAVY_KICK, time);
        }

        const newDirection = this.getDirections();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN, time);
        }
    }


    handleIdleTurnState(time) {
        this.handleIdleState();

        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }


    handleCrouchTurnState(time) {
        this.handleCrouchState();

        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.CROUCH, time);
    }

    handleLightAttackReset() {
        this.animationFrame = 0;
        this.handleStandartAttackInit();
        this.attackStruck = false;
    }

    handleResteAttackState() {
        this.attackStruck = false;
        this.isInAttack = false;
    }

    handleLightPunchState(time) {
        if (this.animationFrame < 2) return;
        if (control.isLightPunch(this.playerId)) this.handleLightAttackReset();

        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.IDLE, time);
    }

    handleMediumPunchState(time) {
        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchLightPunchState(time) {
        if (this.animationFrame < 2) return;
        if (control.isLightPunch(this.playerId)) this.handleLightAttackReset();

        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.CROUCH, time);
    }

    handleCrouchMediumPunchState(time) {
        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.CROUCH, time);
    }

    handleJumpUpAllAttackState(time) {
        if (this.isAnimationCompleted()) {
            this.changeState(FighterState.JUMP_LAND, time);
            this.handleResteAttackState();
        } else {
            this.velocity.y += this.gravity * time.secondsPassed;

            if (this.position.y > STAGE_FLOOR) {
                this.position.y = STAGE_FLOOR;
                this.changeState(FighterState.JUMP_LAND, time);
                this.handleResteAttackState();
            }
        }
    }


    handleLightKickState(time) {
        if (this.animationFrame < 2) return;
        if (control.isLightKick(this.playerId)) this.handleLightAttackReset();

        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchLightKickState(time) {
        if (this.animationFrame < 2) return;
        if (control.isLightKick(this.playerId)) this.handleLightAttackReset();

        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.CROUCH, time);
    }

    handleMediumKickState(time) {
        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchMediumKickState(time) {
        if (!this.isAnimationCompleted()) return;
        this.handleResteAttackState();
        this.changeState(FighterState.CROUCH, time);
    }

    handleHurtState(time) {
        if (!this.isAnimationCompleted()) return;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.hurtBy = undefined;
        this.changeState(FighterState.IDLE, time);
    }

    handleCrouchHurtState(time) {
        if (!this.isAnimationCompleted()) return;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.hurtBy = undefined;
        this.changeState(FighterState.CROUCH, time);
    }

    compareHurtLocationkAndBlockStyle(hurtLocation) {
        switch (this.currentState) {
            case FighterState.UPRIGHT_BLOCK:
                if (hurtLocation === FighterHurtBox.HEAD || hurtLocation === FighterHurtBox.BODY) return true;
                return false;
            case FighterState.CROUCH_BLOCK:
                if (hurtLocation === FighterHurtBox.BODY || hurtLocation === FighterHurtBox.FEET) return true;
                return false;
            default:
                return false;
        }
    }

    handleAttackHit(time, attackStrength, attackType, hitPosition, hurtLocation, hurtBy) {
        console.log(`Attack strenth: ${attackStrength} / Attack type: ${attackType} /
            Hit Position: ${hitPosition} / Hurt location: ${hurtLocation} / Hurt By: ${hurtBy}`);

        const isHitBlocked = this.compareHurtLocationkAndBlockStyle(hurtLocation);

        // Check for new state - Blocked or Hit 
        const newState = isHitBlocked ? this.currentState : this.getHitState(attackStrength, hurtLocation);
        console.log(newState);

        const { velocity, friction } = FighterAttackBasaData[attackStrength].slide;

        this.hurtBy = hurtBy;
        this.slideVelocity = velocity;
        this.slideFriction = friction;
        this.attackStruck = true;

        playSound(this.soundHits[attackStrength][attackType]);
        this.onAttackHit(time, this.opponent.playerId, this.playerId, hitPosition, attackStrength, isHitBlocked, hurtBy);
        this.changeState(newState, time);
    }


    updateStageConstrains(time, context, camera) {
        if (this.position.x > camera.position.x + SCREEN_WIDTH - FIGHTER_DEFAULT_WIDTH) {
            this.position.x = camera.position.x + SCREEN_WIDTH - FIGHTER_DEFAULT_WIDTH;
            this.resetSlide(true);
        }

        if (this.position.x < camera.position.x + FIGHTER_DEFAULT_WIDTH) {
            this.position.x = camera.position.x + FIGHTER_DEFAULT_WIDTH;
            this.resetSlide(true);
        }

        if (this.hasCollidedWithOpponent()) {
            if (this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + FIGHTER_DEFAULT_WIDTH
                );

                if ([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD, FighterState.UPRIGHT_BLOCK
                ].includes(this.opponent.currentState)) {
                    this.opponent.position.x += FIGHTER_PUSH_FRICTION * time.secondsPassed;
                }
            }

            if (this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width)
                    + (this.boxes.push.width + this.boxes.push.x),
                    camera.position.x + SCREEN_WIDTH - FIGHTER_DEFAULT_WIDTH
                );

                if ([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD, FighterState.UPRIGHT_BLOCK
                ].includes(this.opponent.currentState)) {
                    this.opponent.position.x -= FIGHTER_PUSH_FRICTION * time.secondsPassed;
                }
            }
        }
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous <= this.animationTimer + frameDelay * FRAME_TIME) return;

        this.animationTimer = time.previous;

        if (frameDelay <= FrameDelay.FREEZE) return;

        this.animationFrame++;

        if (this.animationFrame >= animation.length) this.animationFrame = 0;

        this.boxes = this.getBoxes(animation[this.animationFrame][0]);
    }


    checkDistanceForBlock() {
        const box = getActualBoxDimensions(this.position, this.direction, this.boxes.push);

        const opponentBox = getActualBoxDimensions(this.opponent.position, this.opponent.direction, this.opponent.boxes.push);

        const distanceToOpponentHitBox = getDistanceToOpponet(box, opponentBox);

        return distanceToOpponentHitBox <= DANGER_DISTANCE_TO_OPPONENT;
    }


    updateHitBoxCollided(time) {
        const { attackStrength, attackType } = this.states[this.currentState];

        if (!attackType || this.attackStruck) return;

        // Check for frame without attack parameters. For skip unnecessary checks
        if (this.boxes.hit.x === 0 || this.boxes.hit.y === 0 || this.boxes.hit.width === 0 || this.boxes.hit.height === 0) return;

        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

        let possibleHurtBoxs = [];

        // Check for all hurt boxes on opponent
        Object.entries(this.opponent.boxes.hurt).forEach(([hurtLoacation, hurtBox]) => {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height },
            );

            // Check for success attack
            if (boxOverlap(actualHitBox, actualOpponentHurtBox)) {
                // Add succes attack to list
                possibleHurtBoxs.push({ hurtLoacation, actualOpponentHurtBox });
                // Stop free hit sount, for future succes attack
                stopSound(this.soundAttacks[attackStrength]);
            }
        });

        if (possibleHurtBoxs.length == 0) return;

        const onlyLocationName = possibleHurtBoxs.map((obj) => obj.hurtLoacation);

        const batteredBox = processHit(onlyLocationName, this.currentPosition, this.opponent.currentPosition);

        const targetBox = possibleHurtBoxs.find(obj => obj.hurtLoacation === batteredBox);

        const hitPosition = {
            x: (actualHitBox.x + (actualHitBox.width / 2) + targetBox.actualOpponentHurtBox.x + (targetBox.actualOpponentHurtBox.width / 2)) / 2,
            y: (actualHitBox.y + (actualHitBox.height / 2) + targetBox.actualOpponentHurtBox.y + (targetBox.actualOpponentHurtBox.height / 2)) / 2,
        };
        hitPosition.x -= 4 - Math.random() * 8;
        hitPosition.y -= 4 - Math.random() * 8;

        if (DEBUG_LOG_ENABLE) {
            console.log(`${gameState.fighters[this.playerId].id} position is ${this.currentPosition}.
                ${gameState.fighters[this.opponent.playerId].id} position is ${this.opponent.currentPosition}`);

            DEBUG_logHit(this, gameState, attackType, attackStrength, targetBox.hurtLoacation);
        }

        this.opponent.handleAttackHit(time, attackStrength, attackType, hitPosition, targetBox.hurtLoacation, FighterHurtBy.FIGHTER);
    }

    updateHurtShake(time, delay) {
        if (this.hurtShakeTimer === 0 || time.previous <= this.hurtShakeTimer) return;

        const shakeAmount = (delay - time.previous < (FIGHTER_HURT_DELAY * FRAME_TIME) / 2 ? 1 : 2);

        this.hurtShake = shakeAmount - this.hurtShake;
        this.hurtShakeTimer = time.previous + FRAME_TIME;
    }

    updateSlide(time) {
        if (this.slideVelocity >= 0) return;

        this.slideVelocity += this.slideFriction * time.secondsPassed;
        if (this.slideVelocity < 0) return;

        this.resetSlide();
    }

    updatePosition(time) {
        this.position.x += ((this.velocity.x + this.slideVelocity) * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;
    }

    updateSpecialMoves(time) {
        for (const specialMove of this.specialMoves) {
            const resultArgs = hasSpecialMoveBeenExecuted(specialMove, this.playerId, time);

            if (resultArgs) this.changeState(specialMove.state, time, resultArgs);
        }
    }


    update(time, context, camera) {
        this.states[this.currentState].update(time, context);
        this.updateSpecialMoves(time);
        this.updateSlide(time);
        this.updatePosition(time);
        this.updateAnimation(time);
        this.updateStageConstrains(time, context, camera);
        this.updateHitBoxCollided(time);
    }


    draw(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [[
            [frameX, frameY, frameWidth, frameHeight],
            [originX, originY],
        ]] = this.frames.get(frameKey);

        context.scale(this.direction, 1);

        context.drawImage(
            this.image,
            frameX, frameY,
            frameWidth, frameHeight,
            Math.floor((this.position.x - this.hurtShake - camera.position.x) * this.direction - originX),
            Math.floor(this.position.y - camera.position.y - originY),
            frameWidth, frameHeight
        );

        context.setTransform(1, 0, 0, 1, 0, 0);

        if (!DEBUG_BOX_ENABLE) return;

        DEBUG_drawCollisionInfoBoxes(this, context, camera);
    }
}