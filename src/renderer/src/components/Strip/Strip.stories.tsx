import type { Meta, StoryObj } from '@storybook/react'

import { Strip } from '.'
import { useEffect, useRef, useState } from 'react'

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
import { Ruler, SelectRect, useSelectRectHandler } from '@toshusai/cmpui'
import { ScaleScrollBar } from '../ScaleScrollBar'

const state = proxy({
  strips: [
    { id: '1', layer: 0, left: 0, width: 1 },
    { id: '2', layer: 1, left: 2, width: 1 },
    { id: '3', layer: 0, left: 4, width: 1 },
    { id: '4', layer: 2, left: 3, width: 1 },
    { id: '5', layer: 3, left: 1, width: 1 }
  ],
  selectedIds: [] as string[]
})

const mainState = proxy({
  strips: [] as typeof state.strips,
  selectedIds: [] as string[]
})

function checkCollision(
  rectA: { x: number; y: number; width: number; height: number },
  rectB: { x: number; y: number; width: number; height: number }
) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  )
}

const scaleState = proxy({
  start: 0,
  end: 1
})

export const Multiple: Story = {
  render: function Render() {
    useEffect(() => {
      mainState.strips = state.strips.map((strip) => ({ ...strip }))
    }, [])

    const snap = useSnapshot(state)
    const mainSnap = useSnapshot(mainState)
    const { rect, onPointerDown } = useSelectRectHandler()
    const scaleStateSnap = useSnapshot(scaleState)

    const refs = useRef([] as Array<HTMLDivElement | null>)
    const parent = useRef<HTMLDivElement | null>(null)

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

      state.selectedIds = hitIds
    }, [rect])

    const [rootWidth, setRootWidth] = useState(0)
    useEffect(() => {
      const handleResize = () => {
        if (!parent.current) return
        setRootWidth(parent.current.clientWidth)
      }
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])
    const defaultPxPerSec = 100
    const pxPerSec = (1 / (scaleState.end - scaleState.start)) * defaultPxPerSec
    const startSec = (scaleState.start * rootWidth) / defaultPxPerSec

    useEffect(() => {
      if (!parent.current) return
      const maxLayer = state.strips.reduce((acc, strip) => Math.max(acc, strip.layer), 0) + 1
      parent.current.style.height = `${(maxLayer + 1) * 32 + 1 + 2 * maxLayer}px`
    }, [snap.strips])

    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Ruler
          pxPerUnit={pxPerSec}
          offset={startSec}
          steps={[0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30, 60, 120, 300, 600, 1200, 1800, 3600]}
        />
        <div
          style={{
            width: '100%',
            height: '128px',
            display: 'flex',
            border: '1px solid black',
            position: 'relative',
            overflow: 'auto'
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              height: '800px',
              position: 'relative',
              overflow: 'hidden'
            }}
            ref={parent}
            onPointerDown={(e) => {
              state.selectedIds = []
              onPointerDown(e)
            }}
          >
            {rect && <SelectRect {...rect} />}
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
                  ref={(el) => {
                    refs.current[i] = el
                    if (el) {
                      el.id = strip.id
                    }
                  }}
                  key={i}
                  invalid={invalid}
                  top={strip.layer * 32 + 1 + 2 * strip.layer}
                  selected={snap.selectedIds.includes(strip.id)}
                  left={strip.left * pxPerSec - startSec * pxPerSec}
                  width={strip.width * pxPerSec}
                  onChange={(left, width) => {
                    left += startSec * pxPerSec
                    const snapPoints = getSnapPoints(state.selectedIds).map(
                      (point) => point * pxPerSec
                    )
                    const isChangedRight = left === strip?.left * pxPerSec
                    const isChangedLeft = width === strip?.width * pxPerSec

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

                    const diffLeft = left - state.strips[i].left * pxPerSec
                    const diffWidth = width - state.strips[i].width * pxPerSec

                    state.strips.forEach((strip, j) => {
                      if (state.selectedIds.includes(strip.id)) {
                        state.strips[j].left += diffLeft / pxPerSec
                        state.strips[j].width += diffWidth / pxPerSec
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
                          const newLayer =
                            currentLayers[i] + Math.ceil((move.diffY + offsetY) / 32) - 1
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
                      mainState.strips = state.strips.map((strip) => ({ ...strip }))
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
        </div>
        <div
          style={{
            width: '100%'
          }}
        >
          <ScaleScrollBar
            end={scaleStateSnap.end}
            start={scaleStateSnap.start}
            onChange={(start, end) => {
              scaleState.start = start
              scaleState.end = end
            }}
          />
        </div>
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
