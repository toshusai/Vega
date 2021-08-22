<template>
  <div class="controller-window">
    <WindowNameTag name="Controller" />
    <div class="container">
      <div style="display: flex">
        <!-- <div style="font-size: 12px; margin: auto; white-space: nowrap">
          Play Mode:
        </div> -->
        <VegaSelect
          :value="playMode"
          style="margin: auto"
          :items="items"
          @change="changePlayMode"
        />
      </div>

      <button class="button" @click="emitTogglePlay">
        <svg v-if="!isPlay" class="icon" viewBox="0 0 24 24">
          <path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
        <svg v-else class="icon" viewBox="0 0 24 24">
          <path fill="white" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.controller-window {
  border: 1px solid var(--black);
  box-sizing: border-box;
}
.container {
  display: flex;
}

.button {
  margin: auto;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  background-color: var(--vc-d-2);
  width: 24px;
  height: 24px;
}

.button:hover {
  background-color: var(--vc-d-3);
}

.button:focus {
  outline: none;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { OptionKeyValue } from "./vega/VegaSelect.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { PlayMode, SYNC_TO_AUDIO, PLAY_EVERY_FRAME } from "~/plugins/config";

@Component({
  components: { WindowNameTag },
})
export default class ControllerWindow extends Vue {
  @Prop({ default: false })
  isPlay!: Boolean;

  @Prop({ default: "NoSync" })
  playMode!: PlayMode;

  items: OptionKeyValue[] = [
    { text: "Play Every Frame", value: PLAY_EVERY_FRAME },
    { text: "Sync To Audio", value: SYNC_TO_AUDIO },
  ];

  changePlayModeEmit(playMode: PlayMode) {
    this.$emit("changePlayMode", playMode);
  }

  changePlayMode(item: OptionKeyValue) {
    this.changePlayModeEmit(item.value as PlayMode);
  }

  emitTogglePlay() {
    this.$emit("togglePlay");
  }
}
</script>
