import { FighterState, FrameDelay, HurtBox, PushBox } from '../../constants/fighters.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(playerId) {
        super('Ken', playerId);

        this.image = document.querySelector('img[alt="Ken"]');

        this.frames = new Map([
            // Idle Stance
            ['idle-1', [[[876, 528, 59, 90], [34, 86]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-2', [[[810, 529, 60, 89], [33, 87]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-3', [[[747, 526, 58, 92], [32, 89]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-4', [[[683, 523, 55, 93], [31, 90]], PushBox.IDLE, HurtBox.IDLE]],

            // Move Forwards
            ['forwards-1', [[[882, 745, 53, 83], [27, 81]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-2', [[[874, 902, 60, 88], [35, 86]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-3', [[[793, 901, 64, 89], [35, 87]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-4', [[[721, 900, 63, 89], [29, 88]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-5', [[[641, 901, 54, 89], [25, 87]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-6', [[[576, 902, 50, 89], [25, 86]], PushBox.IDLE, HurtBox.FORWARD]],

            // Move Backwards
            ['backwards-1', [[[875, 1000, 61, 87], [35, 85]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-2', [[[810, 998, 59, 90], [36, 87]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-3', [[[744, 997, 57, 90], [36, 88]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-4', [[[678, 996, 58, 90], [38, 89]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-5', [[[598, 997, 58, 91], [36, 88]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-6', [[[534, 998, 57, 89], [36, 87]], PushBox.IDLE, HurtBox.BACKWARD]],

            // Jump first/last frame
            ['jump-land', [[[880, 1325, 55, 85], [29, 83]], PushBox.IDLE, HurtBox.IDLE]],
           
            // Jump Up
            ['jump-up-1', [[[876, 1207, 57, 105], [32, 107]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-2', [[[818, 1212, 51, 89], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-3', [[[747, 1213, 55, 78], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-4', [[[682, 1215, 48, 71], [28, 101]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-5', [[[623, 1211, 49, 86], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-6', [[[551, 1207, 56, 104], [32, 107]], PushBox.JUMP, HurtBox.JUMP]],

            // Jump Forwards/Backwards
            ['jump-roll-1', [[[874, 1094, 56, 104],[25, 106]], PushBox.JUMP, [[-11, -106, 24, 16], [-26, -90, 40, 42], [-26, -31, 40, 32]]]], 
            ['jump-roll-2', [[[809, 1089, 61, 78],[22, 90]], PushBox.JUMP, [[17, -90, 24, 14], [-14, -91, 40, 42], [-22, -66, 38, 18]]]],
            ['jump-roll-3', [[[699, 1101, 105, 43],[61, 76]], PushBox.JUMP, [[22, -51, 24, 16], [-14, -81, 40, 42], [-22, -66, 38, 18]]]],
            ['jump-roll-4', [[[635, 1089, 54, 83],[42, 111]], PushBox.JUMP, [[-39, -46, 24, 16], [-30, -88, 40, 42], [-34, -118, 44, 48]]]],
            ['jump-roll-5', [[[503, 1090, 124, 45],[71, 81]], PushBox.JUMP, [[-72, -56, 24, 16], [-54, -77, 52, 40], [-14, -82, 48, 34]]]],
            ['jump-roll-6', [[[420, 1102, 71, 88],[53, 98]], PushBox.JUMP, [[-55, -100, 24, 16], [-48, -87, 44, 38], [-22, -66, 38, 18]]]],
            //['jump-roll-7', [[[551, 1207, 56, 104], [32, 107]], PushBox.JUMP, [[], [], []]]],

            // Crouch
            ['crouch-1', [[[881, 745, 55, 84],[27, 81]], PushBox.IDLE, HurtBox.IDLE]],
            ['crouch-2', [[[803, 759, 57, 69],[25, 66]], PushBox.BEND, HurtBox.BEND]],
            ['crouch-3', [[[721, 767, 62, 61],[25, 58]], PushBox.CROUCH, HurtBox.CROUCH]],

            // Idle Turn
            ['idle-turn-1', [[[880, 636, 54, 95],[29, 92]], PushBox.IDLE, [[-10, -89, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],
            ['idle-turn-2', [[[814, 633, 58, 99],[30, 95]], PushBox.IDLE, [[-16, -96, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],
            ['idle-turn-3', [[[752, 638, 54, 94],[27, 90]], PushBox.IDLE, [[-16, -96, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],

            // Crouch Turn
            ['crouch-turn-1', [[[884, 832, 53, 61],[26, 58]], PushBox.CROUCH, [[-7, -60, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],
            ['crouch-turn-2', [[[818, 832, 52, 61],[27, 58]], PushBox.CROUCH, [[-7, -60, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],
            ['crouch-turn-3', [[[743, 832, 53, 61],[29, 58]], PushBox.CROUCH, [[-26, -61, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],

            // Light Punch
            ['light-punch-1', [[[862, 1416, 64, 91],[32, 88]], PushBox.IDLE, HurtBox.IDLE]],
            ['light-punch-2', [[[749, 1416, 92, 91],[32, 88]], PushBox.IDLE, HurtBox.IDLE, [11, -85, 50, 18]]],

            // Medium/Heavy Punch
            ['medium-punch-1', [[[865, 1510, 60, 94],[28, 91]], PushBox.IDLE, HurtBox.IDLE]],
            ['medium-punch-2', [[[782, 1509, 74, 95],[29, 92]], PushBox.IDLE, HurtBox.PUNCH]],
            ['medium-punch-3', [[[657, 1509, 108, 94],[24, 92]], PushBox.IDLE, HurtBox.PUNCH, [17, -85, 68, 14]]],

            // Heavy Punch
            ['heavy-punch-1', [[[657, 1509, 108, 94],[24, 92]], PushBox.IDLE, HurtBox.PUNCH, [17, -85, 76, 14]]],

            // Light/Medium Kick
            ['light-kick-1', [[[863, 2384, 66, 92],[35, 92]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['light-kick-2', [[[729, 2387, 114, 92],[58, 92]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]], [-8, -98, 66, 28]]],

            // Medium Kick
            ['medium-kick-1', [[[729, 2387, 114, 92], [58, 92]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]], [-21, -98, 80, 28]]],

            // Hevy Kick
            ['heavy-kick-1', [[[870, 2484, 61, 90], [37, 87]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['heavy-kick-2', [[[750, 2480, 95, 94], [44, 91]], PushBox.IDLE, [[12, -90, 34, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [15, -99, 40, 32]]],
            ['heavy-kick-3', [[[623, 2480, 120, 94], [42, 91]], PushBox.IDLE, [[13, -91, 62, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [21, -97, 62, 24]]],
            ['heavy-kick-4', [[[513, 2497, 101, 77], [39, 74]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['heavy-kick-5', [[[437, 2493, 64, 81], [38, 78]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 4], ['idle-2', 4], ['idle-3', 4],
                ['idle-4', 4], ['idle-3', 4], ['idle-2', 4],
            ],
            [FighterState.WALK_FORWARD]: [
                ['forwards-1', 3], ['forwards-2', 6], ['forwards-3', 4],
                ['forwards-4', 4], ['forwards-5', 4], ['forwards-6', 6],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backwards-1', 3], ['backwards-2', 6], ['backwards-3', 4],
                ['backwards-4', 4], ['backwards-5', 4], ['backwards-6', 6],
            ],
            [FighterState.JUMP_START]: [
                ['jump-land', 3], ['jump-land', FrameDelay.TRANSITION],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jump-roll-1', 13], ['jump-roll-2', 5], ['jump-roll-3', 3],
                ['jump-roll-4', 3], ['jump-roll-5', 3], ['jump-roll-6', 5],
                ['jump-up-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_UP]: [
                ['jump-up-1', 8], ['jump-up-2', 8], ['jump-up-3', 8],
                ['jump-up-4', 8], ['jump-up-5', 8], ['jump-up-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jump-roll-6', 15], ['jump-roll-6', 3], ['jump-roll-5', 3],
                ['jump-roll-4', 3], ['jump-roll-3', 3], ['jump-roll-2', 3],
                ['jump-roll-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_LAND]: [
                ['jump-land', 2], ['jump-land', 5],
                ['jump-land', FrameDelay.TRANSITION], 
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 2], ['crouch-2', 2], ['crouch-3', 2],
                ['crouch-3', FrameDelay.TRANSITION], 
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', FrameDelay.FREEZE]
            ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3', 2], ['crouch-2', 2],
                ['crouch-1', 2], ['crouch-1', FrameDelay.TRANSITION], 
            ],
            [FighterState.IDLE_TURN]: [
                ['idle-turn-3', 2], ['idle-turn-2', 2],
                ['idle-turn-1', 2], ['idle-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['crouch-turn-3', 2], ['crouch-turn-2', 2],
                ['crouch-turn-1', 2], ['crouch-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.LIGHT_PUNCH]: [
                ['light-punch-1', 2], ['light-punch-2', 4],
                ['light-punch-1', 4], ['light-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_PUNCH]: [
                ['medium-punch-1', 1], ['medium-punch-2', 2], ['medium-punch-3', 4],
                ['medium-punch-2', 3], ['medium-punch-1', 3],
                ['medium-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_PUNCH]: [
                ['medium-punch-1', 3], ['medium-punch-2', 2], ['heavy-punch-1', 6],
                ['medium-punch-2', 10], ['medium-punch-1', 12],
                ['medium-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.LIGHT_KICK]: [
                ['medium-punch-1', 3], ['light-kick-1', 3], ['light-kick-2', 8],
                ['light-kick-1', 4], ['medium-punch-1', 1],
                ['medium-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_KICK]: [
                ['medium-punch-1', 5], ['light-kick-1', 6], ['medium-kick-1', 12],
                ['light-kick-1', 7], ['light-kick-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_KICK]: [
                ['heavy-kick-1', 2], ['heavy-kick-2', 4], ['heavy-kick-3', 8],
                ['heavy-kick-4', 10], ['heavy-kick-5', 7],
                ['heavy-kick-5', FrameDelay.TRANSITION],
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
