# Micro-Tasks Tracker

## T001-T050: ALL DONE

### Documentation (T001-T002)
| ID | Goal | Status |
|----|------|--------|
| T001 | Initialize project documentation structure | DONE |
| T002 | Define project architecture overview | DONE |

### Backend Entities (T003-T012)
| ID | Goal | Status |
|----|------|--------|
| T003 | Create User entity class | DONE |
| T004 | Add User DbSet to ApplicationDbContext | DONE |
| T005 | Create Question entity class | DONE |
| T006 | Add Question DbSet to ApplicationDbContext | DONE |
| T007 | Create Answer entity class | DONE |
| T008 | Add Answer DbSet to ApplicationDbContext | DONE |
| T009 | Create Match entity class | DONE |
| T010 | Add Match DbSet to ApplicationDbContext | DONE |
| T011 | Create Message entity class | DONE |
| T012 | Add Message DbSet to ApplicationDbContext | DONE |

### Backend DTOs (T013-T016)
| ID | Goal | Status |
|----|------|--------|
| T013 | Create Auth DTOs | DONE |
| T014 | Create Quiz DTOs | DONE |
| T015 | Create Match DTOs | DONE |
| T016 | Create Chat DTOs | DONE |

### Backend Controllers (T017-T020)
| ID | Goal | Status |
|----|------|--------|
| T017 | Create AuthController | DONE |
| T018 | Create QuizController | DONE |
| T019 | Create MatchController | DONE |
| T020 | Create ChatController | DONE |

### Backend Infrastructure (T021-T030)
| ID | Goal | Status |
|----|------|--------|
| T021 | Create Program.cs with service registration | DONE |
| T022 | Create appsettings.json with connection string | DONE |
| T023 | Create SignalR ChatHub | DONE |
| T024 | Add EF Core migration setup | DONE |
| T025 | Create .csproj file for backend | DONE |
| T026 | Register SignalR in Program.cs | DONE |
| T027 | Seed initial MBTI questions | DONE |
| T028 | Create Dockerfile for backend | DONE |
| T029 | Create README.md for backend | DONE |
| T030 | Create .gitignore for project | DONE |

### Frontend Foundation (T031-T032)
| ID | Goal | Status |
|----|------|--------|
| T031 | Create frontend project structure | DONE |
| T032 | Initialize React + Vite frontend with TypeScript | DONE |

### Frontend UI (T033-T040)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T033 | Add Tailwind CSS to frontend | T032 | DONE |
| T034 | Create Home page component | T032 | DONE |
| T035 | Create Quiz page component | T034 | DONE |
| T036 | Create layout components (Header, Footer) | T033 | DONE |
| T037 | Create auth components (Login) | T036 | DONE |
| T038 | Wire up API services layer | T032 | DONE |
| T039 | Create routing configuration | T034-T037 | DONE |
| T040 | Build main App.tsx with all pages | T038-T039 | DONE |

### Frontend Core Features (T041-T043)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T041 | Create Dashboard page | T040 | DONE |
| T042 | Create Chat page with SignalR | T040 | DONE |
| T043 | Add AuthContext for state management | T038 | DONE |

### Frontend Extras (T045-T050)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T045 | Create Result page for quiz display | T035 | DONE |
| T046 | Create types/index.ts with interfaces | - | DONE |
| T047 | Add PWA manifest and icons | T032 | DONE |
| T048 | Add backend quiz questions endpoint | - | DONE |
| T049 | Create service worker registration in main.tsx | T047 | DONE |
| T050 | Add loading/error boundary components | T040 | DONE |

## MVP Phase 2: Password Auth + i18n + Content

### Backend: Password Authentication (T051-T054)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T051 | Add PasswordHash column to User model | - | DONE |
| T052 | Update AuthDto with password field | T051 | DONE |
| T053 | Update AuthController for password registration | T052 | DONE |
| T054 | Add JWT token issuance on password login | T053 | DONE |

### Frontend: i18n Support (T055-T060)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T055 | Install react-i18next and i18next | - | DONE |
| T056 | Create i18n configuration file | T055 | DONE |
| T057 | Create English translation JSON files | T056 | DONE |
| T058 | Create Persian (FA) translation JSON files | T056 | DONE |
| T059 | Add language switcher component | T057-T058 | DONE |
| T060 | Update all pages to use i18n translations | T059 | DONE |

### Frontend: RTL Support (T061-T063)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T061 | Add RTL CSS support in Tailwind config | T060 | DONE |
| T062 | Update index.css for RTL layout | T061 | DONE |
| T063 | Test Persian text rendering and alignment | T062 | DONE |

### Content: Filled Pages (T064-T070)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T064 | Write Home page content (EN/FA) | - | DONE |
| T065 | Write Quiz page instructions (EN/FA) | T064 | DONE |
| T066 | Write Result page descriptions for all 16 types | T065 | DONE |
| T067 | Write Dashboard page content (EN/FA) | T064 | DONE |
| T068 | Write Chat page placeholder text (EN/FA) | T064 | DONE |
| T069 | Add MBTI type descriptions and traits data | T066 | DONE |
| T070 | Add footer links and about section content | T064 | DONE |

### Testing & Polish (T071-T073)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T071 | Test full registration flow with password | T054 | DONE |
| T072 | Test language toggle and RTL layout | T063 | DONE |
| T073 | Verify all pages display correctly in both languages | T070-T072 | DONE |

## Phase 3: User Feedback Implementation

