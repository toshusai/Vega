import { useEffect } from 'react'
import { VegaProject } from '@/schemas'
import { isTextEffect } from '@/rendering/isTextEffect'
import { commit, undo } from '@/state/UndoManager'
import { state } from '@/state'

export function useBackDataFromLocalStorage() {
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('vega') ?? 'null') as VegaProject | null
    if (!data) return
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

    state.timelineSettings = data.timelineSettings
    state.keyframeSettings = data.keyframeSettings

    commit()
    return () => {
      undo()
    }
  }, [])
}
