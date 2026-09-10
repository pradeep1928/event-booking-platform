import { Link, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav
          aria-label="Application navigation"
          className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link
            to="/"
            className="text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:text-xl"
          >
            Event Booking
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/events"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Events
            </Link>

            <Link
              to="/bookings"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              My Bookings
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;