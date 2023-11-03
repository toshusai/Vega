import { IconAlertTriangle } from "@tabler/icons-react";
import { useState } from "react";
import { css } from "styled-components";

import { AudioAsset } from "@/core/types";

export function AudioAssetDetailsPanel(props: { asset: AudioAsset }) {
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
          <IconAlertTriangle size={16} />
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
}
