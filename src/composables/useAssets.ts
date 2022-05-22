import { IAsset } from "../core/IAsset";

interface AssetState {
  assets: IAsset[];
}

const initialAssetsState: AssetState = {
  assets: [
    {
      id: "asset1",
      type: "Video",
      path: "./BigBuckBunny.mp4",
      name: "Big Buck Bunny",
    },
    {
      id: "asset2",
      type: "Audio",
      path: "./tsudumi-japan.mp3",
      name: "Tsu-dumi Japan",
    },
  ],
};

export function useAssets() {
  const assets = useState("assets", () => initialAssetsState);

  return {
    assets: readonly(assets),
  };
}
