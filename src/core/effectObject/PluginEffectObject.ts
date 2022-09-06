import { EffectUpdateContext } from '../EffectUpdateContext'
import { PluginStripEffect } from '../stripEffect'
import { EffectObject } from './EffectObject'

export class PluginEffectObject extends EffectObject {
  /**
   * called every fame
   * @param ctx
   */
  update (ctx: EffectUpdateContext) {
    // should implement
  }

  onMounted (el: HTMLElement, effect: PluginStripEffect) {
    // should implement
  }

  onUnMounted (el: HTMLElement, effect: PluginStripEffect) {
    // should implement
  }
}
