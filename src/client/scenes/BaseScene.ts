import { Scene } from "phaser";
import {
	GameAction,
	SceneConfig,
	InputListener,
	Listener,
} from "../common/interfaces";
import { InputManager } from "../common/InputManager";
import { SongClock } from "../common/SongClock";
import { SoundEffectPlayer } from "../common/SoundEffectPlayer";
import { BeatManager } from "../common/BeatManager";

export class BaseScene extends Scene implements InputListener, Listener {
	protected config: SceneConfig;
	protected songClock: SongClock;
	protected beatManager: BeatManager;
	protected inputManager: InputManager;
	protected isPaused: boolean = false;

	constructor(config: SceneConfig) {
		super({ key: config.key });
		this.config = config;
	}

	preload(): void {
		// Load scene-specific assets
		this.load.audio(
			this.config.songKey,
			`/public/songs/${this.config.songKey}`,
		);
		this.load.json(
			this.config.beatmapKey,
			`/public/beatmaps/${this.config.beatmapKey}`,
		);
		this.load.image(
			this.config.backgroundKey,
			`/public/backgrounds/${this.config.backgroundKey}`,
		);
		this.load.image("elephant", "/public/sprites/elephant.png");
	}

	create(): void {
		// Initialize managers after assets are loaded
		this.songClock = new SongClock(
			this,
			this.config.songKey,
			this.config.beatmapKey,
		);

		// Initialize beat manager with the beatmap data
		const beatmapData = this.cache.json.get(this.config.beatmapKey);
		this.beatManager = new BeatManager(beatmapData.beats);

		// Register beat manager as a listener to the song clock
		this.songClock.addListener(this.beatManager);

		this.inputManager = new InputManager(this);

		// Register this scene as a listener for input and time events
		this.inputManager.addListener(this);
		this.songClock.addListener(this);

		// Set up background
		this.add
			.image(0, 0, this.config.backgroundKey)
			.setOrigin(0, 0)
			.setDisplaySize(this.game.canvas.width, this.game.canvas.height);

		// Start the song clock
		this.songClock.play();
	}

	// InputListener implementation
	onActionStart(action: GameAction): void {
		if (!this.config.availableActions.includes(action)) return;

		if (action === GameAction.Pause) {
			this.togglePause();
			return;
		}

		// Scene-specific action handling should be implemented in derived classes
		this.handleAction(action);
	}

	onActionEnd(action: GameAction): void {
		// Implement if needed in derived classes
	}

	// TimeListener implementation
	notify(currentTime: number): void {
		this.handleTimeUpdate(currentTime);
	}

	protected handleAction(action: GameAction): void {
		// To be implemented by derived classes
	}

	protected handleTimeUpdate(currentTime: number): void {
		// To be implemented by derived classes
	}

	protected togglePause(): void {
		this.isPaused = !this.isPaused;
		if (this.isPaused) {
			this.sound.pauseAll();
			this.songClock.pause();
		} else {
			this.sound.resumeAll();
			this.songClock.resume();
		}
	}

	shutdown(): void {
		this.songClock.destroy();
		this.sound.stopAll();
		this.inputManager.removeListener(this);
		this.songClock.removeListener(this);
	}
}
