import * as THREE from 'three'

export let globalGl: {
  camera: THREE.OrthographicCamera
  scene: THREE.Scene
  tex: THREE.Texture
  mat: THREE.ShaderMaterial
  mesh: THREE.Mesh
  renderer: THREE.WebGLRenderer
} | null = null

export function glSetup(canvas: HTMLCanvasElement, glCanvas: HTMLCanvasElement) {
  if (globalGl) {
    globalGl.tex.image = canvas
    globalGl.renderer.dispose()
    globalGl.renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true })
    globalGl.renderer.setClearColor(0x000000, 0)
    return
  }
  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, alpha: true })
  renderer.setClearColor(0x000000, 0)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1
  const scene = new THREE.Scene()
  const geo = new THREE.PlaneGeometry(2, 2)

  const tex = new THREE.Texture(canvas)
  tex.premultiplyAlpha = true
  tex.needsUpdate = true
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: tex },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1280, 720) }
    },
    vertexShader: `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
    fragmentShader: `
uniform sampler2D uTexture;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(uTexture, vUv);
}
`,
    transparent: true
  })
  mat.blending = THREE.CustomBlending
  mat.blendSrc = THREE.OneFactor
  mat.blendDst = THREE.OneMinusSrcAlphaFactor
  mat.blendEquation = THREE.AddEquation

  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  globalGl = {
    renderer,
    camera,
    scene,
    tex,
    mat,
    mesh
  }
}
