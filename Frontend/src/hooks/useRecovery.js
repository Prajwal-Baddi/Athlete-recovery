/**
 * useRecovery.js
 * React Query hooks for recovery operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as recoveryService from '../services/recoveryService';

// ═══════════════════════════════════════════════════════════════════════════
// Query Keys
// ═══════════════════════════════════════════════════════════════════════════

export const recoveryKeys = {
  all: ['recovery'],
  cases: ['recovery', 'cases'],
  case: (id) => ['recovery', 'cases', id],
  exercises: (caseId) => ['recovery', 'exercises', caseId],
  exercise: (id) => ['recovery', 'exercises', id],
  progress: (caseId) => ['recovery', 'progress', caseId],
  painTrend: (caseId) => ['recovery', 'pain-trend', caseId],
  progressSummary: (caseId) => ['recovery', 'progress-summary', caseId],
  rtp: ['recovery', 'rtp-candidates'],
  alerts: ['recovery', 'alerts'],
  stats: ['recovery', 'stats'],
};

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Cases
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all recovery cases with filters
 */
export const useRecoveryCases = (params = {}) =>
  useQuery({
    queryKey: recoveryKeys.cases,
    queryFn: async () => {
      const response = await recoveryService.getRecoveryCases(params);
      return response?.data?.data || response?.data;
    },
    staleTime: 1000 * 60 * 5,
  });

/**
 * Get a specific recovery case
 */
export const useRecoveryCase = (id) =>
  useQuery({
    queryKey: recoveryKeys.case(id),
    queryFn: async () => {
      const response = await recoveryService.getRecoveryCaseById(id);
      return response?.data?.data?.recoveryCase || response?.data?.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Get recovery cases for an athlete
 */
export const useAthleteRecoveryCases = (athleteId) =>
  useQuery({
    queryKey: ['recovery', 'athlete', athleteId],
    queryFn: async () => {
      const response = await recoveryService.getAthleteRecoveryCases(athleteId);
      return response?.data?.data?.cases || response?.data?.data;
    },
    enabled: !!athleteId,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Create recovery case
 */
export const useCreateRecoveryCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => recoveryService.createRecoveryCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.cases });
      queryClient.invalidateQueries({ queryKey: recoveryKeys.stats });
    },
  });
};

/**
 * Update recovery case
 */
export const useUpdateRecoveryCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      recoveryService.updateRecoveryCase(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.case(id) });
      queryClient.invalidateQueries({ queryKey: recoveryKeys.cases });
    },
  });
};

/**
 * Update recovery phase
 */
export const useUpdateRecoveryPhase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, phase, notes }) =>
      recoveryService.updateRecoveryPhase(id, phase, notes),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.case(id) });
      queryClient.invalidateQueries({ queryKey: recoveryKeys.cases });
    },
  });
};

/**
 * Approve RTP
 */
export const useApproveRTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }) => recoveryService.approveRTP(id, notes),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.case(id) });
      queryClient.invalidateQueries({ queryKey: recoveryKeys.cases });
      queryClient.invalidateQueries({ queryKey: recoveryKeys.rtp });
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Progress
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get progress entries
 */
export const useProgressEntries = (caseId, params = {}) =>
  useQuery({
    queryKey: recoveryKeys.progress(caseId),
    queryFn: async () => {
      const response = await recoveryService.getProgressEntries(caseId, params);
      return response?.data?.data?.entries || response?.data?.data;
    },
    enabled: !!caseId,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Create progress entry
 */
export const useCreateProgressEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, data }) =>
      recoveryService.createProgressEntry(caseId, data),
    onSuccess: (response, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.progress(caseId) });
      queryClient.invalidateQueries({
        queryKey: recoveryKeys.progressSummary(caseId),
      });
    },
  });
};

/**
 * Get pain trend
 */
export const usePainTrend = (caseId, days = 7) =>
  useQuery({
    queryKey: recoveryKeys.painTrend(caseId),
    queryFn: async () => {
      const response = await recoveryService.getPainTrend(caseId, days);
      return response?.data?.data?.trend || response?.data?.data;
    },
    enabled: !!caseId,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Get recovery progress summary
 */
export const useRecoveryProgress = (caseId) =>
  useQuery({
    queryKey: recoveryKeys.progressSummary(caseId),
    queryFn: async () => {
      const response = await recoveryService.getRecoveryProgress(caseId);
      return response?.data?.data?.progress || response?.data?.data;
    },
    enabled: !!caseId,
    staleTime: 1000 * 60 * 2,
  });

// ═══════════════════════════════════════════════════════════════════════════
// Exercises
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get exercises for case
 */
export const useExercises = (caseId) =>
  useQuery({
    queryKey: recoveryKeys.exercises(caseId),
    queryFn: async () => {
      const response = await recoveryService.getExercisesForCase(caseId);
      return response?.data?.data?.exercises || response?.data?.data;
    },
    enabled: !!caseId,
    staleTime: 1000 * 60 * 5,
  });

/**
 * Create exercise
 */
export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, data }) =>
      recoveryService.createExercise(caseId, data),
    onSuccess: (response, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.exercises(caseId) });
      queryClient.invalidateQueries({ queryKey: recoveryKeys.case(caseId) });
    },
  });
};

/**
 * Update exercise
 */
export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, data }) =>
      recoveryService.updateExercise(exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.all });
    },
  });
};

/**
 * Complete exercise
 */
export const useCompleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, data }) =>
      recoveryService.completeExercise(exerciseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.all });
    },
  });
};

/**
 * Delete exercise
 */
export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId) => recoveryService.deleteExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recoveryKeys.all });
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// Analytics & Alerts
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get RTP candidates
 */
export const useRTPCandidates = (params = {}) =>
  useQuery({
    queryKey: recoveryKeys.rtp,
    queryFn: async () => {
      const response = await recoveryService.getRTPCandidates(params);
      return response?.data?.data?.candidates || response?.data?.data;
    },
    staleTime: 1000 * 60 * 5,
  });

/**
 * Get alerts
 */
export const useRecoveryAlerts = () =>
  useQuery({
    queryKey: recoveryKeys.alerts,
    queryFn: async () => {
      const response = await recoveryService.getAlerts();
      return response?.data?.data?.alerts || response?.data?.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });

/**
 * Get dashboard stats
 */
export const useDashboardStats = () =>
  useQuery({
    queryKey: recoveryKeys.stats,
    queryFn: async () => {
      const response = await recoveryService.getDashboardStats();
      return response?.data?.data?.stats || response?.data?.data;
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60 * 5,
  });
