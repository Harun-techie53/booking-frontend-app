import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FilterParams } from "../pages/Search";

type FilterState = {
  isFilterEnable: boolean;
  filterParams: FilterParams;
};

const initialState: FilterState = {
  isFilterEnable: false,
  filterParams: {
    starRatings: [],
    hotelTypes: [],
    hotelFacilities: [],
    maxPrice: null,
    sortBy: "",
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    saveFilterParams: (state, action: PayloadAction<FilterState>) => {
      state.isFilterEnable = action.payload.isFilterEnable;
      state.filterParams = action.payload.filterParams;
    },
    resetFilterParams: (state) => {
      state.isFilterEnable = false;
      state.filterParams = initialState.filterParams;
    },
  },
});

export const { saveFilterParams, resetFilterParams } = filterSlice.actions;

export default filterSlice.reducer;
