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
import { createDragHandler } from '../../interactions/createDragHandler'

const state = proxy({
  strips: [
    { id: '1', layer: 0, left: 0, width: 100 },
    { id: '2', layer: 1, left: 200, width: 100 }
  ],
  selectedIds: [] as string[]
})

const mainState = proxy({
  strips: [
    { id: '1', layer: 0, left: 0, width: 100 },
    { id: '2', layer: 1, left: 200, width: 100 }
  ],
  selectedIds: [] as string[]
})

export const Multiple: Story = {
  render: function Render() {
    const snap = useSnapshot(state)
    const mainSnap = useSnapshot(mainState)

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
          function isInvalid(id: string) {
            if (!state.selectedIds.includes(id)) return false
            const currentStrip = state.strips.find((strip) => strip.id === id)
            if (!currentStrip) return true
            const sameLayerStrips = state.strips.filter(
              (strip) => currentStrip.layer === strip.layer
            )
            if (sameLayerStrips.length === 1) return false

            const sortedStrips = sameLayerStrips.sort((a, b) => a.left - b.left)
            const index = sortedStrips.findIndex((strip) => strip.id === id)
            if (index === 0)
              return currentStrip.left + currentStrip.width > sortedStrips[index + 1].left
            if (index === sortedStrips.length - 1)
              return (
                currentStrip.left < sortedStrips[index - 1].left + sortedStrips[index - 1].width
              )

            return (
              currentStrip.left + currentStrip.width > sortedStrips[index + 1].left ||
              currentStrip.left < sortedStrips[index - 1].left + sortedStrips[index - 1].width
            )
          }

          function getSnapPoints(ids: string[]): number[] {
            const otherStrips = state.strips.filter((strip) => !ids.includes(strip.id))
            return otherStrips
              .flatMap((strip) => [strip.left, strip.left + strip.width])
              .sort((a, b) => a - b)
          }

          const invalid = isInvalid(strip.id)

          return (
            <Strip
              key={i}
              invalid={invalid}
              top={strip.layer * 32 + 1 + 2 * strip.layer}
              selected={snap.selectedIds.includes(strip.id)}
              left={strip.left}
              width={strip.width}
              onChange={(left, width) => {
                const snapPoints = getSnapPoints(state.selectedIds)
                const isChangedRight = left === strip?.left
                const isChangedLeft = width === strip?.width

                const { value: snappedLeft, isSnapped } = checkSnap(left, snapPoints)
                const snappedLeftDiff = snappedLeft - left
                if (isSnapped) {
                  left = snappedLeft
                  if (!isChangedLeft) {
                    width -= snappedLeftDiff
                  }
                }

                const { value: snappedRight, isSnapped: isWidthSnapped } = checkSnap(
                  left + width,
                  snapPoints
                )
                const snappedRightDiff = snappedRight - (left + width)
                if (!isChangedRight) {
                  if (!isSnapped && isWidthSnapped) {
                    left = left + snappedRightDiff
                  }
                } else if (isWidthSnapped) {
                  width = width + snappedRightDiff
                }

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
                createDragHandler({
                  onDown: (e) => {
                    return {
                      offsetY: e.nativeEvent.offsetY,
                      currentLayers: snap.strips.map((strip) => strip.layer)
                    }
                  },
                  onMove: (_, ctx, move) => {
                    if (!ctx) return
                    const { offsetY, currentLayers } = ctx
                    state.selectedIds.forEach((id) => {
                      const i = snap.strips.findIndex((strip) => strip.id === id)
                      const newLayer = currentLayers[i] + Math.ceil((move.diffY + offsetY) / 32) - 1
                      if (newLayer < 0) return
                      state.strips[i].layer = newLayer
                    })
                  }
                })(e as React.PointerEvent<HTMLElement>)
              }}
              onChangeEnd={() => {
                const invalid = isInvalid(strip.id)
                if (invalid) {
                  state.strips = mainSnap.strips.map((strip) => ({ ...strip }))
                } else {
                  mainState.strips = snap.strips.map((strip) => ({ ...strip }))
                }
              }}
            >
              <div
                style={{
                  padding: '0 4px',
                  userSelect: 'none'
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

function checkSnap(value: number, snapPoints: number[], threshold = 8) {
  for (const snapPoint of snapPoints) {
    if (Math.abs(value - snapPoint) < threshold)
      return {
        value: snapPoint,
        isSnapped: true
      }
  }
  return { value, isSnapped: false }
}
