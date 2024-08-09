import { globalGl } from '@renderer/components/Preview/glSetup'
import { stripIsVisible } from '@renderer/components/Preview/updateTextEffect'
import { HSVA, Vector2 } from '@toshusai/cmpui'
import { ShaderMaterial } from 'three'
import * as THREE from 'three'

export type Strip = {
  id: string
  start: number
  length: number
  effects: Effect[]
  layer: number
}
export type Asset = {
  id: string
  name: string
  type: string
  path: string
}

export type AudioAsset = Asset & {
  type: 'audio'
  path: string
}

export type FontAsset = Asset & {
  type: 'font'
  path: string
}

export type ImageAsset = Asset & {
  type: 'image'
  path: string
}

export type ScriptAsset = Asset & {
  type: 'script'
  path: string
}

export type ScriptMeta = {
  id: string
  name: string
  description: string
  version: string
}

export function isScriptAsset(asset: Asset): asset is ScriptAsset {
  return asset.type === 'script'
}

export type VideoAsset = Asset & {
  type: 'video'
  path: string
}

export type AudioEffect = {
  id: string
  type: 'audio'
  audioAssetId: string
  volume: number
  offset: number
  keyframes: KeyFrame[]
}

export type Effect = {
  id: string
  type: string
  keyframes: KeyFrame[]
}

export type ImageEffect = {
  id: string
  type: 'image'
  imageAssetId: string
  x: number
  y: number
  scaleX?: number
  scaleY?: number
  width?: number
  height?: number
  opacity?: number
  keyframes: KeyFrame[]
}

export type KeyFrame = {
  id: string
  time: number
  value: number
  property: string
  ease: Ease
}

export type ScriptEffect = {
  id: string
  type: 'script'
  scriptAssetId: string
  keyframes: KeyFrame[]
}

export type PostProcessEffect = {
  id: string
  type: 'postProcess'
  fragmentShader: string
  keyframes: KeyFrame[]
}

export const materialMap = new Map<string, ShaderMaterial>()

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export async function updatePostProcessEffect(
  ctx: CanvasRenderingContext2D,
  effect: PostProcessEffect,
  strip: Strip,
  scene: VegaProject
) {
  const visible = stripIsVisible(strip, scene.currentTime, scene.fps)
  if (!visible) {
    return
  }
  if (!globalGl) {
    return
  }

  let material = materialMap.get(effect.id)
  if (!material) {
    material = new ShaderMaterial({
      uniforms: {
        uTexture: { value: globalGl.tex },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1280, 720) }
      },
      vertexShader,
      fragmentShader: effect.fragmentShader
    })
    material.needsUpdate = true
    materialMap.set(effect.id, material)
  }
  globalGl.mesh.material = material
  material.uniforms.uTime.value = scene.currentTime
  material.uniforms.uResolution.value = new THREE.Vector2(ctx.canvas.width, ctx.canvas.height)
  globalGl.mesh.material.needsUpdate = true
  globalGl.tex.needsUpdate = true
  globalGl.renderer.render(globalGl.scene, globalGl.camera)
  ctx.drawImage(globalGl.renderer.domElement, 0, 0)
}

export type TextEffect = {
  id: string
  type: 'text'
  text: string
  x: number
  y: number
  fontAssetId: string
  fontSize: number
  scale?: Vector2
  fontStyle?: string
  color?: HSVA
  shadowColor?: string
  shadowBlur?: number
  outlineColor?: string
  outlineWidth?: number
  characterSpacing?: number
  align?: TextAlign
  keyframes: KeyFrame[]
}

export enum TextAlign {
  left = 'left',
  center = 'center',
  right = 'right'
}

export type VideoEffect = {
  id: string
  type: 'video'
  videoAssetId: string
  x: number
  y: number
  scaleX?: number
  scaleY?: number

  width?: number
  height?: number

  keyframes: KeyFrame[]

  playbackRate?: number

  offset?: number
}

export enum Ease {
  Linear = 'linear',
  EaseInSine = 'easeInSine',
  EaseOutSine = 'easeOutSine',
  EaseOutQuart = 'easeOutQuart',
  EaseInExpo = 'easeInExpo',
  EaseInOutQuad = 'easeInOutQuad',
  EaseOutBack = 'easeOutBack',
  EaseInCubic = 'easeInCubic'
}

export const allEase = Object.values(Ease).map((ease) => ease)

export function getEasingFunction(ease: Ease) {
  switch (ease) {
    case Ease.Linear:
      return linear
    case Ease.EaseInSine:
      return easeInSine
    case Ease.EaseOutSine:
      return easeOutSine
    case Ease.EaseOutQuart:
      return easeOutQuart
    case Ease.EaseInExpo:
      return easeInExpo
    case Ease.EaseInOutQuad:
      return easeInOutQuad
    case Ease.EaseOutBack:
      return easeOutBack
    case Ease.EaseInCubic:
      return easeInCubic
    default:
      return linear
  }
}

export function linear(x: number): number {
  return x
}

export function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2)
}

export function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2)
}

export function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4)
}

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10)
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

export function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function easeInCubic(x: number): number {
  return x * x * x
}

export type VegaProject = {
  initialized: boolean
  currentTime: number
  viewStartRate: number
  viewEndRate: number
  length: number
  strips: Strip[]
  isSnap: boolean
  fps: number
  assets: Asset[]
  isPlaying: boolean
  selectedStripIds: string[]
  selectedAssetIds: string[]
  canvasWidth: number
  canvasHeight: number
  selectedKeyframeIds: string[]
  recordingState: 'idle' | 'recording' | 'paused'
  canvasLeft: number
  canvasTop: number
  canvasScale: number
}
