import styled from "styled-components";


export const StyledContextMenuButton = styled.div`
  display: flex;
  font-family: "Ricty Diminished";
  color: var(--color-text);
  font-size: 12px;
  line-height: 14px;
  height: 12px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 2px;
  :hover {
    background-color: var(--color-primary);
    color: white;
  }
`;
