# Announcing

## Project Overview

**Announcing** is a web service for making announcements. It is a full-stack application built with a pnpm monorepo.

The project consists of several packages:

- `reader`: A SvelteKit frontend for reading announcements.
- `writer`: A SvelteKit frontend for writing announcements.
- `db`: A database package using Drizzle ORM with a SQLite dialect.
- `notification`: A package for handling notifications.
- `components`: A shared Svelte component library.
- `cloudflare-support`: Utilities for Cloudflare integration.
- `i18n`: Internationalization support.
- `help`: The documentation site.

The frontends are built with SvelteKit and deployed to Cloudflare Workers. The database is managed with Drizzle ORM and migrations are handled by `drizzle-kit`.

## Building and Running

- **Install dependencies:** `pnpm install`
- **Run all checks:** `pnpm check` (This will build all packages, run tests, lint, and format the code.)
- **Run `reader` frontend locally:** `pnpm --filter @announcing/reader dev`
- **Run `writer` frontend locally:** `pnpm --filter @announcing/writer dev`
- **Run local development environment with workers:** `pnpm --filter @announcing/reader dev:workers` or `pnpm --filter @announcing/writer dev:workers`

### Database Migrations

- **Generate migrations:** `pnpm --filter @announcing/db generate`
- **Apply migrations to local database:** `pnpm --filter @announcing/db migrate:local`
- **Apply migrations to remote database:** `pnpm --filter @announcing/db migrate:remote`

## Development Conventions

- **Formatting:** The project uses Prettier for code formatting. Run `pnpm format` to check formatting and `pnpm format:fix` to fix it.
  - **Agent Formatting:** When the agent modifies files, it will automatically run `pnpm format:fix` to ensure code style consistency.
- **Linting:** The project uses ESLint for linting. Run `pnpm lint` to check for linting errors and `pnpm lint:fix` to fix them.
- **Testing:** The project uses Vitest for unit tests. Run `pnpm -r run test` to run tests in all packages.
- **Commits:** This project follows the Conventional Commits specification.
