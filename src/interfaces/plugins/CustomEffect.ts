import { FC } from "react";

import { ScriptEffect } from "@/interfaces/effects/ScriptEffect";
import { Strip } from "@/packages/types";
import { SceneState } from "@/store/scene";

export type UpdateHandler<T> = (
  ctx: CanvasRenderingContext2D,
  effect: T,
  strip: Strip,
  scene: SceneState,
  appCtx: any
) => void;

export type EffectPlugin = {
  Component?: FC;
  update?: UpdateHandler<ScriptEffect>;
  beforeRender?: UpdateHandler<ScriptEffect>;
};
