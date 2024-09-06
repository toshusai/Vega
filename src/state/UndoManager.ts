import { VegaProject } from '@/schemas'
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
    commitProperty.forEach((key) => {
      // @ts-ignore
      state[key] = data[key]
    })
  }
}

const commitProperty: (keyof VegaProject)[] = ['strips']

export function commit() {
  const clone: Partial<VegaProject> = {} as typeof state
  commitProperty.forEach((key) => {
    // @ts-ignore
    clone[key] = state[key]
  })
  const latest = undoManager.undoStack[undoManager.undoStack.length - 1]
  if (latest === JSON.stringify(clone)) {
    return
  }
  undoManager.push(JSON.stringify(clone))
}

export function redo() {
  if (!undoManager.canRedo()) {
    return
  }

  const data = JSON.parse(undoManager.redo() ?? 'null')
  if (data) {
    commitProperty.forEach((key) => {
      // @ts-ignore
      state[key] = data[key]
    })
  }
}
