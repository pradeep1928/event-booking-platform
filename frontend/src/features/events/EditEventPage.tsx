import { useState } from 'react';

import {
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';

import type { SubmitHandler } from 'react-hook-form';

import EventForm from './EventForm';

import {
  useGetManageEventByIdQuery,
  useUpdateEventMutation,
} from './eventApi';

import type {
  EventFormValues,
  UpdateEventRequest,
} from './eventTypes';

const EditEventPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useGetManageEventByIdQuery(id ?? '', {
    skip: !id,
  });

  const [
    updateEvent,
    { isLoading: isUpdating },
  ] = useUpdateEventMutation();

  if (!id) {
    return (
      <Navigate
        to="/organizer/events"
        replace
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
          aria-label="Loading event"
          role="status"
        />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <h1 className="text-lg font-semibold text-rose-800">
            Unable to load event
          </h1>

          <p className="mt-2 text-sm text-rose-700">
            The event could not be loaded or you do not
            have permission to edit it.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/organizer/events')
            }
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Back to events
          </button>
        </div>
      </section>
    );
  }

  const event = data.data;

  const defaultValues: EventFormValues = {
    title: event.title,

    description:
      event.description ?? '',

    category: event.category,

    venue: event.venue,
    city: event.city,
    state: event.state,
    country: event.country,

    eventDate:
      toDateTimeLocal(event.eventDate),

    bookingStart:
      toDateTimeLocal(event.bookingStart),

    bookingEnd:
      toDateTimeLocal(event.bookingEnd),

    totalSeats: event.totalSeats,

    price: Number(event.price),
  };

  const handleUpdate: SubmitHandler<
    EventFormValues
  > = async (formData) => {
    setServerError(null);

    const body: UpdateEventRequest['body'] = {
      title: formData.title.trim(),

      description:
        formData.description.trim(),

      category: formData.category,

      venue: formData.venue.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),

      eventDate: new Date(
        formData.eventDate,
      ).toISOString(),

      bookingStart: new Date(
        formData.bookingStart,
      ).toISOString(),

      bookingEnd: new Date(
        formData.bookingEnd,
      ).toISOString(),

      totalSeats: formData.totalSeats,

      price: formData.price,
    };

    try {
      await updateEvent({
        id,
        body,
      }).unwrap();

      navigate('/organizer/events', {
        replace: true,
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'data' in error
      ) {
        const response = (
          error as {
            data?: {
              message?: string;
            };
          }
        ).data;

        if (response?.message) {
          setServerError(
            response.message,
          );
          return;
        }
      }

      setServerError(
        'Unable to update the event. Please try again.',
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl">
      <button
        type="button"
        onClick={() =>
          navigate('/organizer/events')
        }
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        ← Back to events
      </button>

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Edit event
        </h1>

        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Update your event details and save your
          changes.
        </p>
      </div>

      <EventForm
        key={event.id}
        defaultValues={defaultValues}
        submitLabel="Save changes"
        loadingLabel="Saving changes..."
        isLoading={isUpdating}
        serverError={serverError}
        onSubmit={handleUpdate}
        onCancel={() =>
          navigate('/organizer/events')
        }
      />
    </section>
  );
};

const toDateTimeLocal = (
  value: string,
) => {
  const date = new Date(value);

  const timezoneOffset =
    date.getTimezoneOffset() * 60_000;

  return new Date(
    date.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 16);
};

export default EditEventPage;