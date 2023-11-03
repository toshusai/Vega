import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import { Item, Modal, ToolBarButton, VSelect } from "@/app-ui/src";
import { Button } from "@/app-ui/src/Button/Button";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";

import { Flex } from "./Flex";
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
    <>
      <ToolBarButton onClick={handleClick}>Record</ToolBarButton>
      <Modal isOpen={showMenu} onClose={handleClose}>
        <RenderPanel onClose={handleClose}></RenderPanel>
      </Modal>
    </>
  );
};

const RenderPanel: FC<{
  onClose?: () => void;
}> = () => {
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
    <Flex $dir="column">
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
    </Flex>
  );
};
