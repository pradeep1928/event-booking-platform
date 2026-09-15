import { Link, Navigate } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

const HomePage = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to="/events" replace />;
  }

  return (
    <section className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Event Booking Platform
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
          Discover and book your next event
        </h1>

        <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
          Find exciting events, reserve your tickets, and manage your
          bookings from one place.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get started
          </Link>

          <Link
            to="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomePage;