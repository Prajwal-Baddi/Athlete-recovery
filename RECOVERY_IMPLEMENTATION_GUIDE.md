# Physiotherapist Recovery Panel - Implementation Guide

## Overview

A complete production-grade recovery management system for physiotherapists to manage athlete recovery cases, track pain progression, manage rehabilitation exercises, and evaluate return-to-play (RTP) eligibility.

## What Was Built

### Backend

#### Models
- **RecoveryCase.js** - Main model representing a recovery case for an athlete
  - Tracks recovery phases, pain scores, readiness
  - Manages phase history
  - Stores RTP approval status
  - Links athlete, physio, and coach

#### Services (`recoveryService.js`)
- Recovery case management (CRUD operations)
- Pain trend analysis
- Exercise management and compliance tracking
- RTP eligibility evaluation
- Alert generation for physios
- Dashboard statistics

#### Controllers (`recoveryController.js`)
- HTTP request handlers for all recovery operations
- Error handling via asyncHandler wrapper
- Response formatting via apiResponse utilities

#### Routes (`recoveryRoutes.js`)
- RESTful endpoints with proper HTTP methods
- Role-based authorization (physiotherapist, coach, athlete)
- Request validation support ready

### Frontend

#### Services (`services/recoveryService.js`)
- Axios-based API client
- All endpoints exported as individual functions
- Proper error handling and response parsing

#### Hooks (`hooks/useRecovery.js`)
- React Query hooks for all operations
- Query key factory for cache management
- Mutations for create/update/delete operations
- Automatic cache invalidation
- Refetch intervals for real-time data (alerts, stats)

#### Components

**RecoveryStats.jsx**
- 4 animated cards showing dashboard summary
- Total recovery cases
- Active recovery plans
- RTP candidates
- Overdue cases
- Glassmorphism design with animations

**RecoveryCasesTable.jsx**
- Comprehensive table with sortable/filterable data
- Search by athlete name or injury
- Filter by recovery phase or status
- Pagination support
- Color-coded pain scores and readiness scores
- Last updated dates

**RecoveryPhaseTracker.jsx**
- Visual step progress UI showing 5 recovery phases
- Click to update phase with notes
- Phase history timeline
- Color-coded completion status

**PainTrendChart.jsx**
- Line chart using Recharts (last 30 days)
- Current vs previous pain score
- Pain improvement percentage
- Status indicator (Improving, Stable, Worsening)
- Interactive tooltips

**ExerciseManager.jsx**
- Compliance progress bar
- Create new exercises with form
- Exercise types: stretch, strengthening, cardio, mobility, balance
- Mark exercises as completed with pain score tracking
- Delete exercises
- Real-time compliance percentage updates

**RecoveryTimeline.jsx**
- Chronological event display
- Phase transitions with dates
- Phase-specific notes
- Visual timeline with icons

**RTPCandidates.jsx**
- Display athletes eligible for RTP
- Eligibility criteria checklist
  - Pain Score ≤ 2
  - Compliance ≥ 85%
  - Recovery Phase = RTP
  - Readiness ≥ 80%
- RTP approval with notes
- Status indicators

**RecoveryAlerts.jsx**
- 4 alert types: Pain Increased, Missed Exercises, No Recovery Updates, Recovery Delayed
- 3 priority levels: Critical, Warning, Info
- Real-time alert generation
- Auto-refresh every 5 minutes
- Alert statistics

#### Pages

**PhysioRecoveryPage.jsx** (in `src/features/recovery/pages/`)
- Main dashboard with tabbed interface
- Overview tab: stats, alerts, recent cases
- Recovery Cases tab: full case management table
- RTP Evaluation tab: RTP candidates and approval
- Alerts tab: detailed alert view
- Responsive layout with smooth transitions

**PhysioDashboard.jsx** (updated in `src/pages/physio/`)
- Now redirects to PhysioRecoveryPage
- Maintains existing route structure

## API Endpoints

### Recovery Cases
```
GET    /api/v1/recovery/cases              # List all cases (with filters)
POST   /api/v1/recovery/cases              # Create new case
GET    /api/v1/recovery/cases/:id          # Get specific case
PATCH  /api/v1/recovery/cases/:id          # Update case
PATCH  /api/v1/recovery/cases/:id/phase    # Update recovery phase
GET    /api/v1/recovery/athlete/:athleteId # Get cases for athlete
```

### RTP Management
```
GET    /api/v1/recovery/rtp-candidates     # Get RTP candidates
POST   /api/v1/recovery/cases/:id/approve-rtp # Approve RTP
```

### Recovery Progress
```
GET    /api/v1/recovery/:caseId/progress   # Get progress entries
POST   /api/v1/recovery/:caseId/progress   # Create progress entry
GET    /api/v1/recovery/:caseId/pain-trend # Get pain trend (7-30 days)
GET    /api/v1/recovery/:caseId/progress-summary # Get overall progress
```

