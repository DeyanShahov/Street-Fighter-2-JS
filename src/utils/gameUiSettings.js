import { BlockStyle } from '../constants/fighters.js';


export let DEBUG_BOX_ENABLE = true;
export let DEBUG_LOG_ENABLE = true;
export let BLOCK_STYLE = undefined;

export function handleDebugBoxClick(checkbox) {
    DEBUG_BOX_ENABLE = checkbox.checked ? true : false;
}

export function handleDebugLogClick(checkbox) {
    DEBUG_LOG_ENABLE = checkbox.checked ? true : false;
}

export function handleBlockStyleClick(checkbox) {
    BLOCK_STYLE = checkbox.checked ? BlockStyle.ON_ATTACK_BACKWARD : BlockStyle.ON_BACKWARD_ANY_PUNCH;
}


