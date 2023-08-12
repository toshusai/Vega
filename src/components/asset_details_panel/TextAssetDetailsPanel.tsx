
import { FontAsset } from "@/core/types";
import { loadFont } from "@/rendering/updateTextEffect";

export function TextAssetDetailsPanel(props: { asset: FontAsset }) {
  loadFont(props.asset);
  return (
    <div>
      <div
        style={{
          fontFamily: `_${props.asset.id}`,
          fontSize: "16px",
          lineHeight: "20px",
        }}
      >
        {sampleText}
      </div>
    </div>
  );
}
const sampleText = `あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。`;
