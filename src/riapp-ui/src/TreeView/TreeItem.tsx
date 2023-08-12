import React from "react";
import styled from "styled-components";

import { COLOR_INPUT_BACKGROUND_FOCUS_NAME } from "../styled";

export type TreeViewItem<T> = {
  id: string;
  children?: TreeViewItem<T>[];
  data: T;
};

export function TreeItem<T>(
  props: {
    children: React.ReactNode;
    depth?: number;
  } & React.HTMLAttributes<HTMLLIElement>
) {
  const { children, depth, ...rest } = props;
  return (
    <TreeItemRoot padding={props.depth ? props.depth * 12 : 0} {...rest}>
      {props.children}
    </TreeItemRoot>
  );
}

const TreeItemRoot = styled.li<{
  padding: number;
}>`
  display: flex;
  cursor: pointer;
  padding-left: ${(props) => props.padding}px;
  height: 12px;
  line-height: 12px;

  :hover {
    background-color: var(${COLOR_INPUT_BACKGROUND_FOCUS_NAME});
  }
`;
