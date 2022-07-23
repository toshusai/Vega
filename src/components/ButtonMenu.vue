<script setup lang="ts">
import type { PropType } from 'vue'

interface Item {
  name: string
  onClick: () => void
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
    <button style="padding: 0 16px" @click="open">
      {{ label }}
    </button>
    <div v-if="show" class="menu">
      <button
        v-for="(item, i) in items"
        :key="i"
        class="header-item"
        @click="
          e => {
            item.onClick()
            close(e, true)
          }
        "
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.menu {
  position: absolute;
  top: 24px;
  left: 0;
  background-color: var(--bg1);
  border: 2px;
  box-sizing: border-box;
  z-index: 10;
}
.header-button {
  cursor: pointer;
  line-height: 24px;
  user-select: none;
  position: relative;
}

.header-button:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.header-item {
  width: 100%;
  padding: 0 16px;
}

.header-item:hover {
  background-color: #333;
}
</style>
