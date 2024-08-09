import { createDragHandler } from '@renderer/interactions/createDragHandler'
import { state } from '@renderer/state'
import { snapState } from '.'
import { setPropertyWithKeyFrame } from './setPropertyWithKeyFrame'
import { snapEffect } from './snapEffect'
import { getSelectedAnimatedTextEffects } from '../../state/getSelectedAnimatedTextEffects'
import { selectedTextEffects } from '../../state/selectedTextEffects'
import { measureMapState } from '../../rendering/updateTextEffect'

export function createPreviewDragHandler(stripId: string) {
  return createDragHandler({
    onDown: () => {
      const effects = getSelectedAnimatedTextEffects(
        selectedTextEffects(),
        state.currentTime,
        state.fps
      )
      const mainEffectIndex = effects.findIndex((effect) => effect.id === stripId)

      const effectArray = [
        effects[mainEffectIndex],
        ...effects.filter((effect) => effect.id !== stripId)
      ]
      return {
        x: effectArray.map((effect) => effect.x),
        y: effectArray.map((effect) => effect.y),
        effects: effectArray
      }
    },
    onMove: (_, ctx, move) => {
      if (!ctx) return
      const effects = ctx.effects
      let snapDiffX = 0
      let snapDiffY = 0

      effects.forEach((animatedEffect, i) => {
        const effect = selectedTextEffects().find((effect) => effect.id === animatedEffect.id)
        if (!effect) return
        const newX = ctx.x[i] + move.diffX / state.canvasScale
        const newY = ctx.y[i] + move.diffY / state.canvasScale
        effect.x = newX
        effect.y = newY
        const width = measureMapState.get(effect.id)?.width ?? 0
        const height = measureMapState.get(effect.id)?.height ?? 0

        if (snapDiffX !== 0 || snapDiffY !== 0) {
          setPropertyWithKeyFrame(effect, 'x', newX + snapDiffX)
          setPropertyWithKeyFrame(effect, 'y', newY + snapDiffY)
        } else if (i === 0) {
          const p = snapEffect(
            newX,
            newY,
            width,
            height,
            effects.map((effect) => effect.id),
            effect,
            4 / state.canvasScale
          )
          if (p) {
            snapDiffX = p.diffX
            snapDiffY = p.diffY
          }
        } else {
          setPropertyWithKeyFrame(effect, 'x', newX)
          setPropertyWithKeyFrame(effect, 'y', newY)
        }
      })
    },
    onUp: () => {
      snapState.points = []
    }
  })
}
