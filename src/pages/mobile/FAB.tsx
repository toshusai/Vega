import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { Plus } from "tabler-icons-react";

import { COLOR_PRIMARY_NAME } from "@/app-ui/src";
import {
  getDefaultTextEffect,
  getNewStrip,
} from "@/components/timeline_panel/AddStripButton";
import { Effect } from "@/core";
import { actions } from "@/store/scene";

export function FAB() {
  const dispatch = useDispatch();

  const addNewStripWithEffect = useCallback(
    (effect: Effect) => {
      dispatch(
        actions.updateStrip({
          ...getNewStrip(0, 0),
          effects: [effect],
        })
      );
    },
    [dispatch]
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value === "text") {
        addNewStripWithEffect(getDefaultTextEffect());
      }
    },
    [addNewStripWithEffect]
  );
  const ref = useRef<HTMLSelectElement>(null);
  return (
    <>
      <Fab htmlFor="select">
        <select
          css={css`
            position: absolute;
            appearance: none;
            width: 100%;
            height: 100%;
            background-color: transparent;
            border: none;
            outline: none;
            color: transparent;
          `}
          id="select"
          ref={ref}
          value={""}
          onChange={handleOnChange}
        >
          <option disabled value="">
            Add Strip
          </option>
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <Plus
          css={css`
            color: white;
          `}
        />
      </Fab>
    </>
  );
}
const Fab = styled.label`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  color: transparent;
  outline: none;
  bottom: 16px;
  right: 16px;
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: var(${COLOR_PRIMARY_NAME});
`;
