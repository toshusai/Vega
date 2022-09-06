<script setup lang="ts">
import { mdiFileCode } from '@mdi/js'
import { IAsset } from '../core'

const props = defineProps<{ asset: IAsset }>()

const error = ref<boolean>(false)

function checkAsset () {
  error.value = false
  // TODO check file exist
}

onMounted(checkAsset)
watch(() => props.asset, checkAsset)
</script>

<template>
  <v-icons style="margin: auto" fill="white" :path="mdiFileCode" />
  <asset-list-item-error-icon v-if="error" />
</template>
