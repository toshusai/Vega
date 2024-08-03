import { KeyFrame } from '@renderer/schemas'
import { useSelectedStrips, useSelectedTextEffects } from '../Inspector'
import { IconSquare } from '@tabler/icons-react'
import { Ruler } from '@toshusai/cmpui'

export function KeyframeEditor() {
  const strips = useSelectedStrips()
  if (strips.length === 0) {
    return null
  }
  const strip = strips[0]

  return (
    <div className="w-full">
      <div className="pl-[64px]">
        <TimeView pxPerSec={100} startSec={strip.start} />
      </div>
      <KeyframeLine />
    </div>
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
                return (
                  <div
                    key={i}
                    className="h-24 w-24 absolute flex items-center justify-center"
                    style={{
                      left: `${keyframe.time * 100}px`
                    }}
                  >
                    <IconSquare size={12} className="rotate-45" />
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
