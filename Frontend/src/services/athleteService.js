/**
 * athleteService.js
 * React Query hooks for athlete-related endpoints.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import api from './api';

// ======================================================
// Query Keys
// ======================================================

export const athleteKeys = {
  me: () => ['athlete', 'me'],
  list: () => ['athletes'],
  detail: (id) => ['athletes', id],
};

// ======================================================
// Athlete Profile (Logged In Athlete)
// ======================================================

export const useMyAthleteProfile = () =>
  useQuery({
    queryKey: athleteKeys.me(),
    queryFn: async () => {
      const response = await api.get('/athletes/me');

      console.log(
        'ATHLETE PROFILE RESPONSE:',
        response.data
      );

      return (
        response?.data?.data?.profile ||
        response?.data?.profile ||
        response?.data?.data ||
        null
      );
    },
  });

export const useUpdateMyAthleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      api.patch('/athletes/me', payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.me(),
      });
    },
  });
};

// ======================================================
// Injuries
// ======================================================

export const useAddInjury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (injury) =>
      api.post('/athletes/me/injuries', injury),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.me(),
      });
    },
  });
};

export const useUpdateInjury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ injuryId, ...payload }) =>
      api.patch(
        `/athletes/me/injuries/${injuryId}`,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.me(),
      });
    },
  });
};

export const useResolveInjury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (injuryId) =>
      api.patch(
        `/athletes/me/injuries/${injuryId}/resolve`
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.me(),
      });
    },
  });
};

// ======================================================
// Coach / Physio - All Athletes
// ======================================================

export const useAthletes = () =>
  useQuery({
    queryKey: athleteKeys.list(),

    queryFn: async () => {
      const response =
        await api.get('/athletes');

      console.log(
        'FULL RESPONSE:',
        response.data
      );

      const athletes =
        response?.data?.data?.athletes ||
        response?.data?.data ||
        [];

      console.log(
        'FIRST ATHLETE:',
        athletes[0]
      );

      return athletes;
    },
  });

export const useAthlete = (athleteId) =>
  useQuery({
    queryKey: athleteKeys.detail(athleteId),

    queryFn: async () => {
      const response = await api.get(
        `/athletes/${athleteId}`
      );

      return (
        response?.data?.data?.athlete ||
        response?.data?.data ||
        null
      );
    },

    enabled: Boolean(athleteId),
  });

// ======================================================
// Coach Actions
// ======================================================

export const useUpdateReadiness = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ athleteId, ...payload }) =>
      api.patch(
        `/athletes/${athleteId}/readiness`,
        payload
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.detail(
          variables.athleteId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: athleteKeys.list(),
      });
    },
  });
};

export const useAssignPhysio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      athleteId,
      physiotherapistId,
    }) =>
      api.patch(
        `/athletes/${athleteId}/assign-physio`,
        {
          physiotherapistId,
        }
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.detail(
          variables.athleteId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: athleteKeys.list(),
      });
    },
  });
};

export const useAssignCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      athleteId,
      coachId,
    }) =>
      api.patch(
        `/athletes/${athleteId}/assign-coach`,
        {
          coachId,
        }
      ),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: athleteKeys.detail(
          variables.athleteId
        ),
      });

      queryClient.invalidateQueries({
        queryKey: athleteKeys.list(),
      });
    },
  });
};