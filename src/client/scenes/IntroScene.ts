import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";
import { Animation } from "../common/Animation";
import { GameAction, SceneConfig } from "../common/interfaces";

export class IntroScene extends BaseScene {
	private leftElephant: Animation;
	private rightElephant: Animation;

	constructor() {
		const config: SceneConfig = {
			key: "IntroScene",
			songKey: "GrooveGarden.mp3",
			beatmapKey: "GrooveGarden.json",
			backgroundKey: "gardenWide.png",
			availableActions: [GameAction.Accept, GameAction.Back],
		};
		super(config);
	}

	create(): void {
		// Call parent create to set up background and base functionality
		super.create();

		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		// Create two elephants at 1/4 and 3/4 of the screen width
		this.leftElephant = new Animation(
			this,
			width * 0.25, // 1/4 of screen width
			height * 0.5, // middle of screen height
			"elephant",
		);
		this.leftElephant.sprite.setScale(0.4); // Scale down to 40%

		this.rightElephant = new Animation(
			this,
			width * 0.75, // 3/4 of screen width
			height * 0.5, // middle of screen height
			"elephant",
		);
		this.rightElephant.sprite.setScale(0.4); // Scale down to 40%

		// Add both elephants as listeners to the beat manager
		this.beatManager.addListener(this.leftElephant);
		this.beatManager.addListener(this.rightElephant);

		// Start the song
		this.songClock.play();
	}

	handleAction(action: GameAction): void {
		switch (action) {
			case GameAction.Accept:
				this.scene.start("MinigameSelectorScene");
				this.shutdown();
				break;
		}
	}

	shutdown(): void {
		// Clean up our additional listeners before calling parent shutdown
		this.beatManager.removeListener(this.leftElephant);
		this.beatManager.removeListener(this.rightElephant);
		super.shutdown();
	}
}
