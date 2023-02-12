import { FC } from "react";

import { AppContext, Effect, ScriptEffect, Strip } from "@/core/types";
import { SceneState } from "@/store/scene";

export type UpdateHandler<T> = (
  ctx: CanvasRenderingContext2D,
  effect: T,
  strip: Strip,
  scene: SceneState,
  appCtx: any
) => void;

export type EffectPlugin = {
  Component?: FC<{ scriptEffect: Effect; strip: Strip; appCtx: AppContext }>;
  update?: UpdateHandler<ScriptEffect>;
  beforeRender?: UpdateHandler<ScriptEffect>;
};
