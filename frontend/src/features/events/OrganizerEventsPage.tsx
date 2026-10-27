import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useGetMyEventsQuery, usePublishEventMutation, useCancelEventMutation } from './eventApi';

import type { EventCategory, EventStatus, EventSortBy, SortOrder } from './eventTypes';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const categories: EventCategory[] = [
  'MUSIC',
  'SPORTS',
  'BUSINESS',
  'EDUCATION',
  'WORKSHOP',
  'CONFERENCE',
  'FESTIVAL',
  'OTHER',
];

const statuses: EventStatus[] = ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'];

const OrganizerEventsPage = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [city, setCity] = useState('');

  const [status, setStatus] = useState<EventStatus | ''>('');

  const [category, setCategory] = useState<EventCategory | ''>('');

  const [sortBy, setSortBy] = useState<EventSortBy>('createdAt');

  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isLoading, isFetching, isError, refetch } = useGetMyEventsQuery({
    page,
    limit: 10,

    search: search || undefined,
    city: city || undefined,

    status: status || undefined,
    category: category || undefined,

    sortBy,
    sortOrder,
  });

  const [publishEvent, { isLoading: isPublishing }] = usePublishEventMutation();

  const [publishingEventId, setPublishingEventId] = useState<string | null>(null);

  const [cancelEvent, { isLoading: isCancelling }] = useCancelEventMutation();

  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  const [eventToCancel, setEventToCancel] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const events = data?.data.items ?? [];

  const pagination = data?.data.pagination;

  const handleResetFilters = () => {
    setSearch('');
    setCity('');
    setStatus('');
    setCategory('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const handlePublishEvent = async (eventId: string) => {
    setActionError(null);
    setPublishingEventId(eventId);

    try {
      await publishEvent(eventId).unwrap();
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = (
          error as {
            data?: {
              message?: string;
            };
          }
        ).data;

        if (data?.message) {
          setActionError(data.message);
          return;
        }
      }

      setActionError('Unable to publish the event. Please try again.');
    } finally {
      setPublishingEventId(null);
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    setActionError(null);
    setCancellingEventId(eventId);

    try {
      await cancelEvent(eventId).unwrap();

      setEventToCancel(null);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = (
          error as {
            data?: {
              message?: string;
            };
          }
        ).data;

        if (data?.message) {
          setActionError(data.message);
          return;
        }
      }

      setActionError('Unable to cancel the event. Please try again.');
    } finally {
      setCancellingEventId(null);
    }
  };
  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Organizer</p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage events
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Create, review and manage all of your events.
          </p>
        </div>

        <Link
          to="/organizer/events/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create event
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {/* Search */}
          <div className="xl:col-span-2">
            <label
              htmlFor="organizer-event-search"
              className="block text-sm font-medium text-slate-700"
            >
              Search
            </label>

            <input
              id="organizer-event-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search events..."
              className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="event-status" className="block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              id="event-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as EventStatus | '');

                setPage(1);
              }}
              className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All statuses</option>

              {statuses.map((eventStatus) => (
                <option key={eventStatus} value={eventStatus}>
                  {formatLabel(eventStatus)}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="event-category" className="block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              id="event-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value as EventCategory | '');

                setPage(1);
              }}
              className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All categories</option>

              {categories.map((eventCategory) => (
                <option key={eventCategory} value={eventCategory}>
                  {formatLabel(eventCategory)}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="organizer-event-city"
              className="block text-sm font-medium text-slate-700"
            >
              City
            </label>

            <input
              id="organizer-event-city"
              type="text"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                setPage(1);
              }}
              placeholder="Mumbai"
              className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-left text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Reset filters
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              aria-label="Sort events"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as EventSortBy);

                setPage(1);
              }}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
            >
              <option value="createdAt">Date created</option>

              <option value="eventDate">Event date</option>

              <option value="price">Price</option>
            </select>

            <select
              aria-label="Sort order"
              value={sortOrder}
              onChange={(event) => {
                setSortOrder(event.target.value as SortOrder);

                setPage(1);
              }}
              className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
            >
              <option value="desc">Descending</option>

              <option value="asc">Ascending</option>
            </select>
          </div>
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

      {/* Initial loading */}
      {isLoading && <EventsSkeleton />}

      {/* Error */}
      {!isLoading && isError && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
          <h2 className="font-semibold text-rose-800">Unable to load your events</h2>

          <p className="mt-2 text-sm text-rose-700">
            Something went wrong while fetching your events.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && events.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl text-indigo-600">
            +
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">No events found</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Create your first event or change the current filters.
          </p>

          <Link
            to="/organizer/events/new"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create event
          </Link>
        </div>
      )}

      {/* Events */}
      {!isLoading && !isError && events.length > 0 && (
        <>
          <div className={`mt-8 grid gap-5 lg:grid-cols-2 ${isFetching ? 'opacity-60' : ''}`}>
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {formatLabel(event.category)}
                    </span>

                    <h2 className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl">
                      {event.title}
                    </h2>
                  </div>

                  <EventStatusBadge status={event.status} />
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <EventDetail label="Event date" value={formatDate(event.eventDate)} />

                  <EventDetail label="Location" value={`${event.city}, ${event.state}`} />

                  <EventDetail
                    label="Available seats"
                    value={`${event.availableSeats} / ${event.totalSeats}`}
                  />

                  <EventDetail label="Price" value={formatPrice(event.price)} />
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <Link
                    to={`/organizer/events/${event.id}`}
                    className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    View
                  </Link>

                  <Link
                    to={`/organizer/events/${event.id}/edit`}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Edit
                  </Link>

                  {event.status === 'DRAFT' && (
                    <button
                      type="button"
                      onClick={() => handlePublishEvent(event.id)}
                      disabled={isPublishing && publishingEventId === event.id}
                      className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPublishing && publishingEventId === event.id ? 'Publishing...' : 'Publish'}
                    </button>
                  )}

                  {(event.status === 'DRAFT' || event.status === 'PUBLISHED') && (
                    <button
                      type="button"
                      onClick={() =>
                        setEventToCancel({
                          id: event.id,
                          title: event.title,
                        })
                      }
                      disabled={isCancelling && cancellingEventId === event.id}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCancelling && cancellingEventId === event.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              isFetching={isFetching}
              onPageChange={setPage}
            />
          )}
        </>
      )}
      <ConfirmDialog
        isOpen={Boolean(eventToCancel)}
        title="Cancel event?"
        description={
          eventToCancel
            ? `Are you sure you want to cancel "${eventToCancel.title}"? This action may affect existing attendees and bookings.`
            : ''
        }
        confirmLabel="Cancel event"
        isLoading={isCancelling && cancellingEventId === eventToCancel?.id}
        onClose={() => {
          if (!isCancelling) {
            setEventToCancel(null);
          }
        }}
        onConfirm={() => {
          if (!eventToCancel) {
            return;
          }

          void handleCancelEvent(eventToCancel.id);
        }}
      />
    </section>
  );
};

type EventStatusBadgeProps = {
  status: EventStatus;
};

const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  const styles: Record<EventStatus, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PUBLISHED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-rose-100 text-rose-700',
    COMPLETED: 'bg-violet-100 text-violet-700',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {formatLabel(status)}
    </span>
  );
};

type EventDetailProps = {
  label: string;
  value: string;
};

const EventDetail = ({ label, value }: EventDetailProps) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>

      <p className="mt-1 font-medium text-slate-700">{value}</p>
    </div>
  );
};

type PaginationProps = {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, totalPages, isFetching, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
      <button
        type="button"
        disabled={page <= 1 || isFetching}
        onClick={() => onPageChange(page - 1)}
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <p className="text-sm text-slate-600">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </p>

      <button
        type="button"
        disabled={page >= totalPages || isFetching}
        onClick={() => onPageChange(page + 1)}
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const EventsSkeleton = () => {
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-3 w-24 rounded bg-slate-200" />

          <div className="mt-4 h-6 w-2/3 rounded bg-slate-200" />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

const formatLabel = (value: string) => {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const formatPrice = (value: string) => {
  const price = Number(value);

  if (price === 0) {
    return 'Free';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price);
};

export default OrganizerEventsPage;
