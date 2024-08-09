import { state } from '../state'
import { updateTextEffect } from './updateTextEffect'
import { stripIsVisible } from './stripIsVisible'
import { PostProcessEffect, TextEffect } from '@renderer/schemas'
import { updatePostProcessEffect } from '@renderer/rendering/updatePostProcessEffect'

export async function updateCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 1280, 720)

  const sortedStrips = state.strips
    .map((strip) => JSON.parse(JSON.stringify(strip)))
    .filter((strip) => stripIsVisible(strip, state.currentTime, state.fps))
    .sort((a, b) => a.layer - b.layer)

  for (const strip of sortedStrips) {
    for (const effect of strip.effects) {
      if (effect.type === 'text') {
        await updateTextEffect(ctx, effect as TextEffect, strip, state)
      } else if (effect.type === 'postProcess') {
        await updatePostProcessEffect(ctx, effect as PostProcessEffect, strip, state)
      }
    }
  }
}
