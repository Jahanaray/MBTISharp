# AI Context

## Current Phase
- **Backend Development** – Core entities, DTOs, controllers, and infrastructure created.
- **Frontend Foundation** – Project structure initialized (T031).
- **New MVP Requirements**: Simple password auth (OTP deferred), Persian & English i18n, filled content for all pages.

## Current Milestone
- Backend foundation complete (T001-T030).
- Frontend project structure created (T031).

## Current Task
- T032: Initialize React + Vite frontend with TypeScript configuration

## Last Completed Task
- T031: Create frontend project structure (package.json, vite.config.ts, index.html, main.tsx, App.tsx)

## Important Technical Decisions
1. **LLM Usage**: All code generation will be performed by local LLMs with limited context windows; prompts are kept concise.
2. **Documentation Strategy**: Each major artifact (plan, rules, status) is stored in `docs/` and versioned via Git.
3. **Task Tracking**: The todo list is maintained using the `update_todo_list` tool to ensure state consistency across sessions.
4. **Authentication**: Simple password auth for MVP; OTP integration deferred until SMS provider available.
5. **Internationalization**: Persian & English support via JSON resource files with locale detection and manual toggle.

---
*Lead Architect – MBTI Match Team*
