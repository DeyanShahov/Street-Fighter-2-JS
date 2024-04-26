import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, velosity) {
        super('Ken', x, y, velosity);

        this.image = document.querySelector('img[alt="Ken"]');

        this.frames = new Map([
            ['forwards-1', [882, 745, 53, 83]],
            ['forwards-2', [874, 902, 60, 88]],
            ['forwards-3', [793, 901, 64, 89]],
            ['forwards-4', [721, 900, 63, 89]],
            ['forwards-5', [641, 901, 54, 89]],
            ['forwards-6', [576, 902, 50, 89]]
        ]);
    }
}
