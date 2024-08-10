import { useEffect } from 'react'
import { redo, undo } from './state/UndoManager'

export function useUndoKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      if (
        isInput ||
        (e.target as HTMLElement).isContentEditable ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }
      if (e.key === 'z' && e.metaKey) {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
