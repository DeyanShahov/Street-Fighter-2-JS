import { FighterCurrntPosition, FighterHurtBox, FighterHurtBoxWeight } from '../constants/fighters.js';

function calculate(box, multiplier) {
    return FighterHurtBoxWeight[box] * (multiplier || 1);
};

function calculateProbabilities(validBoxes, directionOfAttack, positionOfOpponent) {
    let totalWeight = 0;
    const probabilities = {};

    validBoxes.forEach(box => {
        // Check your`s position for FRONT
        if (directionOfAttack === FighterCurrntPosition.FRONT) {
            switch (positionOfOpponent) {
                // FRONT vs FRONT ( no bonus chance )
                case FighterCurrntPosition.FRONT:
                    probabilities[box] = calculate(box);
                    break;
                // FRONT vs TOP ( bonus chance to hit opponent feet )
                case FighterCurrntPosition.TOP:
                    probabilities[box] = calculate(box, box === FighterHurtBox.FEET ? 3 : 1);
                    break;
                // FRONT vs BOTTOM ( bonus chance to hit opponent head )
                case FighterCurrntPosition.BOTTOM:
                    probabilities[box] = calculate(box, box === FighterHurtBox.HEAD ? 8 : 1);
                    break;
            }
        // Check your`s position for TOP
        } else if (directionOfAttack === FighterCurrntPosition.TOP) {
            switch (positionOfOpponent) {
                // TOP vs FRONT ( bonus chance to hit opponent head )
                case FighterCurrntPosition.FRONT:
                    probabilities[box] = calculate(box, box === FighterHurtBox.HEAD ? 8 : 1);
                    break;
                // TOP vs TOP ( no bonus chance )
                case FighterCurrntPosition.TOP:
                    probabilities[box] = calculate(box);
                    break;
                // TOP vs BOTTOM ( strong bonus chance to hit opponent head )
                case FighterCurrntPosition.BOTTOM:
                    probabilities[box] = calculate(box, box === FighterHurtBox.HEAD ? 12 : 1);
                    break;
            }
        // Check your`s position for BOTTOM
        } else if (directionOfAttack === FighterCurrntPosition.BOTTOM) {
            switch (positionOfOpponent) {
                // BOTTOM vs FRONT ( bonus chance to hit opponent feet )
                case FighterCurrntPosition.FRONT:
                    probabilities[box] = calculate(box, box === FighterHurtBox.FEET ? 4 : 1);
                    break;
                // BOTTOM vs TOP ( bonus chance to hit opponent feet )
                case FighterCurrntPosition.TOP:
                    probabilities[box] = calculate(box, box === FighterHurtBox.FEET ? 8 : 1);
                    break;
                // BOTTOM vs BOTTOM ( bonus chance to hit opponent body )
                case FighterCurrntPosition.BOTTOM:
                    probabilities[box] = calculate(box, box === FighterHurtBox.BODY ? 3 : 1);
                    break;
            }
        }
       
        totalWeight += probabilities[box];
    });

    // Converting weights to probabilities
    for (const box in probabilities) {
        probabilities[box] /= totalWeight;
    }

    return probabilities;
};


// Box selection based on probabilities
function selectBox(probabilities) {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const box in probabilities) {
        cumulativeProbability += probabilities[box];
        if (random < cumulativeProbability) {
            return box;
        }
    }

    return null;
};

export function processHit(validBoxes, directionOfAttack, positionOfOpponent) {
    if (validBoxes.length === 1) {
        return validBoxes[0];
    }

    const probabilities = calculateProbabilities(validBoxes, directionOfAttack, positionOfOpponent);
    const box = selectBox(probabilities);
    return box;
};
