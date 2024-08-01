import { proxy, useSnapshot } from 'valtio'
import { createDragHandler } from '../../interactions/createDragHandler'
import { Ruler, SelectRect, useSelectRectHandler } from '@toshusai/cmpui'
import { ScaleScrollBar } from '../ScaleScrollBar'
import { Cursor } from '../Cursor'
import { TextEffect, VegaProject } from '@renderer/schemas'

import { useEffect, useRef, useState } from 'react'
import { Strip } from '../Strip'

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

export const state = proxy({
  assets: [],
  currentTime: 0,
  fps: 30,
  initialized: false,
  isPlaying: false,
  isSnap: false,
  length: 0,
  selectedStripIds: [],
  canvasHeight: 720,
  canvasWidth: 1280,
  viewEndRate: 1,
  viewStartRate: 0,
  canvasLeft: 128,
  canvasTop: 128,
  selectedAssetIds: [],
  selectedKeyframeIds: [],
  canvasScale: 0.5,
  recordingState: 'idle',
  strips: [
    {
      effects: [
        {
          id: '1',
          type: 'text',
          fontAssetId: 'Arial',
          fontSize: 64,
          color: 'black',
          text: 'Hello',
          x: 0,
          y: 0,
          keyframes: []
        } as TextEffect
      ],
      id: '1',
      layer: 0,
      start: 0,
      length: 1
    },
    {
      effects: [
        {
          id: '2',
          type: 'text',
          fontAssetId: 'Arial',
          fontSize: 64,
          color: 'black',
          text: 'World',
          x: 100,
          y: 300,
          keyframes: []
        } as TextEffect
      ],
      id: '2',
      layer: 1,
      start: 0.8,
      length: 1.3
    },
    {
      effects: [
        {
          id: '3',
          type: 'text',
          fontAssetId: 'Arial',
          fontSize: 64,
          color: 'black',
          text: 'Text\nEffect',
          x: 300,
          y: 200,
          keyframes: []
        } as TextEffect
      ],
      id: '3',
      layer: 0,
      start: 1.4,
      length: 1.1
    }
  ]
} as VegaProject)

const LAYER_GAP = 4
const LAYER_HEIGHT = 32

function TimeView({ pxPerSec, startSec }: { pxPerSec: number; startSec: number }) {
  return (
    <Ruler
      pxPerUnit={pxPerSec}
      offset={startSec}
      steps={[0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30, 60, 120, 300, 600, 1200, 1800, 3600]}
      onPointerDown={createDragHandler({
        onDown: (e) => {
          const newTime = e.nativeEvent.offsetX / pxPerSec + startSec
          state.currentTime = newTime
          return {
            time: newTime
          }
        },
        onMove: (_, ctx, move) => {
          if (!ctx) return
          const newTime = ctx.time + move.diffX / pxPerSec
          state.currentTime = newTime
        }
      })}
    />
  )
}

function isInvalid(id: string) {
  if (!state.selectedStripIds.includes(id)) return false
  const currentStrip = state.strips.find((strip) => strip.id === id)
  if (!currentStrip) return true
  const sameLayerStrips = state.strips.filter((strip) => currentStrip.layer === strip.layer)
  if (sameLayerStrips.length === 1) return false

  const sortedStrips = sameLayerStrips.sort((a, b) => a.start - b.start)
  const index = sortedStrips.findIndex((strip) => strip.id === id)
  if (index === 0) return currentStrip.start + currentStrip.length > sortedStrips[index + 1].start
  if (index === sortedStrips.length - 1)
    return currentStrip.start < sortedStrips[index - 1].start + sortedStrips[index - 1].length

  return (
    currentStrip.start + currentStrip.length > sortedStrips[index + 1].start ||
    currentStrip.start < sortedStrips[index - 1].start + sortedStrips[index - 1].length
  )
}

function getSnapPoints(ids: string[]): number[] {
  const otherStrips = state.strips.filter((strip) => !ids.includes(strip.id))
  return otherStrips
    .flatMap((strip) => [strip.start, strip.start + strip.length])
    .sort((a, b) => a - b)
}

function useWidth() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width)
    })
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [])
  return { ref, width }
}

function mergeRefs<T>(...refs: Array<React.MutableRefObject<T | null> | ((instance: T) => void)>) {
  const filteredRefs = refs.filter((ref) => ref)
  if (!filteredRefs.length) {
    return null
  }
  if (filteredRefs.length === 0) {
    return filteredRefs[0]
  }
  return (value: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ref.current = value
      }
    }
  }
}

