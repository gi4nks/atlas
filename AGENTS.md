# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, and server components.
- `components/`: Reusable React UI components.
- `lib/`: Consolidated backend logic (`lib/apps.ts`) and shared schemas.
- `types/`: Shared TypeScript types.
- Data lives in `../apps/*.yml`; templates in `../templates/`.

## Build and Development Commands
- `npm run dev`: Start local dev server.
- `npm run build`: Production build.
- `npm run lint`: ESLint check.
- **Note:** Scanning and project management are now handled directly via the Web UI (Smart Scan feature).

## Coding Style & Naming Conventions
- TypeScript + React; follow the rules in `eslint.config.mjs`.
- React components use `PascalCase` filenames; hooks use `useX` naming.
- YAML app files use kebab-case names (example: `my-new-app.yml` in `../apps/`).
- Keep shared types in `types/` and shared logic in `lib/` rather than duplicating.

## Testing Guidelines
- No automated test framework is configured yet; there is no `npm test` script.
- Minimum check is `npm run lint`, plus manual verification of list and detail pages.
- If you introduce tests, add a script and document the naming/location convention.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (examples: `feat: ...`, `build: ...`, `ci: ...`, `style: ...`).
- PRs should include a short summary, verification steps, and screenshots for UI changes.
- Link related issues and ensure `npm run lint` passes before requesting review.

## Configuration & Secrets
- Copy `.env.example` to `atlas/.env` and set `GEMINI_API_KEY` for smart-scan.
- Do not commit `.env` or local data from `../apps/`.
## Docker Data Mapping
- The Docker setup mounts `../apps` into the container at `/apps`, so app YAML changes are reflected without rebuilds.
