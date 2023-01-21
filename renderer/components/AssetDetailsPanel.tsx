import { FC } from "react";
import styled from "styled-components";
import { FontAsset } from "../interfaces/Asset";
import { isTextAsset } from "../rendering/updateTextEffect";
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
        {isTextAsset(selectedAsset) && (
          <TextAssetDetailsPanel asset={selectedAsset} />
        )}
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
  return (
    <div>
      <div
        style={{
          fontFamily: props.asset.name,
          fontSize: "24px",
          lineHeight: "32px",
        }}
      >
        {sampleText}
      </div>
    </div>
  );
};

const sampleText = `あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。`;
