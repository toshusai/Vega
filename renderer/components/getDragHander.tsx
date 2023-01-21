type DragHanderContext<T> = {
  startX: number;
  startY: number;
  diffX: number;
  diffY: number;
  startEvent: MouseEvent;
  pass?: T;
};

export function getDragHander<T>(
  cb: (context: DragHanderContext<T>) => void,
  onDown?: (context: DragHanderContext<T>) => T,
  onUp?: (context: DragHanderContext<T>) => void
) {
  return (downEvent: React.MouseEvent) => {
    const pass = onDown?.({
      startX: 0,
      startY: 0,
      diffX: 0,
      diffY: 0,
      startEvent: downEvent.nativeEvent,
    });
    downEvent.stopPropagation();
    const startX = downEvent.clientX;
    const startY = downEvent.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      cb({
        startX,
        startY,
        diffX,
        diffY,
        startEvent: downEvent.nativeEvent,
        pass,
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      onUp?.({
        startX,
        startY,
        diffX,
        diffY,
        startEvent: e,
      });
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
}
