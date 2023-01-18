import { createSlice } from "@reduxjs/toolkit";
import { Strip } from "../interfaces/Strip";

export type SceneState = {
  currentTime: number;
  viewStartRate: number;
  viewEndRate: number;
  length: number;
  strips: Strip[];
  fps: number;
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    currentTime: 0,
    viewStartRate: 0,
    viewEndRate: 1,
    length: 13,
    strips: [
      {
        id: "1",
        start: 0,
        length: 5,
        effects: [],
        layer: 1,
      },
      {
        id: "2",
        start: 1,
        length: 2.5,
        effects: [],
        layer: 0,
      },
    ],
    fps: 60,
  } as SceneState,
  reducers: {
    setCurrentTime: (state, action: { payload: number }) => {
      state.currentTime = action.payload;
    },
    setViewStartRate: (state, action: { payload: number }) => {
      state.viewStartRate = action.payload;
    },
    setViewEndRate: (state, action: { payload: number }) => {
      state.viewEndRate = action.payload;
    },
    setLength: (state, action: { payload: number }) => {
      state.length = action.payload;
    },
    setStrips: (state, action: { payload: Strip[] }) => {
      state.strips = action.payload;
    },
    updateStrip: (
      state,
      action: {
        payload: Strip;
      }
    ) => {
      const strip = action.payload;
      const index = state.strips.findIndex((s) => s.id === strip.id);
      if (index >= 0) {
        state.strips[index] = strip;
      }
    },
  },
});

export const actions = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
