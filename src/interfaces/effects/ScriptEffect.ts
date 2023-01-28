import { Effect } from "@/packages/types";

export type ScriptEffect = {
  id: string;
  type: "script";
  scriptAssetId: string;
};

export function isScriptEffect(effect: Effect): effect is ScriptEffect {
  return effect.type === "script";
}
