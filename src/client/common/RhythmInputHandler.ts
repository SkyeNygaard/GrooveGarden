import { GameAction } from "./interfaces";
import { SongClock } from "./SongClock";
import { BeatManager } from "./BeatManager";

export interface RhythmActionHandler {
    onPerfectHit(): void;
    onGoodHit(): void;
    onMiss(): void;
}

export class RhythmInputHandler {
    private readonly PERFECT_WINDOW = 50; // ms
    private readonly GOOD_WINDOW = 100; // ms
    private readonly MISS_WINDOW = 200; // ms

    constructor(
        private songClock: SongClock,
        private beatManager: BeatManager,
        private actionHandler: RhythmActionHandler
    ) {}

    handleInput(action: GameAction): number {
        const currentTime = this.songClock.getCurrentTime();
        const nearestBeatTime = this.beatManager.getNextBeatTime(currentTime);

        if (!nearestBeatTime) {
            return 0;
        }

        const timeDiff = Math.abs(currentTime - nearestBeatTime);
        
        if (timeDiff <= this.PERFECT_WINDOW) {
            this.actionHandler.onPerfectHit();
            return 100;
        } else if (timeDiff <= this.GOOD_WINDOW) {
            this.actionHandler.onGoodHit();
            return 50;
        } else if (timeDiff <= this.MISS_WINDOW) {
            this.actionHandler.onMiss();
            return 0;
        }

        return 0;
    }
}
