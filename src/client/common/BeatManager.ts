import { Listener } from "./interfaces";

export class BeatManager implements Listener {
	private beatTimes: number[];
	private listeners: Set<Listener>;
	private tolerance: number;
	private currentBeatIndex: number;

	constructor(beatTimes: number[], tolerance: number = 50) {
		this.beatTimes = beatTimes;
		this.listeners = new Set();
		this.tolerance = tolerance;
		this.currentBeatIndex = 0;
	}

	addListener(listener: Listener): void {
		this.listeners.add(listener);
	}

	removeListener(listener: Listener): void {
		this.listeners.delete(listener);
	}

	reset(): void {
		this.currentBeatIndex = 0;
	}

	notify(currentTime: number): void {
		// Check if we've hit the next beat
		while (this.currentBeatIndex < this.beatTimes.length) {
			const beatTime = this.beatTimes[this.currentBeatIndex];

			// If we're within tolerance of the beat time
			if (Math.abs(currentTime - beatTime) <= this.tolerance) {
				// Notify all listeners
				this.listeners.forEach((listener) => {
					listener.notify(beatTime);
				});
				this.currentBeatIndex++;
			}
			// If we haven't reached this beat yet, stop checking
			else if (currentTime < beatTime - this.tolerance) {
				break;
			}
			// If we've passed this beat, move to the next one
			else if (currentTime > beatTime + this.tolerance) {
				this.currentBeatIndex++;
			}
		}
	}

	/**
	 * Get the next beat time from the current time
	 */
	getNextBeatTime(currentTime: number): number | null {
		const nextBeat = this.beatTimes.find((time) => time > currentTime);
		return nextBeat ?? null;
	}

	/**
	 * Get the time until the next beat
	 */
	getTimeToNextBeat(currentTime: number): number | null {
		const nextBeatTime = this.getNextBeatTime(currentTime);
		return nextBeatTime !== null ? nextBeatTime - currentTime : null;
	}
}
