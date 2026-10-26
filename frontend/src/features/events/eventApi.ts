import { baseApi } from '../../app/api/baseApi';
import type { Event, EventsResponse, GetEventsParams, CreateEventRequest } from './eventTypes';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<ApiResponse<EventsResponse>, GetEventsParams>({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: ['Event'],
    }),

    getEventById: builder.query<ApiResponse<Event>, string>({
      query: (id) => `/events/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<ApiResponse<Event>, CreateEventRequest>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),

      invalidatesTags: ['Event'],
    }),
  }),
});

export const { useGetEventsQuery, useGetEventByIdQuery, useCreateEventMutation } = eventApi;
