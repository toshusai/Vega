<script setup lang="ts">
import { CSSProperties } from 'vue'
import { uuid } from 'short-uuid'
import { TextStripEffectObject } from '../core'
import { VideoStripEffectObject } from '../core'
import { calcAnimationValue } from '../core'
import { onDragStart } from '../utils/onDragStart'
import { setAnimation } from '../utils/setAnimation'
import { StripEffect, TextStripEffect } from '../core'
import { snap } from '../utils/snap'
import { ImageStripEffectObject } from '../core'
import { Renderer } from '@/core'

const { timeline, updateEffect, setFocusStripId } = useTimeline()

const props = defineProps<{ scale: number }>()

const strip = computed(() => timeline.value.selectedStrips[0])
const effect = computed(() => strip.value?.effects.length > 0 ? strip.value.effects[0] as StripEffect : null)
const style = ref<CSSProperties>({})

const focus = ref(false)

const isTextEffect = computed(() => {
  return effect.value && isText(effect.value)
})

const text = computed(() => {
  if (effect.value && isText(effect.value)) {
    return effect.value.text
  }
})

const textStyle = computed<CSSProperties>(() => {
  if (effect.value && isText(effect.value)) {
    return {
      fontSize: `${effect.value.size * props.scale}px`,
      fontFamily: effect.value.family,
      width: `calc(${style.value.width} + 10px)`,
      color: effect.value.color,
      height: `${style.value.height}`,
      lineHeight: `${(Number.parseFloat(style.value?.height?.toString() || '0') || 0) / (effect.value.text.split('\n').length)}px`,
      letterSpacing: `${effect.value.characterSpace * props.scale}px`,
      visibility: focus.value ? 'visible' : 'hidden'
    }
  }
  return {}
})

function update (e: Event) {
  const t = e.target as HTMLTextAreaElement
  updateEffect(strip.value.id, {
    ...effect.value,
    text: t.value || ''
  } as TextStripEffect)
}

function updateStyle (): CSSProperties {
  if (!effect.value) { return { display: 'none' } }
  const width = timeline.value.width
  const height = timeline.value.height

  if (isText(effect.value)) {
    const obj = Renderer.effectObjectMap.get(effect.value.id)
    if (!(obj instanceof TextStripEffectObject)) { return { display: 'none' } }

    const x = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent - strip.value.start,
      'position.x',
      effect.value.position.x
    )

    const y = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent - strip.value.start,
      'position.y',
      effect.value.position.y
    )

    return {
      left: (width / 2 + x - obj.mesureWidth / 2) * props.scale + 'px',
      bottom: (height / 2 + y - obj.mesureHeight / 2) * props.scale + 'px',
      width: obj.mesureWidth * props.scale + 'px',
      height: obj.mesureHeight * props.scale + 'px'
    }
  } else if (isVideo(effect.value)) {
    const obj = Renderer.effectObjectMap.get(effect.value.id)
    if (!(obj instanceof VideoStripEffectObject)) { return { display: 'none' } }

    const x = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent,
      'position.x',
      effect.value.position.x
    )

    const y = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent,
      'position.y',
      effect.value.position.y
    )

    const videoW = obj.video.videoWidth * effect.value.scale.x
    const videoH = obj.video.videoHeight * effect.value.scale.y

    return {
      left: (width / 2 + x - videoW / 2) * props.scale - 1 + 'px',
      bottom: (height / 2 + y - videoH / 2) * props.scale + 2 + 'px',
      width: videoW * props.scale + 'px',
      height: videoH * props.scale + 'px'
    }
  } else if (isImage(effect.value)) {
    const obj = Renderer.effectObjectMap.get(effect.value.id)
    if (!(obj instanceof ImageStripEffectObject)) { return { display: 'none' } }
    const x = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent,
      'position.x',
      effect.value.position.x
    )

    const y = calcAnimationValue(
      effect.value.animations,
      timeline.value.curent,
      'position.y',
      effect.value.position.y
    )

    const videoW = obj.width * effect.value.scale.x
    const videoH = obj.height * effect.value.scale.y

    return {
      left: (width / 2 + x - videoW / 2) * props.scale + 'px',
      bottom: (height / 2 + y - videoH / 2) * props.scale + 'px',
      width: videoW * props.scale + 'px',
      height: videoH * props.scale + 'px'
    }
  }
  return { display: 'none' }
}

onMounted(() => {
  const update = () => {
    style.value = updateStyle()
    window.requestAnimationFrame(update)
  }
  update()
})

const prevClickTime = ref(0)

const textarea = ref<HTMLTextAreaElement | null>(null)

watch(effect, (newV, oldV) => {
  if (newV && oldV && newV.id !== oldV.id) {
    focus.value = false
    setFocusStripId('')
  }
})

function click (e: MouseEvent) {
  if (e.timeStamp - prevClickTime.value < 500) {
    focus.value = true
  }
  prevClickTime.value = e.timeStamp
  if (focus.value) {
    setFocusStripId(strip.value.id)
    updateStyle()
    setTimeout(() => {
      textarea.value?.focus()
    })
  } else {
    setFocusStripId('')
  }
}

function drag (e: MouseEvent) {
  if (!effect.value) { return }

  if (focus.value) { return }

  onDragStart(e, (delta) => {
    if (!effect.value) { return }
    if (isText(effect.value) || isVideo(effect.value) || isImage(effect.value)) {
      const newE = {
        ...effect.value,
        animations: [...effect.value.animations]
      }
      const p = {
        x: newE.position.x + delta.x / props.scale,
        y: newE.position.y - delta.y / props.scale,
        z: newE.position.z
      }

      if (
        effect.value.animations.filter(a => a.key === 'position.x').length === 0
      ) {
        newE.position = p
      } else {
        p.x =
          calcAnimationValue(
            newE.animations,
            timeline.value.curent - strip.value.start,
            'position.x'
          ) +
          delta.x / props.scale
        newE.animations = setAnimation(newE.animations, {
          id: uuid(),
          key: 'position.x',
          value: p.x,
          time: snap(timeline.value.curent - strip.value.start)
        })
      }
      if (
        effect.value.animations.filter(a => a.key === 'position.y').length === 0
      ) {
        newE.position = p
      } else {
        p.y =
          calcAnimationValue(
            newE.animations,
            timeline.value.curent - strip.value.start,
            'position.y'
          ) +
          -delta.y / props.scale
        newE.animations = setAnimation(newE.animations, {
          id: uuid(),
          key: 'position.y',
          value: p.y,
          time: snap(timeline.value.curent - strip.value.start)
        })
      }

      newE.position = p

      updateEffect(strip.value.id, {
        ...newE
      })
    }
  })
}
</script>

<template>
  <div class="gizmo" :style="style" @click="click" @pointerdown="drag">
    <textarea
      v-if="isTextEffect"
      ref="textarea"
      :value="text"
      class="text-gizmo"
      :style="textStyle"
      @input="update"
    />
  </div>
</template>

<style scoped>
.gizmo {
  border: 1px solid red;
  user-select: none;
  cursor: pointer;
  position: absolute;
  color: var(--brand);
}

.text-gizmo {
  border: none;
  resize: none;
  outline: none;
  background: transparent;
  white-space: nowrap;
  width: 100%;
  height: 100%;
  margin-left: -1px;
  margin-top: -1px;
  overflow: hidden;

}
</style>
