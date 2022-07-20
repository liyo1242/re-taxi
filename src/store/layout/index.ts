import { createSlice } from "@reduxjs/toolkit";

interface LayoutState {
  isSideBarOpen: boolean;
}

const initialState: LayoutState = {
  isSideBarOpen: false,
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
  },
});

export const { toggleSideBar } = layoutSlice.actions;

export default layoutSlice.reducer;
