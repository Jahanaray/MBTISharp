# Development Rules

## Coding Standards
- **Language**: C#, TypeScript, HTML, CSS.
- **Formatting**: Use `dotnet format` for C#, `prettier --write` for TS/CSS/HTML. Enforce 2‑space indentation.
- **Naming**: PascalCase for classes, methods, properties; camelCase for local variables and function parameters; UPPER_SNAKE_CASE for constants.
- **Line Length**: Max 120 characters.
- **Comments**: XML documentation on public APIs; inline comments only for complex logic.

## File Organization Rules
- **Backend**: `Controllers`, `Models`, `Services`, `Repositories`, `DTOs` under `backend/`. Each feature gets its own folder inside these namespaces.
- **Frontend**: `components`, `pages`, `hooks`, `api`, `assets` under `frontend/src/`. Keep components small (< 200 lines).
- **Docs**: All documentation resides in `docs/` with a clear hierarchy.

## Documentation Update Rules
- Every new feature must have an entry in `PROJECT_PLAN.md` and relevant sections updated.
- Code comments should be kept up‑to‑date; run `dotnet format --check` and `prettier --check` before commit.
- Markdown files use GitHub Flavored Markdown. Use tables for data, code fences for snippets.

## Git Workflow
1. **Branching**: Feature branches off `develop`. Naming convention: `feature/<short-description>`.
2. **Commits**: Conventional Commits (`feat`, `fix`, `docs`, `chore`). One logical change per commit.
3. **Pull Requests**: Require at least one review, CI checks must pass (lint, build, tests).
4. **Merge Strategy**: Rebase onto latest `develop` before merging; squash commits for clean history.

## AI Developer Workflow
- Use local LLMs via the provided prompt templates.
- When generating code snippets, always ask for a brief explanation and potential edge cases.
- Store generated drafts in separate files (`.draft.ts`) and review manually before committing.
- Keep context windows small: split large tasks into micro‑tasks as per todo list.

## Definition of Done (DoD)
- Code compiles without errors.
- All unit tests pass locally.
- Linting passes for all languages.
- Documentation updated and reviewed.
- PR merged after CI success and at least one approving review.
- Feature is deployed to staging environment and manually verified.

---
*Lead Architect – MBTI Match Team*
