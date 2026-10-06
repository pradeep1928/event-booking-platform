import { baseApi } from '../../app/api/baseApi';

import type { AuthUser } from './authSlice';

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
  role: 'USER' | 'ORGANIZER';
};

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type RefreshResponse = {
  accessToken: string;
};

export type VerifyEmailRequest = {
  token: string;
};

export type ResendVerificationEmailRequest = {
  email: string;
};

type MeResponse = AuthUser;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<ApiResponse<AuthUser>, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    refreshToken: builder.mutation<ApiResponse<RefreshResponse>, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),

    verifyEmail: builder.mutation<ApiResponse<null>, VerifyEmailRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),

    resendVerificationEmail: builder.mutation<ApiResponse<null>, ResendVerificationEmailRequest>({
      query: (body) => ({
        url: '/auth/resend-verification-email',
        method: 'POST',
        body,
      }),
    }),

    me: builder.query<ApiResponse<MeResponse>, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    logoutAll: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout-all',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useMeQuery,
  useLogoutMutation,
  useLogoutAllMutation,
} = authApi;
