# Testing Guide - Physiotherapist Recovery Panel

## 🧪 COMPLETE TESTING CHECKLIST

---

## PART 1: SETUP & PREREQUISITES

### 1. Start the Backend
```bash
cd Backend
npm start
```
Expected: Server runs on http://localhost:5000

### 2. Start the Frontend
```bash
cd Frontend
npm run dev
```
Expected: Frontend runs on http://localhost:5173

### 3. Verify MongoDB Connection
- Open MongoDB Compass or mongo shell
- Check `athlete_recovery` database exists
- Should see collections: users, athleteprofiles, recoverycases, etc.

---

## PART 2: BACKEND API TESTING

### Using Postman

1. **Import Collection**
   - Open Postman
   - File → Import → Select `Backend/postman/AthleteRecovery.postman_collection.json`
   - Import environment: `Backend/postman/AthleteRecovery.postman_environment.json`

2. **Authentication Setup**
   - Ensure a user exists in database (physiotherapist role)
   - Get JWT token by logging in via `/auth/login`
   - Add token to Authorization header in Postman

### Test Each Endpoint Group

#### A. Recovery Cases Endpoints

**1. Create a Recovery Case**
```
POST /api/v1/recovery/cases
Body (JSON):
{
  "athleteId": "{{existing_athlete_id}}",
  "injury": "ACL Tear",
  "injuryDate": "2026-06-01",
  "recoveryPhase": "Acute Care",
  "expectedReturnDate": "2026-09-01",
  "painScore": 8,
  "readinessScore": 20,
  "assignedPhysio": "{{current_user_id}}"
}
```
✅ Expected: 201 Created, returns recovery case object

**2. Get All Recovery Cases**
```
GET /api/v1/recovery/cases
Query Params:
  - page=1
  - limit=10
  - phase=Acute Care (optional)
  - status=In Progress (optional)
  - search=athlete_name (optional)
```
✅ Expected: 200 OK, returns paginated array of cases

**3. Get Specific Recovery Case**
```
GET /api/v1/recovery/cases/{{case_id}}
```
✅ Expected: 200 OK, returns single case object

**4. Update Recovery Case**
```
PATCH /api/v1/recovery/cases/{{case_id}}
Body (JSON):
{
  "painScore": 5,
  "readinessScore": 50,
  "notes": "Pain decreasing, patient doing well"
}
```
✅ Expected: 200 OK, returns updated case

**5. Update Recovery Phase**
```
PATCH /api/v1/recovery/cases/{{case_id}}/phase
Body (JSON):
{
  "phase": "Mobility",
  "notes": "Ready to move to mobility phase"
}
```
✅ Expected: 200 OK, phaseHistory should contain new entry

**6. Get Athlete's Recovery Cases**
```
GET /api/v1/recovery/athlete/{{athlete_id}}
```
✅ Expected: 200 OK, returns array of cases for that athlete

#### B. Exercise Management

**1. Create Exercise**
```
POST /api/v1/recovery/{{case_id}}/exercises
Body (JSON):
{
  "name": "Quadriceps Strengthening",
  "type": "strengthening",
  "sets": 3,
  "reps": 15,
  "duration": 30,
  "instructions": "Perform slow, controlled movements"
}
```
✅ Expected: 201 Created, returns exercise object

**2. Get Exercises for Case**
```
GET /api/v1/recovery/{{case_id}}/exercises
```
✅ Expected: 200 OK, returns array of exercises

**3. Complete Exercise**
```
POST /api/v1/recovery/exercises/{{exercise_id}}/complete
Body (JSON):
{
  "painDuringExercise": 3
}
```
✅ Expected: 200 OK, isCompleted = true, compliance % updated

**4. Update Exercise**
```
PATCH /api/v1/recovery/exercises/{{exercise_id}}
Body (JSON):
{
  "reps": 20,
  "instructions": "Updated instructions"
}
```
✅ Expected: 200 OK, returns updated exercise

**5. Delete Exercise**
```
DELETE /api/v1/recovery/exercises/{{exercise_id}}
```
✅ Expected: 200 OK, returns success message

#### C. Progress Tracking

**1. Create Progress Entry**
```
POST /api/v1/recovery/{{case_id}}/progress
Body (JSON):
{
  "painScore": 4,
  "mobilityScore": 60,
  "strengthScore": 45,
  "notes": "Good progress this week"
}
```
✅ Expected: 201 Created, returns progress entry

