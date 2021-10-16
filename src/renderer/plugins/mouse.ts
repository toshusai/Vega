export const LEFT = 0;
export const MIDDLE = 1;
export const RIGHT = 2;

export function addDragEventOnce(callback: (e: MouseEvent) => void) {
  document.body.addEventListener("mousemove", callback);
  const removeEvent = (_: MouseEvent) => {
    document.body.removeEventListener("mousemove", callback);
    document.body.removeEventListener("pointerup", removeEvent);
    document.body.removeEventListener("mouseleave", removeEvent);
  };
  document.body.addEventListener("pointerup", removeEvent);
  document.body.addEventListener("mouseleave", removeEvent);
}
