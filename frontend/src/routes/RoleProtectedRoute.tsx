import { Navigate, Outlet } from 'react-router-dom';

import type { UserRole } from '../features/auth/authSlice';
import { useAppSelector } from '../hooks/redux';

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
};

const RoleProtectedRoute = ({
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { accessToken, user } = useAppSelector(
    (state) => state.auth,
  );

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/events" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;