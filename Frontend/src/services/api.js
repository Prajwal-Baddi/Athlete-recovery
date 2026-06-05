import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ───────────────────────────────────────────────────────────
// Attach access token to every request
// ───────────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ───────────────────────────────────────────────────────────
// Refresh token handling
// ───────────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes('/auth/login') &&
      !originalRequest?.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');

        /**
         * Backend returns:
         *
         * {
         *   success: true,
         *   data: {
         *     tokens: {
         *       accessToken,
         *       refreshToken
         *     }
         *   }
         * }
         */

        const newToken =
          data?.accessToken ??
          data?.data?.accessToken ??
          data?.data?.tokens?.accessToken;

        if (!newToken) {
          throw new Error(
            'No access token returned from refresh endpoint'
          );
        }

        localStorage.setItem(
          'accessToken',
          newToken
        );

        api.defaults.headers.common.Authorization =
          `Bearer ${newToken}`;

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        localStorage.removeItem('accessToken');

        delete api.defaults.headers.common.Authorization;

        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;