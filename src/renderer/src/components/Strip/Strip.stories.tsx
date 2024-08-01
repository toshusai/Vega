import type { Meta, StoryObj } from '@storybook/react'

import { Strip } from '.'
import { useState } from 'react'

const meta: Meta<typeof Strip> = {
  component: Strip
}

export default meta

type Story = StoryObj<typeof Strip>

export const Default: Story = {
  args: {
    left: 0,
    width: 100,
    onChange: (left, width) => console.log(left, width)
  },
  render: function Render(args) {
    const [left, setLeft] = useState(args.left)
    const [width, setWidth] = useState(args.width)
    const [selected, setSelected] = useState(false)

    return (
      <div
        style={{
          width: '100%',
          height: '128px',
          display: 'flex',
          border: '1px solid black',
          position: 'relative',
          overflow: 'hidden'
        }}
        onPointerDown={() => setSelected(false)}
      >
        <Strip
          top={4}
          selected={selected}
          left={left}
          width={width}
          onChange={(left, width) => {
            setLeft(left)
            setWidth(width)
            args.onChange(left, width)
          }}
          onPointerDown={() => setSelected(true)}
          onChangeEnd={args.onChange}
        >
          <div
            style={{
              padding: '0 4px'
            }}
          >
            Strip
          </div>
        </Strip>
      </div>
    )
  }
}
import { proxy, useSnapshot } from 'valtio'

const state = proxy({
  strips: [
    { id: '1', layer: 0, left: 0, width: 100 },
    { id: '2', layer: 1, left: 200, width: 100 }
  ],
  selectedIds: [] as string[]
})

export const Multiple: Story = {
  render: function Render() {
    const snap = useSnapshot(state)

    return (
      <div
        style={{
          width: '100%',
          height: '128px',
          display: 'flex',
          border: '1px solid black',
          position: 'relative',
          overflow: 'hidden'
        }}
        onPointerDown={() => {
          state.selectedIds = []
        }}
      >
        {snap.strips.map((strip, i) => {
          return (
            <Strip
              key={i}
              top={strip.layer * 32 + 1 + 2 * i}
              selected={snap.selectedIds.includes(strip.id)}
              left={strip.left}
              width={strip.width}
              onChange={(left, width) => {
                const diffLeft = left - state.strips[i].left
                const diffWidth = width - state.strips[i].width
                state.strips.forEach((strip, j) => {
                  if (state.selectedIds.includes(strip.id)) {
                    state.strips[j].left += diffLeft
                    state.strips[j].width += diffWidth
                  }
                })
              }}
              onPointerDown={(e) => {
                if (e.metaKey) {
                  state.selectedIds.push(strip.id)
                } else if (!state.selectedIds.includes(strip.id)) {
                  state.selectedIds = [strip.id]
                }

                const prevSelectedIds = snap.selectedIds.length
                onClickFromPointerDown(() => {
                  if (prevSelectedIds == state.selectedIds.length) {
                    state.selectedIds = [strip.id]
                  }
                })
              }}
              onChangeEnd={() => {}}
            >
              <div
                style={{
                  padding: '0 4px'
                }}
              >
                Strip
              </div>
            </Strip>
          )
        })}
      </div>
    )
  }
}

function onClickFromPointerDown(callback: () => void) {
  let isMoved = false
  const handleMove = () => {
    isMoved = true
  }

  const handleUp = () => {
    window.removeEventListener('pointerup', handleUp)
    window.removeEventListener('pointermove', handleMove)
    if (!isMoved) callback()
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp)
}
