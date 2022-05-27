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
  getEffect<AudioStripEffect>(props.strip, 'Video')
)

function changeText (v: any, key: string) {
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
    </div>
  </div>
</template>
