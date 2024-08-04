import { Effect, KeyFrame } from '@renderer/schemas'
import { selectedTextEffects, useSelectedStrips, useSelectedTextEffects } from '../Inspector'
import { IconSquare, IconSquareFilled } from '@tabler/icons-react'
import { ContextMenu, ContextMenuItem, Ruler, SelectRect } from '@toshusai/cmpui'
import { state } from '@renderer/state'
import { useSnapshot } from 'valtio'
import { Cursor } from '../Cursor'
import { useSelectStripBox } from '../Timeline/useSelectStripBox'
import { useCallback } from 'react'
import { createDragHandler } from '@renderer/interactions/createDragHandler'
import { checkSnap } from '../Timeline/checkSnap'
import { onClickFromPointerDown } from '../Timeline/onClickFromPointerDown'

export function KeyframeEditor() {
  const strips = useSelectedStrips()
  const snap = useSnapshot(state)
  const pxPerSec = 100
  const selectedTextEffectsSnapshot = useSelectedTextEffects()
  if (strips.length === 0) {
    return null
  }
  const strip = strips[0]

  return (
    <ContextMenu
      content={
        <ContextMenuItem
          onClick={() => {
            selectedTextEffects().forEach((effect) => {
              effect.keyframes = effect.keyframes.filter(
                (keyframe) => !state.selectedKeyframeIds.includes(keyframe.id)
              )
            })
          }}
        >
          Delete
        </ContextMenuItem>
      }
    >
      <div className="w-full">
        <div className="pl-[64px]">
          <TimeView
            pxPerSec={100}
            startSec={0}
            stripStartSec={strip.start}
            snapPoints={selectedTextEffectsSnapshot.flatMap((effect) =>
              effect.keyframes.map((keyframe) => keyframe.time)
            )}
          />
        </div>
        <KeyframeLine />
        {snap.currentTime - strip.start >= 0 && (
          <Cursor
            style={{
              left: 64 + snap.currentTime * pxPerSec - strip.start * pxPerSec
            }}
          >
            {(snap.currentTime - strip.start).toFixed(2)}
          </Cursor>
        )}
      </div>
    </ContextMenu>
  )
}

function TimeView({
  pxPerSec,
  startSec,
  stripStartSec,
  snapPoints
}: {
  pxPerSec: number
  startSec: number
  stripStartSec: number
  snapPoints: number[]
}) {
  return (
    <Ruler
      pxPerUnit={pxPerSec}
      offset={startSec}
      steps={[0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30, 60, 120, 300, 600, 1200, 1800, 3600]}
      onPointerDown={createDragHandler({
        onDown: (e) => {
          const sec = e.nativeEvent.offsetX / pxPerSec + stripStartSec

          state.currentTime = sec

          return {
            time: sec
          }
        },
        onMove: (_, ctx, move) => {
          if (!ctx) return
          const sec = ctx.time + move.diffX / pxPerSec

          const snap = checkSnap(
            sec,
            snapPoints.map((point) => point + stripStartSec),
            8 / pxPerSec
          )
          if (snap.isSnapped) {
            state.currentTime = snap.value
          } else {
            state.currentTime = sec
          }
        }
      })}
    />
  )
}

