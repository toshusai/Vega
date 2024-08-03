import { Effect, KeyFrame } from '@renderer/schemas'
import { selectedTextEffects, useSelectedStrips, useSelectedTextEffects } from '../Inspector'
import { IconSquare, IconSquareFilled } from '@tabler/icons-react'
import { ContextMenu, ContextMenuItem, Ruler } from '@toshusai/cmpui'
import { state } from '@renderer/state'
import { useSnapshot } from 'valtio'
import { Cursor } from '../Cursor'

export function KeyframeEditor() {
  const strips = useSelectedStrips()
  const snap = useSnapshot(state)
  const pxPerSec = 100
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
          <TimeView pxPerSec={100} startSec={0} />
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

function TimeView({ pxPerSec, startSec }: { pxPerSec: number; startSec: number }) {
  return (
    <Ruler
      pxPerUnit={pxPerSec}
      offset={startSec}
      steps={[0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30, 60, 120, 300, 600, 1200, 1800, 3600]}
    />
  )
}

export function KeyframeLine() {
  const effects = useSelectedTextEffects()

  const snap = useSnapshot(state)
  if (effects.length === 0) {
    return null
  }

  const effect = effects[0]

  const keyframes = effect.keyframes

  const map = keyFrameToMap(keyframes as KeyFrame[])

  return (
    <div className="h-1 w-full">
      {Object.keys(map).map((propName, i) => {
        return (
          <div key={i} className="flex">
            <div className="w-[64px]">{propName}</div>
            <div className="relative w-full">
              {map[propName].map((keyframe, i) => {
                const selected = snap.selectedKeyframeIds.includes(keyframe.id)
                return (
                  <div
                    key={i}
                    className="h-24 w-24 absolute flex items-center justify-center"
                    style={{
                      left: `${keyframe.time * 100}px`
                    }}
                  >
                    {selected ? (
                      <IconSquareFilled
                        size={12}
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
                        size={12}
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
