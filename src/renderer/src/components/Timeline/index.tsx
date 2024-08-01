import { useSnapshot } from 'valtio'
import { createDragHandler } from '../../interactions/createDragHandler'
import { IconButton, SelectRect } from '@toshusai/cmpui'
import { ScaleScrollBar } from '../ScaleScrollBar'
import { Cursor } from '../Cursor'
import { Strip } from '../Strip'
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react'
import { checkSnap } from './checkSnap'
import { onClickFromPointerDown } from './onClickFromPointerDown'
import { useTimelineSeconds } from './useTimelineSeconds'
import { useUpdateLayerRootHeight } from './useUpdateLayerRootHeight'
import { useLayerLength } from './useLayerLength'
import { useWidth } from './useWidth'
import { mergeRefs } from './mergeRefs'
import { getSnapPoints } from './getSnapPoints'
import { isInvalid } from './isInvalid'
import { TimeView } from './TimeView'
import { useSelectStripBox } from './useSelectStripBox'
import { state } from '../../state'

const LAYER_GAP = 4
const LAYER_HEIGHT = 32

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
      <div
        className="flex"
        style={{
          justifyContent: 'center',
          padding: '4px 0'
        }}
      >
        <IconButton
          size="S"
          onClick={() => {
            state.isPlaying = !state.isPlaying
          }}
        >
          {snap.isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
        </IconButton>
      </div>
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
          left: snap.currentTime * pxPerSec - startSec * pxPerSec,
          top: 32
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
