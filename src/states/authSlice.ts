import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../types/interfaces";

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: IUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.currentUser;
    },
    signOutUser: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { registerUser, signOutUser } = authSlice.actions;

export default authSlice.reducer;
