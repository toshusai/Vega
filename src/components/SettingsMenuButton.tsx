import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "@/hooks/useSelector";
import { Modal , ModalBody , ToolbarButton,VNumberInput  } from "@/riapp-ui/src";
import { actions } from "@/store/scene";

import { PropertyName } from "./PropertyName";
import { Row } from "./Row";

export const SettingsMenuButton: FC = () => {
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
      <ToolbarButton onClick={handleClick}>Settings</ToolbarButton>
      <Modal isOpen={showMenu} onClose={handleClose}>
        <SettingsModal onClose={handleClose} />
      </Modal>
    </div>
  );
};

const SettingsModal: FC<{
  onClose?: () => void;
}> = (props) => {
  const length = useSelector((state) => state.scene.length);
  const width = useSelector((state) => state.scene.canvasWidth);
  const height = useSelector((state) => state.scene.canvasHeight);
  const dispatch = useDispatch();

  return (
    <ModalBody title="Settings" onClose={props.onClose}>
      <Row>
        <PropertyName>Length(sec):</PropertyName>
        <VNumberInput
          min={1}
          max={1200}
          scale={0.1}
          value={length}
          onInput={(value) => {
            dispatch(actions.setLength(value));
          }}
          onChange={(value) => {
            dispatch(actions.setLength(value));
          }}
        />
      </Row>
      <Row>
        <PropertyName>width:</PropertyName>
        <VNumberInput
          min={1}
          max={1920}
          scale={1}
          value={width}
          onInput={(value) => {
            dispatch(actions.setWidth(value));
          }}
          onChange={(value) => {
            dispatch(actions.setWidth(value));
          }}
        />
      </Row>
      <Row>
        <PropertyName>height:</PropertyName>
        <VNumberInput
          min={1}
          max={1280}
          scale={1}
          value={height}
          onInput={(value) => {
            dispatch(actions.setHeight(value));
          }}
          onChange={(value) => {
            dispatch(actions.setHeight(value));
          }}
        />
      </Row>
    </ModalBody>
  );
};
