import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../store/Api";

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post("/payment", paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment failed.");
    }
  }
);

export const fetchMyPayments = createAsyncThunk(
  "payment/fetchMyPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/payment/my-payments");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch payment history.");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    lastPayment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.lastPayment = action.payload.payment || action.payload.data;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments || action.payload.data || [];
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;