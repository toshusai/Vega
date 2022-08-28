import * as THREE from 'three'
import { ImageStripEffect } from './stripEffect'
import { EffectObject, EffectUpdateContext } from './EffectObject'

export class ImageStripEffectObject extends EffectObject {
  type = 'Image'

  obj!: THREE.Mesh
  tex?: THREE.Texture

  playRequests: number[] = []
  videoDuration = 0

  event: EventTarget = new EventTarget()

  /**
   * quad plane geometry that forward -Z.
   * size is 1x1.
   */
  geometry?: THREE.PlaneBufferGeometry
  /**
   * material
   */
  material?: THREE.MeshBasicMaterial

  get width () {
    return this.tex?.image ? this.tex.image.width : 0
  }

  get height () {
    return this.tex?.image ? this.tex.image.height : 0
  }

  constructor (ctx:EffectUpdateContext) {
    super(ctx)
    const effect = ctx.effect as ImageStripEffect
    const src = ctx.assets.assets.find(a => a.id === effect.imageAssetId)?.path || ''

    this.tex = new THREE.TextureLoader().load(src, () => {
      if (this.obj) {
        this.obj.scale.set(this.tex?.image.width, this.tex?.image.height, 1)
      }
    })
    this.tex.minFilter = THREE.LinearFilter
    this.tex.magFilter = THREE.LinearFilter
    this.material = new THREE.MeshBasicMaterial({
      map: this.tex,
      transparent: true
      //   depthTest: true,
      // colorWrite: false,
      //   depthWrite: false,
      //   opacity: 1,
      //   blending: THREE.CustomBlending,
      //   blendSrc: THREE.OneFactor,
      //   blendDst: THREE.OneMinusSrcAlphaFactor,
      //   blendEquation: THREE.AddEquation,
      // alphaMap: this.texture,
      // stencilFuncMask: 0x00,
      //   stencilWriteMask: 0xFF,
      //   stencilWrite: true
    })
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
    this.obj = new THREE.Mesh(this.geometry, this.material)
    if (effect.id) {
      this.obj.uuid = effect.id
    }

    this.obj.position.set(effect.position.x, effect.position.y, 0)
    this.updateAsset(src)
    ctx.scene.add(this.obj)
  }

  updateStrip (ctx: EffectUpdateContext): void {
    const effect = ctx.effect as ImageStripEffect
    const src = ctx.assets.assets.find(a => a.id === effect.imageAssetId)?.path || ''
    this.updateAsset(src)
  }

  updateAsset (src: string) {
    this.tex?.dispose()
    new THREE.TextureLoader().load(src, (tex) => {
      if (this.obj) {
        this.obj.scale.set(1, 1, 1)
      }
      tex.needsUpdate = true
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      this.tex = tex
      if (this.material) {
        this.geometry = new THREE.PlaneGeometry(
          tex.image.width,
          tex.image.height
        )
        this.obj.geometry = this.geometry
        this.material.map = this.tex
        this.material.needsUpdate = true
      }
    })
  }

  public update ({ strip, effect: _effect, timeline, isPlay, jump }: EffectUpdateContext) {
    const effect = _effect as ImageStripEffect
    const time = timeline.curent
    this.obj.position.set(effect.position.x, effect.position.y, strip.layer)
    this.obj.scale.set(effect.scale.x, effect.scale.y, 1)

    if (strip.start <= time && time < strip.start + strip.length) {
      this.obj.visible = true
    } else {
      this.obj.visible = false
    }
  }
}
