<script setup lang="ts">
import { PropType } from 'vue'
import { mdiArrowLeftRightBold } from '@mdi/js'
import { onDragStart } from '../utils/onDragStart'

const props = defineProps({
  value: {
    default: 0,
    type: Number
  },
  scale: {
    default: 1,
    type: Number
  },
  step: {
    default: null,
    type: Number,
    requred: false
  },
  min: {
    default: null,
    type: Number,
    requred: false
  },
  max: {
    default: null,
    type: Number,
    requred: false
  },
  view: {
    default: null,
    type: Function as PropType<(num: number) => string>,
    requred: false
  }
})

const emit = defineEmits<{ (e: 'input', value: number): void }>()

function pointerdown (e: MouseEvent) {
  onDragStart(e, (delta, e) => {
    if (typeof props.value === 'number') {
      let plus = e.movementX * props.scale
      if (props.step) {
        plus = Math.round(plus / props.step) * props.step
      }

      // clamp
      if (props.min !== null && props.value + plus < props.min) {
        plus = props.min - props.value
      }
      if (props.max !== null && props.value + plus > props.max) {
        plus = props.max - props.value
      }

      emit('input', props.value + plus)
    }
  })
}

function inputByInputEvent (e: Event) {
  const num = parseFloat((e.target as HTMLInputElement).value)
  if (Number.isNaN(num)) {
    return
  }
  emit('input', num)
}
</script>

<template>
  <div style="display: flex; width: 100%">
    <input
      v-bind="$attrs"
      :value="view ? view(value) : value"
      @input="inputByInputEvent"
    >
    <div style="display: flex; cursor: ew-resize">
      <v-icons
        :path="mdiArrowLeftRightBold"
        style="
          margin: auto 4px;
          border-radius: 4px;
          border: 1px solid var(--border-grey);
          width: 14px;
          height: 14px;
          user-select: none;
          fill: white;
        "
        @pointerdown="pointerdown"
      />
    </div>
  </div>
</template>
