import { Scene } from 'three'
import { AssetState } from '../composables/useAssets'
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
}

export class EffectObject {
  update (ctx: EffectUpdateContext) {
    // do nothing
  }
}
