import { GameAction, SceneConfig } from "../common/interfaces";
import { RhythmMinigameScene } from "./RhythmMinigameBaseScene";
import { Animation } from "../common/Animation";
import {
	RhythmInputHandler,
	RhythmActionHandler,
} from "../common/RhythmInputHandler";

export class RussianBounceScene
	extends RhythmMinigameScene
	implements RhythmActionHandler
{
	private leftDoll: Animation;
	private rightDoll: Animation;
	private playerDollTop: Phaser.GameObjects.Sprite;
	private playerDollTopSmall: Phaser.GameObjects.Sprite;
	private playerDollBottom: Phaser.GameObjects.Sprite;
	private isDollSeparated: boolean = false;
	private rhythmHandler: RhythmInputHandler;
	private dollScale = 0.4;

	constructor() {
		const config: SceneConfig = {
			key: "RussianBounceScene",
			songKey: "MatroshkaBounceEDM.mp3",
			beatmapKey: "MatroshkaBounceEDM.json",
			backgroundKey: "RussianScene.png",
			availableActions: [
				GameAction.Accept,
				GameAction.Back,
				GameAction.RhythmAction1,
			],
		};
		super(config);
	}

	preload(): void {
		super.preload();
		this.load.image("matryoshka", "public/sprites/MatroshkaDoll.png");
		this.load.image("matryoshka_top", "public/sprites/MatroshkaDollTop.png");
		this.load.image(
			"matryoshka_bottom",
			"public/sprites/MatroshkaDollBottom.png",
		);
	}

	create(): void {
		super.create();

		const { width, height } = this.game.canvas;
		// Create player-controlled doll in the middle
		const centerX = width * 0.5;
		// Calculate center positions based on bottom position
		const bottomHeight =
			this.textures.get("matryoshka_bottom").getSourceImage().height *
			this.dollScale;
		const topHeight =
			this.textures.get("matryoshka_top").getSourceImage().height *
			this.dollScale;
		const dollHeight =
			this.textures.get("matryoshka").getSourceImage().height * this.dollScale;
		const bottomY = height * 0.8;
		const dollCenterY = bottomY - dollHeight / 2;
		const bottomCenterY = bottomY - bottomHeight / 2;
		const topCenterY = bottomY - bottomHeight - topHeight / 2;
		const topSmallCenterY = bottomY - bottomHeight - topHeight / 4;

		// Create side dolls that bounce to the beat
		this.leftDoll = new Animation(
			this,
			width * 0.2,
			dollCenterY,
			"matryoshka",
			this.beatManager,
			this.dollScale,
		);
		this.rightDoll = new Animation(
			this,
			width * 0.8,
			dollCenterY,
			"matryoshka",
			this.beatManager,
			this.dollScale,
		);

		// Register dolls as beat listeners
		this.beatManager.addListener(this.leftDoll);
		this.beatManager.addListener(this.rightDoll);

		this.playerDollBottom = this.add
			.sprite(centerX, bottomCenterY, "matryoshka_bottom")
			.setScale(this.dollScale);

		this.playerDollTopSmall = this.add
			.sprite(centerX, topSmallCenterY, "matryoshka_top")
			.setScale(this.dollScale / 2);

		this.playerDollTop = this.add
			.sprite(centerX, topCenterY, "matryoshka_top")
			.setScale(this.dollScale);

		// Store initial position for return animation
		this.playerDollTop.setData("initialY", topCenterY);

		// Initialize rhythm handler
		this.rhythmHandler = new RhythmInputHandler(
			this.songClock,
			this.beatManager,
			this,
		);

		this.songClock.play();
	}

	protected handleAction(action: GameAction): void {
		if (action === GameAction.RhythmAction1) {
			const score = this.rhythmHandler.handleInput(action);
			if (score > 0 && !this.isDollSeparated) {
				this.currentScore += score;
			}
		}
	}

	// RhythmActionHandler implementation
	onPerfectHit(): void {
		this.separateDoll();
		// Add visual feedback for perfect hit
		this.createHitFeedback("PERFECT!", 0x00ff00);
	}

	onGoodHit(): void {
		this.separateDoll();
		// Add visual feedback for good hit
		this.createHitFeedback("GOOD!", 0xffff00);
	}

	onMiss(): void {
		// Add visual feedback for miss
		this.createHitFeedback("MISS!", 0xff0000);
	}

	private createHitFeedback(text: string, color: number): void {
		const feedback = this.add.text(
			this.playerDollTop.x,
			this.playerDollTop.y - 50,
			text,
			{
				fontSize: "32px",
				color: `#${color.toString(16).padStart(6, "0")}`,
			},
		);
		feedback.setOrigin(0.5);

		this.tweens.add({
			targets: feedback,
			y: feedback.y - 50,
			alpha: 0,
			duration: 1000,
			onComplete: () => feedback.destroy(),
		});
	}

	private separateDoll(): void {
		if (this.isDollSeparated) return;

		this.isDollSeparated = true;
		const initialY = this.playerDollTop.getData("initialY");

		// Animate the top part moving upward
		this.tweens.add({
			targets: this.playerDollTop,
			y: this.playerDollTop.y - 100,
			duration: 100,
			ease: "Cubic.easeOut",
			onComplete: () => {
				// Return animation
				this.tweens.add({
					targets: this.playerDollTop,
					y: initialY,
					duration: 100,
					ease: "Cubic.easeIn",
					onComplete: () => {
						this.isDollSeparated = false;
					},
				});
			},
		});
	}

	shutdown(): void {
		this.leftDoll.destroy();
		this.rightDoll.destroy();
		super.shutdown();
	}
}
