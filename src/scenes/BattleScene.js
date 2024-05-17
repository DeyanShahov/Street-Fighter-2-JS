import { FighterId } from '../constants/fighters.js';
import { STAGE_MID_POINT, STAGE_PADDING } from '../constants/stage.js';
import { Camera } from '../engine/Camera.js';
import { Ken } from '../entities/fighters/Ken.js';
import { Ryu } from '../entities/fighters/Ryu.js';
import { Shadow } from '../entities/fighters/Shadow.js';
import { FpsCounter } from '../entities/overlays/FpsCounter.js';
import { StatusBar } from '../entities/overlays/StatusBar.js';
import { KenStage } from '../entities/stage/KenStage.js';
import { gameState } from '../state/gameState.js';

export class BattleScene {
    fighters = [];
    camera = undefined;
    shadows = [];
    entities = [];

    constructor() {
        this.stage = new KenStage();
        
        this.fighters = this.getFighterEntities();
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - 192, 16, this.fighters);
        this.shadows = this.fighters.map(fighter => new Shadow(fighter));

        this.overlays = [
            new StatusBar(this.fighters),
            new FpsCounter(),
        ];
    }

    getFighterEntities() {
        const fighterEntities = gameState.fighters.map(this.getFighterEntity.bind(this));

        fighterEntities[0].opponent = fighterEntities[1];
        fighterEntities[1].opponent = fighterEntities[0];

        return fighterEntities;
    }

    getFighterEntity(fighterState, index) {
        const FighterEntityClass = this.getFighterEntityClass(fighterState.id);

        return new FighterEntityClass(index);
    }

    getFighterEntityClass(id) {
        switch (id) {
            case FighterId.RYU:
                return Ryu;
            case FighterId.KEN:
                return Ken;
            default:
                throw new Error('Unimplemented fighter entity request!');
        }
    }

    updateFighters(time, context) {
        for (const fighter of this.fighters) {
            fighter.update(time, context, this.camera);
        }
    }

    updateShadows(time, context) {
        for (const shadow of this.shadows) {
            shadow.update(time, context, this.camera);
        }
    }

    updateEntities(time, context) {
        for (const entity of this.entities) {
            entity.update(time, context, this.camera);
        }
    }

    updateOverlays(time, context) {
        for (const overlay of this.overlays) {
            overlay.update(time, context, this.camera);
        }
    }

    update(time, context) {
        this.updateFighters(time, context);
        this.updateShadows(time, context);
        this.stage.update(time);
        this.updateEntities(time, context);
        this.camera.update(time, context);
        this.updateOverlays(time, context);
    }


    drawFighters(context) {
        for (const fighter of this.fighters) {
            fighter.draw(context, this.camera);
        }
    }

    drawShadows(context) {
        for (const shadow of this.shadows) {
            shadow.draw(context, this.camera);
        }
    }

    drawEntities(context) {
        for (const entity of this.entities) {
            entity.draw(context, this.camera);
        }
    }

    drawOverlays(context) {
        for (const overlay of this.overlays) {
            overlay.draw(context, this.camera);
        }
    }

    draw(context) {
        this.stage.drawBackground(context, this.camera);
        this.drawFighters(context);
        this.drawShadows(context);
        this.drawEntities(context);
        this.stage.drawForeground(context, this.camera);
        this.drawOverlays(context);
    }
}