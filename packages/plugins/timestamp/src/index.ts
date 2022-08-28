/// <amd-module name='TimeStamp'/>

export interface StripEffect {
  id: string;
  type: string;
  animations: Animation[];
}

interface EffectUpdateContext {
  timeline: any;
  assets: any;
  scene: any;
  strip: any;
  effect: any;
  updateStrip: any; // NOTE this property is not official interface
  isPlay: boolean;
  jump: boolean;
}

export default class TimeStampEffectObject {
  update (ctx: EffectUpdateContext) {
    const time = ctx.timeline.curent
    const strip = ctx.strip

    if (strip.start <= time && time < strip.start + strip.length) {
      const text = ctx.timeline.curent.toFixed(3)
      const textEffect = ctx.strip.effects.find((e: any) => e.type === 'Text')
      if (textEffect.text === text) {
        return
      }
      if (textEffect) {
        textEffect.text = text
      }
      ctx.updateStrip(textEffect)
    }
  }
}

export const name = 'TimeStamp'
