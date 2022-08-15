export class Undo {
  private index = -1
  private undoStack: (() => void)[] = []
  private redoStack: (() => void)[] = []

  public push (undo: () => void, redo: () => void) {
    this.undoStack.push(undo)
    this.redoStack.push(redo)
    this.index++
    // undo中にredoを入れると、redoStackのindexがずれるので、indexを更新する
    if (this.index !== this.undoStack.length - 1) {
      this.undoStack.splice(
        this.index,
        this.undoStack.length - this.index,
        undo
      )
      this.redoStack.splice(
        this.index,
        this.redoStack.length - this.index,
        redo
      )
      this.index = this.undoStack.length - 1
    }

    if (this.index > 100) {
      this.undoStack.shift()
      this.redoStack.shift()
      this.index--
    }
  }

  public undo () {
    if (this.index > -1) {
      this.undoStack[this.index]()
      this.index--
    }
  }

  public redo () {
    if (this.index + 1 < this.undoStack.length) {
      this.redoStack[this.index + 1]()
      this.index++
    }
  }
}

const undo = new Undo()
export default undo

// var undos = [A, B, C, D]
// undos.pop() // exec D, push D' ([A, B, C])
// redos.pop() // exec D' ([A, B, C, D])
