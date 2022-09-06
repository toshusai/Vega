<script setup lang="ts">
import { ComputedRef } from 'vue'
import { uuid } from 'short-uuid'
import { clone } from '../utils/clone'
import { eventToString } from '../utils/eventToString'
import { StripEffect, ImageStripEffect } from '../core'
import { setAnimation } from '../utils/setAnimation'
import { calcAnimationValue } from '../core'
import InspectorInput from './InspectorInput.vue'
import { Strip } from '@/core'
import { isImage } from '@/composables/useTimeline'
// var colors = "#194d33";
const { timeline, updateEffect } = useTimeline()

const props = defineProps<{ strip: Strip }>()

const effect: ComputedRef<ImageStripEffect | null> = computed(() => {
  return props.strip.effects.find(
    e => e.type === 'Image'
  ) as ImageStripEffect | null
})

function changeImage (v: number | string | object, key: string) {
  if (effect.value && isImage(effect.value)) {
    const newE = clone(effect.value)
    const newNewE = new Function(
      'effect',
      'value',
      `
effect.${key} = value;
return effect
`
    )(newE, v)

    updateEffect(props.strip?.id, {
      ...newNewE
    })
  }
}

function hasKeyframe (key: string) {
  return effect.value?.animations.find(a => a.key === key) != null
}
</script>

<template>
  <div v-if="effect && isImage(effect)">
    <div style="padding: 4px">
      <div>ImageEffect</div>
      <inspector-input
        label="x"
        :value="
          calcAnimationValue(
            effect.animations,
            timeline.curent - strip.start,
            'position.x',
            effect.position.x
          ) as number
        "
        :key-frame="hasKeyframe('position.x')"
        @input="num => changeImage(num, 'position.x')"
      />
      <inspector-input
        label="y"
        :value="
          calcAnimationValue(
            effect.animations,
            timeline.curent - strip.start,
            'position.y',
            effect.position.y
          ) as number
        "
        :key-frame="hasKeyframe('position.y')"
        @input="e => changeImage({ ...effect?.position, y: e }, 'position')"
      />
      <inspector-input
        label="scaleX"
        :step="0.01"
        :scale="0.01"
        :value="
          calcAnimationValue(
            effect.animations,
            timeline.curent - strip.start,
            'scale.x',
            effect.scale.x
          ) as number
        "
        :key-frame="hasKeyframe('scale.x')"
        @input="num => changeImage(num, 'scale.x')"
      />

      <inspector-input
        label="scaleY"
        :step="0.01"
        :scale="0.01"
        :value="
          calcAnimationValue(
            effect.animations,
            timeline.curent - strip.start,
            'scale.y',
            effect.scale.y
          ) as number
        "
        :key-frame="hasKeyframe('scale.y')"
        @input="e => changeImage({ ...effect?.scale, y: e }, 'scale')"
      />
    </div>
  </div>
</template>
