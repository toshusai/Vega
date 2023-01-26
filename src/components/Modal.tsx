import { useState } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  useFocusTrap({ el: element, isOpen, onClose });

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      ref={setElement}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          zIndex: 101,
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
