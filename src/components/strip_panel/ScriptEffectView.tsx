import { FC } from "react";
import { useDispatch } from "react-redux";

import { AppContext, ScriptEffect, Strip } from "@/core/types";
import { useAnimationedValue } from "@/hooks/useAnimationedValue";
import { useStripTime } from "@/hooks/useStripTime";
import { useUpdateEffect } from "@/hooks/useUpdateEffect";
import { writeFile } from "@/ipc/writeFile";
import { userScriptMap } from "@/rendering/updateScriptEffect";
import { actions } from "@/store/scene";

export const ScriptEffectView: FC<{
  scriptEffect: ScriptEffect;
  strip: Strip;
}> = (props) => {
  const userScript = userScriptMap.get(props.scriptEffect.scriptAssetId);
  const Component = userScript?.Component;
  const dispatch = useDispatch();

  if (!Component) return <div>Script not found</div>;
  const appCtx: AppContext = {
    actions: actions,
    dispatch: dispatch,
    fs: {
      writeFile: writeFile,
    },
    hooks: {
      useAnimationedValue: useAnimationedValue,
      useStripTime: useStripTime,
      useUpdateEffect: useUpdateEffect,
    },
  };
  return (
    <div>
      <Component {...props} appCtx={appCtx} />
    </div>
  );
};
