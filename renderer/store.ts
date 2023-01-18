import { sceneReducer, SceneState } from "./store/scene";
import { configureStore } from "@reduxjs/toolkit";

export type SelectorType = {
  scene: SceneState;
};

export default configureStore({
  reducer: {
    scene: sceneReducer,
  },
});
