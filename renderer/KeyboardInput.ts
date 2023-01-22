export class KeyboardInput {
  static map = new Map<string, boolean>();
  static isInitialized = false;

  public static init(cb: () => void) {
    if (typeof document === "undefined") {
      return;
    }
    if (KeyboardInput.isInitialized) {
      return;
    }
    document.addEventListener("keydown", KeyboardInput.onKeyDown);
    document.addEventListener("keyup", KeyboardInput.onKeyUp);
    cb();
  }

  static listners = new Map<string, ((e: KeyboardEvent) => void)[]>();
  static id = 0;

  static addKeyDownListener(key: Key, listener: (e: KeyboardEvent) => void) {
    const [id, f] = KeyboardInput.getIdAndHandler(key, listener);
    document.addEventListener("keydown", f);
    return id;
  }

  private static getIdAndHandler(
    key: Key,
    listener: (e: KeyboardEvent) => void
  ): [string, (e: KeyboardEvent) => void] {
    const id = key + KeyboardInput.id++;
    return [
      id,
      (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === key.toLowerCase()) {
          listener(e);
          if (!KeyboardInput.listners.has(id)) {
            KeyboardInput.listners.set(id, []);
          }
          KeyboardInput.listners.get(id).push(listener);
        }
      },
    ];
  }

  static addKeyUpListener(key: Key, listener: () => void) {
    const [id, f] = KeyboardInput.getIdAndHandler(key, listener);
    document.addEventListener("keyup", f);
    return id;
  }

  static removeKeyDownListener(id: string) {
    const listeners = KeyboardInput.listners.get(id);
    if (listeners) {
      listeners.forEach((listener) => {
        document.removeEventListener("keydown", listener);
      });
    }
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

  KeyS = "s",
  KeyZ = "z",
}

type Undoable = {
  undo: () => void;
  redo: () => void;
};

export class UndoManager {
  private stack: Undoable[] = [];
  private index = -1;
  private isUndoing = false;
  private isRedoing = false;

  public static main: UndoManager = new UndoManager();

  constructor(private readonly maxStackSize = 100) {}

  add(undoable: Undoable) {
    if (this.isUndoing || this.isRedoing) {
      return;
    }
    if (this.index < this.stack.length - 1) {
      this.stack.splice(this.index + 1);
    }
    this.stack.push(undoable);
    this.index++;
    if (this.stack.length > this.maxStackSize) {
      this.stack.shift();
      this.index--;
    }
    return { run: () => undoable.redo() };
  }

  undo() {
    if (this.index < 0) {
      return;
    }
    this.isUndoing = true;
    this.stack[this.index].undo();
    this.isUndoing = false;
    this.index--;
  }

  redo() {
    if (this.index >= this.stack.length - 1) {
      return;
    }
    this.isRedoing = true;
    this.stack[this.index + 1].redo();
    this.isRedoing = false;
    this.index++;
  }
}
