# Pinpoint

Visual feedback collection tool for web developers. Users highlight exactly what's broken on your website — with a screenshot, a drawing, and a comment. You see it instantly in your dashboard.

Live: [pinpoint.vercel.app](https://pinpoint-ten-sage.vercel.app/)

---

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   Any Website       │────▶│     widget.js         │────▶│   Pinpoint Backend  │
│ (script tag added)  │     │ Screenshot + Canvas   │     │  Node.js / Express  │
└─────────────────────┘     │ Draw + Submit         │     └──────────┬──────────┘
                            └──────────────────────┘                │
                                                                     │
                            ┌──────────────────────────────────────────────────┐
                            │                  MongoDB                         │
                            │     Users · Projects · Feedback + Screenshots    │
                            └──────────────────────────┬───────────────────────┘
                                                       │
                            ┌──────────────────────────▼───────────────────────┐
                            │              Socket.io                           │
                            │   Emits new_feedback event to project room       │
                            └──────────────────────────┬───────────────────────┘
                                                       │
                            ┌──────────────────────────▼───────────────────────┐
                            │           React Dashboard                        │
                            │  Live updates · Status management · Screenshots  │
                            └──────────────────────────────────────────────────┘
```

---

## How it works

A developer creates a project on Pinpoint and gets a unique script tag. They paste it into any website before the closing `</body>` tag. A Feedback button appears in the bottom-right corner of that website. When a user clicks it, the widget captures a screenshot of the current page using `html2canvas`, overlays a drawing canvas so the user can highlight the problem, collects a comment, and submits everything to the Pinpoint backend. The developer sees the new feedback appear in their dashboard in real time via Socket.io — no refresh needed.

---

## Features

**Embeddable widget**
A single script tag with a `data-token` attribute is all that's needed. The widget injects itself into any website without conflicting with existing styles or JavaScript. All widget elements use namespaced `fw-` prefixed IDs and scoped inline styles.

**Screenshot capture with annotations**
`html2canvas` freezes the current DOM state into a canvas image the moment the user clicks Feedback. A drawing layer is overlaid on top — users draw directly on the screenshot to pinpoint the exact problem. Supports freehand drawing with undo, clear, and cancel controls.

**Real-time dashboard**
New feedback appears in the developer's dashboard instantly via Socket.io. Each project has its own room — developers join the room on page load and receive `new_feedback` events without polling.

**Authentication**
Email/password authentication with bcrypt hashing and JWT tokens. Google OAuth via Passport.js as an alternative sign-in method. Both flows issue the same JWT and redirect to the dashboard.

**Multiple projects**
Each account can manage multiple projects. Each project has a unique token used to route feedback submissions to the correct dashboard.

**Feedback management**
Each feedback item includes the annotated screenshot, comment, page URL, browser user agent, device type, and timestamp. Status can be toggled between open and resolved. Feedback can be deleted with a confirmation toast.

**Metadata**
Every submission automatically captures the page URL, browser version, and device type (mobile/tablet/desktop) without any additional input from the user.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, Passport.js (Google OAuth) |
| Real-time | Socket.io |
| Widget | Vanilla JS, html2canvas, HTML5 Canvas API |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Project structure

```
feedbackwidget/
├── backend/
│   ├── config/
│   │   └── passport.js         # Google OAuth strategy
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT verification
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Project.model.js
│   │   └── Feedback.model.js
│   ├── routes/
│   │   ├── auth.routes.js      # Register, login, Google OAuth
│   │   ├── projects.routes.js  # CRUD for projects
│   │   └── feedback.routes.js  # Submit, fetch, update, delete
│   └── index.js                # Express + Socket.io server
├── frontend/
│   └── src/
│       ├── api/axios.js        # Axios instance with JWT interceptor
│       ├── config.js           # Environment-aware URL config
│       ├── context/
│       │   └── AuthContext.jsx
│       └── pages/
│           ├── Landing.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── ProjectDetail.jsx
│           ├── FeedbackDetail.jsx
│           └── AuthCallback.jsx
└── widget/
    └── widget.js               # Embeddable script
```

---

## Local setup

**Prerequisites:** Node.js, MongoDB running locally or Atlas URI

```bash
git clone https://github.com/kartik0905/feedbackwidget.git
cd feedbackwidget
```

**Backend:**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/feedbackwidget
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Widget:**
```bash
cd widget
npx serve . -p 5500
```

Add to any HTML file for local testing:
```html
<script src="http://localhost:5500/widget.js" data-token="YOUR_PROJECT_TOKEN"></script>
```

---

## API routes

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/google
GET    /api/auth/google/callback

GET    /api/projects
POST   /api/projects
DELETE /api/projects/:id

POST   /api/feedback
GET    /api/feedback/:projectId
GET    /api/feedback/single/:id
PATCH  /api/feedback/:id
DELETE /api/feedback/:id
```

---

## Known limitations

- The widget's drawing overlay may cause a minor layout shift on websites with custom scrollbar styles. This is a known `html2canvas` behaviour related to scrollbar width calculation.
- Author filtering on the feedback list requires an exact match — partial name search is not supported.
- The free Render instance spins down after 15 minutes of inactivity. The first request after a cold start takes 30-60 seconds.

---

## Build by Kartik Garg