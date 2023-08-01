import styled from "styled-components";

import { isTextEffect, Strip } from "@/core/types";

export function TextEffectStripUI(props: { strip: Strip }) {
  const textEffect = props.strip.effects.find(isTextEffect);
  if (!textEffect) return null;
  return <Div>{textEffect.text}</Div>;
}

const Div = styled.div`
  margin: 0 12px;
  max-width: calc(100% - 24px);
  overflow: hidden;
  white-space: nowrap;
  align-self: center;
  user-select: none;
`;
