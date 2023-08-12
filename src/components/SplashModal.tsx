import { useEffect, useLayoutEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  buttonCss, MenuItem, Modal,
  ModalBody
} from "@/riapp-ui/src";
import { readRecentFiles } from "@/utils/readRecentFiles";
import { openFile } from "./MenuButton";


export function SplashModal() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <SplashModalBody onClose={handleClose}></SplashModalBody>
    </Modal>
  );
}
function SplashModalBody(props: { onClose?: () => void; }) {
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  useEffect(() => {
    const recentFiles = readRecentFiles();
    setRecentFiles(recentFiles);
  }, []);
  function handleOpen(path: string) {
    openFile(path);
    props.onClose?.();
  }
  return (
    <ModalBody onClose={props.onClose} title="Vega">
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        {recentFiles.length > 0
          ? recentFiles.map((path) => {
            return (
              <StyledButton key={path} onClick={() => handleOpen(path)}>
                <MenuItem text={path}></MenuItem>
              </StyledButton>
            );
          })
          : null}
      </div>
    </ModalBody>
  );
}
const StyledButton = styled.button`
  ${buttonCss}
  max-width: none;
`;
