import { SceneState } from "@/store/scene";

import { jsonCompare } from "./jsonCompare";

export const compareScene = (scene: SceneState, old: SceneState) => {
  return (
    jsonCompare(scene.assets, old.assets) &&
    jsonCompare(scene.strips, old.strips) &&
    scene.canvasHeight === old.canvasHeight &&
    scene.canvasWidth === old.canvasWidth &&
    scene.fps === old.fps
  );
};
