import { Control, GamepadThumbstick } from '../constants/control.js';

export const controls = [
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.UP]: 12,
            [Control.DOWN]: 13,
            [Control.LIGHT_PUNCH]: 2,
            [Control.MEDIUM_PUNCH]: 3,
            [Control.HEAVY_PUNCH]: 5,
            [Control.LIGHT_KICK]: 0,
            [Control.MEDIUM_KICK]: 1,
            [Control.HEAVY_KICK]: 4,
        },
        keyboard: {
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LIGHT_PUNCH]: 'KeyT',
            [Control.MEDIUM_PUNCH]: 'KeyY',
            [Control.HEAVY_PUNCH]: 'KeyU',
            [Control.LIGHT_KICK]: 'KeyG',
            [Control.MEDIUM_KICK]: 'KeyH',
            [Control.HEAVY_KICK]: 'KeyJ',
        },
    },
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: 0.5,
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: 0,
            [GamepadThumbstick.VERTICAL_AXE_ID]: 1,

            [Control.LEFT]: 14,
            [Control.RIGHT]: 15,
            [Control.UP]: 12,
            [Control.DOWN]: 13,
            [Control.LIGHT_PUNCH]: 2,
            [Control.MEDIUM_PUNCH]: 3,
            [Control.HEAVY_PUNCH]: 5,
            [Control.LIGHT_KICK]: 0,
            [Control.MEDIUM_KICK]: 1,
            [Control.HEAVY_KICK]: 4,
        },
        keyboard: {          
            [Control.LEFT]: 'ArrowLeft',
            [Control.RIGHT]: 'ArrowRight',
            [Control.UP]: 'ArrowUp',
            [Control.DOWN]: 'ArrowDown',
            [Control.LIGHT_PUNCH]: 'Numpad7',
            [Control.MEDIUM_PUNCH]: 'Numpad8',
            [Control.HEAVY_PUNCH]: 'Numpad9',
            [Control.LIGHT_KICK]: 'Numpad4',
            [Control.MEDIUM_KICK]: 'Numpad5',
            [Control.HEAVY_KICK]: 'Numpad6',
        },
    }
];