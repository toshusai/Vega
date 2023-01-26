import { FC, useRef, useState } from "react";
import styled from "styled-components";
import { PanelBody } from "./asset_details_panel/AssetDetailsPanel";
import { Panel } from "./core/Panel";
import { Item, Select } from "./core/Select";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { Modal } from "./Modal";
import { PropertyName, Row } from "./strip_panel/StripPanel";

export const RecordMenuButton: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
      }}
    >
      <HeaderMenuButton onClick={handleClick}>Record</HeaderMenuButton>
      <Modal isOpen={showMenu} onClose={() => setShowMenu(false)}>
        <RenderPanel></RenderPanel>
      </Modal>
    </div>
  );
};

const RenderPanel = () => {
  const exportOptionItems: Item[] = [
    {
      label: "WebM",
      value: "webm",
    },
    {
      label: "single PNG",
      value: "png",
    },
  ];

  const [selectedExportOption, setSelectedExportOption] = useState("webm");
  return (
    <Panel
      width={"200px"}
      height={"auto"}
      style={{
        margin: "auto",
      }}
    >
      <PanelBody
        style={{
          height: "100%",
          margin: "0 8px",
          gap: "8px",
        }}
      >
        <Row>
          <PropertyName>Export</PropertyName>
          <Select
            items={exportOptionItems}
            value={selectedExportOption}
            onChange={setSelectedExportOption}
          />
        </Row>
        <div style={{ margin: "auto" }}>
          <Row>
            <Button>Record</Button>
          </Row>
        </div>
      </PanelBody>
    </Panel>
  );
};

const Button = styled.button`
  cursor: pointer;
  display: block;
  color: var(--color-text);
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  margin: 0;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  border-radius: 8px;
  height: 16px;
  padding-left: 8px;
  max-width: 128px;
  :active {
    background-color: var(--color-input-background-focus);
  }
  font-family: "Ricty Diminished";
`;
