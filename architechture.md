# HackWeek 2026 Platform Architecture

## Overview

HackWeek 2026 is a modern hackathon management platform built using:

* React 19 + Vite
* Tailwind CSS
* Framer Motion
* Firebase Authentication
* Firestore Database
* Firebase Storage
* React Router
* React Query
* Zustand
* React Hook Form + Zod

The platform is designed with:

* Scalability
* Future-proof event management
* Reusable component architecture
* Neo Brutalism design system

---

# System Architecture

```text
Frontend (React)

├── Landing Pages
├── Authentication
├── Dashboard
├── Profile Management
├── Challenges
├── Submissions
└── Leaderboards

        ↓

Firebase Layer

├── Authentication
├── Firestore
└── Storage

        ↓

Collections

├── users
├── profiles
├── emails
├── challenges
├── submissions
├── badges
└── leaderboard
```

---

# Folder Structure

```text
src/

├── app/
│   ├── router.jsx
│   ├── providers.jsx
│   └── layouts/
│
├── pages/
│   ├── Landing/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Profile/
│   ├── Challenges/
│   ├── Submission/
│   ├── Leaderboard/
│   ├── Settings/
│   └── Admin/
│
├── components/
│   │
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Select.jsx
│   │   ├── Tabs.jsx
│   │   └── Tooltip.jsx
│   │
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   └── PageWrapper.jsx
│   │
│   ├── landing/
│   ├── profile/
│   ├── dashboard/
│   ├── challenges/
│   └── leaderboard/
│
├── features/
│   ├── auth/
│   ├── profile/
│   ├── challenges/
│   ├── submissions/
│   ├── leaderboard/
│   └── admin/
│
├── services/
│   ├── authService.js
│   ├── profileService.js
│   ├── challengeService.js
│   ├── submissionService.js
│   ├── leaderboardService.js
│   └── storageService.js
│
├── firebase/
│   ├── config.js
│   ├── auth.js
│   ├── firestore.js
│   └── storage.js
│
├── hooks/
│   ├── useAuth.js
│   ├── useProfile.js
│   ├── useChallenges.js
│   ├── useLeaderboard.js
│   └── useFirestore.js
│
├── store/
│   ├── authStore.js
│   ├── uiStore.js
│   └── eventStore.js
│
├── context/
│   └── AuthContext.jsx
│
├── lib/
│   ├── constants.js
│   ├── validations.js
│   ├── permissions.js
│   └── helpers.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── badges/
│   └── animations/
│
└── styles/
    ├── globals.css
    └── theme.css
```

---

# Authentication Architecture

## Provider

GitHub OAuth Only

```text
User
  ↓
GitHub OAuth
  ↓
Firebase Auth
  ↓
Create User Record
  ↓
Create Profile Record
  ↓
Redirect Dashboard
```

# Firestore Collections

## users

Authentication information only.

```js
users
{
  collegeName
  companyName
  createdAt
  degree
  email
  experience
  fullName
  githubAvatar
  githubProfile
  githubUsername
  linkedin
  participantType
  phone
  portfolio
  role
  rollNumber
  uid
  year
}
```


## challenges

```js
challenges
{
  challengeId,

  eventId,

  title,
  slug,

  description,

  category,

  difficulty,

  technologies:[],

  points,

  requirements:[],

  resources:[],

  startDate,
  deadline,

  participantsCount,

  status,

  createdAt
}
```

---

## submissions

```js
submissions
{
  submissionId,

  eventId,
  challengeId,

  userId,

  githubRepo,

  projectUrl,

  description,

  technologiesUsed:[],

  attachments:[],

  status,

  score,

  feedback,

  submittedAt,

  reviewedAt
}
```

## badges

```js
badges
{
  badgeId,

  title,

  description,

  icon,

  criteria,

  rarity
}
```

---

## leaderboard

```js
leaderboard
{
  eventId,

  rankings:[
    {
      userId,
      points,
      rank
    }
  ]
}
```

# Routing Architecture

```text
/

/login
/register

/dashboard

/profile
/challenges
/challenges/:slug

/submissions
/submissions/:id

/leaderboard

```

---

# Dashboard Modules

## Participant Dashboard

```text
Welcome Banner

Profile Completion

HackWeek Countdown

Recent Announcements

My Stats

Recent Submissions

Achievements

Leaderboard Preview
```

---

# Security Rules Strategy

## Authentication Required

```text
profiles
submissions
notifications
```

## Public Read

```text
events
challenges
leaderboard
announcements
badges
```

---

# Neo Brutalism Design System

## Design Principles

* Thick borders
* Large typography
* Strong shadows
* Bright accent colors
* Minimal gradients
* Playful interactions

---

## Color Palette

```css
Background: #FFF8E7

Text: #111111

Yellow: #FFD23F
Pink: #FF5D8F
Blue: #00B7FF
Green: #7AE582
Red: #FF595E
```

---

## Component Standards

Buttons
```css
border: 4px solid black;
box-shadow: 6px 6px 0 black;
```
Cards
```css
border: 4px solid black;
box-shadow: 8px 8px 0 black;
```
Inputs

```css
border: 3px solid black;
```
No glassmorphism.
No gradients.
No rounded-full everywhere.

---
