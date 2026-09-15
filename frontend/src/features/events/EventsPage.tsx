import { useState } from 'react';

import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import EventSearch from './components/EventSearch';
import { useGetEventsQuery } from './eventApi';
import type { EventCategory, EventSortBy, SortOrder } from './eventTypes';

const DEFAULT_LIMIT = 10;

const EventsPage = () => {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<EventCategory | undefined>();
  const [sortBy, setSortBy] = useState<EventSortBy>('eventDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useGetEventsQuery({
    page,
    limit: DEFAULT_LIMIT,
    ...(search ? { search } : {}),
    ...(city.trim() ? { city: city.trim() } : {}),
    ...(category ? { category } : {}),
    sortBy,
    sortOrder,
  });

  const events = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setPage(1);
  };

  const handleCategoryChange = (value?: EventCategory) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (nextSortBy: EventSortBy, nextSortOrder: SortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setCity('');
    setCategory(undefined);
    setSortBy('eventDate');
    setSortOrder('asc');
    setPage(1);
  };

  const hasPreviousPage = page > 1;
  const hasNextPage = pagination !== undefined && page < pagination.totalPages;

  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Discover</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Explore events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover upcoming events and find the perfect experience for you.
          </p>
        </div>

        {/* Search */}
        <div className="mt-6">
          <EventSearch onChange={handleSearchChange} />
        </div>

        {/* Filters */}
        <div className="mt-4">
          <EventFilters
            city={city}
            category={category}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onCityChange={handleCityChange}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onReset={handleReset}
          />
        </div>

        {/* Results header */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            {pagination && (
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{events.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{pagination.total}</span> events
              </p>
            )}
          </div>

          {isFetching && !isLoading && (
            <span className="text-sm text-indigo-600" role="status">
              Updating...
            </span>
          )}
        </div>

        {/* Initial loading */}
        {isLoading && (
          <div
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Loading events"
          >
            {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div
            className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center"
            role="alert"
          >
            <h2 className="text-lg font-semibold text-rose-900">Unable to load events</h2>

            <p className="mt-2 text-sm text-rose-700">
              Something went wrong while loading the events. Please try again.
            </p>

            <button
              type="button"
              onClick={refetch}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && events.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 10h.01M15.5 10h.01M9 15c.8-.8 1.8-1.2 3-1.2s2.2.4 3 1.2" />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">No events found</h2>

            <p className="mt-2 text-sm text-slate-600">
              Try changing your search or filters to find more events.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Events */}
        {!isLoading && !isError && events.length > 0 && (
          <>
            <div
              className={`mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                isFetching ? 'opacity-70' : ''
              }`}
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <nav
                className="mt-8 flex items-center justify-between gap-4 border-t border-slate-200 pt-6"
                aria-label="Event pagination"
              >
                <button
                  type="button"
                  disabled={!hasPreviousPage || isFetching}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600">
                  Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
                  <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
                </span>

                <button
                  type="button"
                  disabled={!hasNextPage || isFetching}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" aria-hidden="true">
      <div className="aspect-[16/9] animate-pulse bg-slate-200" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />

        <div className="space-y-2">
          <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="flex justify-between border-t border-slate-100 pt-4">
          <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
          <div className="h-11 w-28 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
