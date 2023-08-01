import { Music } from "tabler-icons-react";

import { isAudioEffect, Strip } from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { iconProps } from "@/riapp-ui/src";

export function AudioEffectStripUI(props: { strip: Strip }) {
  const assets = useSelector((state) => state.scene.assets);
  const effect = props.strip.effects.find(isAudioEffect);
  if (!effect) return null;
  const asset = assets.find((a) => a.id === effect.audioAssetId);
  if (!asset) return null;
  return (
    <div
      style={{
        userSelect: "none",
        height: "80%",
        margin: "auto 12px",
        maxWidth: "calc(100% - 24px)",
        pointerEvents: "none",
        display: "flex",
      }}
    >
      <Music {...iconProps} size={24}></Music>
    </div>
  );
}