export function KeyframeLine() {
  const effects = useSelectedTextEffects()

  const snap = useSnapshot(state)

  const { rect, onPointerDown, refs, parent } = useSelectStripBox(
    useCallback((ids) => {
      state.selectedKeyframeIds = ids
    }, [])
  )

  if (effects.length === 0) {
    return null
  }

  const effect = effects[0]

  const keyframes = effect.keyframes

  const map = keyFrameToMap(keyframes as KeyFrame[])

  const isSelected = (id: string) => snap.selectedKeyframeIds.includes(id)
  return (
    <div className="w-full h-full flex">
      <div className="min-w-[64px]">
        {Object.keys(map).map((propName, i) => {
          return (
            <div key={i} className="flex">
              {propName}
            </div>
          )
        })}
      </div>

      <div
        className="w-full h-full relative"
        onPointerDown={(e) => {
          onPointerDown(e)
          onClickFromPointerDown(() => {
            state.selectedKeyframeIds = []
          })
        }}
        ref={parent}
      >
        {rect && <SelectRect {...rect} />}
        {Object.keys(map).map((propName, i) => {
          return (
            <div key={i} className="flex">
              <div className="relative w-full">
                {map[propName].map((keyframe, j) => {
                  const selected = isSelected(keyframe.id)
                  return (
                    <div
                      key={j}
                      className="h-8 w-8 absolute flex items-center justify-center translate-x-[-3.5px] translate-y-[8px]"
                      style={{
                        left: `${keyframe.time * 100}px`,
                        top: `${i * 16}px`
                      }}
                      ref={(el) => {
                        refs.current[i * map[propName].length + j] = el
                        if (el) {
                          el.id = keyframe.id
                        }
                      }}
                      onPointerDown={createDragHandler({
                        onDown: (e) => {
                          e.stopPropagation()

                          let added = false
                          if (e.metaKey) {
                            if (!state.selectedKeyframeIds.includes(keyframe.id)) {
                              state.selectedKeyframeIds.push(keyframe.id)
                              added = true
                            }
                          } else if (!state.selectedKeyframeIds.includes(keyframe.id)) {
                            state.selectedKeyframeIds = [keyframe.id]
                          }

                          const prevSelectedIds = state.selectedKeyframeIds.length
                          onClickFromPointerDown(() => {
                            if (!added) {
                              if (e.metaKey) {
                                state.selectedKeyframeIds = state.selectedKeyframeIds.filter(
                                  (id) => id !== keyframe.id
                                )
                              } else {
                                if (prevSelectedIds === state.selectedKeyframeIds.length) {
                                  state.selectedKeyframeIds = [keyframe.id]
                                }
                              }
                            }
                          })

                          const effect = selectedTextEffects()[0]
                          const currentKeyframes = effect.keyframes.filter((k) =>
                            state.selectedKeyframeIds.includes(k.id)
                          )
                          if (currentKeyframes.length === 0) return
                          return {
                            time: keyframe.time,
                            effect,
                            keyframes: currentKeyframes,
                            startKeyframes: currentKeyframes.map((k) => ({ ...k }))
                          }
                        },
                        onMove: (_, ctx, move) => {
                          if (!ctx) return
                          ctx.keyframes.forEach((keyframe, i) => {
                            const prev = ctx.startKeyframes[i]
                            if (prev) {
                              keyframe.time = prev.time + move.diffX / 100
                            }
                          })
                        }
                      })}
                    >
                      {selected ? (
                        <IconSquareFilled
                          size={8}
                          className="rotate-45"
                          onClick={(e) => {
                            if (e.metaKey) {
                              state.selectedKeyframeIds = state.selectedKeyframeIds.filter(
                                (id) => id !== keyframe.id
                              )
                            }
                          }}
                        />
                      ) : (
                        <IconSquare
                          size={8}
                          className="rotate-45"
                          onClick={() => {
                            state.selectedKeyframeIds = [keyframe.id]
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function keyFrameToMap(keyframes: KeyFrame[]): Record<string, KeyFrame[]> {
  const map: Record<string, KeyFrame[]> = {}
  keyframes.forEach((keyframe) => {
    if (!map[keyframe.property]) {
      map[keyframe.property] = []
    }
    map[keyframe.property].push(keyframe)
  })
  return map
}

export function setKeyFrame(effect: Effect, keyframe: KeyFrame) {
  const threshold = 1 / state.fps

  const nearest = effect.keyframes
    .filter((k) => k.property === keyframe.property)
    .find((k) => Math.abs(k.time - keyframe.time) < threshold)

  if (nearest) {
    nearest.value = keyframe.value
  } else {
    effect.keyframes.push(keyframe)
  }
}
