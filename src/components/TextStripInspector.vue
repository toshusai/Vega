<script setup lang="ts">
import { ComputedRef } from 'vue'
import { uuid } from 'short-uuid'
import { eventToString } from '../utils/eventToString'
import { StripEffect } from '../core/StripEffect'
import { setAnimation } from '../utils/setAnimation'
import { calcAnimationValue } from '../utils/calcAnimationValue'
import InspectorInput from './InspectorInput.vue'
import { Strip } from '~/core/Strip'
import { Animation, TextStripEffect } from '~/core/TextStripEffect'
import { isText } from '~/composables/useTimeline'
// var colors = "#194d33";
const { timeline, updateEffect } = useTimeline()

const props = defineProps<{ strip: Strip }>()

const effect: ComputedRef<TextStripEffect | null> = computed(() => {
  return props.strip.effects.find(
    e => e.type === 'Text'
  ) as TextStripEffect | null
})

function changeText (v: object | string | number, key: string) {
  if (effect.value && isText(effect.value)) {
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

function addKeyframe (key: string, value: any) {
  if (!effect.value) { return }
  const newAnimation: Animation = {
    id: uuid(),
    key,
    time: timeline.value.curent - props.strip.start,
    value
  }

  const newEffect = { ...effect.value, animations: [...effect.value.animations] }
  newEffect.animations = setAnimation(newEffect.animations || [], newAnimation)

  updateEffect(props.strip.id, newEffect)
}

function hasKeyframe (key:string) {
  return effect.value?.animations.find(a => a.key === key) != null
}

</script>

<template>
  <div v-if="effect && isText(effect)">
    <div style="padding: 4px;">
      <div>TextEffect</div>
      <inspector-input
        label="x"
        :value="calcAnimationValue(effect.animations, timeline.curent - strip.start, 'position.x', effect.position.x)"
        :key-frame="hasKeyframe('position.x')"
        @input="
          (num) => changeText({ ...effect?.position, x: num }, 'position')
        "
        @key-frame="() => addKeyframe('position.x', effect?.position.x)"
      />
      <inspector-input
        label="y"
        :value="calcAnimationValue(effect.animations, timeline.curent - strip.start, 'position.y', effect.position.y)"
        :key-frame="hasKeyframe('position.y')"
        @input="(e) => changeText({ ...effect?.position, y: e }, 'position')"
        @key-frame="() => addKeyframe('position.y', effect?.position.y)"
      />
      <inspector-input
        :key-frame="hasKeyframe('size')"
        label="fontSize"
        :value="effect.size"
        @input="(n) => changeText(n, 'size')"
        @key-frame="() => addKeyframe('size', effect?.size)"
      />
      <inspector-color-input label="color" :value="effect.color" @update-color="(e) => changeText(e, 'color')" />
      <inspector-string-input
        label="style"
        :value="effect.style"
        @input="(e) => changeText(eventToString(e), 'style')"
      />
      <inspector-string-input
        label="Family"
        :value="effect.family"
        @input="(e) => changeText(eventToString(e), 'family')"
      />
      <inspector-input
        :key-frame="hasKeyframe('characterSpace')"
        label="characterSpace"
        :value="effect.characterSpace"
        @input="(n) => changeText(n, 'characterSpace')"
      />
      <inspector-color-input
        label="shadowColor"
        :value="effect.shadowColor"
        @update-color="(e) => changeText(e, 'shadowColor')"
      />
      <inspector-input

        :key-frame="hasKeyframe('shadowBlur')"
        label="shadowBlur"
        :value="effect.shadowBlur"
        @input="(n) => changeText(n, 'shadowBlur')"
      />
      <inspector-color-input
        label="outlineColor"
        :value="effect.outlineColor"
        @update-color="(e) => changeText(e, 'outlineColor')"
      />
      <inspector-input
        label="outlineWidth"
        :value="effect.outlineWidth"
        @input="(n) => changeText(n, 'outlineWidth')"
      />
    </div>
  </div>
</template>
