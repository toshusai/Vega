import * as THREE from 'three'
import { Scene } from 'three'
import { EffectObject } from '@/core/EffectObject'

export class Renderer {
  static scene = new Scene()
  static camera = new THREE.OrthographicCamera(0, 0, 200, 200)
  static effectObjectMap = new Map<string, EffectObject>()
}
