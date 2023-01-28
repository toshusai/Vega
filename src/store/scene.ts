import { createSlice } from "@reduxjs/toolkit";

import { Asset , Effect , Strip } from "@/packages/types";
import { restrictStartEnd } from "@/utils/restrictStartEnd";

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
  selectedKeyframeIds: string[];
  recordingState: "idle" | "recording" | "paused";
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    recordingState: "idle",
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
    strips: [],
    fps: 60,
    assets: [],
    selectedKeyframeIds: [],
  } as SceneState,
  reducers: {
    setAll: (state, action: { payload: SceneState }) => {
      return action.payload;
    },
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
    setSelectKeyframeIds: (state, action: { payload: string[] }) => {
      state.selectedKeyframeIds = action.payload;
    },
    setViewStartRate: (state, action: { payload: number }) => {
      if (action.payload < 0) {
        action.payload = 0;
      }
      if (action.payload > 1) {
        action.payload = 1;
      }
      const length = (state.viewEndRate - action.payload) * state.length;
      if (length < 1) {
        state.viewStartRate = state.viewEndRate - 1 / state.length;
        return;
      }
      state.viewStartRate = action.payload;
    },
    setViewStartAndEndRate: (
      state,
      action: {
        payload: {
          start: number;
          end: number;
        };
      }
    ) => {
      const { start, end } = action.payload;
      const result = restrictStartEnd(start, end, state.length, 1);
      state.viewStartRate = result[0];
      state.viewEndRate = result[1];
    },

    setViewEndRate: (state, action: { payload: number }) => {
      if (action.payload < 0) {
        action.payload = 0;
      }
      if (action.payload > 1) {
        action.payload = 1;
      }
      const length = (action.payload - state.viewStartRate) * state.length;
      if (length < 1) {
        state.viewEndRate = state.viewStartRate + 1 / state.length;
        return;
      }
      state.viewEndRate = action.payload;
    },
    setLength: (state, action: { payload: number }) => {
      state.length = action.payload;
    },
    setStrips: (state, action: { payload: Strip[] }) => {
      state.strips = action.payload;
    },
    setRecordingState: (
      state,
      action: { payload: SceneState["recordingState"] }
    ) => {
      state.recordingState = action.payload;
    },
    updateEddect: (
      state,
      action: {
        payload: {
          stripId: string;
          effect: Effect;
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

    removeStrip: (
      state,
      action: {
        payload: string | string[];
      }
    ) => {
      const stripIds = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.strips = state.strips.filter((s) => !stripIds.includes(s.id));
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
        } else {
          state.strips.push(strip);
        }
      });
    },

    updateAssets: (
      state,
      action: {
        payload: Asset | Asset[];
      }
    ) => {
      const assets = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      assets.forEach((asset) => {
        const index = state.assets.findIndex((a) => a.id === asset.id);
        if (index >= 0) {
          state.assets[index] = asset;
        } else {
          state.assets.push(asset);
        }
      });
    },

    removeAsset: (
      state,
      action: {
        payload: string | string[];
      }
    ) => {
      const assetIds = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.assets = state.assets.filter((a) => !assetIds.includes(a.id));
    },
  },
});

export const actions = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
