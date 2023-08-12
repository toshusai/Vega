import { FC } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import styled, { css } from "styled-components";
import {
  FilePlus,
  Music,
  Photo,
  Script,
  Tex,
  Trash,
  Video,
} from "tabler-icons-react";

import {
  Asset,
  AudioAsset,
  FontAsset,
  ImageAsset,
  isScriptAsset,
  ScriptAsset,
  VideoAsset,
} from "@/core/types";
import { useSelector } from "@/hooks/useSelector";
import { isAudioAsset, isImageAsset } from "@/rendering/updateTextEffect";
import { Card, IconButton, iconProps, ToolTip } from "@/riapp-ui/src";
import { EditableTree } from "@/riapp-ui/src/TreeView/EditableTree";
import { TreeViewItem } from "@/riapp-ui/src/TreeView/TreeItem";
import { actions } from "@/store/scene";
import { filePick } from "@/utils/filePick";

const supportedVideoExtensions = ["mp4", "webm", "mov"];
const supportedFontExtensions = ["ttf"];
const supportedAudioExtensions = ["mp3", "wav"];
const supportedImageExtensions = ["png", "jpg", "jpeg", "svg"];
const supportedScriptExtensions = ["json"];

function isImage(path: string) {
  return supportedImageExtensions.some((ext) => path.endsWith(ext));
}

function isVideo(path: string) {
  return supportedVideoExtensions.some((ext) => path.endsWith(ext));
}

function isFont(path: string) {
  return supportedFontExtensions.some((ext) => path.endsWith(ext));
}
function isAudio(path: string) {
  return supportedAudioExtensions.some((ext) => path.endsWith(ext));
}

function isScript(path: string) {
  return supportedScriptExtensions.some((ext) => path.endsWith(ext));
}

export const AssetPanel: FC = () => {
  const assets = useSelector((state) => state.scene.assets);
  const selectedAssetIds = useSelector((state) => state.scene.selectedAssetIds);
  const dispatch = useDispatch();
  const handleSelectAsset = (asset: Asset) => {
    dispatch(actions.setSelectedAssetIds([asset.id]));
  };

  const handleAddAsset = () => {
    const accept = [
      ...supportedVideoExtensions,
      ...supportedFontExtensions,
      ...supportedImageExtensions,
    ].join(", ");
    filePick((_, path) => {
      if (isFont(path)) {
        const asset: FontAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "font",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      } else if (isVideo(path)) {
        const asset: VideoAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "video",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      } else if (isImage(path)) {
        const asset: ImageAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "image",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      } else if (isAudio(path)) {
        const asset: AudioAsset = {
          id: uuid(),
          path: `file://${path}`,
          type: "audio",
          name: path.split("/").join("_"),
        };
        dispatch(actions.updateAssets(asset));
      } else if (isScript(path)) {
        const asset: ScriptAsset = {
          id: uuid(),
          path: `file://${path.replace("/package.json", "")}`,
          type: "script",
          name: path.split("/")[path.split("/").length - 2],
        };
        dispatch(actions.updateAssets(asset));
      } else {
        alert("Unsupported file type");
      }
    }, accept);
  };

  const handleDeleteAsset = () => {
    dispatch(actions.removeAsset(selectedAssetIds));
  };

  const items = assets.map((asset) => {
    return {
      id: asset.id,
      data: asset,
    };
  });
  items.sort((a, b) => {
    return a.data.name.localeCompare(b.data.name);
  });

  return (
    <Card height={100} width={100}>
      <div
        style={{
          marginBottom: "8px",
          display: "flex",
          gap: "2px",
        }}
      >
        <IconButton onClick={handleAddAsset}>
          <FilePlus {...iconProps} />
          <ToolTip>Add new asset</ToolTip>
        </IconButton>
        <IconButton onClick={handleDeleteAsset}>
          <Trash {...iconProps} />
          <ToolTip>Delete selected asset</ToolTip>
        </IconButton>
      </div>
      <div
        style={{
          overflowY: "auto",
          height: "calc(100% - 24px)",
        }}
      >
        <EditableTree
          renderItem={(item: TreeViewItem<Asset>) => {
            return (
              <AssetListItem
                key={item.id}
                asset={item.data}
                selected={selectedAssetIds.includes(item.id)}
                onClick={() => handleSelectAsset(item.data)}
              />
            );
          }}
          items={items}
          onChangeSelection={(items) => {
            if (items.length == 1) {
              handleSelectAsset(items[0].data);
            } else {
              dispatch(actions.setSelectedAssetIds([]));
            }
          }}
        />
      </div>
    </Card>
  );
};

const AssetListItem: FC<{
  asset: Asset;
  selected: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <Div tabIndex={0} onClick={props.onClick}>
      {props.asset.type === "video" ? (
        <Video style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : props.asset.type === "font" ? (
        <Tex style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : isImageAsset(props.asset) ? (
        <Photo style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : isAudioAsset(props.asset) ? (
        <Music style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : isScriptAsset(props.asset) ? (
        <Script style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : null}
      <div
        css={css`
          text-overflow: ellipsis;
          overflow: hidden;
        `}
      >
        {props.asset.name}
      </div>
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  font-family: "Ricty Diminished";
  text-overflow: ellipsis;
  overflow: hidden;
  align-items: center;
  line-height: 12px;
  font-size: 10px;
  height: 12px;
  cursor: default;
  user-select: none;
  box-sizing: border-box;

  :hover {
  }

  :focus {
    border-bottom: 1px solid #fff;
  }
`;
