export class KeyboardInput {
  static map = new Map<string, boolean>();
  static isInitialized = false;

  public static init() {
    if (typeof document === "undefined") {
      return;
    }
    if (KeyboardInput.isInitialized) {
      return;
    }
    document.addEventListener("keydown", KeyboardInput.onKeyDown);
    document.addEventListener("keyup", KeyboardInput.onKeyUp);
  }

  static onKeyDown(e: KeyboardEvent) {
    KeyboardInput.map.set(e.key, true);
  }

  static onKeyUp(e: KeyboardEvent) {
    KeyboardInput.map.set(e.key, false);
  }

  static isPressed(key: Key) {
    return KeyboardInput.map.get(key) || false;
  }
}

export enum Key {
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  Space = " ",
  Shift = "Shift",
  Control = "Control",
  Alt = "Alt",
  Meta = "Meta",
  Backspace = "Backspace",
  Delete = "Delete",
  Enter = "Enter",
  Escape = "Escape",
  Tab = "Tab",
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",

  // Number keys
  Digit0 = "0",
  Digit1 = "1",
  Digit2 = "2",
  Digit3 = "3",
  Digit4 = "4",
  Digit5 = "5",
  Digit6 = "6",
  Digit7 = "7",
  Digit8 = "8",
  Digit9 = "9",

  // Alphabet keys
  KeyA = "a",
}
