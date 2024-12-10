import Phaser from "phaser";
import { Listener } from "./interfaces";

export class SongClock {
	private audio: Phaser.Sound.BaseSound;
	private beatTimes: number[];
	private timeListeners: Listener[];
	private lastUpdateTime: number;
	private isPlaying: boolean;
	private scene: Phaser.Scene;
	private updateCallback: () => void;

	constructor(scene: Phaser.Scene, audioKey: string, beatmapFile: string) {
		this.scene = scene;
		this.audio = this.scene.sound.add(audioKey);
		this.timeListeners = [];
		this.isPlaying = false;
		this.lastUpdateTime = 0;

		// Setup update callback
		this.updateCallback = () => this.update();
		this.scene.events.on("update", this.updateCallback);

		// Load beatmap
		fetch(`/beatmaps/${beatmapFile}`)
			.then((response) => response.json())
			.then((data) => {
				this.beatTimes = data.beats;
			})
			.catch((error) => {
				console.error("Error loading beatmap:", error);
				this.beatTimes = [];
			});
	}

	addListener(listener: Listener) {
		this.timeListeners.push(listener);
	}

	removeListener(listener: Listener) {
		const index = this.timeListeners.indexOf(listener);
		if (index !== -1) {
			this.timeListeners.splice(index, 1);
		}
	}

	play(restart: boolean = false) {
		if (restart) {
			this.audio.stop();
		}
		this.audio.play();
		this.isPlaying = true;
		this.lastUpdateTime = this.audio.seek * 1000; // Convert to ms
	}

	pause() {
		this.audio.pause();
		this.isPlaying = false;
	}

	resume() {
		this.audio.resume();
		this.isPlaying = true;
	}

	private update() {
		if (!this.isPlaying) return;

		const currentTime = this.audio.seek * 1000; // Convert to ms

		// Notify listeners
		this.timeListeners.forEach((listener) => {
			listener.notify(currentTime);
		});

		this.lastUpdateTime = currentTime;
	}

	getCurrentTime(): number {
		return this.audio.seek * 1000; // Return time in ms
	}

	getBeatTimes(): number[] {
		return this.beatTimes;
	}

	destroy() {
		// Remove update listener
		this.scene.events.off("update", this.updateCallback);
		this.audio.destroy();
	}
}
