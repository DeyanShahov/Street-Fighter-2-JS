import { FighterState } from '../../constants/fighters.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, velosity) {
        super('Ken', x, y, velosity);

        this.image = document.querySelector('img[alt="Ken"]');

        this.frames = new Map([
            // Idle Stance
            ['idle-1', [[876, 528, 59, 90], [34, 86]]],
            ['idle-2', [[810, 529, 60, 89], [33, 87]]],
            ['idle-3', [[747, 526, 58, 92], [32, 89]]],
            ['idle-4', [[683, 523, 55, 93], [31, 88]]],

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
        ]);

        this.animations = {
            [FighterState.IDLE]: ['idle-1', 'idle-2', 'idle-3', 'idle-4', 'idle-3', 'idle-2'],
            [FighterState.WALK_FORWARD]: ['forwards-1','forwards-2','forwards-3','forwards-4','forwards-5','forwards-6'],
            [FighterState.WALK_BACKWARD]: ['backwards-1','backwards-2','backwards-3','backwards-4','backwards-5','backwards-6'],
        }
    }
}
