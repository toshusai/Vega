import { stripIsVisible } from '@/rendering/stripIsVisible'
import { ShaderMaterial } from 'three'
import * as THREE from 'three'
import { PostProcessEffect, Strip, VegaProject } from '../schemas'
import { globalGl } from './glSetup'
import { calculateKeyFrameValue } from './calculateKeyFrameValue'

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
      fragmentShader: effect.fragmentShader,
      transparent: true
    })
    material.needsUpdate = true
    material.blending = THREE.CustomBlending
    material.blendSrc = THREE.OneFactor
    material.blendDst = THREE.OneMinusSrcAlphaFactor
    material.blendEquation = THREE.AddEquation
    material.depthWrite = false
    materialMap.set(effect.id, material)
  }
  globalGl.mesh.material = material

  const animatedUniforms = JSON.parse(JSON.stringify(effect.uniforms ?? {})) as Record<
    string,
    number
  >
  Object.keys(animatedUniforms).forEach((key) => {
    const value = animatedUniforms[key]
    const newValue = calculateKeyFrameValue(
      effect.keyframes,
      scene.currentTime - strip.start,
      `uniforms.${key}`,
      value,
      scene.fps
    )
    if (!material.uniforms[key]) {
      material.uniforms[key] = { value: newValue }
    }
    material.uniforms[key].value = newValue
  })

  material.uniforms.uTime.value = scene.currentTime
  material.uniforms.uResolution.value = new THREE.Vector2(ctx.canvas.width, ctx.canvas.height)

  globalGl.mesh.material.needsUpdate = true
  globalGl.tex.needsUpdate = true
  globalGl.renderer.render(globalGl.scene, globalGl.camera)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(globalGl.renderer.domElement, 0, 0)
}
