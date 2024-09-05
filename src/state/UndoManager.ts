import { state } from '@/state'

export class UndoManager {
  undoStack: string[] = []
  redoStack: string[] = []

  push(data: string) {
    this.undoStack.push(data)
    this.redoStack = []
  }

  undo() {
    if (this.undoStack.length === 1) {
      return null
    }
    const data = this.undoStack.pop()
    if (!data) return null
    this.redoStack.push(data)
    return this.undoStack[this.undoStack.length - 1]
  }

  redo() {
    if (this.redoStack.length === 0) {
      return null
    }
    const data = this.redoStack.pop()
    if (!data) return null
    this.undoStack.push(data)
    return data
  }

  clear() {
    this.undoStack = []
    this.redoStack = []
  }

  canUndo() {
    return this.undoStack.length > 0
  }

  canRedo() {
    return this.redoStack.length > 0
  }
}

export const undoManager = new UndoManager()

export function undo() {
  if (!undoManager.canUndo()) {
    return
  }

  const data = JSON.parse(undoManager.undo() ?? 'null') as typeof state | null
  if (data) {
    const allKeys = Object.keys(state) as (keyof typeof state)[]
    allKeys.forEach((key) => {
      // @ts-ignore
      state[key] = data[key]
    })
  }
}

export function commit() {
  console.log('commit')
  const clone = JSON.stringify(state)
  undoManager.push(clone)
}

export function redo() {
  if (!undoManager.canRedo()) {
    return
  }

  const data = JSON.parse(undoManager.redo() ?? 'null')
  if (data) {
    const allKeys = Object.keys(state) as (keyof typeof state)[]
    allKeys.forEach((key) => {
      // @ts-ignore
      state[key] = data[key]
    })
  }
}
