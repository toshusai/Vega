import { IconButton, MenuBar, MenuBarButton, MenuBarItem, Toast } from '@toshusai/cmpui'
import { state } from '../../state'
import { useEffect, useState } from 'react'
import { VegaProject } from '@renderer/schemas'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { isTextEffect } from '@renderer/rendering/isTextEffect'

export function Header() {
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('vega') ?? 'null') as VegaProject | null
    if (!data) return
    // state.assets = data.assets
    state.currentTime = data.currentTime
    state.fps = data.fps
    state.initialized = data.initialized
    state.isPlaying = data.isPlaying
    state.isSnap = data.isSnap
    state.length = data.length
    state.selectedStripIds = data.selectedStripIds
    state.canvasHeight = data.canvasHeight
    state.canvasWidth = data.canvasWidth
    state.viewEndRate = data.viewEndRate
    state.viewStartRate = data.viewStartRate
    state.canvasLeft = data.canvasLeft
    state.canvasTop = data.canvasTop
    state.selectedAssetIds = data.selectedAssetIds
    state.selectedKeyframeIds = data.selectedKeyframeIds
    state.canvasScale = data.canvasScale
    state.recordingState = data.recordingState
    state.strips = data.strips

    for (const strip of state.strips) {
      for (const effect of strip.effects) {
        if (isTextEffect(effect)) {
          if (!effect.characterSpacing) {
            effect.characterSpacing = 0
          }
        }
      }
    }
  }, [])
  const [open, setOpen] = useState(false)
  return (
    <div className="flex justify-between">
      <MenuBar>
        <MenuBarButton
          content={
            <>
              <MenuBarItem
                onClick={() => {
                  state.recordingState = 'recording'
                }}
              >
                Export
              </MenuBarItem>
            </>
          }
        >
          File
        </MenuBarButton>
      </MenuBar>
      <IconButton
        onClick={() => {
          const json = JSON.stringify(state)
          localStorage.setItem('vega', json)
          setOpen(true)
        }}
        size="S"
      >
        <IconDeviceFloppy size={16} />
        <Toast open={open} onOpenChange={setOpen}>
          <div className="p-4">Save completed</div>
        </Toast>
      </IconButton>
    </div>
  )
}
