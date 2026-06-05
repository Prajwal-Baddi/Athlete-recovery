import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import api from './api';

/*
|--------------------------------------------------------------------------
| Query Keys
|--------------------------------------------------------------------------
*/

export const recoveryKeys = {
  plans: ['recovery-plans'],
  exercises: ['recovery-exercises'],
  progress: ['recovery-progress'],

  plan: (id) => ['recovery-plan', id],
  exercise: (id) => ['recovery-exercise', id],
  progressEntry: (id) => ['recovery-progress-entry', id],
};

/*
|--------------------------------------------------------------------------
| Recovery Plans
|--------------------------------------------------------------------------
*/

export const useRecoveryPlans = () =>
  useQuery({
    queryKey: recoveryKeys.plans,
    queryFn: async () => {
      const { data } =
        await api.get('/recovery/plans');

      return (
        data?.data?.plans ||
        data?.data ||
        []
      );
    },
  });

export const useRecoveryPlan = (id) =>
  useQuery({
    queryKey: recoveryKeys.plan(id),

    queryFn: async () => {
      const { data } =
        await api.get(`/recovery/plans/${id}`);

      return (
        data?.data?.plan ||
        data?.data
      );
    },

    enabled: !!id,
  });

export const useCreateRecoveryPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      api.post(
        '/recovery/plans',
        payload
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.plans,
      });
    },
  });
};

export const useUpdateRecoveryPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      api.patch(
        `/recovery/plans/${id}`,
        payload
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.plans,
      });
    },
  });
};

export const useDeleteRecoveryPlan = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      api.delete(
        `/recovery/plans/${id}`
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.plans,
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Rehab Exercises
|--------------------------------------------------------------------------
*/

export const useExercises = () =>
  useQuery({
    queryKey: recoveryKeys.exercises,

    queryFn: async () => {
      const { data } =
        await api.get(
          '/recovery/exercises'
        );

      return (
        data?.data?.exercises ||
        data?.data ||
        []
      );
    },
  });

export const useExercise = (id) =>
  useQuery({
    queryKey: recoveryKeys.exercise(id),

    queryFn: async () => {
      const { data } =
        await api.get(
          `/recovery/exercises/${id}`
        );

      return (
        data?.data?.exercise ||
        data?.data
      );
    },

    enabled: !!id,
  });

export const useCreateExercise = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      api.post(
        '/recovery/exercises',
        payload
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.exercises,
      });
    },
  });
};

export const useUpdateExercise = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      api.patch(
        `/recovery/exercises/${id}`,
        payload
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.exercises,
      });
    },
  });
};

export const useCompleteExercise = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      api.patch(
        `/recovery/exercises/${id}/complete`
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.exercises,
      });
    },
  });
};

export const useDeleteExercise = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      api.delete(
        `/recovery/exercises/${id}`
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.exercises,
      });
    },
  });
};

/*
|--------------------------------------------------------------------------
| Recovery Progress
|--------------------------------------------------------------------------
*/

export const useProgressEntries = () =>
  useQuery({
    queryKey: recoveryKeys.progress,

    queryFn: async () => {
      const { data } =
        await api.get(
          '/recovery/progress'
        );

      return (
        data?.data?.entries ||
        data?.data ||
        []
      );
    },
  });

export const useCreateProgressEntry = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      api.post(
        '/recovery/progress',
        payload
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.progress,
      });
    },
  });
};

export const useUpdateProgressEntry = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      api.patch(
        `/recovery/progress/${id}`,
        payload
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.progress,
      });
    },
  });
};

export const useDeleteProgressEntry = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      api.delete(
        `/recovery/progress/${id}`
      ),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: recoveryKeys.progress,
      });
    },
  });
};