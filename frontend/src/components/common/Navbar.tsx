import { useState } from 'react';
import { Link } from 'react-router-dom';

type NavbarProps = {
  variant: 'public' | 'app';
};

const Navbar = ({ variant }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  const isPublic = variant === 'public';

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav
        aria-label={isPublic ? 'Main navigation' : 'Application navigation'}
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={handleNavigation}
          className="text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:text-xl"
        >
          Event Booking
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 sm:flex">
          {isPublic ? (
            <>
              <Link
                to="/login"
                onClick={handleNavigation}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={handleNavigation}
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/events"
                onClick={handleNavigation}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Events
              </Link>

              <Link
                to="/bookings"
                onClick={handleNavigation}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                My Bookings
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
          className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 sm:hidden"
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
        <div id="mobile-navigation" className="border-t border-gray-200 px-4 py-3 sm:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-1">
            {isPublic ? (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-md bg-gray-900 px-3 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/events"
                  className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  Events
                </Link>

                <Link
                  to="/bookings"
                  className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  My Bookings
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
