type Undoable = {
  undo: () => void;
  redo: () => void;
};

const OperationType = {
  Add: "add",
  Remove: "remove",
  Undo: "undo",
  Redo: "redo",
  Change: "change",
};

type OperationType = "add" | "remove" | "undo" | "redo" | "change";

export class UndoManager {
  private stack: Undoable[] = [];
  private index = -1;
  private isUndoing = false;
  private isRedoing = false;

  private event: EventTarget;

  public static main: UndoManager = new UndoManager();

  constructor(private readonly maxStackSize = 100) {
    if (typeof document === "undefined") return;
    this.event = new EventTarget();
  }

  get length() {
    return this.stack.length;
  }

  get Index() {
    return this.index;
  }

  addEventListener(
    type: OperationType,
    listener: EventListenerOrEventListenerObject
  ) {
    this.event.addEventListener(type, listener);
  }

  removeEventListener(
    type: OperationType,
    listener: EventListenerOrEventListenerObject
  ) {
    this.event.removeEventListener(type, listener);
  }

  /**
   * file change detector is watched UndoManager,
   * it used for force notifiy file change.
   * @param type
   */
  emit(type: OperationType) {
    this.event.dispatchEvent(new CustomEvent(type));
  }

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
    this.event.dispatchEvent(new CustomEvent(OperationType.Add));
    this.event.dispatchEvent(new CustomEvent(OperationType.Change));
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
    this.event.dispatchEvent(new CustomEvent(OperationType.Undo));
    this.event.dispatchEvent(new CustomEvent(OperationType.Change));
  }

  redo() {
    if (this.index >= this.stack.length - 1) {
      return;
    }
    this.isRedoing = true;
    this.stack[this.index + 1].redo();
    this.isRedoing = false;
    this.index++;
    this.event.dispatchEvent(new CustomEvent(OperationType.Redo));
    this.event.dispatchEvent(new CustomEvent(OperationType.Change));
  }
}
