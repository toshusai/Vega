import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";

import { Item, Select } from "./core/Select";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { Modal } from "./Modal";
import { ModalBody } from "./ModalBody";
import { PropertyName } from "./PropertyName";
import { Row } from "./Row";

export const RecordMenuButton: FC = () => {
  const [showMenu, setShowMenu] = useState(false);

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
    <ModalBody title="Record" onClose={props.onClose}>
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
    </ModalBody>
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
