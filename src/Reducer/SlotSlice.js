import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

export const fetchSlotsByParking = createAsyncThunk(
  "slot/fetchSlotsByParking",
  async (parkingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/slots/${parkingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch slots.");
    }
  }
);

const slotSlice = createSlice({
  name: "slot",
  initialState: {
    slots: [],
    selectedSlot: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    clearSelectedSlot: (state) => {
      state.selectedSlot = null;
    },
    clearSlotError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlotsByParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlotsByParking.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload.slots || action.payload.data || [];
      })
      .addCase(fetchSlotsByParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectSlot, clearSelectedSlot, clearSlotError } = slotSlice.actions;
export default slotSlice.reducer;