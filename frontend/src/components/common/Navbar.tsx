import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { baseApi } from '../../app/api/baseApi';
import { useLogoutMutation } from '../../features/auth/authApi';
import { clearCredentials } from '../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';

type NavbarProps = {
  variant: 'public' | 'app';
};

const Navbar = ({ variant }: NavbarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { accessToken, user } = useAppSelector((state) => state.auth);

  const isAuthenticated = Boolean(accessToken);
  const isPublic = variant === 'public';

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // Still clear local authentication if server logout fails.
    } finally {
      dispatch(clearCredentials());

      // Clear cached API data belonging to previous user
      dispatch(baseApi.util.resetApiState());
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);

      navigate('/', {
        replace: true,
      });
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        aria-label={isPublic ? 'Main navigation' : 'Application navigation'}
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
          <Link
            to="/events"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Events
          </Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'ORGANIZER' || user?.role === 'ADMIN' ? (
                <>
                  <Link
                    to="/organizer/events"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Manage Events
                  </Link>

                  <Link
                    to="/organizer/events/new"
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Create Event
                  </Link>
                </>
              ) : (
                <Link
                  to="/bookings"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  My Bookings
                </Link>
              )}
              {user && (
                <div className="relative ml-2 border-l border-slate-200 pl-4">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span>{user.firstName}</span>

                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`h-4 w-4 transition-transform ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
                    >
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Profile
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
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
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:hidden"
        >
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>

          <span className="block h-5 w-5" aria-hidden="true">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                isMenuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />

            <span
              className={`mt-1.5 block h-0.5 w-5 bg-current transition-opacity ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />

            <span
              className={`mt-1.5 block h-0.5 w-5 bg-current transition-transform ${
                isMenuOpen ? '-translate-y-2 -rotate-45' : ''
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
            <Link
              to="/events"
              onClick={handleNavigation}
              className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/events"
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Events
                </Link>
                {user?.role === 'ORGANIZER' || user?.role === 'ADMIN' ? (
                  <>
                    <Link
                      to="/organizer/events"
                      onClick={handleNavigation}
                      className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Manage Events
                    </Link>

                    <Link
                      to="/organizer/events/new"
                      onClick={handleNavigation}
                      className="rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Create Event
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/bookings"
                    onClick={handleNavigation}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    My Bookings
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-lg px-3 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/events"
                  onClick={handleNavigation}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Events
                </Link>

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
