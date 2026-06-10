# Feature Implementation Plan

## Overview
This document outlines the implementation plan for the following user feedback items:
1. Test question content (Priority 1)
2. UI layout fixes (Priority 2)
3. Enhanced registration with photo, location, full name, city
4. User preferences checkboxes during registration
5. Safety filter for adult/bad content
6. MBTI type content in both languages (funny style)
7. Legal agreement page
8. Unit testing

## Implementation Order

### Phase 1: Test Questions & UI Fixes (Priority 1-2)
**Files to modify:**
- `backend/Data/DbSeeder.cs` - Add 15 quiz questions with bilingual text
- `frontend/src/index.css` - Fix RTL/LTR alignment issues
- `frontend/src/i18n/locales/en/common.json` - Add quiz question translations
- `frontend/src/i18n/locales/fa/common.json` - Add quiz question translations (Persian)

**Key changes:**
- DbSeeder needs 15 questions covering all 4 MBTI dimensions (EI, SN, TJ, CP)
- CSS needs proper text-align handling for both LTR and RTL modes
- Each question option should have bilingual content in i18n files

### Phase 2: Enhanced Registration (Priority 3-8)
**Files to modify:**
- `backend/Models/User.cs` - Add new fields: FullName, City, Location (lat/lng), ProfilePhotoPath, TermsAccepted, AllowChat, AllowMeetInPerson, AllowCallVerification, InterestedMBTIs
- `backend/DTOs/AuthDto.cs` - Update RegisterRequest DTO with new fields
- `backend/Controllers/AuthController.cs` - Handle file upload and new registration fields
- `backend/Data/ApplicationDbContext.cs` - Update entity configuration for new columns
- `frontend/src/pages/Login.tsx` - Replace OTP flow with full registration form
- `frontend/src/i18n/locales/en/common.json` - Add registration translations
- `frontend/src/i18n/locales/fa/common.json` - Add registration translations (Persian)

**Key changes:**
- User model needs: FullName (string), City (string), Latitude (decimal), Longitude (decimal), ProfilePhotoPath (string), TermsAccepted (bool), AllowChat (bool), AllowMeetInPerson (bool), AllowCallVerification (bool), InterestedMBTIs (string - comma-separated MBTI types)
- AuthController needs multipart form data handling for photo upload
- Frontend registration form needs: full name input, city input, photo upload, geolocation button, 4 checkboxes, MBTI type selector (multi-select)
- Browser geolocation API (navigator.geolocation.getCurrentPosition) for location capture

### Phase 3: Safety Filter (Priority 9)
**Files to create/modify:**
- `backend/Services/SafetyFilterService.cs` - New service for content filtering
- `backend/Controllers/ChatController.cs` - Integrate safety filter
- `backend/Controllers/AuthController.cs` - Filter registration text fields
- `frontend/src/components/SafetyFilter.tsx` - Client-side content validation component

**Key changes:**
- Backend: Word list-based profanity filter for all user inputs (registration, chat messages)
- Frontend: Real-time input validation with visual feedback
- Blocked words list should include common adult/inappropriate terms in both English and Persian

### Phase 4: MBTI Type Content (Priority 10)
**Files to modify:**
- `frontend/src/i18n/locales/en/common.json` - Add funny descriptions for all 16 MBTI types
- `frontend/src/i18n/locales/fa/common.json` - Add funny Persian descriptions for all 16 MBTI types
- `frontend/src/pages/Result.tsx` - Display the new content

**Key changes:**
- Each MBTI type needs: funny title, humorous description (3-4 sentences), key traits list, fun fact
- Content should be culturally appropriate and family-friendly
- Both English and Persian versions required

### Phase 5: Legal Agreement Page (Priority 11)
**Files to create/modify:**
- `frontend/src/pages/Legal.tsx` - New page component
- `frontend/src/routes/index.tsx` - Add route for /legal
- `frontend/src/i18n/locales/en/common.json` - Add legal content translations
- `frontend/src/i18n/locales/fa/common.json` - Add legal content translations (Persian)
- `frontend/src/components/Footer.tsx` - Update legal link

**Key changes:**
- Legal page needs sections: Terms of Service, Privacy Policy, Cookie Policy
- Bilingual content with proper formatting
- Link in footer and registration flow

### Phase 6: Unit Testing (Priority 12)
**Files to create:**
- `backend/Tests/MBTIMatch.Tests/` - New test project
- `backend/Tests/MBTIMatch.Tests/AuthControllerTests.cs`
- `backend/Tests/MBTIMatch.Tests/SafetyFilterServiceTests.cs`
- `frontend/__tests__/` - Frontend test files

**Key changes:**
- Backend: Test registration validation, safety filter logic, password hashing
- Frontend: Test i18n translations, form validation components

## Git Branch Strategy
- Current branch: `feature/add-test-questions` (already created)
- Future branches as needed for each phase

## Risk Assessment
- Photo upload requires file storage solution (local disk or cloud)
- Geolocation API requires HTTPS in production
- Safety filter needs comprehensive word lists for both languages
- Persian content must be culturally appropriate
