import { isVideoEffect, Strip } from "@/core/types";
import { useSelector } from "@/hooks/useSelector";

export function VideoEffectStripUI(props: { strip: Strip }) {
  const assets = useSelector((state) => state.scene.assets);
  const effect = props.strip.effects.find(isVideoEffect);
  if (!effect) return null;
  const asset = assets.find((a) => a.id === effect.videoAssetId);
  if (!asset) return null;
  return (
    <video
      style={{
        userSelect: "none",
        height: "80%",
        objectFit: "cover",
        margin: "auto 12px",
        maxWidth: "calc(100% - 24px)",
        pointerEvents: "none",
      }}
      src={asset.path}
    />
  );
}
