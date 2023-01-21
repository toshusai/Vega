import { createSlice } from "@reduxjs/toolkit";
import { roundToFrame } from "../components/roundToFrame";
import { Asset } from "../interfaces/Asset";
import { Strip } from "../interfaces/Strip";
import { TextEffect } from "../interfaces/TextEffect";
import { VideoEffect } from "../interfaces/VideoEffect";

export type SceneState = {
  initialized: boolean;
  currentTime: number;
  viewStartRate: number;
  viewEndRate: number;
  length: number;
  strips: Strip[];
  fps: number;
  assets: Asset[];
  isPlaying: boolean;
  selectedStripIds: string[];
  selectedAssetIds: string[];
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    selectedStripIds: [],
    selectedAssetIds: [],
    isPlaying: false,
    initialized: false,
    currentTime: 0,
    viewStartRate: 0,
    viewEndRate: 1,
    length: 13,
    strips: [
      {
        id: "1",
        start: roundToFrame(0.5, 60),
        length: roundToFrame(2.5, 60),
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
        start: roundToFrame(1, 60),
        length: roundToFrame(2.5, 60),
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
      {
        id: "3",
        start: roundToFrame(4, 60),
        length: roundToFrame(5, 60),
        effects: [
          {
            id: "3",
            type: "video",
            x: 0,
            y: 0,
            videoAssetId: "2",
          } as VideoEffect,
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
      {
        id: "2",
        name: "video",
        type: "video",
        path: "/cat_in_the_sun.mp4",
      },
    ],
  } as SceneState,
  reducers: {
    setIsPlaying: (state, action: { payload: boolean }) => {
      state.isPlaying = action.payload;
    },
    toggleIsPlaying: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setSelectedStripIds: (state, action: { payload: string[] }) => {
      state.selectedStripIds = action.payload;
    },
    setSelectedAssetIds: (state, action: { payload: string[] }) => {
      state.selectedAssetIds = action.payload;
    },
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
        payload: Strip | Strip[];
      }
    ) => {
      const strips = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      // check strip can move
      strips.forEach((strip) => {
        // const isOverlapped = checkOverlap(state.strips, strip);
        // if (isOverlapped) {
        //   throw new Error("strip is overlapped");
        //   return;
        // }

        const index = state.strips.findIndex((s) => s.id === strip.id);
        if (index >= 0) {
          state.strips[index] = strip;
        }
      });
    },
  },
});

export const actions = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
