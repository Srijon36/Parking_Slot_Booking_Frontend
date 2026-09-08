import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; // sessionStorage

import authReducer from "../Reducer/AuthSlice";
import bookingReducer from "../Reducer/BookingSlice";
import parkingReducer from "../Reducer/ParkingSlice";
import paymentReducer from "../Reducer/PaymentSlice";
import slotReducer from "../Reducer/SlotSlice";

const authPersistConfig = {
  key: "auth",
  storage: storageSession,
  whitelist: ["token", "user", "isAuthenticated"],
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    booking: bookingReducer,
    parking: parkingReducer,
    payment: paymentReducer,
    slot: slotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);