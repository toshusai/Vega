import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "@/hooks/useSelector";
import { Item, Modal, ModalBody, ToolbarButton, VSelect } from "@/riapp-ui/src";
import { Button } from "@/riapp-ui/src/styled/Button";
import { actions } from "@/store/scene";

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
      <ToolbarButton onClick={handleClick}>Record</ToolbarButton>
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
        <VSelect
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
