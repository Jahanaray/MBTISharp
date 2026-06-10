# AI Context

## Current Phase
- **MVP Feature Completion** – All core MVP features implemented (registration, i18n, safety filter, legal pages).
- **Next: Unit Testing (T129-T135)**

## Current Milestone
- MVP feature set complete (T001-T128).
- Documentation updates in progress (T136-T138).

## Current Task
- T136-T138: Update PROJECT_PLAN.md, PROJECT_STATUS.md, and AI_CONTEXT.md with latest state

## Last Completed Task
- T123-T128: Create Legal page with Terms of Service, Privacy Policy, Cookie Policy (EN/FA)

## Important Technical Decisions
1. **LLM Usage**: All code generation will be performed by local LLMs with limited context windows; prompts are kept concise.
2. **Documentation Strategy**: Each major artifact (plan, rules, status) is stored in `docs/` and versioned via Git.
3. **Task Tracking**: The todo list is maintained using the `update_todo_list` tool to ensure state consistency across sessions.
4. **Authentication**: Password-based auth with JWT tokens; OTP phone verification implemented as registration flow.
5. **Internationalization**: Persian (FA) & English (EN) support via react-i18next with JSON resource files and manual toggle.
6. **RTL Support**: Tailwind CSS configured for RTL layout; index.css updated for Persian text rendering.
7. **Safety Filter**: Dual-layer approach – client-side validation in Login.tsx and Chat.tsx, server-side in SafetyFilterService.cs.
8. **Content Strategy**: Funny MBTI descriptions stored in dedicated data file with toggle on Result page for engagement.
9. **Legal Compliance**: Comprehensive legal page with tabbed interface covering Terms, Privacy, and Cookie policies.

## File Structure Summary
```
backend/
  Controllers/    – AuthController, QuizController, MatchController, ChatController
  Models/         – User, Question, Answer, Match, Message
  DTOs/           – AuthDto, QuizDto, MatchDto, ChatDto
  Services/       – SafetyFilterService
  Data/           – ApplicationDbContext, DbSeeder
  Hubs/           – ChatHub (SignalR)
frontend/
  pages/          – Home, Quiz, Login, Dashboard, Chat, Result, Legal
  components/     – Header, Footer, LanguageSwitcher, ErrorBoundary
  i18n/           – EN/FA translation JSON files
  data/           – mbtiDescriptions.ts (funny type descriptions)
  utils/          – safetyFilter.ts (client-side content validation)
  routes/         – AppRoutes, ProtectedRoute, PublicRoute
  store/          – AuthContext
docs/             – All project documentation and task tracking
```

## Recent Commits
- `4c74fab` – feat: Add Legal page with Terms, Privacy, Cookie policies (T123-T128)
- `c37093e` – feat: Add funny MBTI descriptions for all 16 types (T107-T122)
- `53121db` – feat: Add real-time message validation to chat page (T106)
- `68ca4f2` – feat: Add missing auth translations and client-side safety filter (T104-T105)

---
*Lead Architect – MBTI Match Team*
