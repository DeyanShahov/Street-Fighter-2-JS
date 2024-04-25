import { Fighter } from './fighter.js';

export class Ken extends Fighter {
    constructor(x, y, velosity) {
        super('Ken', x, y, velosity);

        this.image = document.querySelector('img[alt="Ken"]');
    }
}
