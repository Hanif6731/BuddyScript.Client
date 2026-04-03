# BuddyScript — Frontend

React 19 + TypeScript + Vite SPA for BuddyScript, a social feed platform.

**Live URL:** https://buddyscript.xchanze.com  
**Backend repo:** https://github.com/Hanif6731/BuddyScript.Backend

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Routing | React Router v7 |
| HTTP client | Axios |
| Auth state | React Context (`AuthContext`) |
| Web server | Nginx (Docker) |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions → self-hosted Windows runner |

---

## Features Implemented

### Authentication
- Email/password registration with **real-time password strength checklist** (min 8 chars, uppercase, lowercase, digit, special char)
- Email/password login
- **Google OAuth** sign-in
- JWT stored in HttpOnly cookie — no JS-accessible token
- Protected routes (`PrivateRoute`) redirect unauthenticated users to `/login`
- Public routes (`PublicRoute`) redirect authenticated users to `/feed`

### Feed
- Infinite-scroll style paginated feed (newest first)
- Create posts with **text and/or image** upload
- **Public / Private** post visibility toggle
- Post author shown with initials avatar (color derived from user ID for consistency)

### Reactions
- 5 reaction types: 👍 Like · ❤️ Love · 😂 Haha · 😮 Wow · 😢 Sad
- Hover the Like button to open the emoji reaction picker
- Same reaction = unlike; different reaction = switches without unliking
- Reaction type **persisted to database** and **restored on reload**
- Likers modal — click the reaction count to see who reacted

### Comments & Replies
- Threaded, multi-level replies (Reddit-style)
- "View N previous replies" lazy-loads older comments
- Each comment/reply supports the same 5-reaction system
- Comment and reply liker modal

---

## Running Locally

```bash
npm install
cp .env.example .env
# set VITE_API_BASE_URL=http://localhost:9384/api
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `/api` in production, `http://localhost:9384/api` locally) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

In production these are injected at build time via GitHub Actions secrets.

---

## Architecture Notes

### Nginx as reverse proxy
The production container serves the built Vite bundle and proxies `/api/*` to the backend container (`buddyscript-api`) on the shared Docker network `buddynet`. This means:
- The frontend and backend share a single domain — no cross-origin cookie issues
- `client_max_body_size 15m` matches the backend's Kestrel limit for image uploads

### Auth flow
```
App load → GET /api/Auth/getcurrentuser
  ├── 200 OK  → setUser(data) → show feed
  └── 401     → setUser(null) → redirect /login
```

Logout always clears the local user state (via `finally`) even if the API call fails, so the UI never gets stuck in a phantom-authenticated state.

### Consistent avatars
`src/utils/avatar.ts` provides `getInitials(name)` and `getAvatarColor(userId)`. Color is derived from `userId % palette.length` — the same user always gets the same color across posts, comments, and the header regardless of name casing.

---

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on push to `main`:
1. Writes `VITE_API_BASE_URL` and `VITE_GOOGLE_CLIENT_ID` to `.env.production`
2. Runs `docker compose down && docker compose up -d --build` (Vite build happens inside Docker)
3. Removes `.env.production`

Container runs with `restart: unless-stopped` for auto-recovery.
