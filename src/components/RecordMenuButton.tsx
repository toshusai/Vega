import { actions } from "@/store/scene";
import { useSelector } from "@/store/useSelector";
import { FC, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Cross, X } from "tabler-icons-react";
import { PanelBody } from "./asset_details_panel/AssetDetailsPanel";
import { iconProps } from "./core/iconProps";
import { Panel } from "./core/Panel";
import { Item, Select } from "./core/Select";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { Modal } from "./Modal";
import { PropertyName, Row } from "./strip_panel/StripPanel";
import { KeyFrameIconButton } from "./strip_panel/KeyFrameIconButton";

export const RecordMenuButton: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    setShowMenu(!showMenu);
  };
  const dispatch = useDispatch();

  const handleClose = () => {
    setShowMenu(false);
    dispatch(actions.setRecordingState("paused"));
  };

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
      }}
    >
      <HeaderMenuButton onClick={handleClick}>Record</HeaderMenuButton>
      <Modal isOpen={showMenu} onClose={handleClose}>
        <RenderPanel onClose={handleClose}></RenderPanel>
      </Modal>
    </div>
  );
};

const RenderPanel: FC<{
  onClose?: () => void;
}> = (props) => {
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
  const dispatch = useDispatch();

  const handleStartRecording = () => {
    dispatch(actions.setRecordingState("recording"));
    dispatch(actions.setCurrentTime(0));
    dispatch(actions.setIsPlaying(true));
  };
  const recordingState = useSelector((state) => state.scene.recordingState);
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
        <div style={{ display: "flex" }}>
          <div style={{ width: "16px" }}></div>
          <div style={{ margin: "auto", fontWeight: "bold" }}>Record</div>
          <div>
            <KeyFrameIconButton onClick={props.onClose}>
              <X {...iconProps} />
            </KeyFrameIconButton>
          </div>
        </div>
        <Row>
          <PropertyName>Export</PropertyName>
          <Select
            disabled={recordingState === "recording"}
            items={exportOptionItems}
            value={selectedExportOption}
            onChange={setSelectedExportOption}
          />
        </Row>
        <div style={{ margin: "auto" }}>
          <Row>
            <Button
              disabled={recordingState === "recording"}
              onClick={handleStartRecording}
            >
              {recordingState === "recording" ? "Stop" : "Start"}
            </Button>
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
  :disabled {
    background-color: var(--color-input-background-disabled);
    color: var(--color-text-disabled);
  }
  font-family: "Ricty Diminished";
`;
