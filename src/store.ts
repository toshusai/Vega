import { configureStore } from "@reduxjs/toolkit";

import { appReducer, AppState } from "./store/app";
import { sceneReducer, SceneState } from "./store/scene";

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
