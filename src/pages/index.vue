<script setup lang="ts">
import { Container } from '../core/Container'
import '~/assets/css/main.css'
import undo from '../core/Undo'
import ButtonMenu from '../components/ButtonMenu.vue'
import SettingsButton from '../components/SettingsButton.vue'
import ProjectModal from '../components/ProjectModal.vue'
import { ipcSend } from '../utils/ipcSend'
import { getIsElectron } from '../utils/getIsElectron()'
import { download } from '../utils/download'
const { container, setContainer } = useContainer()
const { init: initTimeline, timeline, setTimeline } = useTimeline()
const { assets, setAssets } = useAssets()
const op = useOperation()
const { init } = useKeyboard()

const { update } = useUpdate()

const { project } = useProject()

onMounted(() => {
  init()
  let prev = 0
  const mainUpdate = (t: number) => {
    update(t - prev)
    requestAnimationFrame(mainUpdate)
    prev = t
  }
  mainUpdate(0)

  window.addEventListener('keydown', (e) => {
    // if mac ctrl = command
    const ctrlKey = isOSX() ? e.metaKey : e.ctrlKey
    //  Shift + Command + Z
    if (e.keyCode === 90 && e.shiftKey && ctrlKey) {
      undo.redo()
    } else if (e.keyCode === 90 && ctrlKey) {
      undo.undo()
    }
    const isElectron = getIsElectron()
    // Cmannd + S
    if (e.keyCode === 83 && ctrlKey) {
      if (isElectron) {
        if (project.value.path) {
          ipcSend('SAVE_FILE', { path: project.value.path, data: projectToJsonString() })
        } else {
          ipcSend('SAVE_NEW_FILE', projectToJsonString()).then((path) => {
            if (path === false) { return }
            const paths = JSON.parse(localStorage.getItem('RECENT_USED_PROJECT_PATHS_KEY') || '[]')
            paths.push(path)
            localStorage.setItem('RECENT_USED_PROJECT_PATHS_KEY', JSON.stringify(paths))
          })
        }
      } else {
        downloadFile()
      }
      op.pushHistory('Save')
      e.preventDefault()
    }
  })
  initTimeline()
})

function isOSX () {
  return navigator.platform.toUpperCase().includes('MAC')
}

function openfile () {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = '.json'
  fileInput.click()
  fileInput.onchange = () => {
    if (!fileInput.files) {
      return
    }
    const file = fileInput.files[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        projectFromJsonString(reader.result)
      }
    }
    reader.readAsText(file)
  }
}

function downloadFile () {
  const project = projectToJsonString()
  const a = document.createElement('a')
  a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(project)
  a.download = 'project.json'
  a.click()
}

function projectToJsonString () {
  const project = {
    container: container.value,
    timeline: timeline.value,
    assets: assets.value
  }
  return JSON.stringify(project)
}

function projectFromJsonString (json: string) {
  const project = JSON.parse(json)
  setContainer(project.container)
  setTimeline(project.timeline)
  setAssets(project.assets)
  return project
}

const rootContainer = computed(() => container.value as Container)
const isOpenProjectModal = ref(true)

function open () {
  isOpenProjectModal.value = false
  initTimeline()
}
</script>

<template>
  <div
    class="root text-white bg-background1"
    :style="{
      display: container.align === 'horizontal' ? 'flex' : 'block'
    }"
  >
    <div style="height: calc(100vh - 48px)">
      <div class="header-menu">
        <recording-button />
        <button-menu
          label="File"
          :items="[
            { name: 'Open', onClick: openfile },
            { name: 'Save', onClick: downloadFile }
          ]"
        />
        <settings-button />
        <show-stats-button />
      </div>
      <container-ui :container="rootContainer" />
      <operation-history-panel />
    </div>
    <project-modal :is-open="isOpenProjectModal" @open="open" />
  </div>
</template>

<style>
body {
  background: var(--bg1);
  color: var(--text1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-menu {
  display: flex;
  height: 24px;
  border-bottom: 1px solid var(--border-grey);
  box-sizing: border-box;
}

body {
  margin: 0;
  overflow: hidden;
}

:root {
  /* https://htmlcolorcodes.com/color-chart/material-design-color-chart/ */
  /* https://material.io/design/color/the-color-system.html */
  --red-300: #e57373;

  /* Teal */
  --teal: #009688;
  --teal-50: #e0f2f1;
  --teal-100: #b2dfdb;
  --teal-200: #80cbc4;
  --teal-300: #4db6ac;
  --teal-400: #26a69a;
  --teal-500: #009688;
  --teal-600: #00897b;
  --teal-700: #00796b;
  --teal-800: #00695c;
  --teal-900: #004d40;
  --teal-a100: #a7ffeb;
  --teal-a200: #64ffda;
  --teal-a400: #1de9b6;
  --teal-a700: #00bfa5;

  /* Grey */
  --grey: #9e9e9e;
  --grey-50: #fafafa;
  --grey-100: #f5f5f5;
  --grey-200: #eeeeee;
  --grey-300: #e0e0e0;
  --grey-400: #bdbdbd;
  --grey-500: #9e9e9e;
  --grey-600: #757575;
  --grey-700: #616161;
  --grey-800: #424242;
  --grey-900: #212121;

  --border-grey: #9e9e9e;
}

body {
  font-family: Monaco;
}
</style>

<style scoped>
.root {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: block;
  overflow: hidden;
}
</style>
