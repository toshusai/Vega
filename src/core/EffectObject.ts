import { Scene } from 'three'
import { AssetState } from './AssetState'
import { Strip } from './Strip'
import { StripEffect } from './stripEffect'
import { Timeline } from './Timeline'

export interface EffectUpdateContext {
  timeline: Timeline;
  assets: AssetState;
  scene: Scene;
  strip: Strip;
  effect: StripEffect;
  isPlay: boolean;
  jump: boolean;
  updateEffect: (stripId: string, effect: StripEffect) => void;
}

export class EffectObject {
  // eslint-disable-next-line no-useless-constructor
  constructor (ctx: EffectUpdateContext) {
    // do nothingo
  }

  updateStrip (ctx: EffectUpdateContext) {
    // do nothing
  }

  update (ctx: EffectUpdateContext) {
    // do nothing
  }
}
