import { ScriptEffect } from "@/interfaces/effects/ScriptEffect";
import { Strip } from "@/packages/types";
import { userScriptMap } from "@/rendering/updateScriptEffect";
import { FC } from "react";

export const ScriptEffectView: FC<{
  scriptEffect: ScriptEffect;
  strip: Strip;
  appCtx: any;
}> = (props) => {
  const userScript = userScriptMap.get(props.scriptEffect.scriptAssetId);
  const Component = userScript?.Component;
  if (!Component) return <div>Script not found</div>;
  return (
    <div>
      <Component {...props} />
    </div>
  );
};
