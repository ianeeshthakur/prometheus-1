<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Overview
G-VISTA (Gujarat Video Intelligence & Surveillance Technology Architecture) is a statewide AI-driven video intelligence platform for the Gujarat Police.

## Architecture Overview
- **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS v4, Zustand, Recharts, Leaflet/react-leaflet.
- **Backend**: Python 3+, FastAPI, Uvicorn, FFmpeg (for RTSP to HLS conversion).

## Repository Structure
- `/app`: Next.js App Router frontend application.
- `/components`: Reusable UI, layout, and domain-specific React components.
- `/backend`: Python FastAPI application handling streams and AI logic.
- `/public`: Static assets.
- `/lib`: Frontend utilities and helpers.

## Development Commands
- **Frontend**: `npm run dev` (starts Next.js server).
- **Backend**: `cd backend && python -m uvicorn main:app --reload` (or similar standard FastAPI startup).

## Build Commands
- **Frontend**: `npm run build`
- **Backend**: No specific build step required for FastAPI.

## Testing Commands
*No automated test suites are currently configured. Rely on manual verification for MVP.*

## Code Conventions
- **Frontend**: Use TypeScript for all React code. Use Tailwind CSS for styling, supplemented by CSS variables in `globals.css` for the Design System. Rely on Server Components by default; add `'use client'` only when React hooks (e.g., Zustand, useEffect) are needed.
- **Backend**: Use Python type hints. Group routes logically in `/routers`. Handle subprocesses (like FFmpeg) carefully to avoid zombie processes.

## Architecture Conventions
- Video feeds are ingested as RTSP streams by the backend.
- The backend transcodes RTSP to HLS via FFmpeg and serves `.m3u8` and `.ts` files.
- The frontend uses `hls.js` within a React component to play the video streams.

## Database Conventions
*Currently undefined in this scope. Wait for further explicit definition or use mock data.*

## API Conventions
- Backend APIs use `/api/...` prefix.
- FastAPI automatically documents APIs via Swagger at `/docs`.
- Frontend fetches data via standard fetch or specialized client components.

## Security Requirements
- Ensure CORS in FastAPI is restrictive in production.
- Do not expose RTSP credentials in frontend code.

## Dependency Guidelines
- Do not add heavy frontend dependencies without justification.
- Rely on Tailwind v4 for CSS over external component libraries unless complex functionality is required.

## Testing Requirements
- Changes to video streaming logic must be manually tested with an actual or mock RTSP feed.
- Map changes must be tested for performance, especially with many cluster markers.

## Verification Checklist
- [ ] Application compiles without TypeScript errors.
- [ ] Backend starts without syntax errors.
- [ ] Video streams load and play in the UI.
- [ ] UI adheres strictly to the "G-VISTA" dark theme by default.

## Forbidden Changes
- Do not modify the Next.js `generate-agent-files` block at the top of this file.
- Do not replace Tailwind CSS with a CSS-in-JS library like styled-components.
- Do not use WebRTC for video streaming unless explicitly requested; the architecture relies on HLS.

## Additional Documentation
- [PRD.md](./PRD.md)
- [DESIGN.md](./DESIGN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [RULES.md](./RULES.md)
