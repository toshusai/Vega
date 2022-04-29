export function onDragStart(
  e: MouseEvent,
  callback: (delta: { x: number; y: number }) => void
) {
  const startPosition = {
    x: e.clientX,
    y: e.clientY,
  };

  let prevPosition: { x: number; y: number } = startPosition;

  const onMove = (e: MouseEvent) => {
    // const delta = {
    //   x: e.clientX - startPosition.x,
    //   y: e.clientY - startPosition.y,
    // };
    const delta = {
      x: e.clientX - prevPosition.x,
      y: e.clientY - prevPosition.y,
    };
    prevPosition = {
      x: e.clientX,
      y: e.clientY,
    };

    // console.log(delta);
    callback(delta);
  };
  window.addEventListener("mousemove", onMove);

  const remove = () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", remove);
  };
  window.addEventListener("mouseup", remove);
}
