import { FighterId } from '../constants/fighters.js';
import { createDefaultFighterState } from './fighterState.js';

export const gameState = {
    fighters: [
        createDefaultFighterState(FighterId.RYU),
        createDefaultFighterState(FighterId.KEN),
    ],
}