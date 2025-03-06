// Events
export enum CustomEventType {
  PlayerFormChange = "playerFormChange",
  GameSettingsChange = "gameSettingsChange",
  KeybindChange = "keybindChange",
}

export const createCustomEvent = <T = unknown>(type: CustomEventType, detail: T) => {
  return new CustomEvent(type, { detail });
};

interface GameSettingsChangeEvent extends CustomEvent<null> {
  type: CustomEventType.GameSettingsChange;
}

export const isGameSettingsChangeEvent = (obj: unknown): obj is GameSettingsChangeEvent =>
  obj instanceof CustomEvent && obj.type === CustomEventType.GameSettingsChange;

interface PlayerFormChangeEvent extends CustomEvent<null> {
  type: CustomEventType.PlayerFormChange;
}

export const isPlayerFormChangeEvent = (obj: unknown): obj is PlayerFormChangeEvent =>
  obj instanceof CustomEvent && obj.type === CustomEventType.PlayerFormChange;

interface KeybindChangeEvent extends CustomEvent<string> {}

export const isKeybindChangeEvent = (obj: unknown): obj is KeybindChangeEvent =>
  obj instanceof CustomEvent && obj.type === CustomEventType.KeybindChange;

// Player types
export interface PlayerFormData {
  name: string;
  color: Color;
  sound: Sound;
  keyup?: string;
  keydown?: string;
}

export enum Color {
  Blue = "blue",
  Green = "green",
  Red = "red",
  Yellow = "yellow",
}

export const isColor = (obj: unknown): obj is Color =>
  typeof obj === "string" && (Object.values(Color) as string[]).includes(obj);

export enum Sound {
  Eagle = "eagle.mp3",
  Goat = "goat.mp3",
  Monster = "monster.mp3",
  TRex = "trex.mp3",
}

export const isSound = (obj: unknown): obj is Sound =>
  typeof obj === "string" && (Object.values(Sound) as string[]).includes(obj);

// Game types
export const positions = ["top", "right", "bottom", "left"] as const;

export type Position = (typeof positions)[number];

export enum GameState {
  Initializing,
  Ready,
  Running,
  Winner,
  Stopped,
}
