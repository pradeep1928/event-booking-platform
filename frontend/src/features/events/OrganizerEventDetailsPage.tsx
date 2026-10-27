import { useState } from 'react';
import type { ReactNode  } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  useCancelEventMutation,
  useGetManageEventByIdQuery,
  usePublishEventMutation,
} from './eventApi';

import type { EventStatus } from './eventTypes';

const OrganizerEventDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [actionError, setActionError] =
    useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
  } = useGetManageEventByIdQuery(id ?? '', {
    skip: !id,
  });

  const [
    publishEvent,
    { isLoading: isPublishing },
  ] = usePublishEventMutation();

  const [
    cancelEvent,
    { isLoading: isCancelling },
  ] = useCancelEventMutation();

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
      <div
        className="flex min-h-[50vh] items-center justify-center"
        role="status"
        aria-label="Loading event"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
          aria-hidden="true"
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
            This event could not be loaded or you don't
            have permission to manage it.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/organizer/events')
            }
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to events
          </button>
        </div>
      </section>
    );
  }

  const event = data.data;

  const handlePublish = async () => {
    setActionError(null);

    try {
      await publishEvent(event.id).unwrap();
    } catch (error) {
      setActionError(
        getApiErrorMessage(
          error,
          'Unable to publish the event.',
        ),
      );
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${event.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    setActionError(null);

    try {
      await cancelEvent(event.id).unwrap();
    } catch (error) {
      setActionError(
        getApiErrorMessage(
          error,
          'Unable to cancel the event.',
        ),
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          navigate('/organizer/events')
        }
        className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
      >
        ← Back to events
      </button>

      {/* Header */}
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              {formatLabel(event.category)}
            </span>

            <EventStatusBadge
              status={event.status}
            />
          </div>

          <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {event.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Created {formatDate(event.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {event.status === 'DRAFT' && (
            <Link
              to={`/organizer/events/${event.id}/edit`}
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </Link>
          )}

          {event.status === 'DRAFT' && (
            <button
              type="button"
              onClick={() => {
                void handlePublish();
              }}
              disabled={isPublishing}
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPublishing
                ? 'Publishing...'
                : 'Publish'}
            </button>
          )}

          {(event.status === 'DRAFT' ||
            event.status === 'PUBLISHED') && (
            <button
              type="button"
              onClick={() => {
                void handleCancel();
              }}
              disabled={isCancelling}
              className="inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancelling
                ? 'Cancelling...'
                : 'Cancel'}
            </button>
          )}
        </div>
      </div>

      {actionError && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {actionError}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-6">
          <DetailSection title="About this event">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
              {event.description ||
                'No description provided.'}
            </p>
          </DetailSection>

          <DetailSection title="Location">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Venue"
                value={event.venue}
              />

              <DetailItem
                label="City"
                value={event.city}
              />

              <DetailItem
                label="State"
                value={event.state}
              />

              <DetailItem
                label="Country"
                value={event.country}
              />
            </div>
          </DetailSection>

          <DetailSection title="Event schedule">
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Event date"
                value={formatDateTime(
                  event.eventDate,
                )}
              />

              <DetailItem
                label="Booking starts"
                value={formatDateTime(
                  event.bookingStart,
                )}
              />

              <DetailItem
                label="Booking ends"
                value={formatDateTime(
                  event.bookingEnd,
                )}
              />
            </div>
          </DetailSection>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <DetailSection title="Capacity">
            <div className="space-y-4">
              <DetailItem
                label="Total seats"
                value={String(
                  event.totalSeats,
                )}
              />

              <DetailItem
                label="Available seats"
                value={String(
                  event.availableSeats,
                )}
              />

              <DetailItem
                label="Booked seats"
                value={String(
                  event.totalSeats -
                    event.availableSeats,
                )}
              />
            </div>
          </DetailSection>

          <DetailSection title="Pricing">
            <DetailItem
              label="Ticket price"
              value={formatPrice(event.price)}
            />
          </DetailSection>

          <DetailSection title="Organizer">
            <div>
              <p className="font-semibold text-slate-900">
                {event.organizer.firstName}{' '}
                {event.organizer.lastName}
              </p>

              <p className="mt-1 break-all text-sm text-slate-500">
                {event.organizer.email}
              </p>
            </div>
          </DetailSection>
        </aside>
      </div>
    </section>
  );
};

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

const DetailSection = ({
  title,
  children,
}: DetailSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
};

type DetailItemProps = {
  label: string;
  value: string;
};

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
};

type EventStatusBadgeProps = {
  status: EventStatus;
};

const EventStatusBadge = ({
  status,
}: EventStatusBadgeProps) => {
  const styles: Record<
    EventStatus,
    string
  > = {
    DRAFT:
      'bg-slate-100 text-slate-700',
    PUBLISHED:
      'bg-emerald-100 text-emerald-700',
    CANCELLED:
      'bg-rose-100 text-rose-700',
    COMPLETED:
      'bg-violet-100 text-violet-700',
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {formatLabel(status)}
    </span>
  );
};

const formatLabel = (
  value: string,
) => {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
};

const formatDate = (
  value: string,
) => {
  return new Intl.DateTimeFormat(
    'en-IN',
    {
      dateStyle: 'medium',
    },
  ).format(new Date(value));
};

const formatDateTime = (
  value: string,
) => {
  return new Intl.DateTimeFormat(
    'en-IN',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(value));
};

const formatPrice = (
  value: string,
) => {
  const price = Number(value);

  if (price === 0) {
    return 'Free';
  }

  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    },
  ).format(price);
};

const getApiErrorMessage = (
  error: unknown,
  fallback: string,
) => {
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
      return response.message;
    }
  }

  return fallback;
};

export default OrganizerEventDetailsPage;