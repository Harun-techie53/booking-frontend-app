import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
  message: string;
  type: "SUCCESS" | "ERROR" | null;
  isShow: boolean;
}

const initialState: ToastState = {
  message: "",
  type: null,
  isShow: false,
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ToastState>) => {
      (state.message = action.payload.message),
        (state.type = action.payload.type),
        (state.isShow = action.payload.isShow);
    },
    closeToast: (state) => {
      (state.message = ""), (state.type = null), (state.isShow = false);
    },
  },
});

// Action creators are generated for each case reducer function
export const { showToast, closeToast } = toastSlice.actions;

export default toastSlice.reducer;
