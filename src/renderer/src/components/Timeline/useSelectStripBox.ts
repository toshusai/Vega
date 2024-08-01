import { useSelectRectHandler } from '@toshusai/cmpui'
import { useEffect, useRef } from 'react'
import { checkCollision } from './checkCollision'
import { state } from '../../state'

export function useSelectStripBox() {
  const { rect, onPointerDown } = useSelectRectHandler()
  const parent = useRef<HTMLDivElement | null>(null)
  const refs = useRef([] as Array<HTMLDivElement | null>)
  useEffect(() => {
    if (!rect) return
    const hitIds = refs.current
      .map((el) => {
        if (!el) return null
        const bbox = el.getBoundingClientRect()
        const parentBB = parent.current?.getBoundingClientRect()
        if (!parentBB) return null

        const elRect = {
          x: bbox.x - parentBB.x,
          y: bbox.y - parentBB.y,
          width: bbox.width,
          height: bbox.height
        }

        if (checkCollision(rect, elRect)) {
          return el.id
        }
        return null
      })
      .filter((id) => id) as string[]

    state.selectedStripIds = hitIds
  }, [rect])

  return {
    rect,
    onPointerDown,
    parent,
    refs
  }
}
