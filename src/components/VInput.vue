<script setup lang="ts">
import { PropType } from 'vue'
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

const emit = defineEmits<{(e: 'input', value: number): void; }>()

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
  emit('input', parseFloat((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="flex w-full">
    <input
      v-bind="$attrs"
      :value="view ? view(value) : value"
      class="bg-transparent border-default border-2 rounded-4 pl-4 text-sm w-full"
      @input="inputByInputEvent"
    >
    <div class="flex cursor-ew-resize">
      <svg
        class="my-auto mx-4 rounded-4"
        style="
          border: 1px solid var(--border-grey);
          width: 16px;
          height: 16px;
          user-select: none;
        "
        viewBox="0 0 24 24"
        @pointerdown="pointerdown"
      >
        <path fill="currentColor" d="M8,14V18L2,12L8,6V10H16V6L22,12L16,18V14H8Z" />
      </svg>
    </div>
  </div>
</template>

<!--

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
            />
          </svg>
        </button>

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
            />
          </svg>
        </button>

 -->
