import * as THREE from 'three'

export let globalGl: {
  camera: THREE.OrthographicCamera
  scene: THREE.Scene
  tex: THREE.Texture
  mat: THREE.ShaderMaterial
} | null = null

export function glSetup(canvas: HTMLCanvasElement) {
  if (globalGl) {
    globalGl.tex.image = canvas
    return
  }
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1
  const scene = new THREE.Scene()
  const geo = new THREE.PlaneGeometry(2, 2)

  const tex = new THREE.Texture(canvas)
  tex.needsUpdate = true
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: tex },
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1280, 720) },
      uShiftAmount: { value: new THREE.Vector2(4, 0) }
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
  uniform vec2 uShiftAmount;
  varying vec2 vUv;

  void main() {
      vec2 shift = uShiftAmount / uResolution;
      vec4 color;
      color.r = texture2D(uTexture, vUv + shift).r;
      color.g = texture2D(uTexture, vUv).g;
      color.b = texture2D(uTexture, vUv - shift).b;
      color.a = 1.0;

      vec2 uv = vUv - vec2(0.5, 0.5);
      float len = length(uv);
      float vignette = smoothstep(0.5, 0.8, len);
      color.rgb *= 1.0 - vignette;
      gl_FragColor = color;
  }
  `
  })

  const mesh = new THREE.Mesh(geo, mat)
  scene.add(mesh)

  globalGl = {
    camera,
    scene,
    tex,
    mat
  }
}
