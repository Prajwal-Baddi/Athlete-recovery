import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  recoveryService, teamService, injuryService,
  aiService, notificationService,
} from '../services/api'

// ─── DEMO ATHLETE ID (replace with auth context) ─────────────────────────────
const DEMO_ATHLETE_ID = 'athlete_001'
const DEMO_TEAM_ID    = 'team_001'

// ─── RECOVERY HOOKS ──────────────────────────────────────────────────────────
export function useRecoveryTrend(athleteId = DEMO_ATHLETE_ID, days = 7) {
  return useQuery({
    queryKey: ['recovery', 'trend', athleteId, days],
    queryFn:  () => recoveryService.getTrend(athleteId, days).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDailyScore(athleteId = DEMO_ATHLETE_ID) {
  return useQuery({
    queryKey: ['recovery', 'daily', athleteId],
    queryFn:  () => recoveryService.getDailyScore(athleteId).then(r => r.data),
    refetchInterval: 1000 * 60 * 10,
  })
}

export function useWellness(athleteId = DEMO_ATHLETE_ID) {
  return useQuery({
    queryKey: ['recovery', 'wellness', athleteId],
    queryFn:  () => recoveryService.getWellness(athleteId).then(r => r.data),
  })
}

export function useWearables(athleteId = DEMO_ATHLETE_ID) {
  return useQuery({
    queryKey: ['wearables', athleteId],
    queryFn:  () => recoveryService.getWearables(athleteId).then(r => r.data),
    refetchInterval: 1000 * 30,
  })
}

export function useTimeline(athleteId = DEMO_ATHLETE_ID) {
  return useQuery({
    queryKey: ['timeline', athleteId],
    queryFn:  () => recoveryService.getTimeline(athleteId).then(r => r.data),
  })
}

export function usePostCheckin(athleteId = DEMO_ATHLETE_ID) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => recoveryService.postCheckin(athleteId, data),
    onSuccess:  () => { qc.invalidateQueries(['recovery', 'wellness', athleteId]) },
  })
}

// ─── TEAM HOOKS ───────────────────────────────────────────────────────────────
export function useTeamAthletes(teamId = DEMO_TEAM_ID) {
  return useQuery({
    queryKey: ['team', 'athletes', teamId],
    queryFn:  () => teamService.getAthletes(teamId).then(r => r.data),
  })
}

export function useTeamReadiness(teamId = DEMO_TEAM_ID) {
  return useQuery({
    queryKey: ['team', 'readiness', teamId],
    queryFn:  () => teamService.getTeamReadiness(teamId).then(r => r.data),
    refetchInterval: 1000 * 60 * 5,
  })
}

export function useWeeklyLoad(teamId = DEMO_TEAM_ID) {
  return useQuery({
    queryKey: ['team', 'load', teamId],
    queryFn:  () => teamService.getLoadTrend(teamId).then(r => r.data),
  })
}

// ─── INJURY HOOKS ─────────────────────────────────────────────────────────────
export function useActiveInjuries(teamId = DEMO_TEAM_ID) {
  return useQuery({
    queryKey: ['injuries', 'active', teamId],
    queryFn:  () => injuryService.getActiveInjuries(teamId).then(r => r.data),
  })
}

export function useInjuryAnalytics(teamId = DEMO_TEAM_ID) {
  return useQuery({
    queryKey: ['injuries', 'analytics', teamId],
    queryFn:  () => injuryService.getInjuryAnalytics(teamId).then(r => r.data),
  })
}

export function useRTPReadiness(athleteId) {
  return useQuery({
    queryKey: ['rtp', athleteId],
    queryFn:  () => injuryService.getRTPReadiness(athleteId).then(r => r.data),
    enabled:  !!athleteId,
  })
}

// ─── AI HOOKS ─────────────────────────────────────────────────────────────────
export function useAIInsights(athleteId = DEMO_ATHLETE_ID) {
  return useQuery({
    queryKey: ['ai', 'insights', athleteId],
    queryFn:  () => aiService.getInsights(athleteId).then(r => r.data),
    staleTime: 1000 * 60 * 15,
  })
}

export function useGenerateReport(athleteId = DEMO_ATHLETE_ID) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => aiService.generateReport(athleteId),
    onSuccess:  () => { qc.invalidateQueries(['ai', 'insights', athleteId]) },
  })
}

// ─── NOTIFICATION HOOKS ───────────────────────────────────────────────────────
export function useNotifications(userId = DEMO_ATHLETE_ID) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn:  () => notificationService.getAll(userId).then(r => r.data),
    refetchInterval: 1000 * 30,
  })
}
