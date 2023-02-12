import { Effect } from "./Effect";
import { KeyFrame } from "./KeyFrame";


export type ScriptEffect = {
  id: string;
  type: "script";
  scriptAssetId: string;
  keyframes: KeyFrame[];
};

export function isScriptEffect(effect: Effect): effect is ScriptEffect {
  return effect.type === "script";
}
