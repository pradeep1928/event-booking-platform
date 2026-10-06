import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import type { RootState } from '../store';
import {
  clearCredentials,
  setAccessToken,
} from '../../features/auth/authSlice';

type RefreshResponse = {
  success: boolean;
  data: {
    accessToken: string;
  };
  message?: string;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

let refreshPromise: Promise<string> | null = null;

const getNewAccessToken = async (
  api: Parameters<typeof rawBaseQuery>[1],
  extraOptions: Parameters<typeof rawBaseQuery>[2],
): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
        },
        api,
        extraOptions,
      );

      if (refreshResult.error) {
        throw refreshResult.error;
      }

      const response = refreshResult.data as RefreshResponse;

      return response.data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const isRefreshRequest =
    typeof args === 'string'
      ? args === '/auth/refresh-token'
      : args.url === '/auth/refresh-token';

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isRefreshRequest) {
    return result;
  }

  try {
    const accessToken = await getNewAccessToken(
      api,
      extraOptions,
    );

    api.dispatch(setAccessToken(accessToken));

    result = await rawBaseQuery(
      args,
      api,
      extraOptions,
    );
  } catch {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Event', 'Booking'],
  endpoints: () => ({}),
});