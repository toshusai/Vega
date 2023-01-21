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
  isSnap: boolean;
  fps: number;
  assets: Asset[];
  isPlaying: boolean;
  selectedStripIds: string[];
  selectedAssetIds: string[];
  canvasWidth: number;
  canvasHeight: number;
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    canvasHeight: 720,
    canvasWidth: 1280,
    selectedStripIds: [],
    selectedAssetIds: [],
    isPlaying: false,
    initialized: false,
    isSnap: false,
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
            fontSize: 50,
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
            fontAssetId: "3",
            text: "hogehoge",
            fontSize: 30,
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
            scaleX: 0.5,
            scaleY: 0.5,
          } as VideoEffect,
        ],
        layer: 0,
      },
    ],
    fps: 60,
    assets: [
      {
        id: "1",
        name: "RictyDiminished-Regular",
        type: "font",
        path: "/RictyDiminished-Regular.ttf",
      },
      {
        id: "3",
        name: "x12y16pxMaruMonica",
        type: "font",
        path: "/x12y16pxMaruMonica.ttf",
      },
      {
        id: "4",
        name: "YujiBoku-Regular",
        type: "font",
        path: "/YujiBoku-Regular.ttf",
      },
      {
        id: "2",
        name: "cat in the sun",
        type: "video",
        path: "/cat_in_the_sun.mp4",
      },
      {
        id: "5",
        name: "splatoon",
        type: "video",
        path: "/lazer-DQd5U0Wlq8E_2.mp4",
      },
    ],
  } as SceneState,
  reducers: {
    setIsPlaying: (state, action: { payload: boolean }) => {
      state.isPlaying = action.payload;
    },
    toggleIsSnap: (state) => {
      state.isSnap = !state.isSnap;
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
      if (action.payload < 0) {
        action.payload = 0;
      }
      if (action.payload > 1) {
        action.payload = 1;
      }
      state.viewStartRate = action.payload;
    },
    setViewEndRate: (state, action: { payload: number }) => {
      if (action.payload < 0) {
        action.payload = 0;
      }
      if (action.payload > 1) {
        action.payload = 1;
      }
      state.viewEndRate = action.payload;
    },
    setLength: (state, action: { payload: number }) => {
      state.length = action.payload;
    },
    setStrips: (state, action: { payload: Strip[] }) => {
      state.strips = action.payload;
    },
    updateEddect: (
      state,
      action: {
        payload: {
          stripId: string;
          effect: TextEffect | VideoEffect;
        };
      }
    ) => {
      const { stripId, effect } = action.payload;
      const strip = state.strips.find((s) => s.id === stripId);
      if (!strip) {
        throw new Error("strip not found");
      }

      const index = strip.effects.findIndex((e) => e.id === effect.id);
      if (index >= 0) {
        strip.effects[index] = effect;
      }
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
