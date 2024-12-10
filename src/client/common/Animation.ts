import { Scene } from "phaser";
import { Listener } from "./interfaces";
import { BeatManager } from "./BeatManager";

export class Animation implements Listener {
	private scene: Scene;
	private sprite: Phaser.GameObjects.Sprite;
	private initialY: number;
	private isAnimating: boolean = false;
	private animationDuration: number = 200; // Duration in milliseconds
	private beatManager: BeatManager;
	private beatCount: number = 0;

	constructor(
		scene: Scene,
		x: number,
		y: number,
		texture: string,
		beatManager: BeatManager,
		scale: number = 1,
	) {
		this.scene = scene;
		this.sprite = scene.add.sprite(x, y, texture);
		this.initialY = y;
		this.sprite.setScale(scale);
		this.beatManager = beatManager;
	}

	notify(currentTime: number): void {
		// Only animate on every other beat
		if (this.beatCount % 2 === 0) {
			// Start animation half duration before the beat
			this.startAnimation(currentTime);
		}
		this.beatCount++;
	}

	private startAnimation(beatTime: number) {
		if (this.isAnimating) return;

		this.isAnimating = true;
		const startTime = beatTime - this.animationDuration / 2;

		// Create a tween for smooth up and down motion
		this.scene.tweens.add({
			targets: this.sprite,
			y: this.initialY - this.scene.game.canvas.height * 0.1,
			duration: this.animationDuration / 2,
			ease: "Sine.easeOut",
			yoyo: true,
			onComplete: () => {
				this.isAnimating = false;
			},
		});
	}

	getSprite(): Phaser.GameObjects.Sprite {
		return this.sprite;
	}

	reset(): void {
		this.beatCount = 0;
		this.isAnimating = false;
	}

	destroy() {
		this.sprite.destroy();
	}
}
