import { AssetState } from './AssetState'
import { Timeline } from './Timeline'
import { EffectObject, EffectUpdateContext } from './EffectObject'
import { StripEffect } from '@/core/StripEffect'

export interface PluginContext {
  timeline: Timeline;
  assets: AssetState
}

export type PluginEffect = StripEffect;

export class PluginEffectObject extends EffectObject {
  update (ctx: EffectUpdateContext): void {
    //
  }
}
