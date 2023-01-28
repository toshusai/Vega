import { FC } from "react";

import { ScriptEffect,Strip  } from "@/packages/types";
import { userScriptMap } from "@/rendering/updateScriptEffect";

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
