import { FC } from "react";

import {
  AppContext,
  Effect,
  ScriptEffect,
  ScriptMeta,
  Strip,
} from "@/core/types";
import { SceneState } from "@/store/scene";

export type UpdateHandler<T> = (
  ctx: CanvasRenderingContext2D,
  effect: T,
  strip: Strip,
  scene: SceneState,
  appCtx: any
) => void;

export type EffectPlugin = {
  pkg?: ScriptMeta;
  Component?: FC<{ scriptEffect: Effect; strip: Strip; appCtx: AppContext }>;
  AssetPanel?: FC<{ appCtx: AppContext }>;
  update?: UpdateHandler<ScriptEffect>;
  beforeRender?: UpdateHandler<ScriptEffect>;
  defaultEffect?: Effect;
};
