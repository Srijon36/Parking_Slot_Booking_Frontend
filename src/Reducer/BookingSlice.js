import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

// ── Thunks ──────────────────────────────────────

// Get all bookings for the logged-in user
export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/booking/my-bookings");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings."
      );
    }
  }
);

// Get a single booking by ID
export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking details."
      );
    }
  }
);

// Create a new booking
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/booking/create", bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking."
      );
    }
  }
);

// Cancel a booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/booking/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking."
      );
    }
  }
);

// ── Slice ───────────────────────────────────────
const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    selectedBooking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMyBookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.bookings || action.payload?.data || []);
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchBookingById
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload.booking || action.payload.data;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createBooking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        const newBooking = action.payload.booking || action.payload.data;
        if (newBooking) state.bookings.unshift(newBooking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // cancelBooking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledId = action.meta.arg;
        state.bookings = state.bookings.map((b) =>
          b._id === cancelledId ? { ...b, status: "cancelled" } : b
        );
        if (state.selectedBooking && state.selectedBooking._id === cancelledId) {
          state.selectedBooking.status = "cancelled";
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;