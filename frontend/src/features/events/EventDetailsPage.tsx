import { Link, useParams } from 'react-router-dom';

import { useGetEventByIdQuery } from './eventApi';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(date));
};

const formatPrice = (price: string) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return 'Price unavailable';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatCategory = (category: string) => {
  return category.charAt(0) + category.slice(1).toLowerCase();
};

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetEventByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (isError || !response?.data) {
    return (
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center sm:p-8"
            role="alert"
          >
            <h1 className="text-xl font-bold text-rose-900">Event not found</h1>

            <p className="mt-2 text-sm leading-6 text-rose-700">
              We couldn't load this event. It may no longer be available.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refetch}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Try again
              </button>

              <Link
                to="/events"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Back to events
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const event = response.data;
  const isSoldOut = event.availableSeats <= 0;

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Back navigation */}
        <Link
          to="/events"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span aria-hidden="true">←</span>
          Back to events
        </Link>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Hero */}
          <div className="flex aspect-[16/7] min-h-48 items-center justify-center bg-indigo-50 sm:min-h-64">
            <div className="text-center">
              <span className="text-5xl font-bold text-indigo-200 sm:text-7xl">
                {formatCategory(event.category).charAt(0)}
              </span>

              <p className="mt-2 text-sm font-medium text-indigo-400">
                {formatCategory(event.category)}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8 lg:p-10">
            {/* Category + availability */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {formatCategory(event.category)}
              </span>

              {isSoldOut ? (
                <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  Sold out
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {event.availableSeats} seats available
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>

            {/* Description */}
            {event.description && (
              <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-7 text-slate-600">
                {event.description}
              </p>
            )}

            {/* Main information */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard label="Date & time" value={formatDate(event.eventDate)} />

              <InfoCard label="Venue" value={`${event.venue}, ${event.city}`} />

              <InfoCard
                label="Location"
                value={`${event.city}, ${event.state}, ${event.country}`}
              />

              <InfoCard
                label="Available seats"
                value={`${event.availableSeats} of ${event.totalSeats}`}
              />
            </div>

            {/* Booking information */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">Booking information</h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-slate-500">Booking opens</dt>

                  <dd className="font-medium text-slate-900 sm:text-right">
                    {formatDate(event.bookingStart)}
                  </dd>
                </div>

                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-slate-500">Booking closes</dt>

                  <dd className="font-medium text-slate-900 sm:text-right">
                    {formatDate(event.bookingEnd)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Organizer */}
            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-lg font-semibold text-slate-900">Organized by</h2>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {event.organizer.firstName.charAt(0)}
                  {event.organizer.lastName.charAt(0)}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </p>

                  <p className="text-sm text-slate-500">{event.organizer.email}</p>
                </div>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="mt-8 flex flex-col gap-4 rounded-xl border border-indigo-100 bg-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm text-slate-600">Ticket price</p>

                <p className="mt-1 text-2xl font-bold text-slate-900">{formatPrice(event.price)}</p>
              </div>

              <button
                type="button"
                disabled={isSoldOut}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              >
                {isSoldOut ? 'Sold out' : 'Book this event'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

type InfoCardProps = {
  label: string;
  value: string;
};

const InfoCard = ({ label, value }: InfoCardProps) => {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</p>
    </div>
  );
};

const EventDetailsSkeleton = () => {
  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="aspect-[16/7] min-h-48 animate-pulse bg-slate-200 sm:min-h-64" />

          <div className="space-y-6 p-5 sm:p-8 lg:p-10">
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />

            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />

            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>

            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetailsPage;