function useSelectStripBox() {
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

function useLayerLength() {
  const snap = useSnapshot(state)
  return snap.strips.reduce((acc, strip) => Math.max(acc, strip.layer), 0) + 1
}

function useUpdateLayerRootHeight(parent: React.MutableRefObject<HTMLDivElement | null>) {
  const snap = useSnapshot(state)
  const maxLayer = useLayerLength()
  useEffect(() => {
    if (!parent.current) return
    const parentHight = parent.current.parentElement?.clientHeight ?? 0
    const layerHeight = (maxLayer + 1) * 32 + 1 + 2 * maxLayer
    parent.current.style.height = Math.max(parentHight, layerHeight) + 'px'
  }, [maxLayer, parent, snap.strips])
}

function useTimelineSeconds(width: number) {
  const snap = useSnapshot(state)
  const defaultPxPerSec = 100
  const pxPerSec = (1 / (snap.viewEndRate - snap.viewStartRate)) * defaultPxPerSec
  const startSec = (snap.viewStartRate * width) / defaultPxPerSec
  return {
    pxPerSec,
    startSec
  }
}

export function Timeline() {
  const snap = useSnapshot(state)
  const { rect, onPointerDown, parent, refs } = useSelectStripBox()
  const { ref: rootRef, width } = useWidth()

  const maxLayer = useLayerLength()
  const { pxPerSec, startSec } = useTimelineSeconds(width)

  useUpdateLayerRootHeight(parent)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <TimeView pxPerSec={pxPerSec} startSec={startSec} />
      <div
        style={{
          width: '100%',
          display: 'flex',
          height: '100%',
          position: 'relative',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden'
          }}
          ref={mergeRefs(parent, rootRef)}
          onPointerDown={(e) => {
            state.selectedStripIds = []
            onPointerDown(e)
          }}
        >
          {rect && <SelectRect {...rect} />}
          {Array.from({ length: maxLayer + 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: i * LAYER_HEIGHT + 1 + LAYER_GAP * i,
                left: 0,
                width: '100%',
                height: LAYER_HEIGHT + 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid',
                backgroundColor: i === maxLayer ? 'transparent' : '#fafafa',
                borderColor: '#eee',
                boxSizing: 'border-box',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            ></div>
          ))}
          {snap.strips.map((strip, i) => {
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
                top={strip.layer * LAYER_HEIGHT + 1 + LAYER_GAP * strip.layer}
                selected={snap.selectedStripIds.includes(strip.id)}
                left={strip.start * pxPerSec - startSec * pxPerSec}
                width={strip.length * pxPerSec}
                onChange={(left, width) => {
                  left += startSec * pxPerSec
                  const snapPoints = getSnapPoints(state.selectedStripIds).map(
                    (point) => point * pxPerSec
                  )
                  const isChangedRight = left === strip?.start * pxPerSec
                  const isChangedLeft = width === strip?.length * pxPerSec

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

                  const diffLeft = left - state.strips[i].start * pxPerSec
                  const diffWidth = width - state.strips[i].length * pxPerSec

                  state.strips.forEach((strip, j) => {
                    if (state.selectedStripIds.includes(strip.id)) {
                      state.strips[j].start += diffLeft / pxPerSec
                      state.strips[j].length += diffWidth / pxPerSec
                    }
                  })
                }}
                onPointerDown={(e) => {
                  if (e.metaKey) {
                    state.selectedStripIds.push(strip.id)
                  } else if (!state.selectedStripIds.includes(strip.id)) {
                    state.selectedStripIds = [strip.id]
                  }

                  const prevSelectedIds = snap.selectedStripIds.length
                  onClickFromPointerDown(() => {
                    if (prevSelectedIds == state.selectedStripIds.length) {
                      state.selectedStripIds = [strip.id]
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
                      state.selectedStripIds.forEach((id) => {
                        const i = snap.strips.findIndex((strip) => strip.id === id)
                        const newLayer =
                          currentLayers[i] + Math.ceil((move.diffY + offsetY) / 32) - 1
                        if (newLayer < 0) return
                        state.strips[i].layer = newLayer
                      })
                    }
                  })(e as React.PointerEvent<HTMLElement>)
                }}
                onChangeEnd={() => {}}
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
      <Cursor
        style={{
          left: snap.currentTime * pxPerSec - startSec * pxPerSec
        }}
      >
        {snap.currentTime.toFixed(2)}
      </Cursor>

      <div
        style={{
          width: '100%'
        }}
      >
        <ScaleScrollBar
          end={snap.viewEndRate}
          start={snap.viewStartRate}
          onChange={(start, end) => {
            state.viewStartRate = start
            state.viewEndRate = end
          }}
        />
      </div>
    </div>
  )
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
