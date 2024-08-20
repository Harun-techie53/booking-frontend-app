import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BookingState {
    checkIn: Date | null;
    checkOut: Date | null;
    adultCount: number | null;
    childCount: number | null;
  }
  
  const initialState: BookingState = {
    checkIn: null,
    checkOut: null,
    adultCount: null,
    childCount: null
  };


  export const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
      saveBookingData: (state, action: PayloadAction<BookingState>) => {
        state.checkIn = action.payload.checkIn,
        state.checkOut = action.payload.checkOut,
        state.adultCount = action.payload.adultCount,
        state.childCount = action.payload.childCount
      },
    },
  });
  
  // Action creators are generated for each case reducer function
  export const { saveBookingData } = bookingSlice.actions;
  
  export default bookingSlice.reducer;
