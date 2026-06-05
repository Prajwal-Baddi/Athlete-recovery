/**
 * AuthContext.jsx
 * Supports backend response:
 *
 * {
 *   success: true,
 *   data: {
 *     user: {...},
 *     tokens: {
 *       accessToken,
 *       refreshToken
 *     }
 *   }
 * }
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import api from '../services/api';
import {
  connectSocket,
  disconnectSocket,
} from '../services/socket';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken')
  );

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [role, setRole] = useState(null);

  const [loading, setLoading] = useState(true);

  const applyToken = (token) => {
    if (token) {
      localStorage.setItem(
        'accessToken',
        token
      );

      api.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('accessToken');

      delete api.defaults.headers.common[
        'Authorization'
      ];
    }

    setAccessToken(token);
  };

  const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  delete api.defaults.headers.common.Authorization;

  setAccessToken(null);
  setUser(null);
  setRole(null);
  setIsAuthenticated(false);

  disconnectSocket();
};

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');

      const userData =
        data?.data?.user ??
        data?.user ??
        data;

      setUser(userData);
      setRole(userData.role);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      clearAuth();
      return null;
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const { data } = await api.post(
        '/auth/refresh'
      );

      const newToken =
        data?.accessToken ??
        data?.data?.accessToken ??
        data?.data?.tokens?.accessToken;

      if (!newToken) {
        throw new Error(
          'No access token returned'
        );
      }

      applyToken(newToken);

      return newToken;
    } catch (error) {
      clearAuth();
      return null;
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post(
      '/auth/login',
      {
        email,
        password,
      }
    );

    console.log(
      'LOGIN RESPONSE:',
      data
    );

    const token =
      data?.accessToken ??
      data?.data?.accessToken ??
      data?.data?.tokens?.accessToken;

    const userData =
      data?.user ??
      data?.data?.user;

    if (!token) {
      console.error(
        'Login response:',
        data
      );

      throw new Error(
        'No access token returned from server'
      );
    }

    applyToken(token);

    let resolvedUser = userData;

    if (!resolvedUser) {
      resolvedUser =
        await fetchCurrentUser();
    } else {
      setUser(resolvedUser);
      setRole(resolvedUser.role);
      setIsAuthenticated(true);
    }

    connectSocket(token);

    return resolvedUser;
  };

  const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuth();
  }
};

  useEffect(() => {
    const init = async () => {
      try {
        const token =
          localStorage.getItem(
            'accessToken'
          );

        if (token) {
          api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${token}`;

          const userData =
            await fetchCurrentUser();

          if (userData) {
            connectSocket(token);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      disconnectSocket();
    };
  }, [fetchCurrentUser]);

  const value = {
  user,
  accessToken,
  role,
  loading,
  isAuthenticated,

  login,
  logout,

  refreshToken,
  fetchCurrentUser,
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};