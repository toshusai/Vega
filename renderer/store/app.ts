import { createSlice } from "@reduxjs/toolkit";

export type AppState = {
  currentPath: string;
  readedDataJsonString: string;
};

export const sceneSlice = createSlice({
  name: "app",
  initialState: {
    currentPath: "",
    readedDataJsonString: "",
  } as AppState,
  reducers: {
    setCurrentPath: (state, action: { payload: string }) => {
      state.currentPath = action.payload;
    },
    setReadedDataJsonString: (state, action: { payload: string }) => {
      state.readedDataJsonString = action.payload;
    },
  },
});

export const appAction = sceneSlice.actions;

export const appReducer = sceneSlice.reducer;
