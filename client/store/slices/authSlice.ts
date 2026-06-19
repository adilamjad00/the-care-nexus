import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  _id: string;
  email: string;
  role?: string;
  roles?: string[];
  isVerified: boolean;
  profileCompleted?: boolean;
  profileComplete?: boolean;
  onboardingCompleted?: boolean;
  onboardingComplete?: boolean;
  name?: string;
  phone?: string;
  photo?: string | null;
  [key: string]: unknown;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const loadFromStorage = (): AuthState => {
  if (typeof window === "undefined")
    return { user: null, accessToken: null, refreshToken: null };
  try {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    return {
      user: user ? JSON.parse(user) : null,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
};

const persistUser = (user: AuthUser | null) => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

const initialState: AuthState = loadFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        if (action.payload.refreshToken) {
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      }
      persistUser(action.payload.user);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload);
      }
    },
    setProfileComplete: {
      reducer: (state, action: PayloadAction<boolean>) => {
        if (state.user) {
          state.user = { ...state.user, profileCompleted: action.payload };
          persistUser(state.user);
        }
      },
      prepare: (value?: boolean) => ({ payload: value ?? true }),
    },
    setOnboardingComplete: {
      reducer: (state, action: PayloadAction<boolean>) => {
        if (state.user) {
          state.user = { ...state.user, onboardingCompleted: action.payload };
          persistUser(state.user);
        }
      },
      prepare: (value?: boolean) => ({ payload: value ?? true }),
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setProfileComplete,
  setOnboardingComplete,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
