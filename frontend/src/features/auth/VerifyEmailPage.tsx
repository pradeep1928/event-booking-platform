import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useResendVerificationEmailMutation, useVerifyEmailMutation } from './authApi';

type VerificationState = 'idle' | 'verifying' | 'success' | 'error';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email') ?? '';

  const [verificationState, setVerificationState] = useState<VerificationState>(
    token ? 'verifying' : 'idle',
  );

  const hasVerifiedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendSuccessMessage, setResendSuccessMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerificationEmail, { isLoading: isResending }] =
    useResendVerificationEmailMutation();

  useEffect(() => {
    if (!token || hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true

    const verify = async () => {
      try {
        setVerificationState('verifying');
        setErrorMessage('');

        await verifyEmail({ token }).unwrap();

        setVerificationState('success');
      } catch (error) {
        setVerificationState('error');

        const response = error as {
          data?: {
            message?: string;
          };
        };

        setErrorMessage(
          response.data?.message ??
            "We couldn't verify your email. The link may be invalid or expired.",
        );
      }
    };

    void verify();
  }, [token, verifyEmail]);

  const handleResend = async () => {
    if (!emailFromUrl || resendCooldown > 0) {
      setErrorMessage('Please enter your email address to resend the verification email.');
      return;
    }

    try {
      setErrorMessage('');
      setResendSuccessMessage('');

      await resendVerificationEmail({
        email: emailFromUrl,
      }).unwrap();

      setResendSuccessMessage('A new verification email has been sent. Please check your inbox.');

      setVerificationState('idle');

      setResendCooldown(60);

      const intervalId = window.setInterval(() => {
        setResendCooldown((current) => {
          if (current <= 1) {
            window.clearInterval(intervalId);
            return 0;
          }

          return current - 1;
        });
      }, 1000);
    } catch {
      setErrorMessage('Unable to resend the verification email. Please try again.');
    }
  };

  if (verificationState === 'verifying') {
    return (
      <VerificationLayout>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <div
            className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Verifying your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Please wait while we verify your email address.
        </p>
      </VerificationLayout>
    );
  }

  if (verificationState === 'success') {
    return (
      <VerificationLayout>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-7 w-7 text-emerald-600"
            aria-hidden="true"
          >
            <path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Email verified successfully
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          Your email address has been verified. You can now sign in to your account.
        </p>

        <Link
          to="/login"
          className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Continue to login
        </Link>
      </VerificationLayout>
    );
  }

  if (verificationState === 'error') {
    return (
      <VerificationLayout>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-7 w-7 text-rose-600"
            aria-hidden="true"
          >
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Email verification failed
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{errorMessage}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {emailFromUrl && (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending
                ? 'Sending...'
                : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend verification email'}
            </button>
          )}

          <Link
            to="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to login
          </Link>
        </div>
      </VerificationLayout>
    );
  }

  return (
    <VerificationLayout>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-7 w-7 text-indigo-600"
          aria-hidden="true"
        >
          <path d="M4 6.5h16v11H4z" strokeLinejoin="round" />
          <path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Check your email
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
        We sent a verification link to your email address. Open the link in the email to verify your
        account.
      </p>

      {emailFromUrl && (
        <p className="mt-3 break-all text-sm font-medium text-slate-900">{emailFromUrl}</p>
      )}

      {errorMessage && (
        <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {errorMessage}
        </p>
      )}

      {resendSuccessMessage && (
        <p
          className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
        >
          {resendSuccessMessage}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {emailFromUrl && (
          <button
            type="button"
            onClick={handleResend || resendCooldown > 0}
            disabled={isResending}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResending
              ? 'Sending...'
              : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend verification email'}
          </button>
        )}

        <Link
          to="/login"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back to login
        </Link>
      </div>
    </VerificationLayout>
  );
};

type VerificationLayoutProps = {
  children: ReactNode;
};

const VerificationLayout = ({ children }: VerificationLayoutProps) => {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        {children}
      </div>
    </main>
  );
};

export default VerifyEmailPage;
