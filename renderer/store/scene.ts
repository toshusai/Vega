import { createSlice } from "@reduxjs/toolkit";
import { Ease } from "../components/easing";
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
  selectedKeyframeIds: string[];
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
      if (start < 0) {
        action.payload.start = 0;
      }
      if (start > 1) {
        action.payload.start = 1;
      }
      if (end < 0) {
        action.payload.end = 0;
      }
      if (end > 1) {
        action.payload.end = 1;
      }
      const length = (action.payload.end - action.payload.start) * state.length;
      if (length < 1) {
        state.viewStartRate = action.payload.end - 1 / state.length;
        state.viewEndRate = action.payload.end;
        return;
      }
      state.viewStartRate = action.payload.start;
      state.viewEndRate = action.payload.end;
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
  },
});

export const actions = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
