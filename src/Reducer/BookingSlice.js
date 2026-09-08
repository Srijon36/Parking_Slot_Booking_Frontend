import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

// ── Thunks ──────────────────────────────────────

// User: create a new booking for a parking slot
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking."
      );
    }
  }
);

// User: get all of MY bookings
export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/bookings/my-bookings");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your bookings."
      );
    }
  }
);

// User: get a single booking by ID
export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking details."
      );
    }
  }
);

// User: cancel a booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return { bookingId, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking."
      );
    }
  }
);

// Vendor: get all bookings made for MY parking listings
export const fetchVendorBookings = createAsyncThunk(
  "booking/fetchVendorBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/vendor/bookings");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor bookings."
      );
    }
  }
);

// ── Slice ───────────────────────────────────────
const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    vendorBookings: [],
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

      // fetchMyBookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings || action.payload.data || [];
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

      // cancelBooking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.bookings.findIndex((b) => b._id === action.payload.bookingId);
        if (idx !== -1) {
          state.bookings[idx].status = "cancelled";
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchVendorBookings
      .addCase(fetchVendorBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorBookings = action.payload.bookings || action.payload.data || [];
      })
      .addCase(fetchVendorBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;