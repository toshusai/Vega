import { createDragHandler } from '../../interactions/createDragHandler'
import { Ruler } from '@toshusai/cmpui'

import { state } from '../../state'
import { getSnapPoints } from './getSnapPoints'
import { checkSnap } from './checkSnap'

export function TimeView({ pxPerSec, startSec }: { pxPerSec: number; startSec: number }) {
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
            time: newTime,
          }
        },
        onMove: (_, ctx, move) => {
          if (!ctx) return
          const newTime = ctx.time + move.diffX / pxPerSec
          state.currentTime = newTime

          const isTimelineSnap = state.timelineSettings.snapToStrip
          const snapPoints = isTimelineSnap
            ? getSnapPoints([]).map((point) => point * pxPerSec)
            : []

          const snap = checkSnap(newTime * pxPerSec, snapPoints)
          if (snap.isSnapped) {
            state.currentTime = snap.value / pxPerSec
          }
        },
      })}
    />
  )
}
