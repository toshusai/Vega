import { Strip } from '../core/Strip'
import { TextStripEffectObject } from '../core/TextStripEffectObject'
import { calcAnimationValue } from './calcAnimationValue'

/**
 * Stripからフルサイズの矩形を取得する
 * @param strip
 * @param currentTime
 * @param width
 * @param height
 * @returns
 */
export function stripToRect (
  strip: Strip,
  currentTime: number,
  width: number,
  height: number
) {
  if (strip.effects.length === 0) {
    return
  }
  const effect = strip.effects[0]
  if (isText(effect)) {
    const obj = effectObjectMap.get(effect.id)
    if (!(obj instanceof TextStripEffectObject)) { return { display: 'none' } }

    const x = calcAnimationValue(
      effect.animations,
      currentTime - strip.start,
      'position.x',
      effect.position.x
    )

    const y = calcAnimationValue(
      effect.animations,
      currentTime - strip.start,
      'position.y',
      effect.position.y
    )

    return {
      left: width / 2 + x - obj.mesureWidth / 2 + 'px',
      bottom: height / 2 + y - obj.mesureHeight / 2 + 'px',
      width: obj.mesureWidth + 'px',
      height: obj.mesureHeight + 'px'
    }
  }
}
