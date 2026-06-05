/**
 * notificationService.js
 * React Query hooks for notification endpoints.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

export const notifKeys = {
  all: () => ['notifications'],
};

// ─── Fetch notifications ──────────────────────────────────────────────────
export const useNotifications = () =>
  useQuery({
    queryKey: notifKeys.all(),
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data.data ?? data;
    },
    refetchInterval: 30_000, // poll every 30 s
  });

// ─── Mark single read ─────────────────────────────────────────────────────
export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.all() }),
  });
};

// ─── Mark all read ────────────────────────────────────────────────────────
export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.all() }),
  });
};

// ─── Delete notification ──────────────────────────────────────────────────
export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/notifications/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: notifKeys.all() }),
  });
};
