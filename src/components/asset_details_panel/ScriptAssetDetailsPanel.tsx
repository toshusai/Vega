import { useEffect, useState } from "react";

import { ScriptAsset, ScriptMeta } from "@/core/types";
import { useGetAppContext } from "@/hooks/useGetAppContext";
import { useSelector } from "@/hooks/useSelector";
import { userScriptMap } from "@/rendering/updateScriptEffect";

export function ScriptAssetDetailsPanel(props: { asset: ScriptAsset }) {
  const [metaData, setMetaData] = useState<ScriptMeta | undefined>(undefined);
  useEffect(() => {
    fetch(props.asset.path + "/package.json")
      .then((res) => res.json())
      .then((json) => {
        setMetaData(json);
      });
  }, [props.asset.path]);

  const recordingState = useSelector((state) => state.scene.recordingState);
  const appCtx = useGetAppContext();
  const userScript = userScriptMap.get(props.asset.id);
  const AssetPanel = userScript?.AssetPanel;
  if (recordingState === "recording") {
    return null;
  }

  if (!metaData) return <div>loading...</div>;
  if (!AssetPanel) return <div>no AssetPanel</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div>name: {metaData.name}</div>
      <div>version: v{metaData.version}</div>
      <div>description: {metaData.description}</div>
      <AssetPanel appCtx={appCtx} />
    </div>
  );
}
