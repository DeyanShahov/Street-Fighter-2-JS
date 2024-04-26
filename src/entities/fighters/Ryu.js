import { Fighter } from './Fighter.js';

export class Ryu extends Fighter {
    constructor(x, y, velosity) {
        super('Ryu', x, y, velosity);

        this.image = document.querySelector('img[alt="Ryu"]');

        this.frames = new Map([
            ['forwards-1', [9, 136, 53, 83]],
            ['forwards-2', [78, 131, 60, 89]],
            ['forwards-3', [152, 128, 64, 92]],
            ['forwards-4', [229, 130, 63, 90]],
            ['forwards-5', [307, 128, 54, 91]],
            ['forwards-6', [371, 128, 50, 89]]
        ]);
    }
}
