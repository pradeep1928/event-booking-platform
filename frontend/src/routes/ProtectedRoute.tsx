import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

const ProtectedRoute = () => {
  const location = useLocation();

  const { accessToken } = useAppSelector((state) => state.auth);

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;