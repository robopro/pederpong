import { PlayerForm } from "./components/PlayerForm";

export enum CustomEventType {
  PlayerFormChange = "playerFormChange",
  GameSettingsChange = "gameSettingsChange",
  KeybindChange = "keybindChange",
}

export const createCustomEvent = <T>(type: CustomEventType, detail: T) => {
  return new CustomEvent(type, { detail });
};

interface GameSettingsChangeEvent extends CustomEvent<PlayerForm[]> {
  type: CustomEventType.GameSettingsChange;
}

export const isGameSettingsChangeEvent = (obj: unknown): obj is GameSettingsChangeEvent =>
  obj instanceof CustomEvent && obj.type === CustomEventType.GameSettingsChange;

interface PlayerFormChangeEvent extends CustomEvent<PlayerForm> {
  type: CustomEventType.PlayerFormChange;
}

export const isPlayerFormChangeEvent = (obj: unknown): obj is PlayerFormChangeEvent =>
  obj instanceof CustomEvent && obj.type === CustomEventType.PlayerFormChange;

interface KeybindChangeEvent extends CustomEvent<string> {}

export const isKeybindChangeEvent = (obj: unknown): obj is KeybindChangeEvent =>
  obj instanceof CustomEvent && obj.type === CustomEventType.KeybindChange;

export enum Color {
  Blue = "blue",
  Green = "green",
  Red = "red",
  Yellow = "yellow",
}

export enum Sound {
  Eagle = "eagle",
  Goat = "goat",
  Monster = "monster",
  TRex = "trex",
}
