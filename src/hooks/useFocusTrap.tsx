import { useEffect } from "react";
import { createFocusTrap } from "focus-trap";

type UseFocusTrapOptions = {
  el: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
};

export function useFocusTrap({
  el,
  isOpen,
  onClose,
}: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!isOpen || el === null) {
      return;
    }

    const trap = createFocusTrap(el, {
      clickOutsideDeactivates: true,
      escapeDeactivates: true,
      returnFocusOnDeactivate: true,
      onDeactivate: onClose,
    });
    trap.activate();

    return () => {
      trap.deactivate();
    };
  }, [el, isOpen, onClose]);
}
