export const LEFT = 0;
export const MIDDLE = 1;
export const RIGHT = 2;

export function addDragEventOnce(
  callback: (e: MouseEvent) => void,
  onUp?: (e: MouseEvent) => void
) {
  document.body.addEventListener("mousemove", callback);
  const removeEvent = (e: MouseEvent) => {
    document.body.removeEventListener("mousemove", callback);
    document.body.removeEventListener("pointerup", removeEvent);
    document.body.removeEventListener("mouseleave", removeEvent);
    if (onUp) onUp(e);
  };
  document.body.addEventListener("pointerup", removeEvent);
  document.body.addEventListener("mouseleave", removeEvent);
}
