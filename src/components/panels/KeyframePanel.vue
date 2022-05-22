<script setup lang="ts">
import { Animation } from "~~/src/core/TextStripEffect";
import KeyframeMarker from "../KeyframeMarker.vue";

const { timeline, updateEffect } = useTimeline();

const strip = computed(() => timeline.value.selectedStrips[0]);

const keys = ref(new Map<string, Animation[]>());

function update() {
  keys.value.clear();
  strip.value?.effects.forEach((effect) => {
    if ("animations" in effect) {
      effect.animations.forEach((animation) => {
        if (!keys.value.has(animation.key)) {
          keys.value.set(animation.key, []);
        }
        keys.value.get(animation.key)?.push(animation);
      });
    }
  });
}

watch(strip, () => {
  update();
});

watch(
  () => [...(strip.value?.effects || [])],
  () => {
    update();
  }
);

const el = ref<HTMLElement | null>(null);
onMounted(() => {
  console.log("ok");

  el.value?.addEventListener("keydown", (e) => {
    console.log(e.key);

    if (e.key === "x") {
      console.log("delete");

      strip.value.effects.filter((effect) => {
        if ("animations" in effect) {
          let newAnimationIds: Animation[] = [];
          effect.animations.forEach((animation) => {
            timeline.value.selectedKeyframes.forEach((keyframe) => {
              if (animation.id !== keyframe.id) {
                newAnimationIds.push({ ...animation });
              }
            });

            updateEffect(strip.value.id, {
              ...effect,
              animations: newAnimationIds,
            });
          });
        }
        return true;
      });
    }
  });
});

const times = [...Array(10)].map((_, i) => i);
</script>

<template>
  <div ref="el" class="flex h-full">
    <div class="h-full border-r-[1px] border-default">
      <div class="border-bottom-1 h-24">Properties</div>
      <div style="width: 150px; height: 100%">
        <div
          v-for="(key, i) in keys"
          :key="i"
          class="flex overflow-hidden whitespace-nowrap"
          style="
            box-sizing: border-box;
            border-bottom: 1px solid var(--border-grey);
          "
        >
          <div class="mr-4">{{ key[0] }} :</div>
          <v-input-base style="margin: auto" :value="0" readonly />
        </div>
      </div>
    </div>
    <div style="width: 100%">
      <div class="border-bottom-1 h-24 flex relative">
        <div
          v-for="i in times"
          :key="i"
          class="absolute border-l-[1px] border-default text-xs h-24 flex"
          :style="{ left: `${i * 30}px` }"
        >
          <div class="mt-auto ml-2 mb-2">
            {{ i }}
          </div>
        </div>
      </div>
      <div
        v-for="(key, i) in keys"
        :key="i"
        class="flex relative"
        style="
          height: 25px;
          width: 100%;
          border-bottom: 1px solid var(--border-grey);
          box-sizing: border-box;
        "
      >
        <KeyframeMarker
          v-for="(anim, j) in key[1]"
          :key="j"
          :animation="anim"
          :scale="30"
        />
      </div>
    </div>
  </div>
</template>

<style></style>
