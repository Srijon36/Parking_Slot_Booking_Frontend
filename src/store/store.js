import { configureStore } from "@reduxjs/toolkit";
import parkingReducer from "../Reducer/ParkingSlice";
import authReducer from "../Reducer/AuthSlice";
import paymentReducer from "../Reducer/PaymentSlice";

const store = configureStore({
  reducer: {
    parking: parkingReducer,
    auth: authReducer,
    payment: paymentReducer,
  },
});

export default store;