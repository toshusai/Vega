import { FC } from "react";

import { ScriptEffect, Strip } from "@/core/types";
import { useGetAppContext } from "@/hooks/useGetAppContext";
import { userScriptMap } from "@/rendering/updateScriptEffect";


export const ScriptEffectView: FC<{
  scriptEffect: ScriptEffect;
  strip: Strip;
}> = (props) => {
  const userScript = userScriptMap.get(props.scriptEffect.scriptAssetId);
  const Component = userScript?.Component;

  const appCtx = useGetAppContext();
  if (!Component) return <div>Script not found</div>;
  return (
    <div>
      <Component {...props} appCtx={appCtx} />
    </div>
  );
};
