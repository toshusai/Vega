import styled from "styled-components";
import { type IconProps } from "tabler-icons-react";

import { MenuItemBase } from "./MenuItemBase";

export const MenuItemWrapper = styled.div<{
  $hasLeftIcon: boolean;
}>`
  padding-left: ${(props) => (props.$hasLeftIcon ? 0 : 12)}px;
  padding-right: 8px;
`;

const MenuItemShortcut = styled.div`
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  white-space: nowrap;
  justify-content: space-between;
  padding-right: 12px;
`;

export const Root = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const Flex = styled.div`
  display: flex;
  gap: 2px;
`;

export function MenuItem(props: {
  leftIcon?: React.FC<IconProps>;
  text: string;
  shortcut?: string;
}) {
  return (
    <MenuItemBase text={props.text} leftIcon={props.leftIcon}>
      <MenuItemShortcut>{props.shortcut}</MenuItemShortcut>
    </MenuItemBase>
  );
}
