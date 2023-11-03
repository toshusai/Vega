import styled from "styled-components";

type FlexProps = {
  $dir?: "row" | "column";
  $gap?: number;
  $justify?: "start" | "center" | "end" | "space-between";
  $items?: "start" | "center" | "end" | "space-between";
  $p?: number;
  $px?: number;
  $py?: number;
  $pt?: number;
  $pb?: number;
  $pl?: number;
  $pr?: number;
};

function px(n: number | undefined) {
  if (n === undefined) {
    return "";
  }
  return `${n}px`;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.$dir};
  gap: ${(props) => px(props.$gap)};
  justify-content: ${(props) => props.$justify};
  align-items: ${(props) => props.$items};
  padding: ${(props) => px(props.$p)} ${(props) => px(props.$p)};
  padding-left: ${(props) => px(props.$pl)};
  padding-right: ${(props) => px(props.$pr)};
  padding-top: ${(props) => px(props.$pt)};
  padding-bottom: ${(props) => px(props.$pb)};
`;
