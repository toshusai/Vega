type Context<T> = {
  e: TouchEvent;
  startE: TouchEvent;
  prevE?: TouchEvent;
  data?: T;
};

export function getTouchDragHandler<T, U>(props: {
  onStart?: (e: TouchEvent) => T;
  onMove?: (e: Context<T>) => U;
  onEnd?: (ctx: Context<U>) => void;
}) {
  return (startE: React.TouchEvent) => {
    let prevEvent = startE.nativeEvent;
    let data = props.onStart?.(startE.nativeEvent);
    let data2: U | undefined;
    const touchEnd = (e: TouchEvent) => {
      props.onEnd?.({
        e,
        startE: startE.nativeEvent,
        prevE: prevEvent,
        data: data2,
      });
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };
    const touchMove = (e: TouchEvent) => {
      data2 = props.onMove?.({
        e,
        startE: startE.nativeEvent,
        prevE: prevEvent,
        data,
      });
      prevEvent = e;
    };
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);
  };
}
