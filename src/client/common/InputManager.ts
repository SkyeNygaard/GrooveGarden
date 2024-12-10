import Phaser from "phaser";
import {
	GameAction,
	InputBinding,
	InputConfig,
	InputListener,
} from "./interfaces";

export class InputManager {
	private scene: Phaser.Scene;
	private bindings: InputConfig;
	private listeners: Set<InputListener>;
	private activeActions: Set<GameAction>;
	private defaultConfig: InputConfig = {
		[GameAction.Accept]: {
			keyboard: ["ENTER", "SPACE"],
			gamepad: { button: [0] },
		}, // A button
		[GameAction.Back]: { keyboard: ["ESC"], gamepad: { button: [1] } }, // B button
		[GameAction.Pause]: { keyboard: ["P", "ESC"], gamepad: { button: [9] } }, // Start button
		[GameAction.Left]: {
			keyboard: ["LEFT"],
			gamepad: { axis: 0, axisDirection: "negative" },
		},
		[GameAction.Right]: {
			keyboard: ["RIGHT"],
			gamepad: { axis: 0, axisDirection: "positive" },
		},
		[GameAction.Up]: {
			keyboard: ["UP"],
			gamepad: { axis: 1, axisDirection: "negative" },
		},
		[GameAction.Down]: {
			keyboard: ["DOWN"],
			gamepad: { axis: 1, axisDirection: "positive" },
		},
		[GameAction.RhythmAction1]: {
			keyboard: ["A", "J"],
			gamepad: { button: [2] },
		}, // X button
		[GameAction.RhythmAction2]: {
			keyboard: ["S", "K"],
			gamepad: { button: [3] },
		}, // Y button
		[GameAction.RhythmAction3]: {
			keyboard: ["D", "L"],
			gamepad: { button: [5] },
		}, // RB button
	};

	constructor(scene: Phaser.Scene, config?: InputConfig) {
		this.scene = scene;
		this.listeners = new Set();
		this.activeActions = new Set();
		this.bindings = { ...this.defaultConfig, ...config };

		// Create key objects for all keyboard bindings
		Object.values(this.bindings).forEach((binding) => {
			if (binding.keyboard) {
				binding.keyboard.forEach((keyName) => {
					const keyCode = Phaser.Input.Keyboard.KeyCodes[keyName];
					const key = this.scene.input.keyboard?.addKey(keyCode);
				});
			}
		});

		// Setup update callback
		this.scene.events.on("update", () => this.update());
	}

	/**
	 * Add a listener for input events
	 */
	addListener(listener: InputListener): void {
		this.listeners.add(listener);
	}

	/**
	 * Remove a listener
	 */
	removeListener(listener: InputListener): void {
		this.listeners.delete(listener);
	}

	/**
	 * Configure input bindings for an action
	 */
	configureAction(action: GameAction, binding: Partial<InputBinding>): void {
		const currentBinding = this.bindings[action] || {};
		this.bindings[action] = {
			keyboard: [
				...(currentBinding.keyboard || []),
				...(binding.keyboard || []),
			],
			gamepad: {
				button: [
					...(currentBinding.gamepad?.button || []),
					...(binding.gamepad?.button || []),
				],
				axis: binding.gamepad?.axis ?? currentBinding.gamepad?.axis,
				axisDirection:
					binding.gamepad?.axisDirection ??
					currentBinding.gamepad?.axisDirection,
			},
		};
	}

	/**
	 * Reset all bindings to default
	 */
	resetToDefault(): void {
		this.bindings = { ...this.defaultConfig };
	}

	/**
	 * Manually trigger an action (for UI buttons)
	 */
	triggerAction(action: GameAction, active: boolean = true): void {
		if (active && !this.activeActions.has(action)) {
			this.activeActions.add(action);
			this.notifyActionStart(action);
		} else if (!active && this.activeActions.has(action)) {
			this.activeActions.delete(action);
			this.notifyActionEnd(action);
		}
	}

	/**
	 * Clean up resources
	 */
	destroy(): void {
		this.scene.events.off("update");
		this.listeners.clear();
		this.activeActions.clear();
	}

	private notifyActionStart(action: GameAction): void {
		this.listeners.forEach((listener) => {
			if (listener.onActionStart) {
				listener.onActionStart(action);
			}
		});
	}

	private notifyActionEnd(action: GameAction): void {
		this.listeners.forEach((listener) => {
			if (listener.onActionEnd) {
				listener.onActionEnd(action);
			}
		});
	}

	private update(): void {
		const keyboard = this.scene.input.keyboard;
		const gamepad = this.scene.input.gamepad;

		// Process each possible action
		Object.entries(this.bindings).forEach(([action, binding]) => {
			const gameAction = action as GameAction;
			const isActive = this.isActionActive(
				gameAction,
				binding,
				keyboard,
				gamepad,
			);

			// Use triggerAction to handle state changes
			this.triggerAction(gameAction, isActive);
		});
	}

	private isActionActive(
		action: GameAction,
		binding: InputBinding,
		keyboard: Phaser.Input.Keyboard.KeyboardPlugin,
		gamepad: Phaser.Input.Gamepad.GamepadPlugin,
	): boolean {
		// Check keyboard input
		if (binding.keyboard && keyboard) {
			for (const keyName of binding.keyboard) {
				const keyCode = Phaser.Input.Keyboard.KeyCodes[keyName];
				const key = keyboard.keys.find((k) => k?.keyCode === keyCode);
				if (key?.isDown) {
					return true;
				}
			}
		}

		// Check gamepad input
		if (binding.gamepad && gamepad && gamepad.pad1) {
			const pad = gamepad.pad1;

			// Check buttons
			if (binding.gamepad.button) {
				for (const buttonIndex of binding.gamepad.button) {
					if (pad.buttons[buttonIndex].pressed) {
						return true;
					}
				}
			}

			// Check axes
			if (binding.gamepad.axis !== undefined) {
				const axisValue = pad.axes[binding.gamepad.axis].getValue();
				const threshold = 0.5; // Adjust this threshold as needed

				if (
					binding.gamepad.axisDirection === "positive" &&
					axisValue > threshold
				) {
					return true;
				}
				if (
					binding.gamepad.axisDirection === "negative" &&
					axisValue < -threshold
				) {
					return true;
				}
			}
		}

		return false;
	}
}
