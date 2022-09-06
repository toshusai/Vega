import { PluginEffect } from '../dist'
import { EffectUpdateContext } from '../EffectUpdateContext'
import { EffectObject } from './EffectObject'

export class PluginEffectObject extends EffectObject {
  /**
   * called every fame
   * @param ctx
   */
  update (ctx: EffectUpdateContext): void {
    // should implement
  }

  onMounted (el:HTMLElement, effect: PluginEffect) {
    // should implement
  }

  onUnMounted (el:HTMLElement, effect: PluginEffect) {
    // should implement
  }
}
