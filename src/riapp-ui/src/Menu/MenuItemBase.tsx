import { type IconProps } from "tabler-icons-react";

import { Flex, MenuItemWrapper, Root } from "./MenuItem";
import { iconProps } from "../iconProps";

export function MenuItemBase(props: {
  leftIcon?: React.FC<IconProps>;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <Root>
      <Flex>
        {props.leftIcon &&
          props.leftIcon({
            ...iconProps,
            style: {
              ...iconProps.style,
              margin: "",
            },
          })}
        <MenuItemWrapper $hasLeftIcon={props.leftIcon !== undefined}>
          {props.text}
        </MenuItemWrapper>
      </Flex>
      {props.children}
    </Root>
  );
}
