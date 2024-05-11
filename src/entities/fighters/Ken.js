import { FighterState, FrameDelay, PushBox } from '../../constants/fighters.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, direction, playerId) {
        super('Ken', x, y, direction, playerId);

        this.image = document.querySelector('img[alt="Ken"]');

        this.frames = new Map([
            // Idle Stance
            ['idle-1', [[[876, 528, 59, 90], [34, 86]], PushBox.IDLE]],
            ['idle-2', [[[810, 529, 60, 89], [33, 87]], PushBox.IDLE]],
            ['idle-3', [[[747, 526, 58, 92], [32, 89]], PushBox.IDLE]],
            ['idle-4', [[[683, 523, 55, 93], [31, 90]], PushBox.IDLE]],

            // Move Forwards
            ['forwards-1', [[[882, 745, 53, 83], [27, 81]], PushBox.IDLE]],
            ['forwards-2', [[[874, 902, 60, 88], [35, 86]], PushBox.IDLE]],
            ['forwards-3', [[[793, 901, 64, 89], [35, 87]], PushBox.IDLE]],
            ['forwards-4', [[[721, 900, 63, 89], [29, 88]], PushBox.IDLE]],
            ['forwards-5', [[[641, 901, 54, 89], [25, 87]], PushBox.IDLE]],
            ['forwards-6', [[[576, 902, 50, 89], [25, 86]], PushBox.IDLE]],

            // Move Backwards
            ['backwards-1', [[[875, 1000, 61, 87], [35, 85]], PushBox.IDLE]],
            ['backwards-2', [[[810, 998, 59, 90], [36, 87]], PushBox.IDLE]],
            ['backwards-3', [[[744, 997, 57, 90], [36, 88]], PushBox.IDLE]],
            ['backwards-4', [[[678, 996, 58, 90], [38, 89]], PushBox.IDLE]],
            ['backwards-5', [[[598, 997, 58, 91], [36, 88]], PushBox.IDLE]],
            ['backwards-6', [[[534, 998, 57, 89], [36, 87]], PushBox.IDLE]],

            // Jump first/last frame
            ['jump-land', [[[660, 1060, 55, 103], [29, 83]], PushBox.IDLE]],
           
            // Jump Up
            ['jump-up-1', [[[876, 1207, 57, 105], [32, 107]], PushBox.JUMP]],
            ['jump-up-2', [[[818, 1212, 51, 89], [25, 103]], PushBox.JUMP]],
            ['jump-up-3', [[[747, 1213, 55, 78], [25, 103]], PushBox.JUMP]],
            ['jump-up-4', [[[682, 1215, 48, 71], [28, 101]], PushBox.JUMP]],
            ['jump-up-5', [[[623, 1211, 49, 86], [25, 103]], PushBox.JUMP]],
            ['jump-up-6', [[[551, 1207, 56, 104], [32, 107]], PushBox.JUMP]],

            // Jump Forwards/Backwards
            ['jump-roll-1', [[[874, 1094, 56, 104],[25, 106]], PushBox.JUMP]], 
            ['jump-roll-2', [[[809, 1089, 61, 78],[22, 90]], PushBox.JUMP]],
            ['jump-roll-3', [[[699, 1101, 105, 43],[61, 76]], PushBox.JUMP]],
            ['jump-roll-4', [[[635, 1089, 54, 83],[42, 111]], PushBox.JUMP]],
            ['jump-roll-5', [[[503, 1090, 124, 45],[71, 81]], PushBox.JUMP]],
            ['jump-roll-6', [[[420, 1102, 71, 88],[53, 98]], PushBox.JUMP]],
            ['jump-roll-7', [[[551, 1207, 56, 104], [32, 107]], PushBox.JUMP]],

            // Crouch
            ['crouch-1', [[[881, 745, 55, 84],[27, 81]], PushBox.IDLE]],
            ['crouch-2', [[[803, 759, 57, 69],[25, 66]], PushBox.BEND]],
            ['crouch-3', [[[721, 767, 62, 61],[25, 58]], PushBox.CROUCH]],

            // Stand Turn
            ['idle-turn-1', [[[880, 636, 54, 95],[29, 92]], PushBox.IDLE]],
            ['idle-turn-2', [[[814, 633, 58, 99],[30, 95]], PushBox.IDLE]],
            ['idle-turn-3', [[[752, 638, 54, 94],[27, 90]], PushBox.IDLE]],

            // Crouch Turn
            ['crouch-turn-1', [[[884, 832, 53, 61],[26, 58]], PushBox.CROUCH]],
            ['crouch-turn-2', [[[818, 832, 52, 61],[27, 58]], PushBox.CROUCH]],
            ['crouch-turn-3', [[[743, 832, 53, 61],[29, 58]], PushBox.CROUCH]],
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 66], ['idle-2', 66], ['idle-3', 66],
                ['idle-4', 66], ['idle-3', 66], ['idle-2', 66],
            ],
            [FighterState.WALK_FORWARD]: [
                ['forwards-1', 49], ['forwards-2', 100], ['forwards-3', 66],
                ['forwards-4', 66], ['forwards-5', 66], ['forwards-6', 100],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backwards-1', 49], ['backwards-2', 100], ['backwards-3', 66],
                ['backwards-4', 66], ['backwards-5', 66], ['backwards-6', 100],
            ],
            [FighterState.JUMP_START]: [
                ['jump-land', 50], ['jump-land', FrameDelay.TRANSITION],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jump-roll-1', 232], ['jump-roll-2', 83], ['jump-roll-3', 50],
                ['jump-roll-4', 50], ['jump-roll-5', 50], ['jump-roll-6', 83],
                ['jump-roll-7', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_UP]: [
                ['jump-up-1', 149], ['jump-up-2', 133], ['jump-up-3', 133],
                ['jump-up-4', 133], ['jump-up-5', 133], ['jump-up-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jump-roll-7', 249], ['jump-roll-6', 50], ['jump-roll-5', 50],
                ['jump-roll-4', 50], ['jump-roll-3', 50], ['jump-roll-2', 50],
                ['jump-roll-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_LAND]: [
                ['jump-land', 33], ['jump-land', 117],
                ['jump-land', FrameDelay.TRANSITION], 
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 33], ['crouch-2', 33], ['crouch-3', 33],
                ['crouch-3', FrameDelay.TRANSITION], 
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', FrameDelay.FREEZE]
            ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3', 33], ['crouch-2', 33],
                ['crouch-1', 33], ['crouch-1', FrameDelay.TRANSITION], 
            ],
            [FighterState.IDLE_TURN]: [
                ['idle-turn-3', 33], ['idle-turn-2', 33],
                ['idle-turn-1', 33], ['idle-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['crouch-turn-3', 33], ['crouch-turn-2', 33],
                ['crouch-turn-1', 33], ['crouch-turn-1', FrameDelay.TRANSITION],
            ],
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 3 * 60,
                [FighterState.WALK_BACKWARD]: -(2 * 60),
                [FighterState.JUMP_FORWARD]: ((48 * 3) + (12 * 2)),
                [FighterState.JUMP_BACKWARD]: -((45 * 4) + (15 * 3)), 
            },
            jump: -420,
        };

        this.gravity = 1000;
    }
}
