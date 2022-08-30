/// <amd-module name='TimeStamp'/>

import { EffectUpdateContext, TextStripEffect } from '@toshusai/vega-core'

let fetched = false

export default class TimeStampEffectObject {
  update (ctx: EffectUpdateContext) {
    const time = ctx.timeline.curent
    const strip = ctx.strip

    if (strip.start <= time && time < strip.start + strip.length) {
      const text = ctx.timeline.curent.toFixed(3)
      const textEffect = ctx.strip.effects.find(
        (e: any) => e.type === 'Text'
      ) as TextStripEffect
      if (textEffect.text === text) {
        return
      }
      if (textEffect) {
        textEffect.text = text
      }
      ctx.updateEffect(strip.id, textEffect)
      if (!fetched) {
        fetched = true
        fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823'
        ).then((x) => {
          x.json().then((body) => {
            console.log(body)
          })
        })
      }
    }
  }
}

export const name = 'TimeStamp'
