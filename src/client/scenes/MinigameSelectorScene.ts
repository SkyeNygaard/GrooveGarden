import { Scene } from "phaser";
import { BaseScene } from "./BaseScene";
import { GameAction, SceneConfig } from "../common/interfaces";

interface GridSquare {
	sprite: Phaser.GameObjects.Rectangle;
	x: number;
	y: number;
}

export class MinigameSelectorScene extends BaseScene {
	private squares: GridSquare[][] = [];
	private selectedX: number = 0;
	private selectedY: number = 0;
	private readonly GRID_SIZE = 4;
	private readonly SQUARE_SIZE = 100;
	private readonly SQUARE_SPACING = 20;
	private readonly MINIGAME_SCENES = [
		["RussianBounceScene", null],
		[null, null],
	];

	constructor() {
		const config: SceneConfig = {
			key: "MinigameSelectorScene",
			songKey: "SceneSelector.mp3", // Reusing the same song for now
			beatmapKey: "SceneSelector.json",
			backgroundKey: "sceneSelect.png",
			availableActions: [
				GameAction.Left,
				GameAction.Right,
				GameAction.Up,
				GameAction.Down,
				GameAction.Accept,
				GameAction.Back,
			],
		};
		super(config);
	}

	create(): void {
		super.create();

		// Calculate grid position to center it
		const startX =
			(this.game.canvas.width -
				this.GRID_SIZE * (this.SQUARE_SIZE + this.SQUARE_SPACING)) /
			2;
		const startY =
			(this.game.canvas.height -
				this.GRID_SIZE * (this.SQUARE_SIZE + this.SQUARE_SPACING)) /
			2;

		// Create the 4x4 grid
		for (let y = 0; y < this.GRID_SIZE; y++) {
			this.squares[y] = [];
			for (let x = 0; x < this.GRID_SIZE; x++) {
				const posX = startX + x * (this.SQUARE_SIZE + this.SQUARE_SPACING);
				const posY = startY + y * (this.SQUARE_SIZE + this.SQUARE_SPACING);

				const square = this.add.rectangle(
					posX + this.SQUARE_SIZE / 2,
					posY + this.SQUARE_SIZE / 2,
					this.SQUARE_SIZE,
					this.SQUARE_SIZE,
					0xffffff,
					0.5,
				);
				square.setStrokeStyle(2, 0xffffff);

				this.squares[y][x] = {
					sprite: square,
					x: x,
					y: y,
				};
			}
		}

		// Start with the first square selected
		this.updateSelection();
	}

	private updateSelection(): void {
		// Reset all squares to default appearance
		for (let y = 0; y < this.GRID_SIZE; y++) {
			for (let x = 0; x < this.GRID_SIZE; x++) {
				const square = this.squares[y][x].sprite;
				square.setFillStyle(0xffffff, 0.5);
				square.setStrokeStyle(2, 0xffffff);
			}
		}

		// Highlight the selected square
		const selectedSquare = this.squares[this.selectedY][this.selectedX].sprite;
		selectedSquare.setFillStyle(0x00ff00, 0.8);
		selectedSquare.setStrokeStyle(4, 0x00ff00);
	}

	handleAction(action: GameAction): void {
		switch (action) {
			case GameAction.Left:
				if (this.selectedX > 0) {
					this.selectedX--;
					this.updateSelection();
				}
				break;
			case GameAction.Right:
				if (this.selectedX < this.GRID_SIZE - 1) {
					this.selectedX++;
					this.updateSelection();
				}
				break;
			case GameAction.Up:
				if (this.selectedY > 0) {
					this.selectedY--;
					this.updateSelection();
				}
				break;
			case GameAction.Down:
				if (this.selectedY < this.GRID_SIZE - 1) {
					this.selectedY++;
					this.updateSelection();
				}
				break;
			case GameAction.Back:
				this.scene.start("IntroScene");
				this.shutdown();
				break;
			case GameAction.Accept: {
				const selectedScene =
					this.MINIGAME_SCENES[this.selectedY][this.selectedX];
				if (selectedScene) {
					this.scene.start(selectedScene);
					this.shutdown();
				} else {
					console.log("Minigame not implemented");
				}
				break;
			}
		}
	}
}
