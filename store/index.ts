import * as T from "three";
import { FontAsset, TextStrip } from "~/models";

export const state = () => ({
  defaultFont: null,
  eventMap: () => {},
});

export const getters = () => ({
  stateLoaded: (state: any) => {
    return state.defaultFont !== null;
  },
});

export const mutations = {
  setDefaultFont(state: any, font: any) {
    state.defaultFont = font;
  },
  setEvent(state: any, payload: { name: string; event: any }) {
    state.eventMap[payload.name] = payload.event;
  },
  initFont(state: any) {
    const loader = new T.FontLoader();
    const defaultFontPath =
      "/static/assets/default/fonts/gentilis_bold.typeface.json";
    loader.load(defaultFontPath, (font) => {
      TextStrip.defaultFont = font;
      FontAsset.defaultFont = new FontAsset(
        "gentilis_bold",
        "gentilis_bold",
        defaultFontPath
      );
      // @ts-ignore `this.commit not founed`
      this.commit("setDefaultFont", font);
      state.eventMap.init();
    });
  },
};
