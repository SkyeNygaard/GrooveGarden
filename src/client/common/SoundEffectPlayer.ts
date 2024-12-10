import Phaser from "phaser";
import { Listener } from "./BeatManager";

export class SoundEffectPlayer implements Listener {
	private scene: Phaser.Scene;
	private soundKey: string;
	private volume: number;

	constructor(scene: Phaser.Scene, soundKey: string, volume: number = 1) {
		this.scene = scene;
		this.soundKey = soundKey;
		this.volume = volume;
	}

	notify(currentTime: number): void {
		this.scene.sound.play(this.soundKey, { volume: this.volume });
	}

	static preloadSound(scene: Phaser.Scene, key: string, file: string): void {
		scene.load.audio(key, file);
	}
}
