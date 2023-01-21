import { FC } from "react";

export const TimeCursor: FC<{
  left: number;
}> = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        // 16px is the height of the scrollbar,
        // 18px is the height of the timeview
        height: "calc(100% - 16px - 18px - 2px)",
        width: "1px",
        top: "18px",
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
