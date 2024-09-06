import { PostProcessEffect, Strip } from '@/schemas'
import { state } from '@/state'
import { commit } from '@/state/UndoManager'
import { getFirstAddableLayer } from '../getFirstAddableLayer'

export function createNewPostProcessEffect() {
  const id = Math.random().toString()
  const newStrip: Strip = {
    id,
    start: state.currentTime,
    length: 1,
    layer: getFirstAddableLayer(1),
    effects: [
      {
        id,
        fragmentShader: `
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec2 shift = vec2(0.003, 0);
  vec4 color = texture2D(uTexture, vUv);
  color.r = texture2D(uTexture, vUv + shift).r;
  color.g = texture2D(uTexture, vUv).g;
  color.b = texture2D(uTexture, vUv - shift).b;
  color.a = 1.0;
  gl_FragColor = color;
}
`,
        keyframes: [],
        type: 'postProcess',
      } as PostProcessEffect,
    ],
  }
  state.strips.push(newStrip)
  state.selectedStripIds = [id]
  commit()
}
