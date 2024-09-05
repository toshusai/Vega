import { Ruler } from '@toshusai/cmpui'
import { state } from '@/state'
import { createDragHandler } from '@/interactions/createDragHandler'
import { checkSnap } from '../Timeline/checkSnap'
import { selectedTextEffects } from '@/state/selectedTextEffects'

export function TimeView({
  pxPerSec,
  startSec,
  stripStartSec,
}: {
  pxPerSec: number
  startSec: number
  stripStartSec: number
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
            time: sec,
          }
        },
        onMove: (_, ctx, move) => {
          if (!ctx) return
          const sec = ctx.time + move.diffX / pxPerSec

          const isSnap = state.keyframeSettings.snapToKeyframe

          const effects = selectedTextEffects()

          const snapPoints = isSnap
            ? effects
                .flatMap((effect) => effect.keyframes.map((keyframe) => keyframe.time))
                .map((point) => point + stripStartSec)
            : []

          const snap = checkSnap(sec, snapPoints, 8 / pxPerSec)
          if (snap.isSnapped) {
            state.currentTime = snap.value
          } else {
            state.currentTime = sec
          }
        },
      })}
    />
  )
}
