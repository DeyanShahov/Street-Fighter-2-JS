import { FRAME_TIME } from './game.js';

export const FIGHTER_PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;
export const FIGHTER_HURT_DELAY = 7 + 8;
export const FIGHTER_DEFAULT_WIDTH = 40;

export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

export const FighterId = {
    RYU: 'Ryu',
    KEN: 'Ken',
}

export const BlockStyle = {
    ON_ATTACK_BACKWARD: 'on-attack-backward',
    ON_BACKWARD_ANY_PUNCH: 'on-backward-any-punch',
}

// export const FighterCurrentStateType = {
//     ATTACK: 'attack',
//     DEFENCE: 'defence',
// };

export const FighterAttackType = {
    PUNCH: 'punch',
    KICK: 'kick',
};

export const FighterAttackStrength = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
};

export const FighterHurtBox = {
    HEAD: 'head',
    BODY: 'body',
    FEET: 'feet',
};

export const FighterHurtBoxWeight = {
    head: 2,
    body: 8,
    feet: 3
};

export const FighterCurrntPosition = {
    FRONT: 'front',
    TOP: 'top',
    BOTTOM: 'bottom',
};

export const FighterHurtBy = {
    FIGHTER: 'fighter',
    FIREBALL: 'fireball',
};


export const FighterAttackBasaData = {
    [FighterAttackStrength.LIGHT]: {
        score: 100,
        damage: 12,
        slide: {
            velocity: -12 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.MEDIUM]: {
        score: 300,
        damage: 20,
        slide: {
            velocity: -16 * FRAME_TIME,
            friction: 600,
        },
    },
    [FighterAttackStrength.HEAVY]: {
        score: 500,
        damage: 28,
        slide: {
            velocity: -22 * FRAME_TIME,
            friction: 800,
        },
    }
};

export const FighterState = {
    IDLE: 'idle',
    WALK_FORWARD: 'walk-forwards',
    WALK_BACKWARD: 'walk-backwards',
    JUMP_START: 'jump-start',
    JUMP_UP: 'jump-up',
    JUMP_FORWARD: 'jump-forwards',
    JUMP_BACKWARD: 'jump-backwards',
    JUMP_LAND: 'jump-land',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouch-down',
    CROUCH_UP: 'crouch-up',
    IDLE_TURN: 'idle-turn',
    CROUCH_TURN: 'crouch-turn',
    LIGHT_PUNCH: 'light-punch',
    MEDIUM_PUNCH: 'medium-punch',
    HEAVY_PUNCH: 'heavy-punch',
    LIGHT_KICK: 'light-kick',
    MEDIUM_KICK: 'medium-kick',
    HEAVY_KICK: 'heavy-kick',
    CROUCH_LIGHT_PUNCH: 'crouch-light-punch',
    CROUCH_MEDIUM_PUNCH: 'crouch-medium-punch',
    CROUCH_HEAVY_PUNCH: 'crouch-heavy-punch',
    CROUCH_LIGHT_KICK: 'crouch-light-kick',
    CROUCH_MEDIUM_KICK: 'crouch-medium-kick',
    CROUCH_HEAVY_KICK: 'crouch-heavy-kick',
    JUMP_UP_ALL_PUNCH: 'jump-up-all-punch',
    JUMP_UP_LIGHT_KICK: 'jump-up-light-kick',
    JUMP_UP_MEDIUM_KICK: 'jump-up-medium-kick',
    JUMP_UP_HEAVY_KICK: 'jump-up-heavy-kick',
    JUMP_MOVEMENT_LIGHT_PUNCH: 'jump-movement-light-punch',
    JUMP_MOVEMENT_MEDIUM_PUNCH: 'jump-movement-medium-punch',
    JUMP_MOVEMENT_HEAVY_PUNCH: 'jump-movement-heavy-punch',
    JUMP_MOVEMENT_LIGHT_KICK: 'jump-movement-light-kick',
    JUMP_MOVEMENT_MEDIUM_KICK: 'jump-movement-medium-kick',
    JUMP_MOVEMENT_HEAVY_KICK: 'jump-movement-heavy-kick',
    HURT_HEAD_LIGHT: 'hurt-head-light',
    HURT_HEAD_MEDIUM: 'hurt-head-medium',
    HURT_HEAD_HEAVY: 'hurt-head-heavy',
    HURT_BODY_LIGHT: 'hurt-body-light',
    HURT_BODY_MEDIUM: 'hurt-body-medium',
    HURT_BODY_HEAVY: 'hurt-body-heavy',
    HURT_CROUCH_LIGHT: 'hurt-crouch-light',
    HURT_CROUCH_MEDIUM: 'hurt-crouch-medium',
    HURT_CROUCH_HEAVY: 'hurt-crouch-heavy',
    SPECIAL_1: 'special-1',
    UPRIGHT_BLOCK: 'upright-block',
    CROUCH_BLOCK: 'crouch_block',
};

export const SpecialMoveDirection = {
    NONE: 'none',
    UP : 'up',
    DOWN: 'down',
    BACKWARD: 'backward',
    BACKWARD_UP: 'backward_up',
    BACKWARD_DOWN: 'backward_down',
    FORWARD: 'forward',
    FORWARD_UP: 'forward_up',
    FORWARD_DOWN: 'forward_down',
};

export const SpecialMoveButton = {
    ANY_PUNCH: 'any-punch',
    ANY_KICK: 'any-kick',
};

export const FrameDelay = {
    FREEZE: 0,
    TRANSITION: -1,
};

export const PushBox = {
    IDLE: [-16, -80, 32, 78],
    JUMP: [-16, -91, 32, 66],
    BEND: [-16, -58, 32, 58],
    CROUCH: [-16, -50, 32, 50],
};

export const HurtBox = {
    IDLE: [[-8, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]],
    BACKWARD: [[-19, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]],
    FORWARD: [[-3, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]],
    JUMP: [[-13, -106, 28, 18], [-26, -90, 40, 42], [-22, -66, 38, 18]],
    BEND: [[-2, -68, 24, 18], [-16, -53, 44, 24], [-16, -24, 44, 24]],
    CROUCH: [[6, -61, 24, 18], [-16, -46, 44, 24], [-16, -24, 44, 24]],
    PUNCH: [[11, -94, 24, 18], [-7, -77, 40, 43], [-7, -33, 40, 33]],
};

export const HurtStateValidForm = [
    FighterState.IDLE, FighterState.WALK_BACKWARD, FighterState.WALK_FORWARD,
    FighterState.JUMP_START, FighterState.JUMP_LAND, FighterState.IDLE_TURN, 
    FighterState.LIGHT_PUNCH, FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH,
    FighterState.LIGHT_KICK, FighterState.MEDIUM_KICK, FighterState.HEAVY_KICK, 
    FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY,
    FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY, 
    FighterState.SPECIAL_1, FighterState.UPRIGHT_BLOCK, FighterState.CROUCH_BLOCK, 
    FighterState.CROUCH_LIGHT_PUNCH, FighterState.CROUCH_MEDIUM_PUNCH, FighterState.CROUCH_HEAVY_PUNCH,
    FighterState.CROUCH_LIGHT_KICK, FighterState.CROUCH_MEDIUM_KICK, FighterState.CROUCH_HEAVY_KICK,
    FighterState.JUMP_UP_ALL_PUNCH, 
    FighterState.JUMP_UP_LIGHT_KICK, FighterState.JUMP_UP_MEDIUM_KICK, FighterState.JUMP_UP_HEAVY_KICK,
    FighterState.JUMP_MOVEMENT_LIGHT_PUNCH, FighterState.JUMP_MOVEMENT_MEDIUM_PUNCH, FighterState.JUMP_MOVEMENT_HEAVY_PUNCH,
    FighterState.JUMP_MOVEMENT_LIGHT_KICK, FighterState.JUMP_MOVEMENT_MEDIUM_KICK, FighterState.JUMP_MOVEMENT_HEAVY_KICK,
];