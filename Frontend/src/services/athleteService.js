/**
 * athleteService.js
 * React Query hooks for athlete-related endpoints.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// ─── Keys ──────────────────────────────────────────────────────────────────
export const athleteKeys = {
  me:   () => ['athlete', 'me'],
  list: () => ['athletes'],
  detail: (id) => ['athletes', id],
};

export const useMyAthleteProfile = () =>
  useQuery({
    queryKey: athleteKeys.me(),
    queryFn: async () => {
      console.log('CALLING /athletes/me');

      const response = await api.get('/athletes/me');

      console.log('API RESPONSE:', response.data);

      return response.data.data.profile;
    },
  });

export const useUpdateMyAthleteProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.patch('/athletes/me', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.me() }),
  });
};

// ─── Injuries ──────────────────────────────────────────────────────────────
export const useAddInjury = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (injury) => api.post('/athletes/me/injuries', injury),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.me() }),
  });
};

export const useUpdateInjury = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ injuryId, ...payload }) => api.patch(`/athletes/me/injuries/${injuryId}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.me() }),
  });
};

export const useResolveInjury = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (injuryId) => api.patch(`/athletes/me/injuries/${injuryId}/resolve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: athleteKeys.me() }),
  });
};

// ─── All athletes (coach / physiotherapist role) ──────────────────────────
export const useAthletes = () =>
  useQuery({
    queryKey: athleteKeys.list(),
    queryFn: async () => {
      const { data } = await api.get('/athletes');
      return data.data ?? data;
    },
  });

export const useAthlete = (athleteId) =>
  useQuery({
    queryKey: athleteKeys.detail(athleteId),
    queryFn: async () => {
      const { data } = await api.get(`/athletes/${athleteId}`);
      return data.data ?? data;
    },
    enabled: Boolean(athleteId),
  });

// ─── Admin / coach mutations ───────────────────────────────────────────────
export const useUpdateReadiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ athleteId, ...payload }) => api.patch(`/athletes/${athleteId}/readiness`, payload),
    onSuccess: (_d, { athleteId }) => {
      qc.invalidateQueries({ queryKey: athleteKeys.detail(athleteId) });
      qc.invalidateQueries({ queryKey: athleteKeys.list() });
    },
  });
};

export const useAssignPhysio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ athleteId, physiotherapistId }) =>
      api.patch(`/athletes/${athleteId}/assign-physio`, { physiotherapistId }),
    onSuccess: (_d, { athleteId }) => qc.invalidateQueries({ queryKey: athleteKeys.detail(athleteId) }),
  });
};

export const useAssignCoach = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ athleteId, coachId }) =>
      api.patch(`/athletes/${athleteId}/assign-coach`, { coachId }),
    onSuccess: (_d, { athleteId }) => qc.invalidateQueries({ queryKey: athleteKeys.detail(athleteId) }),
  });
};
