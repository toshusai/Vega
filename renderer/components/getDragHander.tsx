type DragHanderContext<T, U> = {
  startX: number;
  startY: number;
  diffX: number;
  diffY: number;
  startEvent: MouseEvent;
  pass?: T;
  movePass?: U;
};

export function getDragHander<T, U>(
  cb: (context: DragHanderContext<T, U>) => U,
  onDown?: (context: DragHanderContext<T, U>) => T,
  onUp?: (context: DragHanderContext<T, U>) => void
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

    let movePass: U | undefined;

    const handleMouseMove = (e: MouseEvent) => {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      movePass = cb({
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
        pass,
        movePass,
      });
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
}
