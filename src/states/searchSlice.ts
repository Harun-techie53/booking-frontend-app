import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ISearchParam } from "../types/interfaces";

export interface SearchState {
  isSearched: boolean;
  searchParam: ISearchParam | null;
}

const initialState: SearchState = {
  isSearched: false,
  searchParam: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    saveSearchParam: (state, action: PayloadAction<SearchState>) => {
      state.isSearched = action.payload.isSearched;
      state.searchParam = action.payload.searchParam;
    },
    removeSearchParam: (state) => {
      state.isSearched = false;
      state.searchParam = null;
    },
  },
});

export const { saveSearchParam, removeSearchParam } = searchSlice.actions;

export default searchSlice.reducer;
