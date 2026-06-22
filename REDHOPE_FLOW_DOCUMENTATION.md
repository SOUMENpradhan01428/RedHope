# RedHope - Complete Application Flow Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Models](#4-database-models)
5. [Backend Architecture](#5-backend-architecture)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Authentication Flow](#7-authentication-flow)
8. [Donor Flow](#8-donor-flow)
9. [Hospital Flow](#9-hospital-flow)
10. [Admin Flow](#10-admin-flow)
11. [Messaging & Notifications](#11-messaging--notifications)
12. [Gamification System](#12-gamification-system)
13. [API Reference](#13-api-reference)

---

## 1. Project Overview

RedHope is a full-stack blood donation management platform that connects **Donors**, **Hospitals**, and **Admins**. It features real-time blood request matching, donation camp management, a gamification/rewards system, messaging, and analytics dashboards.

### Three User Roles

| Role | Purpose |
|------|---------|
| **Donor** | Browse & respond to blood requests, register for camps, earn points, redeem rewards |
| **Hospital** | Manage blood inventory, broadcast blood requests, confirm donations |
| **Admin** | Approve hospitals, manage camps & rewards, view analytics & reports |

---

## 2. Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS 3.4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Recharts 3.8 | Charts & graphs |
| Leaflet + React-Leaflet | Interactive maps |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |
| Material-UI | Avatar component |

---

## 3. Project Structure

```
RedHope/
├── Backend/
│   ├── Server.js                    # Express server entry point
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── Middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── adminMiddleware.js       # Admin role check
│   ├── Models/
│   │   ├── User.js                  # Donor, Hospital, Admin
│   │   ├── BloodRequest.js          # Hospital blood requests
│   │   ├── BloodStock.js            # Hospital inventory
│   │   ├── BloodInventory.js        # Blood inventory tracking
│   │   ├── Camp.js                  # Donation camps
│   │   ├── CampRegistration.js      # Donor camp registrations
│   │   ├── Reward.js                # Redeemable rewards
│   │   ├── Conversation.js          # Message threads
│   │   ├── Message.js               # Individual messages
│   │   └── Notification.js          # System notifications
│   ├── Controllers/
│   │   ├── authController.js        # Login, Register, Profile
│   │   ├── donorController.js       # Donor dashboard & actions
│   │   ├── hospitalController.js    # Hospital dashboard & actions
│   │   ├── adminController.js       # Admin dashboard, analytics, reports
│   │   ├── messageController.js     # Messaging system
│   │   ├── notificationController.js# Notification management
│   │   ├── requestController.js     # Blood request operations
│   │   └── inventoryController.js   # Inventory management
│   ├── Routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── hospitalRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── messageRoutes.js
│   │   └── notificationRoutes.js
│   └── utils/
│       ├── gamification.js          # Point awarding logic
│       ├── seedRewards.js           # Seed default rewards
│       ├── recalculatePoints.js     # Recalculate user points
│       └── clearRequests.js         # Utility to clear requests
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                  # Router & lazy-loaded routes
│   │   ├── main.jsx                 # Entry point with providers
│   │   ├── index.css                # Tailwind base styles
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   └── ThemeContext.jsx     # Dark mode state
│   │   ├── services/
│   │   │   └── api.js               # All API endpoint functions
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Public home page
│   │   │   ├── login.jsx            # Login & Register
│   │   │   ├── Welcome/WelcomeScreen.jsx
│   │   │   ├── Profile/Profile.jsx
│   │   │   ├── Notifications/Notifications.jsx
│   │   │   ├── Messages/Messages.jsx
│   │   │   ├── DonorDashboard/DonorDashboard.jsx
│   │   │   ├── Hospital/Hospital.jsx
│   │   │   └── AdminDashboard/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── SystemOverview.jsx
│   │   │       ├── UserManagement.jsx
│   │   │       ├── Analytics.jsx
│   │   │       └── Reports.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── MapPicker.jsx
│   │       ├── WelcomeOverlay.jsx
│   │       ├── ConfirmModal.jsx
│   │       ├── LoadingFallback.jsx
│   │       ├── Donor/
│   │       │   ├── UrgentBloodRequests.jsx
│   │       │   ├── BloodRequestsNearYou.jsx
│   │       │   ├── DonationProgress.jsx
│   │       │   ├── DonationCamps.jsx
│   │       │   ├── UpcomingRegisteredCamps.jsx
│   │       │   ├── DonationHistory.jsx
│   │       │   ├── RewardSection.jsx
│   │       │   └── Leaderboard.jsx
│   │       └── Admin/
│   │           ├── HospitalApprovals.jsx
│   │           ├── CampApprovals.jsx
│   │           ├── ManageRewards.jsx
│   │           ├── camprequest.jsx
│   │           ├── UserTable.jsx
│   │           ├── DonationTrendsChart.jsx
│   │           ├── UserGrowthChart.jsx
│   │           ├── DistributionPieChart.jsx
│   │           ├── ActivityBarChart.jsx
│   │           └── RegionalChart.jsx
│   └── tailwind.config.js
```

---

## 4. Database Models

### 4.1 User

Shared model for all three roles. Role-specific fields are conditionally used.

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Required, unique, lowercase |
| password | String | Required, bcrypt hashed |
| role | String | `"Donor"` / `"Hospital"` / `"Admin"` |
| status | String | `"Pending"` / `"Approved"` / `"Rejected"` (default: Approved) |
| **Donor-only** | | |
| bloodGroup | String | e.g. "A+", "O-" |
| totalPoints | Number | Gamification points |
| level | String | `"Bronze"` / `"Silver"` / `"Gold"` / `"Platinum"` |
| badges | Array | `[{ name, description, points, earnedAt }]` |
| redeemedRewards | Array | `[{ rewardId, redeemedAt }]` |
| **Hospital-only** | | |
| hospitalName | String | Display name of hospital |
| licenseNumber | String | Medical license |
| **Shared location** | | |
| phone | String | |
| address | String | |
| city | String | |
| region | String | `"North"` / `"South"` / `"East"` / `"West"` |
| latitude | Number | GPS coordinate |
| longitude | Number | GPS coordinate |

### 4.2 BloodRequest

Created by hospitals to broadcast blood needs.

| Field | Type | Notes |
|-------|------|-------|
| hospital | ObjectId → User | Creating hospital |
| hospitalName | String | Denormalized name |
| bloodType | String | e.g. "A+", "O-" |
| units | Number | Units needed |
| details | String | Patient/case details |
| location.address | String | |
| location.lat | Number | GPS |
| location.lng | Number | GPS |
| urgency | String | `"critical"` / `"high"` / `"medium"` / `"low"` |
| status | String | `"open"` / `"fulfilled"` / `"cancelled"` |
| respondedBy | Array | `[{ donorId, name, phone, bloodType, respondedAt }]` |

### 4.3 BloodStock

Per-hospital inventory by blood type. Unique index on `(hospital, bloodType)`.

| Field | Type | Notes |
|-------|------|-------|
| hospital | ObjectId → User | |
| bloodType | String | One of 8 blood types |
| currentUnits | Number | Current stock |
| minimumUnits | Number | Alert threshold (default: 10) |

### 4.4 Camp

Blood donation camp events created by admins.

| Field | Type | Notes |
|-------|------|-------|
| name | String | Camp name |
| organizer | String | Organizing body |
| date | Date | Camp date |
| time | String | e.g. "09:00-17:00" |
| location | String | Venue |
| description | String | |
| totalSlots | Number | Max attendees (default: 50) |
| attendees | Array of ObjectId → User | Registered donors |
| status | String | `"upcoming"` / `"ongoing"` / `"completed"` / `"cancelled"` |
| createdBy | ObjectId → User | Admin who created it |

### 4.5 CampRegistration

Links a donor to a camp with health screening data.

| Field | Type | Notes |
|-------|------|-------|
| camp | ObjectId → Camp | |
| donor | ObjectId → User | |
| name | String | Donor's name |
| phone | String | |
| address | String | |
| bloodGroup | String | |
| healthDetails | Object | `{ isThalassemic, hasHepatitis, hasHighBloodPressure, hasDiabetes, hasSTD, isSmoker }` |
| status | String | `"registered"` / `"pending_completion"` / `"completed"` / `"rejected"` |
| attended | Boolean | Did the donor actually attend? |
| certificateUrl | String | Proof of donation |
| visitTiming | String | When they visited |
| feedback | String | Experience feedback |

### 4.6 Reward

Redeemable items in the reward store.

| Field | Type | Notes |
|-------|------|-------|
| name | String | Reward name |
| description | String | |
| pointsCost | Number | Points required to redeem |
| icon | String | Display icon |
| isActive | Boolean | Available for redemption |

### 4.7 Conversation & Message

| Conversation | | |
|------|------|-------|
| participants | Array of ObjectId → User | Two users |
| lastMessage | String | Preview text |
| updatedAt | Date | For sorting |

| Message | | |
|------|------|-------|
| conversation | ObjectId → Conversation | |
| sender | ObjectId → User | |
| content | String | Message text |

### 4.8 Notification

| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId → User | Recipient |
| title | String | |
| message | String | |
| type | String | `"success"` / `"warning"` / `"error"` / `"info"` |
| read | Boolean | |

---

## 5. Backend Architecture

### 5.1 Server Setup (`Server.js`)

```
Express App
├── cors() middleware
├── express.json() body parser
├── Route mounting:
│   /api/auth          → authRoutes
│   /api/dashboard     → dashboardRoutes
│   /api/requests      → requestRoutes
│   /api/admin         → adminRoutes
│   /api/hospital      → hospitalRoutes
│   /api/donor         → donorRoutes
│   /api/inventory     → inventoryRoutes
│   /api/notifications → notificationRoutes
│   /api/messages      → messageRoutes
└── Listen on PORT (default 5000)
```

### 5.2 Middleware

**authMiddleware.js** - Extracts JWT from `Authorization: Bearer <token>` header, verifies it, attaches `req.user` with `{ _id, role }`.

**adminMiddleware.js** - Runs after auth middleware. Checks `req.user.role === "Admin"`, returns 403 if not.

### 5.3 Request Lifecycle

```
Client Request
  → CORS check
  → JSON body parse
  → Route match
  → authMiddleware (verify JWT, attach req.user)
  → [adminMiddleware] (if admin route)
  → Controller function
  → MongoDB query via Mongoose
  → JSON response
```

---

## 6. Frontend Architecture

### 6.1 Routing (App.jsx)

All major pages are lazy-loaded with React.lazy() + Suspense.

```
Routes:
  /                → LandingPage           (public)
  /login           → Login                 (public)
  /welcome         → WelcomeScreen         (authenticated)
  /notifications   → Notifications         (authenticated)
  /profile         → Profile               (Donor, Hospital)
  /messages        → Messages              (Donor, Hospital)
  /donor           → DonorDashboard        (Donor only)
  /hospital        → Hospital              (Hospital only)
  /admin           → AdminDashboard        (Admin only)
```

**ProtectedRoute** wrapper checks:
1. Is user logged in? (redirect to `/login` if not)
2. Does user have the required role? (redirect to their own dashboard if not)

### 6.2 State Management

**AuthContext** (global):
- `user` object: `{ name, role }`
- `token`: JWT string
- `login(email, password)` → calls API, stores token + user in localStorage
- `register(formData)` → calls API, stores token + user
- `logout()` → clears localStorage, resets state

**ThemeContext** (global):
- `darkMode`: boolean from localStorage
- `toggleDarkMode()` → toggles and persists

**Component-level state**: Each page/component uses `useState` + `useEffect` for data fetching.

### 6.3 API Service Layer (`services/api.js`)

Centralized fetch wrapper with:
- Automatic `Authorization: Bearer <token>` header injection
- JSON content-type headers
- Error extraction from response body
- Methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`
- Role-specific exports: `authAPI`, `donorAPI`, `hospitalAPI`, `adminAPI`, `notificationAPI`, `messageAPI`

---

## 7. Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    REGISTRATION                         │
│                                                         │
│  User fills form (role-specific fields)                 │
│       │                                                 │
│       ▼                                                 │
│  POST /api/auth/register                                │
│       │                                                 │
│       ├─ Donor: status = "Approved" (instant access)    │
│       ├─ Hospital: status = "Pending" (needs approval)  │
│       └─ Admin: cannot register publicly                │
│       │                                                 │
│       ▼                                                 │
│  Backend hashes password with bcrypt                    │
│  Creates User document in MongoDB                       │
│  Returns JWT token + user object                        │
│       │                                                 │
│       ▼                                                 │
│  Frontend stores token in localStorage                  │
│  Sets sessionStorage.showWelcome = true                 │
│  Redirects to /welcome                                  │
│       │                                                 │
│       ▼                                                 │
│  WelcomeScreen shows for 3.5s                           │
│  Auto-redirects to role dashboard                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      LOGIN                              │
│                                                         │
│  User enters email + password                           │
│       │                                                 │
│       ▼                                                 │
│  POST /api/auth/login                                   │
│       │                                                 │
│       ▼                                                 │
│  Backend verifies email exists                          │
│  Compares password with bcrypt                          │
│  Checks user.status (Hospitals must be "Approved")      │
│  Returns JWT token + user object                        │
│       │                                                 │
│       ▼                                                 │
│  Frontend stores token, redirects to dashboard          │
│                                                         │
│  Hospital with status "Pending" → shows popup:          │
│  "Your account is pending admin approval"               │
└─────────────────────────────────────────────────────────┘
```

### JWT Token Contents
```json
{
  "_id": "user_mongo_id",
  "role": "Donor|Hospital|Admin"
}
```

---

## 8. Donor Flow

### 8.1 Dashboard Overview

```
DonorDashboard
├── Stat Cards
│   ├── Total Donations (fulfilled requests + completed camps)
│   ├── Points Earned (totalPoints from gamification)
│   ├── Next Donation (days until 56-day cooldown ends)
│   └── Lives Saved (totalDonations * 3)
│
├── Eligibility Alert (if within 56-day cooldown)
│
├── Tabs
│   ├── Overview
│   │   ├── UpcomingRegisteredCamps (if any)
│   │   ├── UrgentBloodRequests (top 5 matching)
│   │   └── DonationProgress (level + badges)
│   │
│   ├── Blood Requests
│   │   └── BloodRequestsNearYou (map + list)
│   │
│   ├── Donation History
│   │   └── Table of past donations
│   │
│   ├── Donation Camps
│   │   ├── Available Camps (register)
│   │   └── Registered Camps (complete/track)
│   │
│   └── Rewards
│       ├── RewardSection (points, badges, store)
│       └── Leaderboard (top 10 donors)
```

### 8.2 Responding to a Blood Request

```
Hospital creates BloodRequest (status: "open")
       │
       ▼
Donor sees request in:
  - UrgentBloodRequests (top 5 by urgency + blood match)
  - BloodRequestsNearYou (map view, sorted by distance)
       │
       ▼
Donor clicks "Respond"
  POST /api/donor/respond-request/:requestId
       │
       ▼
Backend:
  - Adds donor to request.respondedBy[]
  - Creates notification for hospital
  - Returns success
       │
       ▼
Hospital sees responded donor in "My Requests" tab
Hospital clicks "Confirm Donation"
  POST /api/hospital/confirm-donation
       │
       ▼
Backend:
  - Awards points to donor (via gamification.js)
  - Updates request status if fulfilled
  - Sends notification to donor
```

### 8.3 Donation Camp Flow

```
Admin creates Camp (date, time, location, slots)
       │
       ▼
Donor sees camp in "Available Camps" tab
  (only camps where date+time has NOT passed)
  (hidden if donor has active registration)
  (hidden if camp date falls within 56-day cooldown)
       │
       ▼
Donor clicks "Apply" → Registration Modal opens
  - Fills: name, phone, address, blood group
  - Health questionnaire (6 yes/no checkboxes)
  POST /api/donor/camps/:campId/apply
       │
       ▼
Backend:
  - Creates CampRegistration (status: "registered")
  - Adds donor to camp.attendees[]
       │
       ▼
Camp date passes → "Complete Donation" button appears
       │
       ▼
Donor clicks "Complete Donation" → Completion Modal
       │
       ├── Checks "Did you attend?" → YES
       │     - Fills: visit timing, certificate URL, feedback
       │     - Submit → status = "pending_completion"
       │     - Goes to admin for approval
       │     - Admin approves → status = "completed", +100 points
       │
       └── Does NOT check "Did you attend?" → NO
             - Submit → status = "rejected" (instant, no admin needed)
             - Camp disappears from registered list
```

### 8.4 Blood Type Matching

Donors see blood requests that match their blood type compatibility:

```
Donor Blood Type → Can Donate To
─────────────────────────────────
O-               → All types (universal donor)
O+               → O+, A+, B+, AB+
A-               → A-, A+, AB-, AB+
A+               → A+, AB+
B-               → B-, B+, AB-, AB+
B+               → B+, AB+
AB-              → AB-, AB+
AB+              → AB+ only
```

---

## 9. Hospital Flow

### 9.1 Dashboard Overview

```
Hospital Dashboard
├── Stat Cards
│   ├── Current Stock (total units across all blood types)
│   ├── Critical Levels (blood types below minimum)
│   ├── Active Requests (open blood requests)
│   └── Fulfilled Requests (completed donations)
│
├── Tabs
│   ├── Overview
│   │   ├── Low Stock Alerts (blood types below threshold)
│   │   ├── Weekly Collection Chart (bar chart)
│   │   └── Blood Type Distribution (pie chart)
│   │
│   ├── My Requests
│   │   ├── List of all blood requests
│   │   ├── Responded donors per request
│   │   └── Confirm donation / Cancel request buttons
│   │
│   ├── Blood Stock
│   │   ├── Table: blood type, current units, minimum units
│   │   ├── Edit mode for updating stock levels
│   │   └── Export as CSV
│   │
│   └── + New Request
│       └── Form: blood type, units, urgency, location (map), details
```

### 9.2 Creating a Blood Request

```
Hospital fills "New Request" form
  - Selects blood type, units needed, urgency level
  - Picks location on map (auto-fills hospital address)
  - Adds patient/case details
       │
       ▼
POST /api/hospital/blood-request
       │
       ▼
Backend:
  - Creates BloodRequest (status: "open")
  - Stores location coordinates for distance calculations
       │
       ▼
Request appears to matching donors in:
  - UrgentBloodRequests component
  - BloodRequestsNearYou map view
```

### 9.3 Confirming a Donation

```
Donor responds to blood request
       │
       ▼
Hospital sees donor in request's "Responded" list
       │
       ▼
Hospital clicks "Confirm Donation"
  POST /api/hospital/confirm-donation
  Body: { requestId, donorId, bloodType, units }
       │
       ▼
Backend:
  - Updates request status
  - Calls awardPoints(donorId, points)
  - Sends notification to donor
  - Updates BloodStock if applicable
```

### 9.4 Hospital Approval Flow

```
Hospital registers on /login
       │
       ▼
User created with status: "Pending"
Login returns special flag → shows "Pending Approval" popup
       │
       ▼
Admin sees hospital in "Hospital Approvals" tab
  GET /api/admin/hospitals/pending
       │
       ├── Admin clicks "Approve"
       │   PUT /api/admin/hospitals/:id/status { status: "Approved" }
       │   → Hospital can now login and use dashboard
       │   → Notification sent: "Account Approved!"
       │
       └── Admin clicks "Reject"
           PUT /api/admin/hospitals/:id/status { status: "Rejected" }
           → Hospital cannot access dashboard
           → Notification sent: "Account Rejected"
```

---

## 10. Admin Flow

### 10.1 Dashboard Overview

```
Admin Dashboard
├── Stat Cards
│   ├── Total Users (donors + hospitals)
│   ├── Active Hospitals (role: Hospital count)
│   ├── Total Donations (fulfilled requests + completed camps)
│   └── System Health (100%)
│
├── Tabs
│   ├── System Overview
│   │   ├── Donation Trends (line chart: donations vs requests, 6 months)
│   │   ├── User Growth (area chart: cumulative users + bars for new)
│   │   └── Blood Type Distribution (interactive donut chart)
│   │
│   ├── Hospital Approvals
│   │   └── Pending hospital registrations → Approve/Reject
│   │
│   ├── Donation Approvals
│   │   └── Pending camp completion requests → Approve/Reject
│   │
│   ├── Camp Management
│   │   └── CRUD for donation camps
│   │
│   ├── User Management
│   │   ├── Filter by Donors / Hospitals
│   │   ├── Search by name/email
│   │   ├── Toggle user status (Approved/Rejected)
│   │   └── Delete user
│   │
│   ├── Rewards
│   │   └── CRUD for reward store items
│   │
│   ├── Analytics (5 charts)
│   │   ├── Donation Trends (ComposedChart: lines + area fills)
│   │   ├── User Growth (ComposedChart: area + bars)
│   │   ├── Blood Type Distribution (interactive donut)
│   │   ├── Peak Activity Hours (color-coded bar chart)
│   │   └── Regional Activity (bar chart by region)
│   │
│   └── Reports (5 report types)
│       ├── Donation Report (by blood type, by hospital)
│       ├── User Activity Report (top donors, role breakdown)
│       ├── Hospital Report (stock, requests, critical alerts)
│       ├── Blood Type Report (stock vs demand per type)
│       └── Regional Report (donors/hospitals per region)
```

### 10.2 Analytics Data Pipeline

```
Backend aggregates data from MongoDB using Mongoose aggregate():

Donation Trends:
  BloodRequest (status: "fulfilled", last 6 months, grouped by year-month)
  + CampRegistration (status: "completed", last 6 months)
  → Returns: [{ month, donations, requests }]

User Growth:
  User (last 6 months, grouped by year-month, split by role)
  + Cumulative count from before period
  → Returns: [{ month, users, newUsers, donors, hospitals }]

Blood Distribution:
  BloodStock (grouped by bloodType, summed currentUnits)
  Falls back to User bloodGroup counts if no stock data
  → Returns: [{ type, value }]

Peak Hours:
  BloodRequest (grouped by hour of createdAt)
  → Returns: [{ hour, requests }]

Regional Activity:
  User (grouped by region field)
  → Returns: [{ region, count }]
```

### 10.3 Camp Approval Flow

```
Donor submits camp completion (attended = true)
  POST /api/donor/camps/:id/complete
       │
       ▼
CampRegistration.status = "pending_completion"
       │
       ▼
Admin sees in "Donation Approvals" tab
  GET /api/admin/camp-approvals
       │
       ├── Approve
       │   PUT /api/admin/camp-approvals/:id/approve { status: "completed" }
       │   → awardPoints(donorId, 100)
       │   → Notification: "Camp Donation Verified! +100 points!"
       │
       └── Reject
           PUT /api/admin/camp-approvals/:id/approve { status: "rejected" }
           → Notification: "Camp Submission Rejected"
```

---

## 11. Messaging & Notifications

### 11.1 Messaging Flow

```
User A wants to message User B
       │
       ▼
POST /api/messages/start { userId: B }
  → Creates Conversation with participants [A, B]
  → Returns conversation object
       │
       ▼
POST /api/messages/send { receiverId: B, content: "Hello" }
  → Creates Message in conversation
  → Updates conversation.lastMessage
       │
       ▼
User B's Messages page polls every 5 seconds:
  GET /api/messages/conversations
  GET /api/messages/conversations/:convId
       │
       ▼
Messages render in chat view with:
  - Sender alignment (left/right)
  - Timestamps
  - Auto-scroll to latest
```

### 11.2 Notification System

Notifications are created server-side via `createNotification()` utility.

**Trigger points:**
| Event | Notification To | Type |
|-------|----------------|------|
| Hospital approved | Hospital | success |
| Hospital rejected | Hospital | error |
| Camp donation verified | Donor | success |
| Camp submission rejected | Donor | error |
| User status changed | User | success/warning |
| Donation confirmed | Donor | success |
| Donor responds to request | Hospital | info |

**Frontend:**
- Navbar shows unread count badge
- `/notifications` page lists all notifications
- "Mark all as read" button

---

## 12. Gamification System

### 12.1 Points & Levels

| Level | Points Required |
|-------|----------------|
| Bronze | 0 - 99 |
| Silver | 100 - 499 |
| Gold | 500 - 999 |
| Platinum | 1000+ |

**Point sources:**
- Confirmed hospital donation: variable points
- Approved camp completion: 100 points

### 12.2 Rewards Store

Admins create rewards with a `pointsCost`. Donors can redeem if:
1. Their `totalPoints >= reward.pointsCost`
2. They haven't already redeemed that reward
3. The reward `isActive === true`

### 12.3 Leaderboard

- `GET /api/donor/leaderboard` returns top donors sorted by `totalPoints`
- Current user's rank is calculated and returned
- Top 3 get special styling (gold/silver/bronze)

### 12.4 Eligibility Cooldown

56-day mandatory gap between donations. Checked via:
```
Latest completed donation date (from BloodRequest or CampRegistration)
  + 56 days = nextEligibleDate
  
If today < nextEligibleDate → NOT eligible
  - Shows warning banner on dashboard
  - Disables camp registration for camps before nextEligibleDate
  - Shows countdown: "X days until next donation"
```

---

## 13. API Reference

### Auth Routes (`/api/auth`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/login` | No | Login with email + password |
| POST | `/register` | No | Register new user |
| GET | `/me` | Yes | Get current user profile |
| PUT | `/change-password` | Yes | Change password |

### Donor Routes (`/api/donor`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard` | Donor | Dashboard stats |
| GET | `/progress` | Donor | Level, points, badges |
| GET | `/urgent-requests` | Donor | Matching urgent blood requests |
| POST | `/respond-request/:id` | Donor | Respond to blood request |
| POST | `/complete-donation` | Donor | Mark donation complete |
| GET | `/donations` | Donor | Donation history |
| GET | `/eligibility` | Donor | Check 56-day cooldown |
| GET | `/camps` | Donor | Available camps (excludes expired) |
| POST | `/camps/:id/apply` | Donor | Register for camp |
| GET | `/camps/registered` | Donor | Registered camps |
| POST | `/camps/:id/complete` | Donor | Submit completion |
| GET | `/rewards` | Donor | Points, badges, store items |
| POST | `/rewards/:id/redeem` | Donor | Redeem reward |
| GET | `/leaderboard` | Donor | Top donors ranking |
| GET | `/profile` | Donor | Profile data |
| PUT | `/profile` | Donor | Update profile |

### Hospital Routes (`/api/hospital`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard` | Hospital | Dashboard stats |
| GET | `/blood-stock` | Hospital | Current inventory |
| PUT | `/blood-stock` | Hospital | Update stock levels |
| GET | `/low-stock-alerts` | Hospital | Critical level alerts |
| POST | `/blood-request` | Hospital | Create blood request |
| GET | `/my-requests` | Hospital | Hospital's requests |
| PUT | `/requests/:id/status` | Hospital | Update request status |
| POST | `/confirm-donation` | Hospital | Confirm donor donation |
| GET | `/weekly-collection` | Hospital | Weekly chart data |
| GET | `/blood-type-distribution` | Hospital | Stock by type |
| GET | `/profile` | Hospital | Hospital profile |
| PUT | `/profile` | Hospital | Update profile |

### Admin Routes (`/api/admin`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/dashboard` | Admin | System-wide stats |
| GET | `/users` | Admin | All users list |
| GET | `/users/:id` | Admin | User detail |
| PUT | `/users/:id/status` | Admin | Toggle user status |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/hospitals/pending` | Admin | Pending hospital approvals |
| PUT | `/hospitals/:id/status` | Admin | Approve/reject hospital |
| POST | `/camps` | Admin | Create camp |
| GET | `/camps` | Admin | List all camps |
| PUT | `/camps/:id` | Admin | Update camp |
| DELETE | `/camps/:id` | Admin | Delete camp |
| GET | `/camp-approvals` | Admin | Pending camp completions |
| PUT | `/camp-approvals/:id/approve` | Admin | Approve/reject completion |
| GET | `/rewards` | Admin | List rewards |
| POST | `/rewards` | Admin | Create reward |
| PUT | `/rewards/:id` | Admin | Update reward |
| DELETE | `/rewards/:id` | Admin | Delete reward |
| GET | `/analytics/donation-trends` | Admin | 6-month donation data |
| GET | `/analytics/user-growth` | Admin | User growth data |
| GET | `/analytics/blood-distribution` | Admin | Blood type distribution |
| GET | `/analytics/peak-hours` | Admin | Peak activity hours |
| GET | `/analytics/regional` | Admin | Regional user counts |
| GET | `/reports/donations` | Admin | Donation report |
| GET | `/reports/users` | Admin | User activity report |
| GET | `/reports/hospitals` | Admin | Hospital report |
| GET | `/reports/blood-types` | Admin | Blood type report |
| GET | `/reports/regional` | Admin | Regional report |
| POST | `/seed-analytics` | Admin | Seed demo data for charts |

### Notification Routes (`/api/notifications`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Yes | All notifications + unread count |
| PUT | `/read` | Yes | Mark all as read |

### Message Routes (`/api/messages`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/conversations` | Yes | User's conversations |
| GET | `/conversations/:id` | Yes | Messages in conversation |
| POST | `/send` | Yes | Send message |
| GET | `/unread-count` | Yes | Unread message count |
| POST | `/start` | Yes | Start new conversation |

---

## End-to-End Flow Summary

```
                    ┌──────────────┐
                    │   Register   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌────────┐  ┌──────────┐  ┌────────┐
         │ Donor  │  │ Hospital │  │ Admin  │
         │(Auto   │  │(Pending  │  │(Login  │
         │Approved│  │Approval) │  │ only)  │
         └───┬────┘  └────┬─────┘  └───┬────┘
             │            │            │
             │     Admin Approves      │
             │      ◄─────┤            │
             │            │            │
    ┌────────▼────────┐   │   ┌────────▼────────┐
    │ Donor Dashboard │   │   │ Admin Dashboard  │
    │                 │   │   │                  │
    │ • View Requests │   │   │ • Approve Hosp.  │
    │ • Respond       │   │   │ • Approve Camps  │
    │ • Join Camps    │   │   │ • Manage Users   │
    │ • Earn Points   │   │   │ • View Analytics │
    │ • Redeem Rewards│   │   │ • Manage Rewards │
    └────────┬────────┘   │   └─────────────────┘
             │            │
             │   ┌────────▼────────┐
             │   │ Hospital Dash.  │
             │   │                 │
             │   │ • Create Request│──── Donor sees & responds
             │   │ • Manage Stock  │
             │   │ • Confirm Donate│──── Donor gets points
             │   └─────────────────┘
             │
    ┌────────▼────────┐
    │   Gamification   │
    │                  │
    │ Points → Levels  │
    │ Bronze → Silver  │
    │ Gold → Platinum  │
    │                  │
    │ Badges + Rewards │
    │ + Leaderboard    │
    └─────────────────┘
```
