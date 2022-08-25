<script setup lang="ts">
import { getIsElectron } from '../utils/getIsElectron()'
import { ipcSend } from '~/utils/ipcSend'
import { Project } from '~/core/Project'

const RECENT_USED_PROJECT_PATHS_KEY = 'RECENT_USED_PROJECT_PATHS_KEY'
const GET_PROJECT_BY_ID_KEY = 'GET_PROJECT_BY_ID_KEY'
defineProps({
  isOpen: {
    default: false,
    type: Boolean
  }
})

const emit = defineEmits<{
    (e: 'close'): void
}>()

function getProjects (): Project[] {
  const paths: string[] = JSON.parse(localStorage.getItem(RECENT_USED_PROJECT_PATHS_KEY) || '[]')
  return paths.map((path) => {
    return getIsElectron() ? ipcSend('getProjectById', path) : JSON.parse(localStorage.getItem(GET_PROJECT_BY_ID_KEY) || '')
  })
}

const projects = ref<Project[]>([])

onMounted(() => {
  projects.value = getProjects()
})

function getProjectName (p: Project) {
  const sp = p.path.split('/')
  if (sp.length > 0) { return '' }
  return sp.at(-1)
}

</script>

<template>
  <v-modal :show-close="false" :is-open="isOpen" @close="emit('close')">
    <v-button v-for="(p, i) in projects" :key="i">
      {{ getProjectName(p) }}
    </v-button>
    <v-button>
      New Project
    </v-button>
  </v-modal>
</template>

<style scoped>
</style>
