import styled from "styled-components";

export function TimeText(props: { time: number; left: number }) {
  let viewTime = props.time.toFixed(2);
  if (viewTime.endsWith(".00")) {
    viewTime = viewTime.slice(0, -3);
  } else if (viewTime.endsWith("0")) {
    viewTime = viewTime.slice(0, -1);
  }

  return (
    <TimeTextDiv $left={props.left}>
      <div style={{ marginLeft: "2px" }}>{viewTime}</div>
    </TimeTextDiv>
  );
}

const TimeTextDiv = styled.div<{
  $left: number;
}>`
  position: absolute;
  left: ${(props) => props.$left}px;
  height: 20px;
  border-left: 1px solid lightgray;
`;
