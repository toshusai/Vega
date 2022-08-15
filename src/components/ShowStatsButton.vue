<script setup lang="ts">
import Stats from 'stats.js'

let stats: Stats | null = null
const { updateState } = useUpdate()

function showStat () {
  if (!stats) {
    return
  }
  stats.dom.style.visibility = 'visible'
}

function hideStats () {
  if (!stats) {
    return
  }
  stats.dom.style.visibility = 'hidden'
}

function toggleStats () {
  if (!stats) {
    return
  }
  if (stats.dom.style.visibility === 'hidden') {
    showStat()
  } else {
    hideStats()
  }
}

onMounted(() => {
  stats = new Stats()
  stats.showPanel(0)
  updateState.value.before = stats.begin
  updateState.value.after = stats.end

  document.body.append(stats.dom)
  stats.dom.style.left = ''
  stats.dom.style.right = '0'
  stats.dom.style.pointerEvents = 'none'
  stats.dom.childNodes.forEach((node: Node) => {
    if (node instanceof HTMLElement) {
      node.style.display = ''
    }
  })
  hideStats()
})
</script>

<template>
  <button @click="toggleStats">
    stats
  </button>
</template>

<style scoped></style>
