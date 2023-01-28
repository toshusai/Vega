import { uuid } from "short-uuid";

import { ScriptEffect } from "@/interfaces/effects/ScriptEffect";
import { Strip } from "@/packages/types";
import { SceneState } from "@/store/scene";

import { EffectPlugin } from "./../interfaces/plugins/CustomEffect";

enum Status {
  LOADING,
  LOADED,
  ERROR,
}

export const userScriptMap = new Map<string, EffectPlugin>();
const scriptStatusMap = new Map<string, Status>();

export const handler = (
  ctx: CanvasRenderingContext2D,
  effect: ScriptEffect,
  strip: Strip,
  scene: SceneState,
  appCtx: {
    dispatch: (action: any) => void;
    actions: any;
  }
) => {
  const scriptAsset = scene.assets.find(
    (asset) => asset.id === effect.scriptAssetId
  );
  if (!scriptAsset) return;
  const status = scriptStatusMap.get(effect.scriptAssetId);
  if (status === Status.ERROR || status === Status.LOADING) return;
  if (!status) {
    scriptStatusMap.set(effect.scriptAssetId, Status.LOADING);
    const srcPath = scriptAsset.path + "/dist/esm/index.js";
    const userScriptElement = document.createElement("script");
    userScriptElement.type = "module";
    userScriptElement.onerror = () => {
      scriptStatusMap.set(effect.scriptAssetId, Status.ERROR);
    };
    userScriptElement.onload = () => {
      const tmpEventId = uuid().replace(/-/g, "");

      // Load the ESM module through another temporary script and inject it into the runtime via window.
      const esmBridgeElement = document.createElement("script");
      esmBridgeElement.type = "module";
      esmBridgeElement.innerHTML = `
import _${tmpEventId} from "${srcPath}";
window.dispatchEvent(new CustomEvent("${tmpEventId}", { detail: _${tmpEventId} }));
`;

      const handlePluginLoaded = (event: Event) => {
        if (event.type !== tmpEventId) return;
        if (!(event instanceof CustomEvent)) return;
        const userScript = event.detail;
        userScriptMap.set(effect.scriptAssetId, userScript);
        scriptStatusMap.set(effect.scriptAssetId, Status.LOADED);
        esmBridgeElement.remove();
        userScriptElement.remove();
        window.removeEventListener(tmpEventId, handlePluginLoaded);
      };
      window.addEventListener(tmpEventId, handlePluginLoaded);

      document.body.appendChild(esmBridgeElement);
    };
    userScriptElement.src = srcPath;
    document.head.appendChild(userScriptElement);
  }
  const userScript = userScriptMap.get(effect.scriptAssetId);
  if (!userScript) return;
  return {
    update: () => userScript.update?.(ctx, effect, strip, scene, appCtx),
    beforeUpdate: () =>
      userScript.beforeRender?.(ctx, effect, strip, scene, appCtx),
  };
};
