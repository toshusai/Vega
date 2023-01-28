import { FC, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { actions } from "@/store/scene";
import { useSelector } from "@/store/useSelector";

import { NumberEditInput } from "./core/NumberEditInput";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { Modal } from "./Modal";
import { ModalBody } from "./ModalBody";
import { PropertyName, Row } from "./strip_panel/StripPanel";

export const SettingsMenuButton: FC = () => {
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
      <HeaderMenuButton onClick={handleClick}>Settings</HeaderMenuButton>
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
  const dispatch = useDispatch();

  return (
    <ModalBody title="Settings" onClose={props.onClose}>
      <Row>
        <PropertyName>Length(sec):</PropertyName>
        <NumberEditInput
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
    </ModalBody>
  );
};
