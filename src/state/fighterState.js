import { HEALTH_MAX_HIT_POINTS } from '../constants/battle.js';

export const createDefaultFighterState = (id) => ({
    id,
    score: 13,
    battles: 0,
    hitPoints: 35//HEALTH_MAX_HIT_POINTS,
});