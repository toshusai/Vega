import { Ref } from 'nuxt/dist/app/compat/capi'
import * as THREE from 'three'
import { Timeline } from '@/core/Timeline'
import { EffectObject } from '@/core/EffectObject'
import { TextStripEffect } from '@/core/TextStripEffect'
import { StripEffect } from '@/core/StripEffect'
import { TextStripEffectObject } from '@/core/TextStripEffectObject'

import { VideoStripEffect } from '@/core/VideoStripEffect'
import { VideoStripEffectObject } from '@/core/VideoStripEffectObject'
import { snap } from '@/utils/snap'
import { Strip } from '@/core/Strip'
import { AudioStripEffect } from '@/core/AudioStripEffect'
import { AudioStripEffectObject } from '@/core/AudioStripEffectObject'
import { ImageStripEffect } from '@/core/ImageStripEffect'
import { ImageStripEffectObject } from '@/core/ImageStripEffectObject'
import { Animation } from '@/core/Animation'

export const initialTimelineState: Timeline = {
  isRecording: false,
  selectedStrips: [],
  selectedKeyframes: [],
  focusStripId: '',
  previewTool: 'cursor',
  timelineTool: 'cursor',
  isPlay: false,
  width: 1920,
  height: 1080,
  length: 15,
  curent: 3,
  end: 15,
  scale: 20,
  start: 0,
  strips: []
}

function findStripById (id: string, timeline: Timeline) {
  for (const strip of timeline.strips) {
    if (strip.id === id) {
      return strip
    }
  }
  return null
}

function moveStrip (timeline: Ref<Timeline>) {
  return (id: string, start: number, length: number, layer?: number) => {
    const strip = findStripById(id, timeline.value)
    if (!strip) {
      return
    }
    strip.start = snap(start)
    strip.length = snap(length)
    strip.layer = layer ?? strip.layer
  }
}

function changeView (timeline: Ref<Timeline>) {
  return (start: number, end: number) => {
    if (start < 0) {
      start = 0
    }
    if (end > timeline.value.length) {
      end = snap(timeline.value.length)
    }
    if (end - start < 1) {
      end = start + 1
    }
    timeline.value.start = snap(start)
    timeline.value.end = snap(end)
  }
}

const ONE_FRAME = 1 / 60

