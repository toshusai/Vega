import { IconFilePlus, IconMusic, IconPhoto, IconScript, IconTex, IconTrash, IconVideo } from "@tabler/icons-react";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { uuid } from "short-uuid";
import styled, { css } from "styled-components";

import { IconButton, iconProps, ToolTip } from "@/app-ui/src";
import { EditableTree } from "@/app-ui/src/TreeView/EditableTree";
import { TreeViewItem } from "@/app-ui/src/TreeView/TreeItem";
import { Card } from "@/components/Card";
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
import { isElectron } from "@/ipc/readFileUserDataDir";
import { isAudioAsset, isImageAsset } from "@/rendering/updateTextEffect";
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
    filePick((_, path, name) => {
      if (isFont(name)) {
        const asset: FontAsset = {
          id: uuid(),
          path: path,
          type: "font",
          name,
        };
        dispatch(actions.updateAssets(asset));
      } else if (isVideo(name)) {
        const asset: VideoAsset = {
          id: uuid(),
          path: path,
          type: "video",
          name,
        };
        dispatch(actions.updateAssets(asset));
      } else if (isImage(name)) {
        const asset: ImageAsset = {
          id: uuid(),
          path: path,
          type: "image",
          name,
        };
        dispatch(actions.updateAssets(asset));
      } else if (isAudio(name)) {
        const asset: AudioAsset = {
          id: uuid(),
          path: path,
          type: "audio",
          name,
        };
        dispatch(actions.updateAssets(asset));
      } else if (isScript(name)) {
        const asset: ScriptAsset = {
          id: uuid(),
          path: isElectron() ? path.replace("/package.json", "") : path,
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
    <Card>
      <div style={{ flexDirection: "column", width: "100%" }}>
        <div
          style={{
            marginBottom: "8px",
            display: "flex",
            width: "100%",
            gap: "2px",
          }}
        >
          <ToolTip content="Add new asset">
            <IconButton onClick={handleAddAsset}>
              <IconFilePlus {...iconProps} />
            </IconButton>
          </ToolTip>
          <ToolTip content="Delete selected asset">
            <IconButton onClick={handleDeleteAsset}>
              <IconTrash {...iconProps} />
            </IconButton>
          </ToolTip>
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
        <IconVideo style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : props.asset.type === "font" ? (
        <IconTex style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : isImageAsset(props.asset) ? (
        <IconPhoto style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : isAudioAsset(props.asset) ? (
        <IconMusic style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
      ) : isScriptAsset(props.asset) ? (
        <IconScript style={{ margin: "auto 2px", minWidth: "12px" }} size={12} />
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