**2. Get Progress Entries**
```
GET /api/v1/recovery/{{case_id}}/progress
```
✅ Expected: 200 OK, returns array of entries

**3. Get Pain Trend**
```
GET /api/v1/recovery/{{case_id}}/pain-trend?days=30
```
✅ Expected: 200 OK, returns array of {date, painScore} objects

**4. Get Progress Summary**
```
GET /api/v1/recovery/{{case_id}}/progress-summary
```
✅ Expected: 200 OK, returns summary stats

#### D. RTP (Return To Play)

**1. Get RTP Candidates**
```
GET /api/v1/recovery/rtp-candidates
```
✅ Expected: 200 OK, returns athletes eligible for RTP evaluation
- Should check: pain ≤ 2, compliance ≥ 85%, phase = "Return To Play"

**2. Approve RTP**
```
POST /api/v1/recovery/cases/{{case_id}}/approve-rtp
Body (JSON):
{
  "notes": "Cleared for full return to play"
}
```
✅ Expected: 200 OK, rtpApproved = true

#### E. Analytics

**1. Get Alerts**
```
GET /api/v1/recovery/alerts
```
✅ Expected: 200 OK, returns 4 types of alerts:
- Pain Increased
- Missed Exercises
- No Recovery Updates
- Recovery Delayed

**2. Get Dashboard Stats**
```
GET /api/v1/recovery/stats
```
✅ Expected: 200 OK, returns:
- totalCases
- activePlans
- rtpCandidates
- overdueRecoveries

---

## PART 3: FRONTEND COMPONENT TESTING

### Manual Testing in Browser

#### 1. Navigation & Authentication
- [ ] Open http://localhost:5173
- [ ] Login with physiotherapist account
- [ ] Should be redirected to dashboard

#### 2. PhysioRecoveryPage - Overview Tab
```
URL: /physio/recovery (or /physio/dashboard)
```

**RecoveryStats Component**
- [ ] 4 stat cards appear
- [ ] Numbers update when data loads
- [ ] Cards have hover animations
- [ ] Loading skeletons show initially

**RecoveryCasesTable Component**
- [ ] Table loads with recovery cases
- [ ] Search field works (try athlete name)
- [ ] Phase filter works
- [ ] Status filter works
- [ ] Pagination works (if >10 cases)
- [ ] Color coding appears:
  - Pain: Red (>5), Yellow (3-5), Green (≤2)
  - Phase: Different color per phase
  - Status: Color per status type

**RecoveryAlerts Component**
- [ ] Alerts display with priority colors
- [ ] 4 alert type icons appear
- [ ] Alert count cards show
- [ ] Can see athlete names in alerts
- [ ] Timestamps display correctly

**RTPCandidates Component**
- [ ] Shows athletes ready for RTP
- [ ] Eligibility checklist displays
- [ ] Approve RTP button works
- [ ] Status updates after approval

#### 3. PhysioRecoveryPage - Recovery Cases Tab
- [ ] Full cases table displays
- [ ] All filtering/search works
- [ ] Pagination functions properly
- [ ] Can click rows (if click handler exists)

#### 4. PhysioRecoveryPage - RTP Tab
- [ ] RTP candidates display
- [ ] Can approve RTP
- [ ] Approval updates immediately
- [ ] Info message shows after approval

#### 5. PhysioRecoveryPage - Alerts Tab
- [ ] All alerts display in list
- [ ] Sorted by priority (Critical → Warning → Info)
- [ ] Statistics cards at top
- [ ] "All Clear" message if no alerts
- [ ] Auto-refreshes every 5 minutes

---

## PART 4: FEATURE-SPECIFIC TESTING

### A. Recovery Case Workflow
```
1. Create recovery case
   POST /api/v1/recovery/cases
   ✅ Check database: RecoveryCases collection

2. Assign exercises
   POST /api/v1/recovery/{{case_id}}/exercises
   ✅ Create 3-4 exercises

3. Create progress entries
   POST /api/v1/recovery/{{case_id}}/progress
   ✅ Create 3-5 entries with different dates

4. Complete exercises
   POST /api/v1/recovery/exercises/{{exercise_id}}/complete
   ✅ Complete 2-3 exercises
   ✅ Check compliance % increases

5. Update phase
   PATCH /api/v1/recovery/cases/{{case_id}}/phase
   ✅ Move through 2-3 phases
   ✅ Check phaseHistory array in database

6. Approve RTP
   POST /api/v1/recovery/cases/{{case_id}}/approve-rtp
   ✅ Check rtpApproved = true
```

