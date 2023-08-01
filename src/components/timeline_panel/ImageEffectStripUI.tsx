import { isImageEffect, Strip } from "@/core/types";
import { useSelector } from "@/hooks/useSelector";

export function ImageEffectStripUI(props: { strip: Strip }) {
  const assets = useSelector((state) => state.scene.assets);
  const effect = props.strip.effects.find(isImageEffect);
  if (!effect) return null;
  const asset = assets.find((a) => a.id === effect.imageAssetId);
  if (!asset) return null;
  return (
    <img
      alt="preview"
      src={asset.path}
      style={{
        height: "80%",
        userSelect: "none",
        objectFit: "cover",
        margin: "auto 12px",
        background: "white",
        maxWidth: "calc(100% - 24px)",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
