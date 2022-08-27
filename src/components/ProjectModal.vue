<script setup lang="ts">
import { getIsElectron } from '../utils/getIsElectron()'
import { ipcSend } from '~/utils/ipcSend'
import { getEmptyProject, Project } from '~/core/Project'

const { setContainer } = useContainer()
const { setTimeline } = useTimeline()
const { setAssets } = useAssets()
const { project } = useProject()
const RECENT_USED_PROJECT_PATHS_KEY = 'RECENT_USED_PROJECT_PATHS_KEY'
defineProps({
  isOpen: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits<{
    (e: 'open'): void
}>()

async function fetchGet (url: string): Promise<Project> {
  const response = await fetch(url)
  return response.json()
}

function getProjects (): Promise<Project>[] {
  const isE = getIsElectron()
  const paths: string[] = JSON.parse(localStorage.getItem(RECENT_USED_PROJECT_PATHS_KEY) || (isE ? '[]' : '["/Vega/demo/demo_project.json"]'))
  return paths.map(async (path) => {
    const project = isE ? await ipcSend<Project>('getProjectById', path) : await fetchGet(path)
    const p = {
      ...project,
      path
    }
    return p
  })
}

const projects = ref<Project[]>([])

function processArray<T> (array: Promise<T>[], cb: (arr: T[]) => void) {
  const result: T[] = []
  let index = 0
  function next () {
    if (index < array.length) {
      array[index++].then((res) => {
        result.push(res)
        next()
      })
    } else {
      cb(result)
    }
  }
  next()
}

onMounted(() => {
  processArray(getProjects(), (res) => {
    projects.value = res
  })
})

function getProjectName (p: Project) {
  const sp = p.path.split('/')
  if (sp.length === 0) { return '' }
  return sp.at(-1)
}

function createNewProject () {
  const p = getEmptyProject()
  setAssets(p.assets)
  setTimeline(p.timeline)
  setContainer(p.container)
  emit('open')
}

function openProject (p: Project) {
  setAssets(p.assets)
  setTimeline(p.timeline)
  setContainer(p.container)
  emit('open')
  project.value = p
}

</script>

<template>
  <v-modal :show-close="false" :is-open="isOpen">
    <h3 style="margin: 12px; margin-left: 0;">
      Projects
    </h3>
    <div>
      <v-button @click="createNewProject">
        New Project
      </v-button>
    </div>
    <div style="margin: 12px; margin-left: 0;">
      Recent used projects
    </div>
    <div style="gap: 4px; display: flex; flex-direction: column;">
      <div v-for="(p, i) in projects" :key="i">
        <v-button @click="() => openProject(p)">
          {{ getProjectName(p) }}
        </v-button>
      </div>
    </div>
  </v-modal>
</template>

<style scoped>
</style>
