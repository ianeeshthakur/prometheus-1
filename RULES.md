# Project Rules

## General Rules
- Always prioritize performance and responsiveness. The system is designed for emergency response where seconds matter.
- Maintain a strict separation between the Next.js frontend (UI/State) and Python FastAPI backend (Video Processing/AI).

## Code Organization
- **Frontend**: Place reusable UI components in `/components`. Group domain-specific components into subfolders (e.g., `/components/cameras`, `/components/map`).
- **Backend**: Place API routes in `/backend/routers` and core logic (like FFmpeg managers) in `/backend/video` or `/backend/intelligence`.

## Naming Conventions
- React Components: `PascalCase.tsx`
- Utility functions: `camelCase.ts`
- Python files/modules: `snake_case.py`
- CSS variables: `--kebab-case`

## Type Safety
- TypeScript is mandatory for all frontend code. Avoid `any`. Define interfaces for API responses and Zustand stores.
- Python Type Hints are mandatory for FastAPI routes and Pydantic models.

## Error Handling
- **Frontend**: Use Next.js `error.tsx` boundaries. Display user-friendly alerts for stream failures using the G-VISTA design system status colors.
- **Backend**: Catch `subprocess` errors for FFmpeg immediately and return meaningful HTTP 500/503 errors.

## API Rules
- All backend routes must be prefixed with `/api`.
- Use Pydantic models to validate request/response payloads in FastAPI.

## Database Rules
*Pending formal database integration.*

## Security Rules
- Do not hardcode RTSP credentials in the frontend. All stream URLs must be proxied or transcoded via the backend.
- Ensure CORS policies in `main.py` restrict access to the production frontend domain.

## Dependency Rules
- Prefer Tailwind CSS v4 features over installing new UI libraries.
- Justify any new heavy npm package (e.g., 3D rendering) before installation.

## UI Rules
- Strictly adhere to the colors defined in `globals.css`. Do not use arbitrary Tailwind color classes (like `bg-red-500`); use the CSS variables (e.g., `var(--status-critical)`) to maintain the exact design system.
- Ensure the `AppShell` layout is preserved on all pages.

## State Management
- Use `Zustand` for global state (e.g., currently selected camera, active alerts).
- Avoid heavy React Context usage for frequently changing data to prevent re-renders.

## Testing Rules
- Ensure manual verification of video streams before committing changes to `ffmpeg_runner.py` or `stream_manager.py`.

## Git Rules
- Write descriptive commit messages.

## Performance Rules
- Leaflet map clusters should not cause main thread blocking. Use `leaflet.markercluster`.
- Ensure React components holding `hls.js` properly destroy the instance and detach media on unmount to prevent memory leaks.

## Forbidden Practices
- **NEVER** use `styled-components` or `emotion`. Stick to Tailwind and `globals.css`.
- **NEVER** run blocking synchronous operations in FastAPI routes. Use `async def`.
- **NEVER** expose raw camera IP addresses to the client-side browser network requests.
