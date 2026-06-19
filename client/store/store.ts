import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import uiReducer from "./slices/uiSlice";
import { authApi } from "./api/authApi";
import { doctorApi } from "./api/doctorApi";
import { clinicApi } from "./api/clinicApi";
import { patientApi } from "./api/patientApi";
import { notificationApi } from "./api/notificationApi";
import { chatApi } from "./api/chatApi";
import { aiApi } from "./api/aiApi";
import { onboardingApi } from "./api/onboardingApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [clinicApi.reducerPath]: clinicApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [onboardingApi.reducerPath]: onboardingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      doctorApi.middleware,
      clinicApi.middleware,
      patientApi.middleware,
      notificationApi.middleware,
      chatApi.middleware,
      aiApi.middleware,
      onboardingApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
