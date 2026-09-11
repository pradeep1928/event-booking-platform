import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

      dispatch(setCredentials(response.data));

      const state = location.state as LoginLocationState | null;
      const from = state?.from;

      const destination =
        from?.pathname && from.pathname !== '/login'
          ? `${from.pathname}${from.search}${from.hash}`
          : '/';

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
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Sign in to manage your events and bookings.
            </p>
          </div>

          {serverError && (
            <div
              className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="mt-6 space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="mt-2 block min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="you@example.com"
              />

              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="mt-2 block min-h-11 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                placeholder="Enter your password"
              />

              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex min-h-11 w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-gray-900 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
