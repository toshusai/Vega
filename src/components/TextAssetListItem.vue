<script setup lang="ts">
import { mdiFormatText } from '@mdi/js'
import { IAsset } from '../core'

const props = defineProps<{ asset: IAsset }>()

const error = ref<boolean>(false)

</script>

<template>
  <v-icons style="margin: auto" fill="white" :path="mdiFormatText" />
  <asset-list-item-error-icon v-if="error" />
</template>
