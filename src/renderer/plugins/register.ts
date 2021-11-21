import * as components from "@toshusai/spectrum-vue";
import Vue from "vue";

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component);
});
