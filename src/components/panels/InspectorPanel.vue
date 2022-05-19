<script setup lang="ts">
import { ComputedRef } from "vue";
import { TextStripEffect } from "~~/src/core/TextStripEffect";
import { isText } from "../../composables/useTimeline";
const { timeline, updateEffect } = useTimeline();

const strip = computed(() => {
  return timeline.value.selectedStrips[0];
});

const effect: ComputedRef<TextStripEffect | null> = computed(() => {
  if (timeline.value.selectedStrips.length === 0) return null;
  return timeline.value.selectedStrips[0].effects[0] as TextStripEffect;
});

function changeText(v: any, key: string) {
  if (effect.value && isText(effect.value)) {
    const newE = { ...effect.value };
    const newNewE = new Function(
      "effect",
      "value",
      `
effect.${key} = value;
return effect
`
    )(newE, v);

    console.log(key, v);

    updateEffect(strip.value?.id, {
      ...newNewE,
    });
  }
}

function eventToFloat(e: Event) {
  if (e.target instanceof HTMLInputElement) {
    return Number.parseFloat(e.target.value);
  }
  return 0;
}

function eventToString(e: Event) {
  if (e.target instanceof HTMLInputElement) {
    return e.target.value;
  }
  return "";
}
</script>

<template>
  <div v-if="effect && isText(effect)">
    <div class="p-4">
      <div>TextEffect</div>
      <div class="flex mb-4">
        <div class="w-full pr-8">text :</div>
        <v-input
          :value="effect.text"
          @input="(e) => changeText(eventToString(e), 'text')"
        />
      </div>
      <div class="flex mb-4">
        <div class="w-full pr-8">x :</div>
        <v-input
          :value="effect.position.x"
          @input="
            (e) =>
              changeText({ ...effect.position, x: eventToFloat(e) }, 'position')
          "
        />

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12Z"
            />
          </svg>
        </button>

        <button>
          <svg style="width: 12px; height: 12px" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
            />
          </svg>
        </button>
      </div>
      <div class="flex mb-4">
        <div class="w-full pr-8">y :</div>
        <v-input
          :value="effect.position.y"
          @input="
            (e) =>
              changeText({ ...effect.position, y: eventToFloat(e) }, 'position')
          "
        />
      </div>

      <div class="flex mb-4">
        <div class="w-full pr-8">size :</div>
        <v-input
          :value="effect.size"
          @input="(e) => changeText(eventToFloat(e), 'size')"
        />
      </div>

      <div class="flex mb-4">
        <div class="w-full pr-8">color :</div>
        <v-input
          :value="effect.color"
          @input="(e) => changeText(eventToString(e), 'color')"
        />
      </div>

      <div class="flex mb-4">
        <div class="w-full pr-8">style :</div>
        <v-input
          :value="effect.style"
          @input="(e) => changeText(eventToString(e), 'style')"
        />
      </div>

      <!--  -->

      <div class="flex mb-4">
        <div class="w-full pr-8">family :</div>
        <v-input
          :value="effect.family"
          @input="(e) => changeText(eventToString(e), 'family')"
        />
      </div>
      <div class="flex mb-4">
        <div class="w-full pr-8">shadowColor :</div>
        <v-input
          :value="effect.shadowColor"
          @input="(e) => changeText(eventToString(e), 'shadowColor')"
        />
      </div>

      <div class="flex mb-4">
        <div class="w-full pr-8">shadowBlur :</div>
        <v-input
          :value="effect.shadowBlur"
          @input="(e) => changeText(eventToString(e), 'shadowBlur')"
        />
      </div>

      <div class="flex mb-4">
        <div class="w-full pr-8">outlineColor :</div>
        <v-input
          :value="effect.outlineColor"
          @input="(e) => changeText(eventToString(e), 'outlineColor')"
        />
      </div>

      <div class="flex mb-4">
        <div class="w-full pr-8">outlineWidth :</div>
        <v-input
          :value="effect.outlineWidth"
          @input="(e) => changeText(eventToString(e), 'outlineWidth')"
        />
      </div>
    </div>
  </div>
</template>
