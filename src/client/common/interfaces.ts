export interface Listener {
    notify(currentTime: number): void;
}

export enum GameAction {
    Accept = 'Accept',
    Pause = 'Pause',
    Back = 'Back',
    Left = 'Left',
    Right = 'Right',
    Up = 'Up',
    Down = 'Down',
    RhythmAction1 = 'RhythmAction1',
    RhythmAction2 = 'RhythmAction2',
    RhythmAction3 = 'RhythmAction3'
}

export interface InputBinding {
    keyboard?: string[];
    gamepad?: {
        button?: number[];
        axis?: number;
        axisDirection?: 'positive' | 'negative';
    };
}

export interface InputConfig {
    [key in GameAction]?: InputBinding;
}

export interface InputListener {
    onActionStart?(action: GameAction): void;
    onActionEnd?(action: GameAction): void;
}

export interface SceneConfig {
    key: string;
    songKey: string;
    beatmapKey: string;
    backgroundKey: string;
    availableActions: GameAction[];
}
