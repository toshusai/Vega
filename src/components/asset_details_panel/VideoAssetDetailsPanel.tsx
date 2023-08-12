import { VideoAsset } from "@/core/types";

export function VideoAssetDetailsPanel(props: { asset: VideoAsset; }) {
  return (
    <div>
      <video
        style={{
          width: "100%",
          height: "100%",
        }}
        src={props.asset.path}
        controls />
    </div>
  );
}
