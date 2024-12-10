import Phaser from "phaser";
import { IntroScene } from "./scenes/IntroScene";
import { MinigameSelectorScene } from "./scenes/MinigameSelectorScene";
import { RussianBounceScene } from "./scenes/RussianBounceScene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: "game-container",
	scale: {
		mode: Phaser.Scale.RESIZE,
		width: "100%",
		height: "100%",
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	backgroundColor: "#000000",
	scene: [IntroScene, MinigameSelectorScene, RussianBounceScene],
	physics: {
		default: "arcade",
		arcade: {
			gravity: { x: 0, y: 0 },
			debug: false,
		},
	},
};

export class Game extends Phaser.Game {
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}
}
