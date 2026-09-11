import { useEffect, useState, type ReactNode } from "react";

import { useAppDispatch } from "../../hooks/redux";
import { clearCredentials, setAccessToken, setUser } from "./authSlice";
import {
  useMeQuery,
  useRefreshTokenMutation,
} from "./authApi";

type AuthBootstrapProps = {
  children: ReactNode;
};

let refreshPromise: Promise<string> | null = null;

const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const dispatch = useAppDispatch();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [refreshToken] = useRefreshTokenMutation();

  const { data: meResponse, isSuccess: isMeSuccess } = useMeQuery(
    undefined,
    {
      skip: !isAuthenticated,
    },
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!refreshPromise) {
          refreshPromise = refreshToken()
            .unwrap()
            .then((response) => response.data.accessToken)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;

        dispatch(setAccessToken(accessToken));
        setIsAuthenticated(true);
      } catch {
        dispatch(clearCredentials());
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    void initializeAuth();
  }, [dispatch, refreshToken]);

  useEffect(() => {
    if (isMeSuccess && meResponse) {
      dispatch(setUser(meResponse.data));
    }
  }, [dispatch, isMeSuccess, meResponse]);

  if (!isInitialized) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-label="Initializing application"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"
          aria-hidden="true"
        />
      </div>
    );
  }

  return children;
};

export default AuthBootstrap;