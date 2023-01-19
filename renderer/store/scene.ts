import { createSlice } from "@reduxjs/toolkit";
import { Asset } from "../interfaces/Asset";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/TextEffect";

export type SceneState = {
  initialized: boolean;
  currentTime: number;
  viewStartRate: number;
  viewEndRate: number;
  length: number;
  strips: Strip[];
  fps: number;
  assets: Asset[];
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    initialized: false,
    currentTime: 0,
    viewStartRate: 0,
    viewEndRate: 1,
    length: 13,
    strips: [
      {
        id: "1",
        start: 0,
        length: 5,
        effects: [
          {
            id: "1",
            type: "text",
            x: 10,
            y: 50,
            text: "Hello",
            fontAssetId: "1",
          } as TextEffect,
        ],
        layer: 1,
      },
      {
        id: "2",
        start: 1,
        length: 2.5,
        effects: [
          {
            id: "2",
            type: "text",
            x: 10,
            y: 100,
            text: "hogehoge",
          } as TextEffect,
        ],
        layer: 0,
      },
    ],
    fps: 60,
    assets: [
      {
        id: "1",
        name: "font",
        type: "font",
        path: "/RictyDiminished-Regular.ttf",
      },
    ],
  } as SceneState,
  reducers: {
    setInitialized: (state, action: { payload: boolean }) => {
      state.initialized = action.payload;
    },
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
