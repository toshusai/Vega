import styled from "styled-components";

import { useSelector } from "@/hooks/useSelector";
import { floorFrame } from "@/utils/roundToFrame";

export function CurrentTime() {
  const currentTime = useSelector((state) => state.scene.currentTime);
  const fps = useSelector((state) => state.scene.fps);
  const curerntFrame = floorFrame(currentTime, fps);
  return (
    <StyledDiv>
      {curerntFrame} / {currentTime.toFixed(2)}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  position: absolute;
  left: 8px;
`;