### B. Pain Monitoring Workflow
```
1. Create recovery case with initialPainScore = 8
2. Create 5 progress entries with decreasing pain:
   - Day 1: 8
   - Day 2: 7
   - Day 3: 6
   - Day 4: 5
   - Day 5: 4

3. Get pain trend:
   GET /api/v1/recovery/{{case_id}}/pain-trend?days=30
   ✅ Should return array of 5 points
   ✅ Frontend: PainTrendChart should show downward line
   ✅ Check "Improving" status appears
```

### C. Exercise Compliance Workflow
```
1. Create recovery case
2. Create 5 exercises
3. Complete exercises one by one
4. After each completion, check:
   - Compliance % in response
   - Should increase: 20%, 40%, 60%, 80%, 100%

5. In ExerciseManager component:
   ✅ Progress bar updates smoothly
   ✅ Colors change: Red → Yellow → Green
   ✅ Completed exercises have strikethrough
```

### D. Alert Generation Workflow
```
1. Create recovery case
2. Check GET /api/v1/recovery/alerts
   ✅ Should be empty or minimal

3. Trigger Pain Increased alert:
   - Update case painScore from 3 → 8
   - GET alerts again
   ✅ "Pain Increased" alert appears

4. Trigger Missed Exercises alert:
   - Create exercises
   - Don't complete them
   - Create progress entry with old date
   - GET alerts
   ✅ "Missed Exercises" alert appears

5. In RecoveryAlerts component:
   ✅ New alerts display
   ✅ Correct priority colors
   ✅ Correct icons
```

---

## PART 5: DATA VALIDATION TESTING

### A. Recovery Case Validation
```
Test Invalid Data:

1. Missing required fields
   POST /api/v1/recovery/cases
   Body: { injury: "ACL" }  // Missing athleteId, phase, etc.
   ✅ Should return 400 Bad Request with validation error

2. Invalid phase
   Body: { phase: "Invalid Phase" }
   ✅ Should return 400 Bad Request

3. Invalid pain score (outside 0-10)
   Body: { painScore: 15 }
   ✅ Should return 400 Bad Request

4. Invalid readiness (outside 0-100)
   Body: { readinessScore: 150 }
   ✅ Should return 400 Bad Request
```

### B. Exercise Validation
```
1. Missing exercise type
   POST /api/v1/recovery/{{case_id}}/exercises
   Body: { name: "Test" }  // Missing type, sets, reps
   ✅ Should return 400 Bad Request

2. Invalid type
   Body: { type: "invalid_type" }
   ✅ Should return 400 Bad Request

3. Negative sets/reps
   Body: { sets: -1, reps: 0 }
   ✅ Should return 400 Bad Request
```

---

## PART 6: ERROR HANDLING TESTING

### A. Database Errors
```
1. Get non-existent case
   GET /api/v1/recovery/cases/invalid_id
   ✅ Should return 404 Not Found

2. Update non-existent case
   PATCH /api/v1/recovery/cases/invalid_id
   ✅ Should return 404 Not Found

3. Delete non-existent exercise
   DELETE /api/v1/recovery/exercises/invalid_id
   ✅ Should return 404 Not Found
```

### B. Authorization Errors
```
1. Test without token
   GET /api/v1/recovery/cases
   Headers: (no Authorization)
   ✅ Should return 401 Unauthorized

2. Test with invalid token
   GET /api/v1/recovery/cases
   Headers: Authorization: Bearer invalid_token
   ✅ Should return 401 Unauthorized

3. Test wrong role (athlete accessing physio endpoint)
   GET /api/v1/recovery/cases
   With athlete token
   ✅ Should return 403 Forbidden
```

---

## PART 7: FRONTEND UI/UX TESTING

### A. Loading States
- [ ] Stat cards show skeleton loaders initially
- [ ] Table shows loading animation while fetching
- [ ] Components show loading text/spinner
- [ ] Buttons show loading state during mutation

### B. Error States
- [ ] Error messages display in console
- [ ] UI gracefully handles errors
- [ ] Can retry after error
- [ ] Error doesn't crash page

### C. Animations
- [ ] Tab transitions are smooth
- [ ] Card entrance animations work
- [ ] Hover effects on interactive elements
- [ ] Phase tracker animation smooth
- [ ] Timeline animations staggered

### D. Responsiveness
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] All tables stack on mobile
- [ ] All buttons clickable on touch

