# ⚡ APEX Recovery OS

**AI-Powered Athlete Recovery SaaS Platform**

A production-grade React + Vite frontend for managing athlete recovery, physio rehab workflows, and team coaching analytics — inspired by WHOOP, Oura, and Strava.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
apex-recovery/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/               # Reusable primitives
│   │   │   ├── Avatar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── RingScore.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Tag.jsx
│   │   │   └── Toggle.jsx
│   │   ├── charts/           # Recharts wrappers
│   │   │   ├── ChartTooltip.jsx
│   │   │   ├── InjuryPieChart.jsx
│   │   │   ├── LoadChart.jsx
│   │   │   ├── RecoveryTrendChart.jsx
│   │   │   └── TeamRadarChart.jsx
│   │   ├── dashboard/        # Feature-specific components
│   │   │   ├── AthleteRow.jsx
│   │   │   ├── BodyMap.jsx
│   │   │   ├── RehabPhaseTracker.jsx
│   │   │   ├── WearableCard.jsx
│   │   │   └── WellnessCheckin.jsx
│   │   └── layout/           # App shell components
│   │       ├── NotifPanel.jsx
│   │       ├── Sidebar.jsx
│   │       └── TopBar.jsx
│   ├── context/
│   │   └── AppContext.jsx     # Role, sidebar, notif state
│   ├── data/
│   │   └── mockData.js        # Typed mock data (swap for API)
│   ├── hooks/
│   │   └── useRecovery.js     # React Query hooks (all modules)
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── HomePage.jsx       # Role-aware router
│   │   ├── AthleteDashboard.jsx
│   │   ├── CoachDashboard.jsx
│   │   ├── PhysioDashboard.jsx
│   │   ├── WellnessPage.jsx
│   │   ├── TimelinePage.jsx
│   │   ├── AIReportsPage.jsx
│   │   ├── InjuryAnalyticsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/
│   │   └── api.js             # Centralized Axios service layer
│   ├── utils/
│   │   └── helpers.js         # scoreColor, riskColor, cn, etc.
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

---

## 🎭 Role Switching

Switch between the three dashboard roles from the TopBar:

| Role | Icon | Dashboard |
|------|------|-----------|
| **Athlete** | ⚡ | Daily readiness, body map, wearables, AI recs |
| **Coach** | 🏆 | Team readiness, risk filters, load analytics |
| **Physiotherapist** | 🏥 | Injury tracking, rehab phases, RTP readiness |

---

## 🔌 Connecting a Real Backend

1. Set your API base URL in `.env`:
   ```
   VITE_API_BASE_URL=https://your-api.com/api
   ```

2. All API calls are centralized in `src/services/api.js` — swap mock data for real hooks in `src/hooks/useRecovery.js`.

3. Replace `mockData.js` imports in each page with the corresponding React Query hook.

4. Add JWT handling in the request interceptor (already scaffolded in `api.js`).

---

## 🛠 Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion v11 |
| Charts | Recharts v2 |
| Data fetching | TanStack React Query v5 |
| HTTP client | Axios v1 |
| State | Context API |

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

Output is in `dist/` — deploy to Vercel, Netlify, or any static host.
