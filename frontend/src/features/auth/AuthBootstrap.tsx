import { useEffect, useRef, useState, type ReactNode } from "react";

import { useAppDispatch } from "../../hooks/redux";
import {
  clearCredentials,
  setAccessToken,
  setUser,
} from "./authSlice";

import {
  useMeQuery,
  useRefreshTokenMutation,
} from "./authApi";

type AuthBootstrapProps = {
  children: ReactNode;
};

const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const dispatch = useAppDispatch();

  const hasInitializedRef = useRef(false);

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
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    const initializeAuth = async () => {
      try {
        const response = await refreshToken().unwrap();

        dispatch(
          setAccessToken(response.data.accessToken),
        );

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
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
          aria-hidden="true"
        />
      </div>
    );
  }

  return children;
};

export default AuthBootstrap;