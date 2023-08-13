import { useEffect, useState } from "react";
import { css } from "styled-components";

import { MenuItem, Modal, ModalBody } from "@/riapp-ui/src";
import { ListItem } from "@/riapp-ui/src/ListItem";
import { readRecentFiles } from "@/utils/readRecentFiles";

import { openFile } from "./MenuButton";

export function SplashModal() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <SplashModalBody onClose={handleClose}></SplashModalBody>
    </Modal>
  );
}
function SplashModalBody(props: { onClose?: () => void }) {
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
    <ModalBody onClose={props.onClose} title="Open Project">
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        {recentFiles.length > 0
          ? recentFiles.map((path) => {
              return (
                <ListItem
                  as={"button"}
                  key={path}
                  onClick={() => handleOpen(path)}
                >
                  <MenuItem text={path}></MenuItem>
                </ListItem>
              );
            })
          : null}
      </div>
    </ModalBody>
  );
}
