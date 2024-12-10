import { BaseScene } from "./BaseScene";

export class RhythmMinigameScene extends BaseScene {
  protected currentScore: number = 0;
  
  // Maximum score for perfect timing
  protected readonly PERFECT_SCORE = 100;
  // Time window (in ms) for perfect timing
  protected readonly PERFECT_WINDOW = 50;
  // Time window (in ms) for good timing
  protected readonly GOOD_WINDOW = 100;
  
  protected calculateScore(inputTime: number, beatTime: number): number {
      const timeDiff = Math.abs(inputTime - beatTime);
      if (timeDiff <= this.PERFECT_WINDOW) {
          return this.PERFECT_SCORE;
      } else if (timeDiff <= this.GOOD_WINDOW) {
          return Math.floor(this.PERFECT_SCORE * 0.5);
      }
      return 0;
  }
  
}