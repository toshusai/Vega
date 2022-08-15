<script setup lang="ts">
import { ComputedRef } from 'vue'
import { eventToFloat } from '../utils/eventToFloat'
import { eventToString } from '../utils/eventToString'
import { VideoStripEffect } from '../core/VideoStripEffect'
import { AudioStripEffect } from '../core/AudioStripEffect'
import { getEffect } from '../utils/getEffect'
import { StripEffect } from '../core/StripEffect'
import InspectorInput from './InspectorInput.vue'
import { isText, isVideo, isAudio } from '~/composables/useTimeline'
import { TextStripEffect } from '~/core/TextStripEffect'
import { Strip } from '~/core/Strip'

const { updateEffect } = useTimeline()
const props = defineProps<{ strip: Strip }>()

const effect = computed(() =>
  getEffect<AudioStripEffect>(props.strip, 'Audio')
)

function changeText (v: number, key: string) {
  if (effect.value && isAudio(effect.value)) {
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
  <div v-if="effect && isAudio(effect)">
    <div class="p-4">
      <div>AudioEffect</div>
      <inspector-input
        label="start"
        :value="effect.start"
        :step="0.01"
        :scale="0.01"
        @input="
          (num) =>
            changeText(num, 'start')
        "
      />

      <inspector-input
        label="volume"
        :value="effect.volume"
        :step="0.1"
        :scale="0.1"
        :min="0"
        :max="1"
        @input="
          (num) =>
            changeText(num, 'volume')
        "
      />
    </div>
  </div>
</template>
