import styled from "styled-components";

export type SelectRectProps = {
  $left: number;
  $width: number;
  $top: number;
  $height: number;
};

export const SelectRectDiv = styled.div.attrs<SelectRectProps>((props) => ({
  style: {
    left: props.$left + "px",
    width: props.$width + "px",
    top: props.$top + "px",
    height: props.$height + "px",
  },
}))<SelectRectProps>`
  position: absolute;
  background: rgba(110, 132, 255, 0.557);
  pointer-events: none;
`;
