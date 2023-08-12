import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { ImageAsset } from "@/core/types";

export function ImageAssetDetailsPanel(props: { asset: ImageAsset }) {
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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 4px;
      `}
    >
      <div>
        resolution: {width} x {height}
      </div>
      <div
        css={css`
          display: flex;
          justify-content: center;
        `}
      >
        <StyledImg alt="preview" ref={imgRef} src={props.asset.path} />
      </div>
    </div>
  );
}
const StyledImg = styled.img`
  width: 50%;
  border: 1px solid #ccc;
`;
