import { AssetState } from '../composables/useAssets'
import { Timeline } from './Timeline'
import { EffectObject } from './EffectObject'
import { Strip } from './Strip'
import { StripEffect } from '@/core/StripEffect'

export interface PluginContext {
  timeline: Timeline;
  assets: AssetState
}

export type PluginEffect = StripEffect;

export class PluginEffectObject extends EffectObject {
  update (strip: Strip, effect: StripEffect, time: number, isPlay: boolean, jump: boolean): void {
    //
  }
}
