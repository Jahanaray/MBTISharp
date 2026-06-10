# Current Task: T104-T105 + Translation Completion

## Goal
Add missing auth translations and client-side safety filter to registration form.

## Files Affected
- frontend/src/i18n/locales/en/common.json (added missing auth keys)
- frontend/src/i18n/locales/fa/common.json (added missing auth keys)
- frontend/src/pages/Login.tsx (added safety filter validation)
- docs/TASKS.md (marked T104-T105 DONE)

## Dependencies
- T096-T097 (registration translations)
- T103 (backend safety filter service)

## Acceptance Criteria
- All auth translation keys used in Login.tsx exist in EN/FA JSON files
- Client-side safety filter validates registration inputs
- TASKS.md updated

## Definition of Done
- TASKS.md updated
