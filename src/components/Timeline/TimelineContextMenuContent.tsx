import { state } from '@/state'
import { ContextMenuItem } from '@toshusai/cmpui'
import { useSnapshot } from 'valtio'
import { createNewTextEffect } from './actions/createNewTextEffect'
import { deleteSelectedStrips } from './actions/deleteSelectedStrips'
import { createNewPostProcessEffect } from './actions/createNewPostProcessEffect'

export function TimelineContextMenuContent() {
  const snap = useSnapshot(state)

  return (
    <>
      <ContextMenuItem
        onClick={() => {
          createNewTextEffect()
        }}
      >
        Create Text
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          createNewPostProcessEffect()
        }}
      >
        Create PostProcess
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => {
          deleteSelectedStrips()
        }}
        disabled={snap.selectedStripIds.length === 0}
      >
        Delete
      </ContextMenuItem>
    </>
  )
}
