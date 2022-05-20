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
  ],
};

export function useAssets() {
  const assets = useState("assets", () => initialAssetsState);

  return {
    assets: readonly(assets),
  };
}