### Exercises
```
GET    /api/v1/recovery/:caseId/exercises  # List exercises
POST   /api/v1/recovery/:caseId/exercises  # Create exercise
PATCH  /api/v1/recovery/exercises/:id      # Update exercise
POST   /api/v1/recovery/exercises/:id/complete # Mark complete
DELETE /api/v1/recovery/exercises/:id      # Delete exercise
```

### Analytics
```
GET    /api/v1/recovery/alerts             # Get physio alerts
GET    /api/v1/recovery/stats              # Get dashboard stats
```

## Usage Examples

### Creating a Recovery Case
```javascript
const { mutate: createCase } = useCreateRecoveryCase();

await createCase({
  athleteId: 'athlete_id',
  injury: 'ACL Tear',
  injuryDate: new Date(),
  recoveryPhase: 'Acute Care',
  assignedPhysio: user._id,
});
```

### Updating Recovery Phase
```javascript
const { mutate: updatePhase } = useUpdateRecoveryPhase();

await updatePhase({
  id: caseId,
  phase: 'Mobility',
  notes: 'Pain reduced, starting mobility exercises',
});
```

### Creating an Exercise
```javascript
const { mutate: createExercise } = useCreateExercise();

await createExercise({
  caseId: recoveryCase._id,
  data: {
    name: 'Quadriceps Strengthening',
    type: 'strengthening',
    sets: 3,
    reps: 15,
    duration: 30,
    instructions: 'Perform slow, controlled movements',
  },
});
```

### Completing an Exercise
```javascript
const { mutate: completeExercise } = useCompleteExercise();

await completeExercise({
  exerciseId: exercise._id,
  data: {
    painDuringExercise: 3, // 0-10 scale
  },
});
```

### Getting Pain Trends
```javascript
const { data: painTrend } = usePainTrend(caseId, 30); // Last 30 days

// Returns array of {date, painScore} objects
```

### Approving RTP
```javascript
const { mutate: approveRTP } = useApproveRTP();

await approveRTP({
  id: caseId,
  notes: 'Athlete cleared for full return to play',
});
```

## Architecture

### Data Flow
1. Components dispatch mutations/queries via React Query hooks
2. Hooks call axios service layer functions
3. Axios functions make HTTP requests to backend
4. Backend controllers delegate to services
5. Services handle business logic and database operations
6. Responses flow back through the chain

### Caching Strategy
- Recovery cases: 5-minute stale time
- Pain trends: 5-minute stale time
- Alerts: 1-minute stale time, auto-refetch every 5 minutes
- Stats: 1-minute stale time, auto-refetch every 5 minutes

### Error Handling
- Backend: asyncHandler wraps all controller functions
- Frontend: Query/mutation errors accessible via `error` property
- UI: Toast notifications can be added for user feedback

## UI/UX Features

### Modern Design
- Glassmorphism cards with backdrop blur
- Smooth Framer Motion animations
- Responsive grid layouts
- Color-coded status indicators
- Professional medical theme

### Responsive Design
- Mobile-first approach
- Tablet-optimized tables
- Desktop multi-column layouts
- Touch-friendly buttons (min 44x44px)

### Real-time Updates
- Auto-refetching for alerts and stats
- Optimistic updates for mutations
- Proper loading/error states
- Skeleton loaders for async data

## Production Checklist

✅ Models created with validation
✅ Services with business logic
✅ Controllers with error handling
✅ Routes with authorization
✅ Frontend components with animations
✅ React Query hooks with cache management
✅ Axios service layer
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Type-safe operations
✅ Documentation

## Future Enhancements

1. **Advanced Analytics**
   - Pain reduction trends by phase
   - Compliance correlations
   - Readiness prediction modeling

2. **Mobile App**
   - React Native implementation
   - Offline support

3. **Notifications**
   - Email alerts for physios
   - SMS notifications for athletes
   - Push notifications

4. **Integration**
   - Wearable device data (heart rate, sleep)
   - Video exercise library
   - AI-powered form correction

5. **Reporting**
   - PDF recovery reports
   - Progress summaries for athletes
   - Quarterly performance analysis

## Troubleshooting

### API Not Responding
1. Check backend is running: `npm start` in Backend/
2. Verify MongoDB connection
3. Check environment variables (`.env` file)

### Components Not Rendering
1. Verify React Query is configured in App.jsx
2. Check AuthContext is providing user data
3. Look for console errors

### Data Not Updating
1. Check network tab in DevTools
2. Verify API responses return expected structure
3. Check query key setup in hooks

### Styling Issues
1. Verify Tailwind CSS is installed
2. Check for conflicting CSS
3. Clear browser cache

## Support

For issues or questions:
1. Check the console for error messages
2. Review network requests in DevTools
3. Verify data structure matches API response
4. Check database for data integrity

---

**Implementation Date:** 2026-06-06
**Version:** 1.0.0
**Status:** Production Ready
