import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "USER" | "ORGANIZER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
};

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        user: AuthUser;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },

    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },

    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  setUser,
  clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;