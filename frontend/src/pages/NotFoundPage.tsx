import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold tracking-tight text-indigo-600 sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Page not found
        </h1>

        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;