import { createFocusTrap } from "focus-trap";
import { useEffect } from "react";

type UseFocusTrapOptions = {
  el: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  canEscapeKeyClose?: boolean;
};

export function useFocusTrap({
  el,
  isOpen,
  onClose,
  canEscapeKeyClose,
}: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!isOpen || el === null) {
      return;
    }

    const trap = createFocusTrap(el, {
      clickOutsideDeactivates: true,
      escapeDeactivates: canEscapeKeyClose,
      returnFocusOnDeactivate: true,
      onDeactivate: onClose,
    });
    trap.activate();

    return () => {
      trap.deactivate();
    };
  }, [el, isOpen, onClose, canEscapeKeyClose]);
}
