import { FC } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Tex, Video } from "tabler-icons-react";
import { Asset } from "../interfaces/Asset";
import { actions } from "../store/scene";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";

export const AssetPanel: FC = () => {
  const assets = useSelector((state) => state.scene.assets);
  const selectedAssetIds = useSelector((state) => state.scene.selectedAssetIds);
  const dispatch = useDispatch();
  const handleSelectAsset = (asset: Asset) => {
    dispatch(actions.setSelectedAssetIds([asset.id]));
  };

  return (
    <Panel>
      {assets.map((asset) => {
        return (
          <AssetListItem
            key={asset.id}
            asset={asset}
            selected={selectedAssetIds.includes(asset.id)}
            onClick={() => handleSelectAsset(asset)}
          />
        );
      })}
    </Panel>
  );
};

const AssetListItem: FC<{
  asset: Asset;
  selected: boolean;
  onClick: () => void;
}> = (props) => {
  return (
    <Div
      tabIndex={0}
      onClick={props.onClick}
      style={{
        backgroundColor: props.selected ? "#444" : "transparent",
      }}
    >
      {props.asset.type === "video" ? (
        <Video style={{ margin: "auto 2px" }} size={16} />
      ) : props.asset.type === "font" ? (
        <Tex style={{ margin: "auto 2px" }} size={16} />
      ) : null}
      <div>{props.asset.name}</div>
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  color: white;
  font-family: "Ricty Diminished";
  line-height: 20px;
  height: 20px;
  cursor: default;

  :hover {
    background-color: #333;
  }

  :focus {
    background-color: #444;
  }
`;
