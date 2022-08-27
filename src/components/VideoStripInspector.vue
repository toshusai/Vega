<script setup lang="ts">
import { ComputedRef } from 'vue'
import { eventToFloat } from '../utils/eventToFloat'
import { eventToString } from '../utils/eventToString'
import { VideoStripEffect } from '../core/VideoStripEffect'
import { getEffect } from '../utils/getEffect'
import { StripEffect } from '../core/StripEffect'
import InspectorInput from './InspectorInput.vue'
import { isText, isVideo } from '@/composables/useTimeline'
import { TextStripEffect } from '@/core/stripEffect'
import { Strip } from '@/core/Strip'

const { updateEffect } = useTimeline()
const props = defineProps<{ strip: Strip }>()

const effect = computed(() => getEffect<VideoStripEffect>(props.strip, 'Video'))

function changeText (v: object | number, key: string) {
  if (effect.value && isVideo(effect.value)) {
    const newE = { ...effect.value }
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
</script>

<template>
  <div v-if="effect && isVideo(effect)">
    <div style="padding: 4px">
      <div>VideoEffect</div>
      <inspector-input
        label="start"
        :value="effect.start"
        :step="0.01"
        :scale="0.01"
        @input="num => changeText(num, 'start')"
      />
      <inspector-input
        label="x"
        :value="effect.position.x"
        @input="num => changeText({ ...effect?.position, x: num }, 'position')"
      />
      <inspector-input
        label="y"
        :value="effect.position.y"
        @input="num => changeText({ ...effect?.position, y: num }, 'position')"
      />
      <inspector-input
        label="scaleX"
        :value="effect.scale.x"
        :step="0.01"
        :scale="0.01"
        @input="num => changeText({ ...effect?.scale, x: num }, 'scale')"
      />
      <inspector-input
        label="scaleY"
        :value="effect.scale.y"
        :step="0.01"
        :scale="0.01"
        @input="num => changeText({ ...effect?.scale, y: num }, 'scale')"
      />

      <inspector-input
        label="volume"
        :value="effect.volume"
        :step="0.1"
        :scale="0.1"
        :min="0"
        :max="1"
        @input="num => changeText(num, 'volume')"
      />
    </div>
  </div>
</template>