### Backend: Enhanced User Model (T074-T080)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T074 | Add FullName column to User model | - | DONE |
| T075 | Add City column to User model | T074 | DONE |
| T076 | Add Latitude and Longitude columns to User model | T074 | DONE |
| T077 | Add ProfilePhotoPath column to User model | T074 | DONE |
| T078 | Add TermsAccepted column to User model | T074 | DONE |
| T079 | Add AllowChat, AllowMeetInPerson, AllowCallVerification columns to User model | T078 | DONE |
| T080 | Add InterestedMBTIs column to User model | T079 | DONE |

### Backend: Enhanced Registration API (T081-T086)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T081 | Update RegisterRequest DTO with new fields | T074 | DONE |
| T082 | Add file upload handling to AuthController | T081 | DONE |
| T083 | Update ApplicationDbContext for new User columns | T074 | DONE |
| T084 | Create migration for User table changes | T083 | DONE |
| T085 | Add validation for required registration fields | T082 | DONE |
| T086 | Test enhanced registration endpoint | T085 | DONE |

### Frontend: Enhanced Registration Form (T087-T095)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T087 | Add full name input field to registration form | - | PENDING |
| T088 | Add city input field to registration form | T087 | PENDING |
| T089 | Add photo upload component to registration form | T088 | PENDING |
| T090 | Add geolocation button and API integration | T089 | PENDING |
| T091 | Add terms acceptance checkbox to registration form | T090 | PENDING |
| T092 | Add chat preference checkbox to registration form | T091 | PENDING |
| T093 | Add meet-in-person preference checkbox to registration form | T092 | PENDING |
| T094 | Add call verification consent checkbox to registration form | T093 | PENDING |
| T095 | Add MBTI type interest multi-select to registration form | T094 | PENDING |

### Frontend: Registration i18n (T096-T097)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T096 | Add registration translations to English JSON | - | PENDING |
| T097 | Add registration translations to Persian JSON | T096 | PENDING |

### Backend: Safety Filter Service (T098-T103)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T098 | Create SafetyFilterService interface | - | PENDING |
| T099 | Implement English profanity word list | T098 | PENDING |
| T100 | Implement Persian profanity word list | T098 | PENDING |
| T101 | Create filter method for text content | T099-T100 | PENDING |
| T102 | Integrate safety filter into AuthController | T101 | PENDING |
| T103 | Integrate safety filter into ChatController | T101 | PENDING |

### Frontend: Safety Filter Component (T104-T106)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T104 | Create client-side content validation utility | - | PENDING |
| T105 | Add real-time input validation to registration form | T104 | PENDING |
| T106 | Add real-time message validation to chat page | T104 | PENDING |

### Content: Funny MBTI Descriptions (T107-T122)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T107 | Write funny INTJ description (EN/FA) | - | PENDING |
| T108 | Write funny INTP description (EN/FA) | T107 | PENDING |
| T109 | Write funny ENTJ description (EN/FA) | T107 | PENDING |
| T110 | Write funny ENTP description (EN/FA) | T107 | PENDING |
| T111 | Write funny INFJ description (EN/FA) | T107 | PENDING |
| T112 | Write funny INFP description (EN/FA) | T107 | PENDING |
| T113 | Write funny ENFJ description (EN/FA) | T107 | PENDING |
| T114 | Write funny ENFP description (EN/FA) | T107 | PENDING |
| T115 | Write funny ISTJ description (EN/FA) | T107 | PENDING |
| T116 | Write funny ISFJ description (EN/FA) | T107 | PENDING |
| T117 | Write funny ESFJ description (EN/FA) | T107 | PENDING |
| T118 | Write funny ESTJ description (EN/FA) | T107 | PENDING |
| T119 | Write funny ISTP description (EN/FA) | T107 | PENDING |
| T120 | Write funny ISFP description (EN/FA) | T107 | PENDING |
| T121 | Write funny ESFP description (EN/FA) | T107 | PENDING |
| T122 | Write funny ESTP description (EN/FA) | T107 | PENDING |

### Content: Legal Agreement Page (T123-T128)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T123 | Create Legal.tsx page component | - | PENDING |
| T124 | Add /legal route to router | T123 | PENDING |
| T125 | Write Terms of Service content (EN/FA) | - | PENDING |
| T126 | Write Privacy Policy content (EN/FA) | T125 | PENDING |
| T127 | Write Cookie Policy content (EN/FA) | T126 | PENDING |
| T128 | Update Footer with legal page link | T123 | PENDING |

### Testing: Unit Tests (T129-T135)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T129 | Create backend test project structure | - | PENDING |
| T130 | Write AuthController registration tests | T129 | PENDING |
| T131 | Write SafetyFilterService tests | T129 | PENDING |
| T132 | Write password hashing tests | T130 | PENDING |
| T133 | Create frontend test setup | - | PENDING |
| T134 | Write registration form validation tests | T133 | PENDING |
| T135 | Write i18n translation verification tests | T133 | PENDING |

### Documentation Updates (T136-T138)
| ID | Goal | Dependencies | Status |
|----|------|--------------|--------|
| T136 | Update PROJECT_PLAN.md with new features | - | PENDING |
| T137 | Update PROJECT_STATUS.md with current progress | T136 | PENDING |
| T138 | Update AI_CONTEXT.md with latest decisions | T137 | PENDING |

## Phase 4: Post-MVP Future Features
| ID | Goal | Dependencies |
|----|------|--------------|
| T139 | Implement deterministic MBTI matching algorithm | - |
| T140 | Add AI-driven compatibility recommendations | T139 |
| T141 | Add analytics dashboard | - |
| T142 | Performance optimization and load testing | - |
| T143 | Add SMS OTP verification | - |
| T144 | Implement photo storage with cloud provider | T077 |
| T145 | Add user profile display page | T087-T095 |
| T146 | Add match preferences filtering | T095 |
