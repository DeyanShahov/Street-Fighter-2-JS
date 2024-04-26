import { Fighter } from './Fighter.js';

export class Ryu extends Fighter {
    constructor(x, y, velosity) {
        super('Ryu', x, y, velosity);

        this.image = document.querySelector('img[alt="Ryu"]');
    }
}
