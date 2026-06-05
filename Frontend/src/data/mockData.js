export const RECOVERY_TREND = [
  { day: 'Mon', score: 72, hrv: 58, sleep: 7.2, load: 65 },
  { day: 'Tue', score: 68, hrv: 52, sleep: 6.8, load: 78 },
  { day: 'Wed', score: 75, hrv: 62, sleep: 7.5, load: 55 },
  { day: 'Thu', score: 81, hrv: 71, sleep: 8.1, load: 42 },
  { day: 'Fri', score: 79, hrv: 68, sleep: 7.8, load: 60 },
  { day: 'Sat', score: 85, hrv: 75, sleep: 8.4, load: 35 },
  { day: 'Sun', score: 88, hrv: 80, sleep: 8.7, load: 28 },
]

export const TEAM_ATHLETES = [
  { id: 1, name: 'Marcus Johnson', pos: 'Forward',    readiness: 92, risk: 'low',    avatar: 'MJ', streak: 12, injury: null },
  { id: 2, name: 'Sarah Chen',     pos: 'Midfielder', readiness: 74, risk: 'medium', avatar: 'SC', streak: 7,  injury: 'Hamstring strain' },
  { id: 3, name: 'Devon Williams', pos: 'Defender',   readiness: 45, risk: 'high',   avatar: 'DW', streak: 3,  injury: 'Knee sprain' },
  { id: 4, name: 'Aisha Patel',    pos: 'Goalkeeper', readiness: 88, risk: 'low',    avatar: 'AP', streak: 18, injury: null },
  { id: 5, name: 'James Torres',   pos: 'Forward',    readiness: 62, risk: 'medium', avatar: 'JT', streak: 5,  injury: 'Calf tightness' },
  { id: 6, name: 'Emma Rodriguez', pos: 'Midfielder', readiness: 95, risk: 'low',    avatar: 'ER', streak: 24, injury: null },
]

export const WEEKLY_LOAD = [
  { week: 'W1', load: 420, recovery: 380, optimal: 400 },
  { week: 'W2', load: 510, recovery: 440, optimal: 420 },
  { week: 'W3', load: 380, recovery: 420, optimal: 400 },
  { week: 'W4', load: 460, recovery: 450, optimal: 430 },
  { week: 'W5', load: 540, recovery: 410, optimal: 440 },
  { week: 'W6', load: 490, recovery: 470, optimal: 450 },
]

export const INJURY_LOG = [
  { id: 1, athlete: 'Devon Williams', type: 'Knee Sprain',      severity: 'Moderate', daysOut: 14, rtp: 72, phase: 'Strengthening', last: '2h ago',
    details: { strength: 68, rom: 75, functional: 45, pain: 80 } },
  { id: 2, athlete: 'Sarah Chen',     type: 'Hamstring Strain', severity: 'Mild',     daysOut: 7,  rtp: 45, phase: 'Stretching',    last: '4h ago',
    details: { strength: 50, rom: 60, functional: 35, pain: 65 } },
  { id: 3, athlete: 'James Torres',   type: 'Calf Tightness',   severity: 'Minor',    daysOut: 3,  rtp: 20, phase: 'Monitoring',    last: '1d ago',
    details: { strength: 30, rom: 40, functional: 20, pain: 40 } },
]

export const WELLNESS_METRICS = [
  { metric: 'Sleep Quality', value: 88, trend: '+4%',  trendUp: true  },
  { metric: 'Stress Level',  value: 32, trend: '-8%',  trendUp: false },
  { metric: 'Energy',        value: 76, trend: '+12%', trendUp: true  },
  { metric: 'Soreness',      value: 24, trend: '-6%',  trendUp: false },
  { metric: 'Motivation',    value: 91, trend: '+3%',  trendUp: true  },
  { metric: 'Hydration',     value: 82, trend: '+5%',  trendUp: true  },
]

export const RADAR_DATA = [
  { subject: 'Speed',       team: 85, league: 72 },
  { subject: 'Power',       team: 78, league: 80 },
  { subject: 'Agility',     team: 90, league: 65 },
  { subject: 'Endurance',   team: 70, league: 88 },
  { subject: 'Recovery',    team: 82, league: 75 },
  { subject: 'Flexibility', team: 68, league: 79 },
]

export const INJURY_TYPES = [
  { name: 'Muscle Strain', value: 35, color: '#ff5f6d' },
  { name: 'Joint Sprain',  value: 28, color: '#ffb347' },
  { name: 'Tendon Issue',  value: 18, color: '#4a9eff' },
  { name: 'Contusion',     value: 12, color: '#a78bfa' },
  { name: 'Other',         value: 7,  color: '#4a5568' },
]

export const MONTHLY_INJURY = [
  { month: 'Jan', new: 2, resolved: 1 },
  { month: 'Feb', new: 1, resolved: 2 },
  { month: 'Mar', new: 3, resolved: 2 },
  { month: 'Apr', new: 1, resolved: 3 },
  { month: 'May', new: 2, resolved: 1 },
  { month: 'Jun', new: 1, resolved: 1 },
]

