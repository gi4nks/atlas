# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router routes, layouts, and server components.
- `components/`: Reusable React UI components.
- `lib/`: Backend helpers and CLI-style scripts (scan/smart-scan).
- `types/`: Shared TypeScript types.
- `public/`: Static assets.
- Data lives outside this repo in `../apps/*.yml`; templates live in `../templates/`.

## Build, Test, and Development Commands
- `npm run dev` / `make dev`: Start the local dev server (http://localhost:3000).
- `npm run build` / `make build`: Create a production build.
- `npm run start` / `make start`: Run the production server.
- `npm run lint` / `make lint`: Run ESLint.
- `npm run scan <name>` / `make scan APP_NAME=name`: Generate a YAML entry from a folder.
- `npm run smart-scan <name>` / `make smart-scan APP_NAME=name`: AI-assisted scan (requires `GEMINI_API_KEY`).
- `docker compose up -d` / `docker-compose up -d` / `make docker-up`: Run via Docker Compose.

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
