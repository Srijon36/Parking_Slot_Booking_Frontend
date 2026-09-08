import { createSlice } from "@reduxjs/toolkit";

const getStoredAuth = () => {
  try {
    const stored = sessionStorage.getItem("parking_token");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const storedAuth = getStoredAuth();

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  isAuthenticated: !!storedAuth?.token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;

      state.loading = false;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;

      sessionStorage.setItem("parking_token", JSON.stringify({ user, token }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      sessionStorage.removeItem("parking_token");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };

      const stored = getStoredAuth();
      if (stored) {
        sessionStorage.setItem(
          "parking_token",
          JSON.stringify({ ...stored, user: state.user })
        );
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;