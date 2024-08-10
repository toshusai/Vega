import { selectedTextEffects } from '../../state/selectedTextEffects'
import { useSelectedStrips } from '../../state/useSelectedStrips'
import { ContextMenu, ContextMenuItem } from '@toshusai/cmpui'
import { state } from '@renderer/state'
import { useSnapshot } from 'valtio'
import { Cursor } from '../Cursor'
import { KeyframeLine } from './KeyframeLine'
import { TimeView } from './TimeView'

export function KeyframeEditor() {
  const strips = useSelectedStrips()
  const snap = useSnapshot(state)
  const pxPerSec = 100
  const selectedTextEffectsSnapshot = useSelectedStrips().flatMap((strip) => {
    return strip.effects
  })
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
        <div className="pl-[64px] border-b border-gray-300">
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
