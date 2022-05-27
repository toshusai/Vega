<script setup lang="ts">
import type { PropType } from 'vue'

interface Item {
  name: string;
  onClick: () => void;
}

defineProps({
  label: {
    default: '',
    type: String
  },
  items: {
    default: () => [],
    type: Array as PropType<Item[]>
  }
})
const show = ref(false)

function close (e: MouseEvent, force = false) {
  if (!force && el.value?.contains(e.target as HTMLElement)) {
    e.stopPropagation()
    return
  }
  show.value = false
  window.removeEventListener('click', close)
}

function open (e: MouseEvent) {
  if (show.value === true) {
    close(e, true)
    return
  }
  show.value = true
  window.addEventListener('click', close)
}

const el = ref<HTMLElement | null>(null)
</script>

<template>
  <div ref="el" class="header-button">
    <button @click="open">
      {{ label }}
    </button>
    <div
      v-if="show"
      class="absolute top-24 left-0 bg-background1 border-default border-2 box-border z-10"
    >
      <button
        v-for="(item, i) in items"
        :key="i"
        class="header-item px-16 cursor-pointer"
        @click="
          (e) => {
            item.onClick();
            close(e, true);
          }
        "
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.header-button {
  cursor: pointer;
  line-height: 24px;
  padding: 0 12px;
  position: relative;
}
.header-button:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.header-item {
  width: 100%;
}
.header-item:hover {
  background-color: #333;
}
</style>
