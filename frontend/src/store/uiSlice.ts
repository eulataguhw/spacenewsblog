import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoading: boolean;
  pendingRequests: number;
}

const initialState: UIState = {
  isLoading: false,
  pendingRequests: 0,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.pendingRequests += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
      state.isLoading = state.pendingRequests > 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (!action.payload) {
        state.pendingRequests = 0;
      }
    },
  },
});

export const { startLoading, stopLoading, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
