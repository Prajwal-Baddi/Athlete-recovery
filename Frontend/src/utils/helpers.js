import { clsx } from 'clsx'

export { clsx as cn }

export function scoreColor(score) {
  if (score >= 80) return '#00d4aa'
  if (score >= 60) return '#ffb347'
  return '#ff5f6d'
}

export function riskColor(risk) {
  return { low: '#00d4aa', medium: '#ffb347', high: '#ff5f6d' }[risk] ?? '#4a5568'
}

export function severityColor(sev) {
  return { Moderate: '#ff5f6d', Mild: '#ffb347', Minor: '#4a9eff' }[sev] ?? '#4a5568'
}

export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}
