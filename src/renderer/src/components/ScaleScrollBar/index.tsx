import { createDragHandler } from '../../interactions/createDragHandler'
import './index.css'
import { useRef } from 'react'

type ScaleScrollBarProps = {
  start: number
  end: number
  onChange: (start: number, end: number) => void
}

export function ScaleScrollBar({ start, end, onChange }: ScaleScrollBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="scale-scroll-bar" ref={ref}>
      <div>
        <div
          className="scale-scroll-bar-handle"
          style={{
            left: `${start * 100}%`,
            right: `calc(100% - ${end * 100}%)`
          }}
          onPointerDown={createDragHandler({
            onDown: () => {
              return { start, end }
            },
            onMove: (_, ctx, move) => {
              if (!ctx) return
              const el = ref.current
              const width = el?.clientWidth ?? 0
              const newStart = ctx.start + move.diffX / width
              const newEnd = ctx.end + move.diffX / width
              if (newStart < 0) {
                onChange(0, end - start)
                return
              }
              if (newEnd > 1) {
                onChange(1 - end + start, 1)
                return
              }
              onChange(newStart, newEnd)
            }
          })}
        ></div>
        <Handle
          style={{
            left: `${start * 100}%`
          }}
          onPointerDown={createDragHandler({
            onDown: () => {
              return { start }
            },
            onMove: (_, ctx, move) => {
              if (!ctx) return
              const el = ref.current
              const width = el?.clientWidth ?? 0

              const newStart = ctx.start + move.diffX / width

              if (newStart + 16 / width > end) {
                onChange(end - 16 / width, end)
                return
              }
              if (newStart < 0) {
                onChange(0, end)
                return
              }

              onChange(newStart, end)
            }
          })}
        />
        <Handle
          style={{
            right: `calc(100% - ${end * 100}%)`
          }}
          onPointerDown={createDragHandler({
            onDown: () => {
              return { end }
            },
            onMove: (_, ctx, move) => {
              if (!ctx) return
              const el = ref.current
              const width = el?.clientWidth ?? 0
              const newEnd = ctx.end + move.diffX / width
              if (start + 16 / width > newEnd) {
                onChange(start, start + 16 / width)
                return
              }
              if (newEnd > 1) {
                onChange(start, 1)
                return
              }

              onChange(start, newEnd)
            }
          })}
        />
      </div>
    </div>
  )
}

function Handle(props: React.ComponentProps<'div'>) {
  return <div {...props} className="scale-scroll-bar-handle-edge"></div>
}
