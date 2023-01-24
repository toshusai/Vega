import { FC } from "react";
import { Strip } from "../Strip";
import { SceneState } from "@/store/scene";
import { ScriptEffect } from "../effects/ScriptEffect";

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