function update (timeline: Ref<Timeline>) {
  return (time: number, jump = false) => {
    if (time < 0) {
      time = 0
    }
    timeline.value.curent = time
    if (jump) {
      timeline.value.curent = Math.floor(time / ONE_FRAME) * ONE_FRAME
    }

    for (let j = 0; j < timeline.value.strips.length; j++) {
      const strip = timeline.value.strips[j]

      for (let k = 0; k < strip.effects.length; k++) {
        const effect = strip.effects[k]
        if (isText(effect)) {
          const textObj = effectObjectMap.get(
            effect.id
          ) as TextStripEffectObject
          if (textObj) {
            textObj.update(strip, effect, timeline.value)
          }
        } else if (isVideo(effect)) {
          const videoObj = effectObjectMap.get(
            effect.id
          ) as VideoStripEffectObject
          if (videoObj) {
            videoObj.update(
              strip,
              effect,
              timeline.value.curent,
              timeline.value.isPlay,
              jump
            )
          }
        } else if (isAudio(effect)) {
          const audioObj = effectObjectMap.get(
            effect.id
          ) as AudioStripEffectObject
          if (audioObj) {
            audioObj.update(
              strip,
              effect,
              timeline.value.curent,
              timeline.value.isPlay,
              jump
            )
          }
        } else if (isImage(effect)) {
          const imageObj = effectObjectMap.get(
            effect.id
          ) as ImageStripEffectObject
          if (imageObj) {
            imageObj.update(
              strip,
              effect,
              timeline.value.curent,
              timeline.value.isPlay,
              jump
            )
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn('Unknown effect type')
        }
      }
    }
  }
}

export const effectObjectMap = new Map<string, EffectObject>()

function play (timeline: Ref<Timeline>) {
  return (state: boolean) => {
    timeline.value.isPlay = state
  }
}

export function isText (effect: StripEffect): effect is TextStripEffect {
  return effect.type === 'Text'
}

export function isVideo (effect: StripEffect): effect is VideoStripEffect {
  return effect.type === 'Video'
}

export function isAudio (effect: StripEffect): effect is AudioStripEffect {
  return effect.type === 'Audio'
}
export function isImage (effect: StripEffect): effect is ImageStripEffect {
  return effect.type === 'Image'
}

export interface State {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  // renderer?: THREE.WebGLRenderer | null;
}

export const view: State = {
  scene: new THREE.Scene(),
  camera: new THREE.OrthographicCamera(0, 0, 200, 200)
}

export function setTimeline (state: Ref<Timeline>) {
  return (timeline: Timeline) => {
    state.value = timeline
  }
}

export function useTimeline () {
  const timeline = useState('timeline', () => initialTimelineState)
  const assets = useAssets()

  const init = () => {
    for (const strip of timeline.value.strips) {
      for (const effect of strip.effects) {
        if (isText(effect)) {
          if (!effectObjectMap.has(effect.id)) {
            const textObj = new TextStripEffectObject(effect)
            effectObjectMap.set(effect.id, textObj)
            view.scene.add(textObj.obj)
          }
        } else if (isVideo(effect)) {
          const veo = effectObjectMap.get(effect.id)
          const assetPath =
            assets.assets.value.assets.find(a => a.id === effect.videoAssetId)
              ?.path || ''

          if (veo instanceof VideoStripEffectObject) {
            veo.updateAsset(assetPath)
          } else {
            const videoObj = new VideoStripEffectObject(
              effect,
              assets.assets.value.assets.find(
                a => a.id === effect.videoAssetId
              )?.path || ''
            )
            effectObjectMap.set(effect.id, videoObj)
            view.scene.add(videoObj.obj)
          }
        } else if (isAudio(effect)) {
          if (!effectObjectMap.has(effect.id)) {
            const audioObj = new AudioStripEffectObject(
              effect,
              assets.assets.value.assets.find(
                a => a.id === effect.audioAssetId
              )?.path || ''
            )
            effectObjectMap.set(effect.id, audioObj)
          }
        } else if (isImage(effect)) {
          if (!effectObjectMap.has(effect.id)) {
            const audioObj = new ImageStripEffectObject(
              effect,
              assets.assets.value.assets.find(
                a => a.id === effect.imageAssetId
              )?.path || ''
            )
            effectObjectMap.set(effect.id, audioObj)
            view.scene.add(audioObj.obj)
          }
        } else {
          // eslint-disable-next-line no-console
          console.warn('Unknown effect type: ' + effect.type)
        }
      }
    }
  }

  return {
    timeline: readonly(timeline),
    init,
    addStrip: ((state: Ref<Timeline>) => {
      return (strip: Strip) => {
        state.value.strips.push(strip)
      }
    })(timeline),
    removeStrips: ((state: Ref<Timeline>) => {
      return (ids: string[]) => {
        state.value.strips = state.value.strips.filter(
          s => !ids.includes(s.id)
        )
      }
    })(timeline),
    moveStrip: moveStrip(timeline),
    changeView: changeView(timeline),
    update: update(timeline),
    play: play(timeline),
    setTimeline: setTimeline(timeline),
    startRecording: ((state: Ref<Timeline>) => {
      return (value = true) => {
        state.value.isRecording = value
      }
    })(timeline),
    updateLength: ((state: Ref<Timeline>) => {
      return (length: number) => {
        state.value.length = length
      }
    })(timeline),

    getFisrtSelectedStrip: ((state: Ref<Timeline>) => {
      return () => {
        if (state.value.selectedStrips.length > 0) {
          return state.value.selectedStrips[0]
        }
        return null
      }
    })(timeline),

    setFocusStripId: ((state: Ref<Timeline>) => {
      return (id: string) => {
        state.value.focusStripId = id
      }
    })(timeline),

    selectStrip: ((state: Ref<Timeline>) => {
      return (ids: string[]) => {
        const strips = ids
          .map((id) => {
            return findStripById(id, state.value)
          })
          .filter(strip => strip) as Strip[]
        state.value.selectedStrips = strips
      }
    })(timeline),

    updateEffect: ((state: Ref<Timeline>) => {
      return <T extends StripEffect>(stripId: string, effect: T) => {
        const strip = findStripById(stripId, state.value)
        if (!strip) {
          return
        }
        const index = strip.effects.findIndex(e => e.id === effect.id)
        if (index === -1) {
          return
        }
        const newAnimations: Animation[] = []
        effect.animations.forEach((a) => {
          if (
            !newAnimations.find(na => na.key === a.key && na.time === a.time)
          ) {
            newAnimations.push(a)
          }
        })
        effect.animations = newAnimations
        strip.effects[index] = effect
      }
    })(timeline),

    selectKeyframe: ((state: Ref<Timeline>) => {
      return (animations: Animation[]) => {
        state.value.selectedKeyframes = animations
      }
    })(timeline),

    changeTimelineTool: ((state: Ref<Timeline>) => {
      return (tool: 'cursor' | 'cut') => {
        state.value.timelineTool = tool
      }
    })(timeline)
  }
}
