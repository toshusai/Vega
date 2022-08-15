import * as THREE from 'three'
import { easeInOutCubic } from '../utils/easeInOutCubic'
import { normalize } from '../utils/normalize'
import { calcAnimationValue, findBetween } from '../utils/calcAnimationValue'
import { ImageStripEffect } from './ImageStripEffect'
import { EffectObject } from './EffectObject'
import { TextStripEffect } from './TextStripEffect'
import { Strip } from './Strip'
import { Timeline } from './Timeline'

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

  constructor (iface: ImageStripEffect, src: string) {
    super()

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
    if (iface.id) {
      this.obj.uuid = iface.id
    }

    this.obj.position.set(iface.position.x, iface.position.y, 0)
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

  public update (
    strip: Strip,
    effect: ImageStripEffect,
    time: number,
    isPlay: boolean,
    jump: boolean
  ) {
    this.obj.position.set(effect.position.x, effect.position.y, strip.layer)
    this.obj.scale.set(effect.scale.x, effect.scale.y, 1)
    this.obj.position.setZ(strip.layer)

    if (strip.start <= time && time < strip.start + strip.length) {
      this.obj.visible = true
    } else {
      this.obj.visible = false
    }
  }
}