export const NOTIFICATIONS = [
  { id: 1, type: 'alert',   msg: 'Devon Williams: High injury risk detected',       time: '2m ago'  },
  { id: 2, type: 'ai',      msg: 'AI recommends load reduction for James Torres',    time: '18m ago' },
  { id: 3, type: 'success', msg: 'Emma Rodriguez: 24-day streak milestone!',         time: '1h ago'  },
  { id: 4, type: 'info',    msg: 'Weekly recovery report is ready',                 time: '3h ago'  },
]

export const AI_INSIGHTS = [
  { id: 1, title: 'Recovery Pattern Analysis', score: 92, tags: ['Sleep','HRV','Trend'],   color: '#00d4aa',
    summary: 'Recovery consistency improved 18% over 3 weeks. Sleep quality is the strongest predictor of next-day performance.' },
  { id: 2, title: 'Injury Risk Forecast',      score: 24, tags: ['Injury','Load','Alert'], color: '#ffb347',
    summary: 'Current risk is LOW. Left quad fatigue detected — recommend 2 days reduced loading before next HIT session.' },
  { id: 3, title: 'Performance Readiness',     score: 88, tags: ['Performance','Peak'],    color: '#4a9eff',
    summary: 'Top 15% of team for readiness this week. Optimal window for peak performance: next 48 hours.' },
  { id: 4, title: 'Nutrition & Hydration',     score: 76, tags: ['Nutrition','Recovery'],  color: '#a78bfa',
    summary: 'Hydration 8% below optimal on training days. Consider electrolyte supplementation post-session.' },
]

export const TIMELINE_EVENTS = [
  { date: 'Today',     title: 'Recovery Score: 88',      color: '#00d4aa', detail: 'Season-high readiness. HRV optimal.' },
  { date: 'Yesterday', title: 'Daily Check-in Complete', color: '#4a9eff', detail: 'Mild quad soreness reported.' },
  { date: 'Jun 1',     title: 'High-Intensity Session',  color: '#ffb347', detail: 'Sprint intervals — 540 AU load.' },
  { date: 'May 31',    title: 'Recovery Day',            color: '#a78bfa', detail: 'Cryotherapy + 30min mobility.' },
  { date: 'May 30',    title: 'Match Day',               color: '#ff5f6d', detail: '90 min · Excellent performance.' },
  { date: 'May 28',    title: 'Injury Alert Cleared',    color: '#00d4aa', detail: 'Left quad monitoring concluded.' },
]

export const PAIN_TREND = [
  { day: 'Mon', pain: 3.8 }, { day: 'Tue', pain: 4.2 }, { day: 'Wed', pain: 3.5 },
  { day: 'Thu', pain: 2.9 }, { day: 'Fri', pain: 2.4 }, { day: 'Sat', pain: 2.0 }, { day: 'Sun', pain: 1.7 },
]

export const REHAB_PHASES = [
  { phase: 'Acute',     complete: true,  current: false, days: 3 },
  { phase: 'Sub-Acute', complete: true,  current: false, days: 5 },
  { phase: 'Rehab',     complete: false, current: true,  days: 8 },
  { phase: 'Strength',  complete: false, current: false, days: 6 },
  { phase: 'RTP',       complete: false, current: false, days: 4 },
]

export const WEARABLES = [
  { id: 1, name: 'WHOOP 4.0',         icon: '⌚', status: 'synced',  last: '2 min ago', battery: 82, color: '#00d4aa' },
  { id: 2, name: 'Garmin Forerunner', icon: '⌚', status: 'synced',  last: '5 min ago', battery: 67, color: '#4a9eff' },
  { id: 3, name: 'Oura Ring',         icon: '💍', status: 'offline', last: '2h ago',    battery: 15, color: '#ffb347' },
]

export const AI_RECOMMENDATIONS = [
  { icon: '💤', text: '10pm–6am sleep window for optimal recovery', tag: 'Sleep',    color: '#4a9eff' },
  { icon: '🏃', text: 'Zone 2 aerobic session, 30min — light load', tag: 'Training', color: '#00d4aa' },
  { icon: '💧', text: 'Increase hydration by 500ml today',          tag: 'Nutrition',color: '#a78bfa' },
  { icon: '🧘', text: '15min mobility work for left quad',          tag: 'Recovery', color: '#ffb347' },
]

export const STREAK_STATS = [
  { label: 'Current Streak',   value: '12 days', color: '#00d4aa' },
  { label: 'Best Streak',      value: '24 days', color: '#4a9eff' },
  { label: 'Sessions / Month', value: '18',      color: '#a78bfa' },
  { label: 'Check-in Rate',    value: '92%',     color: '#ffb347' },
]
