import {
  Ease,
  Effect,
  FontAsset,
  getEasingFunction,
  KeyFrame,
  Strip,
  TextEffect,
  VegaProject
} from '../../schemas'
import { hsvToHex } from '@toshusai/cmpui'
import { proxyMap } from 'valtio/utils'
import { getDeepProperties } from './getDeepProperties'
import { assignDeepProperty } from './assignDeepProperty'
import { getDeepProperty } from './getDeepProperty'

const loadedFontAssetMap = new Map<string, boolean>()

export async function loadFont(fontAsset: FontAsset) {
  if (!loadedFontAssetMap.has(fontAsset.id) && fontAsset) {
    loadedFontAssetMap.set(fontAsset.id, true)

    const link = document.createElement('link')
    link.href = fontAsset.path
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return new Promise<void>((resolve) => {
      link.onload = () => {
        resolve()
      }
    })
  }
  return Promise.resolve()
}

export const measureMapState = proxyMap<
  string,
  {
    left: number
    top: number
    width: number
    height: number
    scaledRect: {
      left: number
      top: number
      width: number
      height: number
    }
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

export type DeepReadOnly<T> = {
  readonly [K in keyof T]: DeepReadOnly<T[K]>
}

export function isTextEffect(effect: Effect | DeepReadOnly<Effect>): effect is TextEffect {
  return effect.type === 'text'
}

export async function updateTextEffect(
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
    await loadFont(fontAsset as FontAsset)
  }

  const animatedEffect: TextEffect = JSON.parse(JSON.stringify(effect))

  const allKeys = getDeepProperties(effect)
  allKeys.forEach((key) => {
    const value = getDeepProperty(effect, key)
    if (typeof value !== 'number') {
      return
    }
    if (effect.keyframes.length === 0) {
      return
    }
    const newValue = calculateKeyFrameValue(
      effect.keyframes,
      scene.currentTime - strip.start,
      key,
      value,
      scene.fps
    )

    assignDeepProperty(animatedEffect, key, newValue)
  })

  ctx.fillStyle = 'black'
  ctx.font =
    (animatedEffect.fontStyle ?? '') +
    ' ' +
    animatedEffect.fontSize +
    'px ' +
    (fontAsset !== undefined ? '' + fontAsset.id : 'sans-serif')

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
  const maxHeight = lineHeight * lines.length
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

  ctx.fillStyle = hsvToHex(animatedEffect.color ?? { a: 1, h: 0, s: 0, v: 0 }) ?? 'black'
  ctx.globalAlpha =
    animatedEffect.color === undefined ? 1 : Math.min(Math.max(animatedEffect.color.a, 0), 1)
  top = y - maxHeight / 2
  left = x - maxWidth / 2
  lineIndex = 0
  width = 0
  moveAlign()
  const align = animatedEffect.align
  ctx.save()
  ctx.translate(x, y)
  // TODO: rotation
  ctx.scale(animatedEffect.scale?.x ?? 1, animatedEffect.scale?.y ?? 1)
  ctx.rotate(0)
  ctx.translate(-x, -y)

  if (align === 'right') {
    ctx.translate(maxWidth, 0)
  } else if (align === 'center') {
    ctx.translate(maxWidth / 2, 0)
  }
  for (let i = 0; i < animatedEffect.text.length; i++) {
    const char = animatedEffect.text[i]
    if (char === '\n') {
      top += lineHeight
      left = x - maxWidth / 2
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
  if (align === 'right') {
    ctx.translate(-maxWidth, 0)
  } else if (align === 'center') {
    ctx.translate(-maxWidth / 2, 0)
  }
  ctx.restore()

  measureMapState.set(animatedEffect.id, {
    left: x - maxWidth / 2,
    top: y - maxHeight / 2,
    width: maxWidth,
    height: maxHeight,
    scaledRect: {
      left: x - (maxWidth / 2) * (animatedEffect.scale?.x ?? 1),
      top: y - (maxHeight / 2) * (animatedEffect.scale?.y ?? 1),
      width: maxWidth * (animatedEffect.scale?.x ?? 1),
      height: maxHeight * (animatedEffect.scale?.y ?? 1)
    }
  })
}

export function pointerInRect(
  x: number,
  y: number,
  rect: { left: number; top: number; width: number; height: number }
) {
  return (
    x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height
  )
}

export function calculateKeyFrameValue(
  keyframes: KeyFrame[],
  currentTime: number,
  property: string,
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
