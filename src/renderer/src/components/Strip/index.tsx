import './index.css'

import { createDragHandler } from '../../interactions/createDragHandler'
import React from 'react'

export type StripProps = {
  children: React.ReactNode
  left: number
  width: number
  top: number
  onChange: (left: number, width: number) => void
  onChangeEnd: (left: number, width: number) => void
  onPointerDown?: (e: React.PointerEvent) => void
  onClick?: (e: React.MouseEvent) => void
  selected?: boolean
}

const MIN_WIDTH = 8

export function Strip({
  left,
  width,
  top,
  children,
  onChange,
  onChangeEnd,
  selected,
  onClick,
  onPointerDown
}: StripProps) {
  const handleLeftHandle = createDragHandler({
    onDown: (e) => {
      e.stopPropagation()
      onPointerDown?.(e)
      return {
        left: left,
        width: width
      }
    },
    onMove: (_, ctx, move) => {
      if (!ctx) return
      const { left, width } = ctx
      let newLeft = left + move.diffX
      let newWidth = width - move.diffX
      if (newWidth < MIN_WIDTH) {
        newWidth = MIN_WIDTH
        newLeft = left + width - MIN_WIDTH
      }

      onChange(newLeft, newWidth)
      return {
        left: newLeft,
        width: newWidth
      }
    },
    onUp: (_, __, moveCtx) => {
      if (!moveCtx) return
      const { left, width } = moveCtx
      onChangeEnd(left, width)
    }
  })

  const handleRightHandle = createDragHandler({
    onDown: (e) => {
      e.stopPropagation()
      onPointerDown?.(e)
      return {
        left: left,
        width: width
      }
    },
    onMove: (_, ctx, move) => {
      if (!ctx) return
      const { left, width } = ctx
      const newWidth = Math.max(width + move.diffX, MIN_WIDTH)
      onChange(left, newWidth)
    },
    onUp: (_, __, moveCtx) => {
      if (!moveCtx) return
      const { left, width } = moveCtx
      onChangeEnd(left, width)
    }
  })

  const handleMove = createDragHandler({
    onDown: (e) => {
      e.stopPropagation()
      onPointerDown?.(e)
      return {
        left: left,
        width: width
      }
    },
    onMove: (_, ctx, move) => {
      if (!ctx) return
      const { left, width } = ctx
      const newLeft = left + move.diffX
      onChange(newLeft, width)
    },
    onUp: (_, __, moveCtx) => {
      if (!moveCtx) return
      const { left, width } = moveCtx
      onChangeEnd(left, width)
    }
  })

  return (
    <div
      className="strip"
      style={{
        left,
        width,
        top
      }}
      data-selected={selected}
      onPointerDown={handleMove}
      onClick={onClick}
    >
      <Handle onPointerDown={handleLeftHandle} style={{ left: 0 }} />
      <div className="strip-container">{children}</div>
      <Handle onPointerDown={handleRightHandle} style={{ right: 0 }} />
    </div>
  )
}

function Handle(props: React.ComponentProps<'div'>) {
  return (
    <div className="handle" {...props}>
      <div></div>
    </div>
  )
}
