import { FC } from "react";
import styled from "styled-components";
import { useSelector } from "../store/useSelector";
import { ClickEditInput } from "./core/ClickEditInput";
import { Panel } from "./core/Panel";

export const AssetDetailsPanel: FC = () => {
  const selectedAssetIds = useSelector((state) => state.scene.selectedAssetIds);
  const assets = useSelector((state) => state.scene.assets);
  const selectedAssets = assets.filter((asset) =>
    selectedAssetIds.includes(asset.id)
  );

  if (selectedAssets.length !== 1) {
    return <Panel />;
  }
  const selectedAsset = selectedAssets[0];
  return (
    <Panel>
      <PanelBody>
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
