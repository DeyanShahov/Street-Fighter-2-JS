import { FighterState } from '../../constants/fighters.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, direction, playerId) {
        super('Ken', x, y, direction, playerId);

        this.image = document.querySelector('img[alt="Ken"]');

        this.frames = new Map([
            // Idle Stance
            ['idle-1', [[876, 528, 59, 90], [34, 86]]],
            ['idle-2', [[810, 529, 60, 89], [33, 87]]],
            ['idle-3', [[747, 526, 58, 92], [32, 89]]],
            ['idle-4', [[683, 523, 55, 93], [31, 90]]],

            // Move Forwards
            ['forwards-1', [[882, 745, 53, 83], [27, 81]]],
            ['forwards-2', [[874, 902, 60, 88], [35, 86]]],
            ['forwards-3', [[793, 901, 64, 89], [35, 87]]],
            ['forwards-4', [[721, 900, 63, 89], [29, 88]]],
            ['forwards-5', [[641, 901, 54, 89], [25, 87]]],
            ['forwards-6', [[576, 902, 50, 89], [25, 86]]],

            // Move Backwards
            ['backwards-1', [[875, 1000, 61, 87], [35, 85]]],
            ['backwards-2', [[810, 998, 59, 90], [36, 87]]],
            ['backwards-3', [[744, 997, 57, 90], [36, 88]]],
            ['backwards-4', [[678, 996, 58, 90], [38, 89]]],
            ['backwards-5', [[598, 997, 58, 91], [36, 88]]],
            ['backwards-6', [[534, 998, 57, 89], [36, 87]]],

            // Jump first/last frame
            ['jump-land', [[660, 1060, 55, 103], [29, 83]]],
           
            // Jump Up
            ['jump-up-1', [[876, 1207, 57, 105], [32, 107]]],
            ['jump-up-2', [[818, 1212, 51, 89], [25, 103]]],
            ['jump-up-3', [[747, 1213, 55, 78], [25, 103]]],
            ['jump-up-4', [[682, 1215, 48, 71], [28, 101]]],
            ['jump-up-5', [[623, 1211, 49, 86], [25, 103]]],
            ['jump-up-6', [[551, 1207, 56, 104], [32, 107]]],

            // Jump Forwards/Backwards
            ['jump-roll-1', [[874, 1094, 56, 104],[25, 106]]],
            ['jump-roll-2', [[809, 1089, 61, 78],[22, 90]]],
            ['jump-roll-3', [[699, 1101, 105, 43],[61, 76]]],
            ['jump-roll-4', [[635, 1089, 54, 83],[42, 111]]],
            ['jump-roll-5', [[503, 1090, 124, 45],[71, 81]]],
            ['jump-roll-6', [[420, 1102, 71, 88],[53, 98]]],
            ['jump-roll-7', [[551, 1207, 56, 104], [32, 107]]],

            // Crouch
            ['crouch-1', [[881, 745, 55, 84],[27, 81]]],
            ['crouch-2', [[803, 759, 57, 69],[25, 66]]],
            ['crouch-3', [[721, 767, 62, 61],[25, 58]]],

            // Stand Turn
            ['idle-turn-1', [[880, 636, 54, 95],[29, 92]]],
            ['idle-turn-2', [[814, 633, 58, 99],[30, 95]]],
            ['idle-turn-3', [[752, 638, 54, 94],[27, 90]]],

            // Crouch Turn
            ['crouch-turn-1', [[884, 832, 53, 61],[26, 58]]],
            ['crouch-turn-2', [[818, 832, 52, 61],[27, 58]]],
            ['crouch-turn-3', [[743, 832, 53, 61],[29, 58]]],
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 68], ['idle-2', 68], ['idle-3', 68], ['idle-4', 68], ['idle-3', 68], ['idle-2', 68]
            ],
            [FighterState.WALK_FORWARD]: [
                ['forwards-1', 65], ['forwards-2', 65], ['forwards-3', 65], ['forwards-4', 65], ['forwards-5', 65], ['forwards-6', 65]
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backwards-1', 65], ['backwards-2', 65], ['backwards-3', 65], ['backwards-4', 65], ['backwards-5', 65], ['backwards-6', 65]
            ],
            [FighterState.JUMP_START]: [
                ['jump-land', 50], ['jump-land', -2],
            ],
            [FighterState.JUMP_UP]: [
                ['jump-up-1', 180], ['jump-up-2', 100], ['jump-up-3', 100], ['jump-up-4', 100], ['jump-up-5', 100], ['jump-up-6', -1]
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jump-roll-1', 200], ['jump-roll-2', 50], ['jump-roll-3', 50], ['jump-roll-4', 50],
                ['jump-roll-5', 50], ['jump-roll-6', 50], ['jump-roll-7', 0]
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jump-roll-7', 200], ['jump-roll-6', 50], ['jump-roll-5', 50], ['jump-roll-4', 50],
                ['jump-roll-3', 50], ['jump-roll-2', 50], ['jump-roll-1', 0]
            ],
            [FighterState.JUMP_LAND]: [
                ['jump-land', 33], ['jump-land', 117],
                ['jump-land', -2], 
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', 0]
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 30], ['crouch-2', 30], ['crouch-3', 30], ['crouch-3', -2], 
            ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3', 30], ['crouch-2', 30], ['crouch-1', 30], ['crouch-1', -2], 
            ],
            [FighterState.IDLE_TURN]: [
                ['idle-turn-3', 33], ['idle-turn-2', 33],
                ['idle-turn-1', 33], ['idle-turn-1', -2],
            ],
            [FighterState.IDLE_TURN]: [
                ['crouch-turn-3', 33], ['crouch-turn-2', 33],
                ['crouch-turn-1', 33], ['crouch-turn-1', -2],
            ],
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 200,
                [FighterState.WALK_BACKWARD]: -150,
                [FighterState.JUMP_FORWARD]: 170,
                [FighterState.JUMP_BACKWARD]: -200, 
            },
            jump: -420,
        };

        this.gravity = 1000;
    }
}
