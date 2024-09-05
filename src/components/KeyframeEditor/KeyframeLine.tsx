import { KeyFrame } from '@/schemas'
import { IconSquareFilled } from '@tabler/icons-react'
import { SelectRect, Tooltip } from '@toshusai/cmpui'
import { state } from '@/state'
import { useSnapshot } from 'valtio'
import { useSelectStripBox } from '../Timeline/useSelectStripBox'
import { useCallback } from 'react'
import { createDragHandler } from '@/interactions/createDragHandler'
import { onClickFromPointerDown } from '../../interactions/onClickFromPointerDown'
import { keyFrameToMap } from './keyFrameToMap'
import { useSelectedStrips } from '@/state/useSelectedStrips'
import { selectedStrips } from '@/state/selectedStrips'
import { commit } from '@/state/UndoManager'

export function useSelectedEffects() {
  return useSelectedStrips().flatMap((strip) => {
    return strip.effects
  })
}

export function getSelectedEffects() {
  return selectedStrips().flatMap((strip) => {
    return strip.effects
  })
}

export function KeyframeLine() {
  const effects = useSelectedEffects()

  const snap = useSnapshot(state)

  const { rect, onPointerDown, refs, parent } = useSelectStripBox(
    useCallback((ids) => {
      state.selectedKeyframeIds = ids
    }, []),
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
      <div className="min-w-[64px] max-w-[64px] border-r border-gray-300">
        {Object.keys(map).map((propName, i) => {
          return (
            <Tooltip key={i} content={propName}>
              <div key={i} className="block pl-4 h-16 text-[12px] truncate">
                {propName}
              </div>
            </Tooltip>
          )
        })}
      </div>

      <div
        className="w-full h-full relative overflow-hidden"
        onPointerDown={(e) => {
          if (e.button !== 0) return
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
              <div className="relative w-full h-[16px] border-b border-gray-200">
                {map[propName].map((keyframe, j) => {
                  const selected = isSelected(keyframe.id)
                  return (
                    <div
                      key={j}
                      className="h-8 w-8 absolute flex items-center justify-center translate-x-[-3.5px] translate-y-[3.5px]"
                      style={{
                        left: `${keyframe.time * 100}px`,
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
                                  (id) => id !== keyframe.id,
                                )
                              } else {
                                if (prevSelectedIds === state.selectedKeyframeIds.length) {
                                  state.selectedKeyframeIds = [keyframe.id]
                                }
                              }
                            }
                          })

                          const effect = getSelectedEffects()[0]
                          const currentKeyframes = effect.keyframes.filter((k) =>
                            state.selectedKeyframeIds.includes(k.id),
                          )
                          if (currentKeyframes.length === 0) return null
                          return {
                            time: keyframe.time,
                            effect,
                            keyframes: currentKeyframes,
                            startKeyframes: currentKeyframes.map((k) => ({ ...k })),
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
                        },
                        onUp() {
                          commit()
                        },
                      })}
                    >
                      <IconSquareFilled
                        size={8}
                        // TODO: use classNames
                        className={
                          selected
                            ? 'rotate-45 border border-[var(--cmpui-primary-color)] text-gray-500'
                            : 'rotate-45 text-gray-500'
                        }
                        fill="currentColor"
                        onClick={(e) => {
                          if (selected) {
                            if (e.metaKey) {
                              state.selectedKeyframeIds = state.selectedKeyframeIds.filter(
                                (id) => id !== keyframe.id,
                              )
                            }
                          } else {
                            state.selectedKeyframeIds = [keyframe.id]
                          }
                        }}
                      />
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
