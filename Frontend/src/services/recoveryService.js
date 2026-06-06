/**
 * recoveryService.js
 * Axios service layer for recovery API endpoints
 */

import api from './api';

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Cases
// ═══════════════════════════════════════════════════════════════════════════

export const getRecoveryCases = (params) =>
  api.get('/recovery/cases', { params });

export const getRecoveryCaseById = (id) =>
  api.get(`/recovery/cases/${id}`);

export const getAthleteRecoveryCases = (athleteId) =>
  api.get(`/recovery/athlete/${athleteId}`);

export const createRecoveryCase = (data) =>
  api.post('/recovery/cases', data);

export const updateRecoveryCase = (id, data) =>
  api.patch(`/recovery/cases/${id}`, data);

export const updateRecoveryPhase = (id, phase, notes) =>
  api.patch(`/recovery/cases/${id}/phase`, { phase, notes });

export const getRTPCandidates = (params) =>
  api.get('/recovery/rtp-candidates', { params });

export const approveRTP = (id, notes) =>
  api.post(`/recovery/cases/${id}/approve-rtp`, { notes });

// ═══════════════════════════════════════════════════════════════════════════
// Recovery Progress
// ═══════════════════════════════════════════════════════════════════════════

export const getProgressEntries = (caseId, params) =>
  api.get(`/recovery/${caseId}/progress`, { params });

export const createProgressEntry = (caseId, data) =>
  api.post(`/recovery/${caseId}/progress`, data);

export const getPainTrend = (caseId, days) =>
  api.get(`/recovery/${caseId}/pain-trend`, { params: { days } });

export const getRecoveryProgress = (caseId) =>
  api.get(`/recovery/${caseId}/progress-summary`);

// ═══════════════════════════════════════════════════════════════════════════
// Exercises
// ═══════════════════════════════════════════════════════════════════════════

export const getExercisesForCase = (caseId) =>
  api.get(`/recovery/${caseId}/exercises`);

export const createExercise = (caseId, data) =>
  api.post(`/recovery/${caseId}/exercises`, data);

export const updateExercise = (exerciseId, data) =>
  api.patch(`/recovery/exercises/${exerciseId}`, data);

export const completeExercise = (exerciseId, data) =>
  api.post(`/recovery/exercises/${exerciseId}/complete`, data);

export const deleteExercise = (exerciseId) =>
  api.delete(`/recovery/exercises/${exerciseId}`);

// ═══════════════════════════════════════════════════════════════════════════
// Analytics & Alerts
// ═══════════════════════════════════════════════════════════════════════════

export const getAlerts = () =>
  api.get('/recovery/alerts');

export const getDashboardStats = () =>
  api.get('/recovery/stats');
