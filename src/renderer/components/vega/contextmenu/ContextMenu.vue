<template>
  <sp-menu v-if="isOpen" ref="el" class="contextmenu" :style="style">
    <div v-for="(item, i) in items" :key="i">
      <sp-action-button size="S" :quiet="true" @click="(e) => click(e, item)">
        {{ item.text }}
      </sp-action-button>
    </div>
  </sp-menu>
</template>

<style scoped>
.contextmenu {
  background-color: var(
    --spectrum-alias-background-color-default,
    var(--spectrum-global-color-gray-100)
  );
  position: fixed;
  z-index: 10;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import MenuButton from "~/components/vega/MenuButton.vue";

export class ContextMenuItem {
  text: string = "";
  action: (e: Event) => void = () => {};
}

@Component({
  components: {
    MenuButton,
  },
})
export default class ContextMenu extends Vue {
  x: number = 0;
  y: number = 0;
  isOpen: boolean = false;

  items: ContextMenuItem[] = [];

  get style(): Partial<CSSStyleDeclaration> {
    return {
      left: this.x + "px",
      top: this.y + "px",
    };
  }

  click(e: Event, item: ContextMenuItem) {
    item.action(e);
    this.close();
    console.log("cl;ick");
  }

  close() {
    this.isOpen = false;
    window.removeEventListener("mousedown", this.mouseDownInWindow);
  }

  mouseDownInWindow(e: MouseEvent) {
    const target = e.target as HTMLElement;
    // @ts-ignore
    const el = this.$refs.el.$el as HTMLElement;
    if (el.contains(target)) {
      return;
    }
    this.close();
  }

  open(e: MouseEvent, items: ContextMenuItem[]) {
    window.addEventListener("mousedown", this.mouseDownInWindow);
    this.items = items;
    this.isOpen = true;
    this.x = e.pageX;
    this.y = e.pageY;
    this.$nextTick(() => {
      const rect = this.$el.getBoundingClientRect();
      const diff = rect.height + rect.top - window.innerHeight;
      if (diff > 0) {
        this.y -= diff;
      }
    });
  }
}
</script>
