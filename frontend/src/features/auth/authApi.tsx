import { baseApi } from "../../app/api/baseApi";

import type {
  AuthUser
} from "./authSlice";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type RefreshResponse = {
  accessToken: string;
};

type MeResponse = AuthUser;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      ApiResponse<LoginResponse>,
      LoginRequest
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<
      ApiResponse<AuthUser>,
      RegisterRequest
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    refreshToken: builder.mutation<
      ApiResponse<RefreshResponse>,
      void
    >({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    me: builder.query<ApiResponse<MeResponse>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    logoutAll: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout-all",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useMeQuery,
  useLogoutMutation,
  useLogoutAllMutation,
} = authApi;