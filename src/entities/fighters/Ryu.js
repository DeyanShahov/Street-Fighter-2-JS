import { Control } from '../../constants/control.js';
import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY, SpecialMoveDirection, SpecialMoveButton } from '../../constants/fighters.js';
import { playSound } from '../../engine/soundHandler.js';
import { Fireball } from '../special/Fireball.js';
import { Fighter } from './Fighter.js';

export class Ryu extends Fighter {
    constructor(playerId, onAttackHit, entityList) {
        super(playerId, onAttackHit);

        this.image = document.querySelector('img[alt="Ryu"]');
        this.voiceHadouken = document.querySelector('audio#sound-ryu-voice-hadouken');

        this.gravity = 1000;

        this.fireball = { fired: false, strength: undefined };
        this.entityList = entityList;

        this.frames = new Map([
            // Idle Stance
            ['idle-1', [[[75, 14, 60, 89], [34, 86]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-2', [[[7, 14, 59, 90], [33, 87]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-3', [[[277, 11, 58, 92], [32, 89]], PushBox.IDLE, HurtBox.IDLE]],
            ['idle-4', [[[211, 10, 55, 93], [31, 90]], PushBox.IDLE, HurtBox.IDLE]],

            // Move Forwards
            ['forwards-1', [[[9, 136, 53, 83], [27, 81]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-2', [[[78, 131, 60, 89], [35, 86]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-3', [[[152, 128, 64, 92], [35, 89]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-4', [[[229, 130, 63, 90], [29, 89]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-5', [[[307, 128, 54, 91], [25, 89]], PushBox.IDLE, HurtBox.FORWARD]],
            ['forwards-6', [[[371, 128, 50, 89], [25, 86]], PushBox.IDLE, HurtBox.FORWARD]],

            // Move Backwards
            ['backwards-1', [[[777, 128, 61, 87], [35, 85]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-2', [[[430, 124, 59, 90], [36, 87]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-3', [[[495, 124, 57, 90], [36, 88]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-4', [[[559, 124, 58, 90], [38, 89]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-5', [[[631, 125, 58, 91], [36, 88]], PushBox.IDLE, HurtBox.BACKWARD]],
            ['backwards-6', [[[707, 126, 57, 89], [36, 87]], PushBox.IDLE, HurtBox.BACKWARD]],

            // Jump Up
            ['jump-up-1', [[[67, 244, 56, 104], [32, 107]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-2', [[[138, 233, 50, 89], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-3', [[[197, 233, 54, 77], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-4', [[[259, 240, 48, 70], [28, 101]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-5', [[[319, 234, 48, 89], [25, 106]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-6', [[[375, 244, 55, 109], [31, 113]], PushBox.JUMP, HurtBox.JUMP]],

            // Jump Forwards/Backwards
            ['jump-roll-1', [[[882, 261, 55, 109], [25, 106]], PushBox.JUMP, [[-11, -106, 24, 16], [-26, -90, 40, 42], [-26, -31, 40, 32]]]],
            ['jump-roll-2', [[[442, 261, 61, 78], [22, 90]], PushBox.JUMP, [[17, -90, 24, 14], [-14, -91, 40, 42], [-22, -66, 38, 18]]]],
            ['jump-roll-3', [[[507, 259, 104, 42], [61, 76]], PushBox.JUMP, [[22, -51, 24, 16], [-14, -81, 40, 42], [-22, -66, 38, 18]]]],
            ['jump-roll-4', [[[617, 240, 53, 82], [42, 111]], PushBox.JUMP, [[-39, -46, 24, 16], [-30, -88, 40, 42], [-34, -118, 44, 48]]]],
            ['jump-roll-5', [[[676, 257, 122, 44], [71, 81]], PushBox.JUMP, [[-72, -56, 24, 16], [-54, -77, 52, 40], [-14, -82, 48, 34]]]],
            ['jump-roll-6', [[[804, 258, 71, 87], [53, 98]], PushBox.JUMP, [[-55, -100, 24, 16], [-48, -87, 44, 38], [-22, -66, 38, 18]]]],
            //['jump-roll-7', [[[883, 261, 54, 109], [31, 113]], PushBox.JUMP]],

            // Jump first/last frame
            ['jump-land', [[[7, 268, 55, 85], [29, 83]], PushBox.IDLE, HurtBox.IDLE]],

            // Crouch
            ['crouch-1', [[[551, 21, 53, 83], [27, 81]], PushBox.IDLE, HurtBox.IDLE]],
            ['crouch-2', [[[611, 36, 57, 69], [25, 66]], PushBox.BEND, HurtBox.BEND]],
            ['crouch-3', [[[679, 44, 61, 61], [25, 58]], PushBox.CROUCH, HurtBox.CROUCH]],

            // Idle Turn
            ['idle-turn-1', [[[348, 8, 54, 95], [29, 92]], PushBox.IDLE, [[-10, -89, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],
            ['idle-turn-2', [[[414, 6, 58, 97], [30, 94]], PushBox.IDLE, [[-16, -96, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],
            ['idle-turn-3', [[[486, 10, 54, 94], [27, 90]], PushBox.IDLE, [[-16, -96, 28, 18], [-14, -74, 40, 42], [-14, -31, 40, 32]]]],

            // Crouch Turn
            ['crouch-turn-1', [[[751, 46, 53, 61], [26, 58]], PushBox.CROUCH, [[-7, -60, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],
            ['crouch-turn-2', [[[816, 46, 52, 61], [27, 58]], PushBox.CROUCH, [[-7, -60, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],
            ['crouch-turn-3', [[[878, 46, 53, 61], [29, 58]], PushBox.CROUCH, [[-26, -61, 24, 18], [-28, -46, 44, 24], [-28, -24, 44, 24]]]],

            // Light Punch
            ['light-punch-1', [[[9, 365, 64, 91], [32, 88]], PushBox.IDLE, HurtBox.IDLE]],
            ['light-punch-2', [[[98, 365, 92, 91], [32, 88]], PushBox.IDLE, HurtBox.IDLE, [11, -75, 50, 18]]],

            // Medium/Heavy Punch
            ['medium-punch-1', [[[6, 466, 60, 94], [29, 92]], PushBox.IDLE, HurtBox.IDLE]],
            ['medium-punch-2', [[[86, 465, 74, 95], [29, 92]], PushBox.IDLE, HurtBox.PUNCH]],
            ['medium-punch-3', [[[175, 465, 108, 94], [24, 92]], PushBox.IDLE, HurtBox.PUNCH, [17, -75, 68, 14]]],

            // Heavy Punch
            ['heavy-punch-1', [[[175, 465, 108, 94], [24, 92]], PushBox.IDLE, HurtBox.PUNCH, [17, -75, 70, 14]]],

            // Light/Medium Kick
            ['light-kick-1', [[[87, 923, 66, 92], [46, 93]], PushBox.IDLE, [[-33, -96, 30, 18], [-41, -79, 42, 38], [-32, -52, 44, 50]]]],
            ['light-kick-2', [[[162, 922, 114, 92], [68, 95]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]], [-19, -98, 66, 28]]],

            // Medium Kick
            ['medium-kick-1', [[[162, 922, 114, 92], [68, 95]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]], [-33, -98, 80, 28]]],

            // Hevy Kick
            ['heavy-kick-1', [[[5, 1196, 61, 90], [37, 87]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['heavy-kick-2', [[[72, 1192, 94, 94], [44, 91]], PushBox.IDLE, [[12, -90, 34, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [15, -99, 40, 32]]],
            ['heavy-kick-3', [[[176, 1191, 120, 94], [42, 91]], PushBox.IDLE, [[13, -91, 62, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [21, -97, 62, 24]]],
            ['heavy-kick-4', [[[306, 1208, 101, 77], [39, 74]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
            ['heavy-kick-5', [[[418, 1204, 64, 81], [38, 78]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],

            // Hit Face
            ['hit-face-1', [[[169, 2151, 62, 91], [47, 86]], PushBox.IDLE, [[-42, -88, 20, 20], [-46, -74, 40, 46], [-33, -37, 40, 38]]]],
            ['hit-face-2', [[[238, 2152, 68, 90], [53, 85]], PushBox.IDLE, [[-52, -87, 20, 20], [-53, -71, 40, 46], [-33, -37, 40, 38]]]],
            ['hit-face-3', [[[314, 2152, 72, 89], [56, 90]], PushBox.IDLE, [[-57, -88, 20, 20], [-53, -71, 40, 46], [-33, -37, 40, 38]]]],
            ['hit-face-4', [[[170, 2043, 67, 91], [41, 87]], PushBox.IDLE, [[-25, -89, 20, 20], [-33, -74, 40, 46], [-30, -37, 40, 38]]]],

            // Hit Stomach
            ['hit-stomach-1', [[[397, 2156, 58, 86], [37, 83]], PushBox.IDLE, [[-15, -85, 28, 18], [-31, -69, 42, 42], [-30, -34, 42, 34]]]],
            ['hit-stomach-2', [[[470, 2159, 68, 83], [41, 80]], PushBox.IDLE, [[-17, 82, 28, 18], [-33, -65, 38, 36], [-34, -34, 42, 34]]]],
            ['hit-stomach-3', [[[544, 2167, 68, 79], [40, 81]], PushBox.IDLE, [[-17, 82, 28, 18], [-41, -59, 38, 30], [-34, -34, 42, 34]]]],
            ['hit-stomach-4', [[[170, 2043, 67, 91], [35, 88]], PushBox.IDLE, [[-28, -67, 28, 18], [-41, -59, 38, 30], [-40, -34, 42, 34]]]],

            // Stunned
            ['stun-1', [[[7, 2046, 77, 88], [28, 85]], PushBox.IDLE, [[8, -87, 28, 18], [-16, -75, 40, 46], [-26, -31, 40, 32]]]],
            ['stun-2', [[[93, 2044, 65, 90], [28, 87]], PushBox.IDLE, [[-9, -89, 28, 18], [-23, -75, 40, 46], [-26, -31, 40, 32]]]],
            ['stun-3', [[[170, 2043, 67, 91], [35, 88]], PushBox.IDLE, [[-22, -91, 28, 18], [-30, -72, 42, 40], [-26, -31, 40, 32]]]],

            // Hadouken
            ['special-1', [[[17, 1417, 74, 90], [28, 89]], PushBox.IDLE, HurtBox.IDLE]],
            ['special-2', [[[112, 1423, 85, 84], [25, 83]], PushBox.IDLE, HurtBox.IDLE]],
            ['special-3', [[[210, 1424, 90, 84], [25, 81]], PushBox.IDLE, HurtBox.PUNCH]],
            ['special-4', [[[315, 1431, 106, 77], [23, 76]], PushBox.IDLE, [[38, -79, 26, 18], [21, -65, 40, 38], [-12, -30, 78, 30]]]],

            // Upright Block
            ['upright-block-1', [[[75, 14, 60, 89], [34, 86]], PushBox.IDLE, HurtBox.IDLE]],
            ['upright-block-2', [[[9, 365, 64, 91], [32, 88]], PushBox.IDLE, HurtBox.IDLE]],

            // Crouch Light Punch
            ['crouch-light-punch-1', [[[507, 398, 69, 61], [31, 59]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-light-punch-2', [[[590, 400, 95, 60], [31, 57]], PushBox.CROUCH, HurtBox.CROUCH, [13, -50, 51, 18]]],

            // Crouch Medium Punch
            ['crouch-medium-punch-1', [[[318, 586, 66, 62], [31, 59]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-medium-punch-2', [[[394, 585, 92, 63], [31, 60]], PushBox.CROUCH, HurtBox.CROUCH, [13, -50, 51, 18]]],
            ['crouch-medium-punch-3', [[[247, 584, 64, 61], [31, 59]], PushBox.CROUCH, HurtBox.CROUCH]],

            // Crouch Heavy Punch
            ['crouch-heavy-punch-1', [[[11, 834, 60, 72], [28, 69]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-heavy-punch-2', [[[83, 815, 73, 92], [28, 88]], PushBox.IDLE, HurtBox.IDLE]],
            ['crouch-heavy-punch-3', [[[167, 781, 57, 126], [28, 123]], PushBox.IDLE, HurtBox.IDLE, [11, -122, 18, 51]]],

            // Crouch Light Kick
            ['crouch-light-kick-1', [[[895, 953, 70, 64], [32, 62]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-light-kick-2', [[[977, 953, 112, 64], [32, 62]], PushBox.CROUCH, [[6, -61, 24, 18], [-16, -46, 44, 24], [-16, -24, 84, 24]], [13, -20, 60, 20]]],

            // Crouch Medium Kick
            ['crouch-medium-kick-1', [[[944, 1069, 70, 64], [32, 62]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-medium-kick-2', [[[1022, 1075, 97, 60], [14, 57]], PushBox.CROUCH, [[6, -61, 24, 18], [1, -46, 44, 24], [-16, -24, 44, 24]]]],
            ['crouch-medium-kick-3', [[[1135, 1083, 145, 53], [32, 51]], PushBox.CROUCH, [[6, -61, 24, 18], [-16, -46, 44, 24], [-16, -24, 114, 24]], [20, -22, 85, 18]]],

            // Crouch Heavy Kick
            ['crouch-heavy-kick-1', [[[1424, 1222, 53, 60], [22, 57]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-heavy-kick-2', [[[1486, 1224, 122, 58], [45, 56]], PushBox.CROUCH, [[6, -61, 24, 18], [-16, -46, 44, 24], [-16, -22, 84, 22]], [10, -18, 60, 18]]],
            ['crouch-heavy-kick-3', [[[1612, 1226, 62, 58], [30, 56]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['crouch-heavy-kick-4', [[[1682, 1224, 62, 60], [28, 58]], PushBox.CROUCH, HurtBox.CROUCH]],

            // Jump Up - Light, Medium and Heavy Punch
            ['jump-up-all-punch-1', [[[5, 571, 69, 78], [33, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['jump-up-all-punch-2', [[[148, 575, 89, 65], [33, 63]], PushBox.CROUCH, HurtBox.CROUCH, [13, -40, 40, 20]]],
            ['jump-up-all-punch-3', [[[87, 576, 52, 69], [33, 63]], PushBox.CROUCH, HurtBox.CROUCH]],

            // Jump Up - Light and Medium Kick
            //['jump-up-l-m-kick-1', [[[532, 1042, 55, 103], [27, 100]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-l-m-kick-1', [[[595, 1045, 77, 92], [32, 89]], PushBox.JUMP, HurtBox.JUMP, [5, -90, 35, 30]]],
            ['jump-up-l-m-kick-2', [[[1535, 2181, 54, 77], [28, 75]], PushBox.JUMP, HurtBox.JUMP]],

            // Jump Up - Heavy Kick
            ['jump-up-heavy-kick-1', [[[864, 1181, 53, 94], [23, 91]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-up-heavy-kick-2', [[[929, 1181, 94, 103], [25, 99]], PushBox.JUMP, HurtBox.JUMP, [3, -60, 60, 20]]],
            ['jump-up-heavy-kick-3', [[[1032, 1191, 58, 95], [21, 91]], PushBox.JUMP, HurtBox.JUMP]],

            // Jump Forward / Backward - Light
            ['jump-movement-light-punch-1', [[[353, 362, 52, 69], [28, 66]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['jump-movement-light-punch-2', [[[415, 365, 81, 71], [30, 69]], PushBox.CROUCH, HurtBox.CROUCH, [10, -40, 40, 15]]],

            // Jump Forward / Backward - Medium
            ['jump-movement-medium-punch-1', [[[666, 931, 59, 77], [32, 74]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-movement-medium-punch-2', [[[734, 930, 56, 74], [30, 71]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-movement-medium-punch-3', [[[801, 934, 77, 67], [38, 63]], PushBox.CROUCH, HurtBox.CROUCH, [10, -30, 30, 20]]],

            // Jump Forward / Backward - Heavy
            ['jump-movement-heavy-punch-1', [[[5, 571, 69, 78], [33, 75]], PushBox.CROUCH, HurtBox.CROUCH]],
            ['jump-movement-heavy-punch-2', [[[148, 575, 89, 65], [33, 63]], PushBox.CROUCH, HurtBox.CROUCH, [13, -40, 40, 20]]],
            ['jump-movement-heavy-punch-3', [[[87, 576, 52, 69], [33, 63]], PushBox.CROUCH, HurtBox.CROUCH]],

            // Jump Forward / Backward- Light, Medium and Heavy Kick
            ['jump-movement-all-kick-1', [[[752, 1052, 63, 73], [33, 70]], PushBox.JUMP, HurtBox.JUMP]],
            ['jump-movement-all-kick-2', [[[823, 1056, 109, 62], [32, 58]], PushBox.CROUCH, HurtBox.CROUCH, [13, -20, 60, 20]]],
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 4], ['idle-2', 4], ['idle-3', 4],
                ['idle-4', 4], ['idle-3', 4], ['idle-2', 4],
            ],
            [FighterState.WALK_FORWARD]: [
                ['forwards-1', 3], ['forwards-2', 6], ['forwards-3', 4],
                ['forwards-4', 4], ['forwards-5', 4], ['forwards-6', 6],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backwards-1', 3], ['backwards-2', 6], ['backwards-3', 4],
                ['backwards-4', 4], ['backwards-5', 4], ['backwards-6', 6],
            ],
            [FighterState.JUMP_START]: [
                ['jump-land', 3], ['jump-land', FrameDelay.TRANSITION],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jump-roll-1', 13], ['jump-roll-2', 5], ['jump-roll-3', 3],
                ['jump-roll-4', 3], ['jump-roll-5', 3], ['jump-roll-6', 5],
                ['jump-up-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_UP]: [
                ['jump-up-1', 8], ['jump-up-2', 8], ['jump-up-3', 8],
                ['jump-up-4', 8], ['jump-up-5', 8],
                ['jump-up-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jump-roll-6', 15], ['jump-roll-5', 3], ['jump-roll-4', 3],
                ['jump-roll-3', 3], ['jump-roll-2', 3],
                ['jump-roll-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_LAND]: [
                ['jump-land', 2], ['jump-land', 5],
                ['jump-land', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 2], ['crouch-2', 2], ['crouch-3', 2],
                ['crouch-3', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', FrameDelay.FREEZE]
            ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3', 2], ['crouch-2', 2],
                ['crouch-1', 2], ['crouch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.IDLE_TURN]: [
                ['idle-turn-3', 2], ['idle-turn-2', 2],
                ['idle-turn-1', 2], ['idle-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['crouch-turn-3', 33], ['crouch-turn-2', 33],
                ['crouch-turn-1', 33], ['crouch-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.LIGHT_PUNCH]: [
                ['light-punch-1', 2], ['light-punch-2', 4],
                ['light-punch-1', 4], ['light-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_PUNCH]: [
                ['medium-punch-1', 1], ['medium-punch-2', 2], ['medium-punch-3', 4],
                ['medium-punch-2', 3], ['medium-punch-1', 3],
                ['medium-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_PUNCH]: [
                ['medium-punch-1', 3], ['medium-punch-2', 2], ['heavy-punch-1', 6],
                ['medium-punch-2', 10], ['medium-punch-1', 12],
                ['medium-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.LIGHT_KICK]: [
                ['medium-punch-1', 3], ['light-kick-1', 3], ['light-kick-2', 8],
                ['light-kick-1', 4], ['medium-punch-1', 1],
                ['medium-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_KICK]: [
                ['medium-punch-1', 5], ['light-kick-1', 6], ['medium-kick-1', 12],
                ['light-kick-1', 7], ['light-kick-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_KICK]: [
                ['heavy-kick-1', 2], ['heavy-kick-2', 4], ['heavy-kick-3', 8],
                ['heavy-kick-4', 10], ['heavy-kick-5', 7],
                ['heavy-kick-5', FrameDelay.TRANSITION],
            ],
            // [FighterState.HIT_FACE_LIGHT]: [
            //     ['hit-face-1', 18], ['hit-face-2', FrameDelay.FREEZE],
            // ],
            // [FighterState.HIT_FACE_MEDIUM]: [
            //     ['hit-face-1', 18], ['hit-face-2', 4], ['hit-face-3', FrameDelay.FREEZE],
            // ],
            // [FighterState.HIT_FACE_HEAVY]: [
            //     ['hit-face-3', 18], ['hit-face-4', 7], ['stun-3', FrameDelay.FREEZE],
            // ],
            [FighterState.HURT_HEAD_LIGHT]: [
                ['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 3],
                ['hit-face-2', 8], ['hit-face-2', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_HEAD_MEDIUM]: [
                ['hit-face-1', FIGHTER_HURT_DELAY], ['hit-face-1', 3],
                ['hit-face-2', 4], ['hit-face-3', 9], ['hit-face-3', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_HEAD_HEAVY]: [
                ['hit-face-3', FIGHTER_HURT_DELAY], ['hit-face-3', 7],
                ['hit-face-4', 4], ['stun-3', 9], ['stun-3', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_BODY_LIGHT]: [
                ['hit-stomach-1', FIGHTER_HURT_DELAY], ['hit-stomach-1', 11],
                ['hit-stomach-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_BODY_MEDIUM]: [
                ['hit-stomach-1', FIGHTER_HURT_DELAY], ['hit-stomach-1', 7],
                ['hit-stomach-2', 9], ['hit-stomach-2', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_BODY_HEAVY]: [
                ['hit-stomach-2', FIGHTER_HURT_DELAY], ['hit-stomach-2', 3], ['hit-stomach-3', 4],
                ['hit-stomach-4', 4], ['stun-3', 9], ['stun-3', FrameDelay.TRANSITION],
            ],
            [FighterState.SPECIAL_1]: [
                ['special-1', 2], ['special-2', 8], ['special-3', 2], ['special-4', 40],
                ['special-4', FrameDelay.TRANSITION],
            ],
            [FighterState.UPRIGHT_BLOCK]: [
                ['upright-block-1', 3], ['upright-block-2', 3],
                ['upright-block-2', FrameDelay.FREEZE],
            ],
            [FighterState.CROUCH_LIGHT_PUNCH]: [
                ['crouch-light-punch-1', 4], ['crouch-light-punch-2', 4],
                ['crouch-light-punch-1', 6], ['crouch-light-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_MEDIUM_PUNCH]: [
                ['crouch-medium-punch-1', 4], ['crouch-medium-punch-2', 4],
                ['crouch-medium-punch-1', 4], ['crouch-medium-punch-3', 6], ['crouch-medium-punch-3', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_HEAVY_PUNCH]: [
                ['crouch-heavy-punch-1', 4], ['crouch-heavy-punch-2', 6],
                ['crouch-heavy-punch-3', 12], ['crouch-heavy-punch-2', 6], ['crouch-heavy-punch-1', 4],
                ['crouch-heavy-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_LIGHT_KICK]: [
                ['crouch-light-kick-1', 4], ['crouch-light-kick-2', 4],
                ['crouch-light-kick-1', 6], ['crouch-light-kick-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_MEDIUM_KICK]: [
                ['crouch-medium-kick-1', 2], ['crouch-medium-kick-2', 4],
                ['crouch-medium-kick-3', 6], ['crouch-medium-kick-2', 4],
                ['crouch-medium-kick-1', 2], ['crouch-medium-kick-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_HEAVY_KICK]: [
                ['crouch-heavy-kick-1', 6], ['crouch-heavy-kick-2', 12],
                ['crouch-heavy-kick-3', 6], ['crouch-heavy-kick-4', 4],
                ['crouch-turn-3', 4], ['crouch-turn-3', FrameDelay.TRANSITION],
            ],
            [FighterState.JUMP_UP_ALL_PUNCH]: [
                ['jump-up-all-punch-1', 4], ['jump-up-all-punch-2', 8], ['jump-up-all-punch-1', 6],
                ['jump-up-all-punch-3', 6], ['jump-up-all-punch-3', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_UP_LIGHT_KICK]: [
                ['jump-up-l-m-kick-1', 10], ['jump-up-l-m-kick-1', 6],
                ['jump-up-l-m-kick-2', 6], ['jump-up-l-m-kick-2', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_UP_MEDIUM_KICK]: [
                ['jump-up-l-m-kick-1', 6], ['jump-up-l-m-kick-1', 20],
                ['jump-up-l-m-kick-2', 12], ['jump-up-l-m-kick-2', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_UP_HEAVY_KICK]: [
                ['jump-up-heavy-kick-1', 8], ['jump-up-heavy-kick-1', 8],
                ['jump-up-heavy-kick-2', 12], ['jump-up-heavy-kick-3', 16],
                ['jump-up-heavy-kick-3', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_MOVEMENT_LIGHT_PUNCH]: [
                ['jump-movement-light-punch-1', 2], ['jump-movement-light-punch-2', 4],
                ['jump-movement-light-punch-1', 4], ['jump-movement-light-punch-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_MOVEMENT_MEDIUM_PUNCH]: [
                ['jump-movement-medium-punch-1', 2], ['jump-movement-medium-punch-2', 4], ['jump-movement-medium-punch-3', 12],
                ['jump-movement-medium-punch-2', 4], ['jump-movement-medium-punch-2', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_MOVEMENT_HEAVY_PUNCH]: [
                ['jump-movement-heavy-punch-1', 4], ['jump-movement-heavy-punch-2', 8], ['jump-movement-heavy-punch-1', 6],
                ['jump-movement-heavy-punch-3', 6], ['jump-movement-heavy-punch-3', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_MOVEMENT_LIGHT_KICK]: [
                ['jump-movement-all-kick-1', 4], ['jump-movement-all-kick-2', 12],
                ['jump-movement-all-kick-1', 8], ['jump-movement-all-kick-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_MOVEMENT_MEDIUM_KICK]: [
                ['jump-movement-all-kick-1', 4], ['jump-movement-all-kick-2', 12],
                ['jump-movement-all-kick-1', 8], ['jump-movement-all-kick-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_MOVEMENT_HEAVY_KICK]: [
                ['jump-movement-all-kick-1', 4], ['jump-movement-all-kick-2', 12],
                ['jump-movement-all-kick-1', 8], ['jump-movement-all-kick-1', FrameDelay.FREEZE],
            ],
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 3 * 60,
                [FighterState.WALK_BACKWARD]: -(2 * 60),
                [FighterState.JUMP_FORWARD]: ((48 * 3) + (12 * 2)),
                [FighterState.JUMP_BACKWARD]: -((45 * 4) + (15 * 3)),
            },
            jump: -420,
        };

        this.specialMoves = [
            {
                state: FighterState.SPECIAL_1,
                sequence: [
                    SpecialMoveDirection.DOWN, SpecialMoveDirection.FORWARD_DOWN,
                    SpecialMoveDirection.FORWARD, SpecialMoveButton.ANY_PUNCH
                ],
                cursor: 0,
            },
        ];


        this.states[FighterState.SPECIAL_1] = {
            init: this.handleHadoukenInit.bind(this),
            update: this.handleHadoukenState.bind(this),
            shadow: [1.6, 1, 22, 0],
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.IDLE_TURN,
                FighterState.CROUCH, FighterState.CROUCH_DOWN, FighterState.CROUCH_UP, FighterState.CROUCH_TURN,
            ],
        };

        this.states[FighterState.IDLE].validFrom.push(FighterState.SPECIAL_1);
    }

    handleHadoukenInit(_, strength) {
        this.resetVelocities();
        playSound(this.voiceHadouken);
        this.fireball = { fired: false, strength };
    }

    handleHadoukenState(time) {
        if (!this.fireball.fired && this.animationFrame === 3) {
            this.fireball.fired = true;
            this.entityList.add(Fireball, time, this, this.fireball.strength);
        }
        if (!this.isAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }
}
