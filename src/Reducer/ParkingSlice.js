import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

// ── Thunks ──────────────────────────────────────

// Public: get all parking listings (optionally with search/filter params)
export const fetchAllParkings = createAsyncThunk(
  "parking/fetchAllParkings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/parking", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch parkings."
      );
    }
  }
);

// Public: get a single parking listing by ID
export const fetchParkingById = createAsyncThunk(
  "parking/fetchParkingById",
  async (parkingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/parking/${parkingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch parking details."
      );
    }
  }
);

// Vendor: create a new parking listing
export const createParking = createAsyncThunk(
  "parking/createParking",
  async (parkingData, { rejectWithValue }) => {
    try {
      const response = await api.post("/vendor/create-parking", parkingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create parking."
      );
    }
  }
);

// Vendor: get all of MY parking listings
export const fetchVendorParkings = createAsyncThunk(
  "parking/fetchVendorParkings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/vendor/my-parkings");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your parkings."
      );
    }
  }
);

// ── Slice ───────────────────────────────────────
const parkingSlice = createSlice({
  name: "parking",
  initialState: {
    parkings: [],
    vendorParkings: [],
    selectedParking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedParking: (state) => {
      state.selectedParking = null;
    },
    clearParkingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllParkings
      .addCase(fetchAllParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllParkings.fulfilled, (state, action) => {
        state.loading = false;
        state.parkings = action.payload.parkings || action.payload.data || [];
      })
      .addCase(fetchAllParkings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchParkingById
      .addCase(fetchParkingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParkingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedParking = action.payload.parking || action.payload.data;
      })
      .addCase(fetchParkingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createParking
      .addCase(createParking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParking.fulfilled, (state, action) => {
        state.loading = false;
        const newParking = action.payload.parking || action.payload.data;
        if (newParking) state.vendorParkings.push(newParking);
      })
      .addCase(createParking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchVendorParkings
      .addCase(fetchVendorParkings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorParkings.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorParkings = action.payload.parkings || action.payload.data || [];
      })
      .addCase(fetchVendorParkings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedParking, clearParkingError } = parkingSlice.actions;
export default parkingSlice.reducer;x``