### E. Colors & Contrast
- [ ] Pain scores properly color-coded
- [ ] Phase colors distinct
- [ ] Status colors clear
- [ ] Alert priority colors visible
- [ ] Text readable on all backgrounds

---

## PART 8: PERFORMANCE TESTING

### A. Load Testing
```
1. Create 50+ recovery cases
2. Load cases list
   ✅ Should load and paginate smoothly
   ✅ Should not freeze browser

3. Create 100+ progress entries
4. Load pain trend chart
   ✅ Should render smoothly
   ✅ No lag on interactions
```

### B. Cache Testing
```
1. Load recovery cases
2. Wait 5 minutes (cache stale time)
3. Load again
   ✅ Should refetch from API (not cache)

4. Load alerts
5. Wait 1 minute
   ✅ Should refetch automatically
```

### C. Search Performance
```
1. Type in search field
2. Search through 50+ cases
   ✅ Should be instant/responsive
   ✅ No lag while typing
```

---

## PART 9: INTEGRATION TESTING

### A. Complete Recovery Journey
```
Flow:
1. Physio creates recovery case for athlete
2. Physio assigns 5 exercises
3. Athlete completes exercises over 1 week
4. Physio checks pain trends (should improve)
5. Physio checks compliance (should increase)
6. When ready, physio approves RTP
7. Athlete is marked as RTP

Check:
✅ All data flows correctly
✅ UI updates in real-time
✅ Database records all steps
✅ No data loss
✅ All calculations correct
```

### B. Multi-User Testing
```
1. Create 3 physiotherapist users
2. Each creates recovery cases
3. Each can only see their own cases
   ✅ Isolation works properly
   ✅ No cross-user data leaks

4. Coach views shared data
   ✅ Can see assigned cases
   ✅ Cannot modify
```

---

## QUICK TESTING CHECKLIST

### In 5 Minutes
- [ ] Backend runs: `npm start` in Backend/
- [ ] Frontend runs: `npm run dev` in Frontend/
- [ ] Can login to dashboard
- [ ] Recovery cases table loads
- [ ] Can see 4 stat cards
- [ ] Can see alerts

### In 15 Minutes
- [ ] Create a recovery case via Postman
- [ ] Create an exercise
- [ ] Complete the exercise
- [ ] Check compliance % updated
- [ ] Create progress entry
- [ ] View pain trend chart

### In 30 Minutes
- [ ] Full recovery workflow (create → exercise → progress → phase → RTP)
- [ ] Test all tabs on dashboard
- [ ] Test search and filters
- [ ] Test error cases (invalid data)
- [ ] Check animations and responsiveness

### In 1 Hour
- [ ] All API endpoints tested
- [ ] All components tested
- [ ] Authorization tested
- [ ] Error handling tested
- [ ] Performance verified

---

## DEBUGGING TIPS

### Backend Issues
```
1. Check console for errors
2. Verify MongoDB connection: 
   mongosh athlete_recovery
3. Check token in request:
   Authorization: Bearer {{token}}
4. Verify user has physio role:
   db.users.findOne({_id: ObjectId("...")})
```

### Frontend Issues
```
1. Open DevTools (F12)
2. Check Console tab for JS errors
3. Check Network tab for API calls
4. Check React Query DevTools (if installed)
5. Check localStorage for token:
   localStorage.getItem('token')
```

### React Query Cache Issues
```
1. Open DevTools
2. Check if data is cached:
   Navigate away and back, should be instant
3. Force refetch:
   Ctrl+R (hard refresh)
4. Clear cache:
   localStorage.clear()
```

---

## EXPECTED RESULTS SUMMARY

✅ All 21 API endpoints respond correctly
✅ All CRUD operations work (Create, Read, Update, Delete)
✅ All filters and search work
✅ Pagination works with >10 items
✅ Authorization blocks unauthorized users
✅ Validation rejects invalid data
✅ Errors return proper status codes (4xx, 5xx)
✅ Frontend components render without errors
✅ Data flows from backend → frontend correctly
✅ Compliance calculations are accurate
✅ Pain trend shows correct visualization
✅ Alerts generate for appropriate conditions
✅ RTP eligibility checks pass/fail correctly
✅ Animations are smooth and responsive
✅ Mobile/tablet/desktop layouts work
✅ No console errors

---

**Happy Testing! 🧪**

If you encounter any issues, reference this guide and the RECOVERY_IMPLEMENTATION_GUIDE.md for troubleshooting.
