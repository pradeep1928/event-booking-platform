import { Link } from "react-router-dom";

import type { Event } from "../eventTypes";

type EventCardProps = {
  event: Event;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const formatPrice = (price: string) => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "Price unavailable";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatCategory = (category: Event["category"]) => {
  return category.charAt(0) + category.slice(1).toLowerCase();
};

const EventCard = ({ event }: EventCardProps) => {
  const isSoldOut = event.availableSeats <= 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Event image placeholder */}
      <div
        className="flex aspect-[16/9] items-center justify-center bg-indigo-50"
        aria-hidden="true"
      >
        <span className="text-3xl font-bold text-indigo-200">
          {formatCategory(event.category).charAt(0)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {formatCategory(event.category)}
          </span>

          {isSoldOut && (
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
              Sold out
            </span>
          )}
        </div>

        <h2 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-900">
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {event.description}
          </p>
        )}

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-900">When:</span>{" "}
            {formatDate(event.eventDate)}
          </p>

          <p>
            <span className="font-medium text-slate-900">Where:</span>{" "}
            {event.venue}, {event.city}
          </p>

          <p>
            <span className="font-medium text-slate-900">Seats:</span>{" "}
            {event.availableSeats} available
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="text-lg font-bold text-slate-900">
              {formatPrice(event.price)}
            </p>
          </div>

          <Link
            to={`/events/${event.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventCard;