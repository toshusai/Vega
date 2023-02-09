import { FC } from "react";

export const TimeCursor: FC<{
  left: number;
  top: number;
  bottom?: number;
}> = (props) => {
  const bottom = props.bottom ?? 0;
  return (
    <div
      style={{
        position: "absolute",
        // 16px is the height of the scrollbar,
        height: `calc(100% - ${bottom}px - ${props.top}px - 2px)`,
        width: "1px",
        top: props.top + "px",
        backgroundColor: "red",
        zIndex: 100,
        left: props.left,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          background: "red",
          left: "0px",
          top: "0px",
          width: "8px",
          height: "8px",
        }} />
    </div>
  );
};
