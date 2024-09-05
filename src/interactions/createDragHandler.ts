import { useMemo } from 'react'

export type OnMoveHandler<T = undefined, U = undefined> = (
  e: PointerEvent,
  ctx: T | undefined,
  move: {
    diffX: number
    diffY: number
    deltaX: number
    deltaY: number
  },
) => U

export function createDragHandler<T, U>({
  onDown,
  onMove,
  onUp,
  options,
}: {
  /**
   * if returns false, the drag will be canceled
   */
  onDown?: (e: React.PointerEvent<HTMLElement | SVGElement>) => T | false
  onMove?: OnMoveHandler<T, U>
  onUp?: (e: PointerEvent, downCtx?: T, moveCtx?: U, moveEvent?: PointerEvent) => void
  options?: {
    disableCapture?: boolean
  }
}) {
  const handlePointerDown = (downEvent: React.PointerEvent<HTMLElement | SVGElement>) => {
    if (downEvent.button !== 0) return
    const el = downEvent.currentTarget

    const downCtx = onDown?.(downEvent)
    let prevEvent: PointerEvent | undefined = undefined
    let moveCtx: U | undefined = undefined
    const handlePointerMove = (e: Event) => {
      if (!(e instanceof PointerEvent)) return
      if (downCtx === false) return
      e.preventDefault()
      moveCtx = onMove?.(e, downCtx, {
        diffX: e.clientX - downEvent.clientX,
        diffY: e.clientY - downEvent.clientY,
        deltaX: e.clientX - (prevEvent?.clientX ?? downEvent.clientX),
        deltaY: e.clientY - (prevEvent?.clientY ?? downEvent.clientY),
      })

      prevEvent = e
    }

    const handlePointerUp = (e: Event) => {
      if (!(e instanceof PointerEvent)) return
      if (downCtx === false) return
      el.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      if (options?.disableCapture !== true) {
        el.releasePointerCapture(e.pointerId)
      }
      onUp?.(e, downCtx, moveCtx, prevEvent)
    }

    if (downCtx === false) return

    if (options?.disableCapture !== true) {
      el.setPointerCapture(downEvent.pointerId)
    }
    el.addEventListener('pointermove', handlePointerMove, {
      passive: false,
    })
    window.addEventListener('pointerup', handlePointerUp)
  }

  return handlePointerDown
}

export function useCreateDragHandler<T, U>({
  onDown,
  onMove,
  onUp,
  options,
}: {
  onDown?: (e: React.PointerEvent<HTMLElement | SVGElement>) => T | false
  onMove?: OnMoveHandler<T, U>
  onUp?: (e: PointerEvent, downCtx?: T, moveCtx?: U, moveEvent?: PointerEvent) => void
  options?: {
    disableCapture?: boolean
  }
}) {
  return useMemo(
    () => createDragHandler({ onDown, onMove, onUp, options }),
    [onDown, onMove, onUp, options],
  )
}
