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

const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const dispatch = useAppDispatch();

  const [isInitialized, setIsInitialized] = useState(false);

  const [refreshToken] = useRefreshTokenMutation();

  const { data: meResponse, isSuccess: isMeSuccess } = useMeQuery(
    undefined,
    {
      skip: !isInitialized,
    },
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await refreshToken().unwrap();

        dispatch(setAccessToken(response.data.accessToken));
      } catch {
        dispatch(clearCredentials());
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