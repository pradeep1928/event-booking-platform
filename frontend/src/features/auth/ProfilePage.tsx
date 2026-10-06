import { useMeQuery } from './authApi';

const ProfilePage = () => {
  const { data, isLoading, isError } = useMeQuery();

  if (isLoading) {
    return (
      <div
        className="flex min-h-[50vh] items-center justify-center"
        role="status"
        aria-label="Loading profile"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Unable to load your profile.
        </div>
      </div>
    );
  }

  const user = data.data;

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {user.firstName} {user.lastName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <ProfileField label="First name" value={user.firstName} />

          <ProfileField label="Last name" value={user.lastName} />

          <ProfileField label="Email" value={user.email} />

          <ProfileField label="Role" value={user.role} />
        </div>
      </div>
    </section>
  );
};

type ProfileFieldProps = {
  label: string;
  value: string;
};

const ProfileField = ({ label, value }: ProfileFieldProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>

      <p className="mt-1 break-words text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
};

export default ProfilePage;
