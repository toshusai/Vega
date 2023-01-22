import { FC } from "react";
import styled from "styled-components";
import { ImageAsset } from "../../interfaces/asset/ImageAsset";
import { VideoAsset } from "../../interfaces/asset/VideoAsset";
import { FontAsset } from "../../interfaces/asset/FontAsset";
import {
  isImageAsset,
  isTextAsset,
  isVideoAsset,
  loadFont,
} from "../../rendering/updateTextEffect";
import { useSelector } from "../../store/useSelector";
import { ClickEditInput } from "../core/ClickEditInput";
import { Panel } from "../core/Panel";

export const AssetDetailsPanel: FC = () => {
  const selectedAssetIds = useSelector((state) => state.scene.selectedAssetIds);
  const assets = useSelector((state) => state.scene.assets);
  const selectedAssets = assets.filter((asset) =>
    selectedAssetIds.includes(asset.id)
  );

  if (selectedAssets.length !== 1) {
    return <Panel width={100} height={100} />;
  }
  const selectedAsset = selectedAssets[0];
  return (
    <Panel width={50} height={100}>
      <PanelBody
        style={{
          overflow: "hidden",
          height: "100%",
        }}
      >
        <div style={{ display: "flex" }}>
          <div>name:</div>
          <ClickEditInput
            style={{ marginLeft: "auto", width: "100%" }}
            value={selectedAsset.name}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div>path:</div>
          <ClickEditInput
            style={{ marginLeft: "auto", width: "100%" }}
            value={selectedAsset.path}
          />
        </div>
        <div
          style={{
            margin: "8px",
          }}
        >
          {isTextAsset(selectedAsset) && (
            <TextAssetDetailsPanel asset={selectedAsset} />
          )}
          {isVideoAsset(selectedAsset) && (
            <VideoAssetDetailsPanel asset={selectedAsset} />
          )}
          {isImageAsset(selectedAsset) && (
            <ImageAssetDetailsPanel asset={selectedAsset} />
          )}
        </div>
      </PanelBody>
    </Panel>
  );
};
export const PanelBody = styled.div`
  color: white;
  font-family: "Ricty Diminished";
  line-height: 16px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
`;

const TextAssetDetailsPanel: FC<{
  asset: FontAsset;
}> = (props) => {
  loadFont(props.asset);
  return (
    <div>
      <div
        style={{
          fontFamily: props.asset.name,
          fontSize: "16px",
          lineHeight: "20px",
        }}
      >
        {sampleText}
      </div>
    </div>
  );
};

const VideoAssetDetailsPanel: FC<{
  asset: VideoAsset;
}> = (props) => {
  return (
    <div>
      <video
        style={{
          width: "100%",
          height: "100%",
        }}
        src={props.asset.path}
        controls
      />
    </div>
  );
};

const ImageAssetDetailsPanel: FC<{
  asset: ImageAsset;
}> = (props) => {
  return (
    <div>
      <img
        style={{
          width: "100%",
          height: "100%",
        }}
        src={props.asset.path}
      />
    </div>
  );
};

const sampleText = `あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。`;
