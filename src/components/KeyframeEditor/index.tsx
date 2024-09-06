import { useSelectedStrips } from '../../state/useSelectedStrips'
import { ContextMenu } from '@toshusai/cmpui'
import { state } from '@/state'
import { useSnapshot } from 'valtio'
import { Cursor } from '../Cursor'
import { KeyframeLine } from './KeyframeLine'
import { TimeView } from './TimeView'
import { ChangeKeyframeEditorSnapToggle } from './ChangeKeyframeEditorSnapToggle'
import { KeyframeContextMenuContent } from './KeyframeContextMenuContent'

export function KeyframeEditor() {
  const strips = useSelectedStrips()
  const snap = useSnapshot(state)
  const pxPerSec = 100

  if (strips.length === 0) {
    return null
  }
  const strip = strips[0]

  return (
    <ContextMenu content={<KeyframeContextMenuContent />}>
      <div className="w-full">
        <div className="grid grid-cols-3 p-4">
          <div></div>
          <div className="flex justify-center"></div>
          <div className="flex justify-end">
            <ChangeKeyframeEditorSnapToggle />
          </div>
        </div>
        <div className="pl-[64px] border-b border-gray-300">
          <TimeView pxPerSec={100} startSec={0} stripStartSec={strip.start} />
        </div>
        <KeyframeLine />
        {snap.currentTime - strip.start >= 0 && (
          <Cursor
            style={{
              left: 64 + snap.currentTime * pxPerSec - strip.start * pxPerSec,
              top: 32,
            }}
          >
            {(snap.currentTime - strip.start).toFixed(2)}
          </Cursor>
        )}
      </div>
    </ContextMenu>
  )
}
