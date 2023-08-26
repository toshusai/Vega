import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { css } from "styled-components";

import { TimeCursor, TimeView } from "@/app-ui/src";
import { useSelector } from "@/hooks/useSelector";
import { actions } from "@/store/scene";

import { FAB } from "./FAB";
import { Flex } from "./index.page";
import { MobileStrip } from "./MobileStrip";
import { getTouchDragHandler } from "./utils/getTouchDragHandler";

export function Timeline() {
  const dispatch = useDispatch();
  const strips = useSelector((state) => state.scene.strips);
  const currentTime = useSelector((state) => state.scene.currentTime);
  const leftOffset = window.innerWidth / 2;
  const leftOffsetSec = leftOffset / 100;

  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    dispatch(actions.setCurrentTime(time));
  }, [dispatch, time]);

  const handleMouseDown = useMemo(() => {
    return getTouchDragHandler({
      onMove: (ctx) => {
        if (ctx.prevE) {
          const dx = ctx.e.touches[0].clientX - ctx.prevE.touches[0].clientX;
          setTime((prev) => {
            return prev - dx / 100;
          });
        }
      },
    });
  }, []);

  return (
    <div
      css={css`
        width: 100%;
        position: relative;
      `}
    >
      <Flex>
        <TimeView
          offsetSec={time - leftOffsetSec}
          pxPerSec={100}
          onTouchStart={handleMouseDown}
          height={24}
        />
      </Flex>
      <TimeCursor left={window.innerWidth / 2} top={0} />
      <div
        css={css`
          position: relative;
        `}
      >
        {strips.map((strip) => (
          <MobileStrip
            key={strip.id}
            fps={60}
            offset={time - leftOffsetSec}
            pxPerSec={100}
            strip={strip}
          />
        ))}
      </div>
      <FAB />
    </div>
  );
}
