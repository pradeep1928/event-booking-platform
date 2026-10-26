import { baseApi } from '../../app/api/baseApi';
import type {
  Event,
  EventsResponse,
  GetEventsParams,
  CreateEventRequest,
  OrganizerEventsParams,
} from './eventTypes';

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
    getMyEvents: builder.query<ApiResponse<EventsResponse>, OrganizerEventsParams>({
      query: (params) => ({
        url: '/events/my-events',
        params,
      }),

      providesTags: ['Event'],
    }),
    createEvent: builder.mutation<ApiResponse<Event>, CreateEventRequest>({
      query: (body) => ({
        url: '/events',
        method: 'POST',
        body,
      }),

      invalidatesTags: ['Event'],
    }),
    publishEvent: builder.mutation<ApiResponse<Event>, string>({
      query: (id) => ({
        url: `/events/${id}/publish`,
        method: 'PATCH',
      }),

      invalidatesTags: (_result, _error, id) => [
        'Event',
        {
          type: 'Event',
          id,
        },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useGetMyEventsQuery,
  useCreateEventMutation,
  usePublishEventMutation
} = eventApi;
