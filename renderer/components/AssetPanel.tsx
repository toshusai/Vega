import { FC } from "react";
import { useSelector } from "../store/useSelector";
import { Panel } from "./core/Panel";

export const AssetPanel: FC = () => {
  const assets = useSelector((state) => state.scene.assets);
  return (
    <Panel>
      <div>Asset Panel</div>
      {assets.map((asset) => {
        return <div>{asset.name}</div>;
      })}
    </Panel>
  );
};
