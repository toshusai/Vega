import { createSlice } from "@reduxjs/toolkit";

export type SceneState = {
  currentTime: number;
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    currentTime: 0,
  },
  reducers: {
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
  },
});

export const { setCurrentTime } = sceneSlice.actions;

export const sceneReducer = sceneSlice.reducer;
