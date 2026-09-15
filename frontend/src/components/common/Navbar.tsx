import { useState } from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../hooks/redux";

type NavbarProps = {
  variant: "public" | "app";
};

const Navbar = ({ variant }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { accessToken, user } = useAppSelector(
    (state) => state.auth,
  );

  const isAuthenticated = Boolean(accessToken);
  const isPublic = variant === "public";

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label={
          isPublic
            ? "Main navigation"
            : "Application navigation"
        }
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          to="/"
          onClick={handleNavigation}
          className="text-lg font-bold tracking-tight text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-xl"
        >
          Event Booking
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 sm:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/events"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Events
              </Link>

              <Link
                to="/bookings"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                My Bookings
              </Link>

              {user && (
                <span className="ml-2 border-l border-slate-200 pl-4 text-sm font-medium text-slate-700">
                  {user.firstName}
                </span>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={
            isMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:hidden"
        >
          <span className="sr-only">
            {isMenuOpen ? "Close menu" : "Open menu"}
          </span>

          <span
            className="block h-5 w-5"
            aria-hidden="true"
          >
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                isMenuOpen
                  ? "translate-y-2 rotate-45"
                  : ""
              }`}
            />

            <span
              className={`mt-1.5 block h-0.5 w-5 bg-current transition-opacity ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`mt-1.5 block h-0.5 w-5 bg-current transition-transform ${
                isMenuOpen
                  ? "-translate-y-2 -rotate-45"
                  : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/events"
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Events
                </Link>

                <Link
                  to="/bookings"
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  My Bookings
                </Link>

                {user && (
                  <div className="border-t border-slate-200 px-3 py-3 text-sm font-medium text-slate-700">
                    {user.firstName} {user.lastName}
                  </div>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={handleNavigation}
                  className="rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;