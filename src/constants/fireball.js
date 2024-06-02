import { Control } from './control.js'

export const fireballVelocity = {
    [Control.LIGHT_PUNCH]: 150,
    [Control.MEDIUM_PUNCH]: 220,
    [Control.HEAVY_PUNCH]: 300,
};

export const FireballState = {
    ACTIVE: 'active',
    COLLIDED: 'collided',
};

export const FireballCollidedState = {
    NONE: 'none',
    OPPONENT: 'opponent',
    FIREBALL: 'fireball',
};

export const FireballBlockReduction = 0.1;