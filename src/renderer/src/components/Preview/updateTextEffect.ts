import {
  Ease,
  Effect,
  FontAsset,
  getEasingFunction,
  KeyFrame,
  Strip,
  TextEffect,
  VegaProject
} from '@renderer/schemas'
import { proxyMap } from 'valtio/utils'

const loadedFontAssetMap = new Map<string, boolean>()

export function loadFont(fontAsset: FontAsset) {
  if (!loadedFontAssetMap.has(fontAsset.id) && fontAsset) {
    const style = document.createElement('style')
    style.innerHTML = `@font-face {
        font-family: _${fontAsset.id};
        src: url(${fontAsset.path});
      }`
    document.head.appendChild(style)
    loadedFontAssetMap.set(fontAsset.id, true)
  }
}

export const measureMapState = proxyMap<
  string,
  {
    width: number
    height: number
  }
>()

export function floorFrame(time: number, fps: number) {
  return Math.round(time * fps)
}

export function stripIsVisible(strip: Strip, currentTime: number, fps: number) {
  const currentFrame = floorFrame(currentTime, fps)
  const startFrame = floorFrame(strip.start, fps)
  const endFrame = floorFrame(strip.start + strip.length, fps)
  return currentFrame >= startFrame && currentFrame < endFrame
}

export type PickProperties<T, TFilter> = {
  [K in keyof T as T[K] extends TFilter ? K : never]: T[K]
}

export function isTextEffect(effect: Effect): effect is TextEffect {
  return effect.type === 'text'
}

export function updateTextEffect(
  ctx: CanvasRenderingContext2D,
  effect: TextEffect,
  strip: Strip,
  scene: VegaProject
) {
  const visible = stripIsVisible(strip, scene.currentTime, scene.fps)
  if (!visible) {
    return
  }
  const fontAsset = scene.assets.find((asset) => asset.id === effect.fontAssetId)

  if (fontAsset) {
    loadFont(fontAsset as FontAsset)
  }

  const animatedEffect: TextEffect = {
    ...effect
  }
  Object.keys(effect).forEach((key) => {
    const k = key as keyof PickProperties<TextEffect, number>
    const value = effect[k]
    if (typeof value !== 'number') {
      return
    }
    if (effect.keyframes.length === 0) {
      return
    }
    animatedEffect[k] = calculateKeyFrameValue(
      effect.keyframes,
      scene.currentTime - strip.start,
      key,
      value,
      scene.fps
    )
  })

  ctx.fillStyle = 'black'
  ctx.font =
    (animatedEffect.fontStyle ?? '') +
    ' ' +
    animatedEffect.fontSize +
    'px ' +
    (fontAsset !== undefined ? '_' + fontAsset.id : 'sans-serif')

  const x = animatedEffect.x
  const y = animatedEffect.y
  let top = animatedEffect.y
  let left = animatedEffect.x
  let width = 0
  let maxWidth = 0
  const lineHeight = animatedEffect.fontSize
  const characterSpacing = animatedEffect.characterSpacing ?? 0
  ctx.textBaseline = 'top'
  ctx.shadowColor = animatedEffect.shadowColor ?? 'transparent'
  ctx.shadowBlur = animatedEffect.shadowBlur ?? 0
  ctx.lineJoin = 'round'
  ctx.strokeStyle = animatedEffect.outlineColor ?? 'transparent'
  ctx.lineWidth = animatedEffect.outlineWidth ?? 1
  if ((animatedEffect.outlineWidth ?? 0) <= 1) {
    ctx.strokeStyle = 'transparent'
  }

  const lines = animatedEffect.text.split('\n')
  const lineWidths = lines.map((line) => {
    return ctx.measureText(line).width
  })

  let lineIndex = 0

  function moveAlign() {
    if (animatedEffect.align === 'center') {
      left -= lineWidths[lineIndex] / 2
      left -= ((lines[lineIndex].length - 1) * characterSpacing) / 2
    } else if (animatedEffect.align === 'right') {
      left -= lineWidths[lineIndex]
      left -= (lines[lineIndex].length - 1) * characterSpacing
    }
  }

  moveAlign()
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i]
    if (char === '\n') {
      top += lineHeight
      left = x
      lineIndex++
      width = 0
      moveAlign()
      continue
    }
    const w = ctx.measureText(char).width
    ctx.strokeText(char, left, top)
    left += w + characterSpacing
    width += w + characterSpacing
    maxWidth = Math.max(maxWidth, width)
  }

  ctx.fillStyle = animatedEffect.color ?? 'black'
  top = y
  left = x
  lineIndex = 0
  width = 0
  moveAlign()
  let lineNum = 1
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i]
    if (char === '\n') {
      lineNum += 1
      top += lineHeight
      left = x
      lineIndex++
      width = 0
      moveAlign()
      continue
    }
    const w = ctx.measureText(char).width
    ctx.fillText(char, left, top)
    left += w + characterSpacing
    width += w + characterSpacing
    maxWidth = Math.max(maxWidth, width)
  }

  measureMapState.set(animatedEffect.id, {
    width: maxWidth,
    height: lineHeight * lineNum
  })
}

export function calculateKeyFrameValue(
  keyframes: KeyFrame[],
  currentTime: number,
  property: string | number | symbol,
  defaultValue: number,
  fps: number
) {
  const prevKeyframe = keyframes
    .filter((k) => k.property === property && k.time < currentTime + 1 / fps)
    .sort((a, b) => b.time - a.time)[0]
  const nextKeyframe = keyframes
    .filter((k) => k.property === property && k.time > currentTime - 1 / fps)
    .sort((a, b) => a.time - b.time)[0]

  if (!prevKeyframe && nextKeyframe) {
    return nextKeyframe.value
  }
  if (prevKeyframe && !nextKeyframe) {
    return prevKeyframe.value
  }
  if (prevKeyframe && nextKeyframe) {
    let ratio = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time)
    const ease = getEasingFunction(prevKeyframe.ease || Ease.Linear)
    if (isNaN(ratio) || ratio === Infinity || ratio === -Infinity) {
      ratio = 0
    }
    return prevKeyframe.value + (nextKeyframe.value - prevKeyframe.value) * ease(ratio)
  }
  return defaultValue
}
