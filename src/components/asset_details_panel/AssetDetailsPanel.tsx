import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { ClickEditInput } from "@/components/core/ClickEditInput";
import { Panel } from "@/components/core/Panel";
import {
  AudioAsset,
  FontAsset,
  ImageAsset,
  isScriptAsset,
  ScriptAsset,
  ScriptMeta,
  VideoAsset,
} from "@/packages/types";
import {
  isAudioAsset,
  isImageAsset,
  isTextAsset,
  isVideoAsset,
  loadFont,
} from "@/rendering/updateTextEffect";
import { useSelector } from "@/store/useSelector";

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
    <Panel width={100} height={100}>
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
          {isAudioAsset(selectedAsset) && (
            <AudioAssetDetailsPanel asset={selectedAsset} />
          )}
          {isScriptAsset(selectedAsset) && (
            <ScriptAssetDetailsPanel asset={selectedAsset} />
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
  overflow: hidden;
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (imgRef.current) {
      setWidth(imgRef.current.naturalWidth);
      setHeight(imgRef.current.naturalHeight);
    }
  }, [props.asset.path]);

  return (
    <div>
      <div>
        {width}x{height}
      </div>
      <img
        alt="preview"
        ref={imgRef}
        style={{
          width: "100%",
          height: "100%",
        }}
        src={props.asset.path}
      />
    </div>
  );
};

const AudioAssetDetailsPanel: FC<{
  asset: AudioAsset;
}> = (props) => {
  return (
    <div>
      <audio
        style={{
          transform: "scale(0.5)",
          transformOrigin: "top left",
        }}
        src={props.asset.path}
        controls
      />
    </div>
  );
};

const ScriptAssetDetailsPanel: FC<{
  asset: ScriptAsset;
}> = (props) => {
  const [metaData, setMetaData] = useState<ScriptMeta | undefined>(undefined);
  useEffect(() => {
    fetch(props.asset.path + "/package.json")
      .then((res) => res.json())
      .then((json) => {
        setMetaData(json);
      });
  }, [props.asset.path]);

  if (!metaData) return <div>loading...</div>;

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
    </div>
  );
};

const sampleText = `あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。`;
