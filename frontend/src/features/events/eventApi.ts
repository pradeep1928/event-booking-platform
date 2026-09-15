import { baseApi } from '../../app/api/baseApi';
import type { Event, EventsResponse, GetEventsParams } from './eventTypes';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<EventsResponse, GetEventsParams>({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Event' as const,
                id,
              })),
              { type: 'Event' as const, id: 'LIST' },
            ]
          : [{ type: 'Event' as const, id: 'LIST' }],
    }),

    getEventById: builder.query<ApiResponse<Event>, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventByIdQuery } = eventApi;
