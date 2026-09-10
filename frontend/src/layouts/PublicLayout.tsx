import { Link, Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav
          aria-label="Main navigation"
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
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Event Booking
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;