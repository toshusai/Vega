import { FC } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Link } from "tabler-icons-react";

import { isScriptAsset } from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import {
  isAudioAsset,
  isImageAsset,
  isTextAsset,
  isVideoAsset,
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

import { AudioAssetDetailsPanel } from "./AudioAssetDetailsPanel";
import { EditableView } from "./EditableView";
import { ImageAssetDetailsPanel } from "./ImageAssetDetailsPanel";
import { ScriptAssetDetailsPanel } from "./ScriptAssetDetailsPanel";
import { TextAssetDetailsPanel } from "./TextAssetDetailsPanel";
import { VideoAssetDetailsPanel } from "./VideoAssetDetailsPanel";

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
          <SectionDiv>
            <strong>preview</strong>
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
          </SectionDiv>
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
