import { sceneReducer, SceneState } from "./store/scene";
import { configureStore } from "@reduxjs/toolkit";
import { appReducer, AppState } from "./store/app";

export type SelectorType = {
  scene: SceneState;
  app: AppState;
};

export default configureStore({
  reducer: {
    scene: sceneReducer,
    app: appReducer,
  },
});
