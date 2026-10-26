import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from './authSlice';
import { useLoginMutation } from './authApi';

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(2, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginLocationState = {
  from?: {
    pathname: string;
    search: string;
    hash: string;
  };
};

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isOrganizerMode = searchParams.get('mode') === 'organizer';

  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (formData: LoginFormData) => {
    setServerError(null);

    try {
      const response = await login(formData).unwrap();
      if (
        isOrganizerMode &&
        response.data.user.role !== 'ORGANIZER' &&
        response.data.user.role !== 'ADMIN'
      ) {
        setServerError(
          'This account is not registered as an organizer. Please use attendee sign in.',
        );
        return;
      }

      dispatch(setCredentials(response.data));

      const state = location.state as LoginLocationState | null;
      const from = state?.from;

      let destination = '/events';

      if (from?.pathname && from.pathname !== '/login') {
        destination = `${from.pathname}${from.search}${from.hash}`;
      } else if (response.data.user.role === 'ORGANIZER') {
        destination = '/organizer/events';
      }

      navigate(destination, { replace: true });
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'data' in error) {
        const data = (
          error as {
            data?: {
              message?: string;
            };
          }
        ).data;

        if (data?.message) {
          setServerError(data.message);
          return;
        }
      }

      setServerError('Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600">Event Booking</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {isOrganizerMode ? 'Organizer sign in' : 'Welcome back'}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              {isOrganizerMode
                ? 'Sign in to create and manage your events.'
                : 'Sign in to discover events and manage your bookings.'}
            </p>
          </div>

          {serverError && (
            <div
              className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="mt-2 block min-h-12 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="you@example.com"
              />

              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-rose-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="mt-2 block min-h-12 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter your password"
              />

              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-rose-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              to={isOrganizerMode ? '/register?mode=organizer' : '/register'}
              className="font-semibold text-indigo-600 transition hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create one
            </Link>
          </p>
          {!isOrganizerMode && (
            <p className="mt-3 text-center text-sm text-slate-600">
              Hosting events?{' '}
              <Link
                to="/login?mode=organizer"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Organizer sign in
              </Link>
            </p>
          )}
          {isOrganizerMode && (
            <p className="mt-3 text-center text-sm text-slate-600">
              Looking to attend events?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Attendee sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
