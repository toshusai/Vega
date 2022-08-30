/// <amd-module name='TimeStamp'/>

import { EffectUpdateContext, TextStripEffect } from '@toshusai/vega-core'

export default class TimeStampEffectObject {
  update (ctx: EffectUpdateContext) {
    const time = ctx.timeline.curent
    const strip = ctx.strip

    if (strip.start <= time && time < strip.start + strip.length) {
      const text = ctx.timeline.curent.toFixed(3)
      const textEffect = ctx.strip.effects.find(
        e => e.type === 'Text'
      ) as TextStripEffect
      if (textEffect.text === text) {
        return
      }
      if (textEffect) {
        textEffect.text = text
      }
      ctx.updateEffect(strip.id, textEffect)
    }
  }
}

export const name = 'TimeStamp'
