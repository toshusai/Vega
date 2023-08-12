import { FC, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { AlertTriangle, Link } from "tabler-icons-react";

import {
  AudioAsset,
  FontAsset,
  ImageAsset,
  isScriptAsset,
  ScriptAsset,
  ScriptMeta,
  VideoAsset,
} from "@/core/types";
import { useGetAppContext } from "@/hooks/useGetAppContext";
import { useSelector } from "@/hooks/useSelector";
import { userScriptMap } from "@/rendering/updateScriptEffect";
import {
  isAudioAsset,
  isImageAsset,
  isTextAsset,
  isVideoAsset,
  loadFont,
} from "@/rendering/updateTextEffect";
import {
  AutoHeightTextarea,
  Card,
  Flex,
  IconButton,
  iconProps,
  PanelBody,
} from "@/riapp-ui/src";
import { actions } from "@/store/scene";
import { filePick } from "@/utils/filePick";

import { EditableView } from "./EditableView";

export const AssetDetailsPanel: FC = () => {
  const selectedAssetIds = useSelector((state) => state.scene.selectedAssetIds);
  const assets = useSelector((state) => state.scene.assets);
  const selectedAssets = assets.filter((asset) =>
    selectedAssetIds.includes(asset.id)
  );
  const dispatch = useDispatch();

  const changeAssetPath = () => {
    filePick((_, path) => {
      const newAsset = { ...selectedAssets[0], path: `file://` + path };
      dispatch(actions.updateAssets(newAsset));
    }, "*");
  };

  if (selectedAssets.length !== 1) {
    return <Card width={100} height={100} />;
  }
  const selectedAsset = selectedAssets[0];
  return (
    <Card width={100} height={100}>
      <PanelBody
        style={{
          overflow: "hidden",
          height: "100%",
        }}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0 4px;
          `}
        >
          <SectionDiv>
            <strong>name</strong>
            <EditableView
              text={selectedAsset.name}
              onChange={(value) => {
                const newAsset = { ...selectedAssets[0], name: value };
                dispatch(actions.updateAssets(newAsset));
              }}
            />
          </SectionDiv>
          <SectionDiv>
            <strong>path</strong>
            <Flex>
              <IconButton
                style={{ marginLeft: "auto" }}
                onClick={() => {
                  changeAssetPath();
                }}
              >
                <Link {...iconProps} />
              </IconButton>
              <AutoHeightTextarea
                css={css`
                  width: 100%;
                  max-width: 100%;
                `}
                style={{ width: "100%", maxWidth: "100%" }}
                value={selectedAsset.path.replace(/\n/g, "")}
              />
            </Flex>
          </SectionDiv>
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
    </Card>
  );
};

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TextAssetDetailsPanel: FC<{
  asset: FontAsset;
}> = (props) => {
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
      imgRef.current.onload = () => {
        setWidth(imgRef.current?.naturalWidth);
        setHeight(imgRef.current?.naturalHeight);
      };
    }
  }, []);

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
  const [isFound, setIsFound] = useState(false);
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      `}
    >
      {!isFound && (
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 8px;
            color: #ff756b;
          `}
        >
          <AlertTriangle size={16} />
          <div>not found asset</div>
        </div>
      )}
      <audio
        onError={() => {
          setIsFound(false);
        }}
        onLoadedMetadata={() => {
          setIsFound(true);
        }}
        css={css`
          height: 24px;
          width: 100%;
        `}
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
};

const sampleText = `あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。`;
