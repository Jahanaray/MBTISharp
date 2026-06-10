# Project Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (PWA)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   React TS   │  │  Tailwind    │  │  Service     │ │
│  │   + Vite     │  │  + shadcn/ui │  │  Worker      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    API Gateway                          │
│              (ASP.NET Core 9)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   REST API   │  │ SignalR Hub  │  │   Auth       │ │
│  │   (Controllers)│ │  (Chat)      │  │   (JWT)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                           │
│              (Entity Framework Core)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                 │  │
│  │  ┌────────┐ ┌───────┐ ┌────────┐ ┌──────────┐  │  │
│  │  │ Users  │ │Quiz   │ │ Matches│ │ Messages │  │  │
│  │  └────────┘ └───────┘ └────────┘ └──────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Project Structure
```
backend/
├── Controllers/          # API endpoints
│   ├── AuthController.cs
│   ├── QuizController.cs
│   ├── MatchController.cs
│   └── ChatController.cs
├── Models/               # EF Core entities
│   ├── User.cs
│   ├── Question.cs
│   ├── Answer.cs
│   ├── Match.cs
│   └── Message.cs
├── DTOs/                 # Data Transfer Objects
│   ├── AuthDto.cs
│   ├── QuizDto.cs
│   ├── MatchDto.cs
│   └── ChatDto.cs
├── Services/             # Business logic
│   ├── AuthService.cs
│   ├── QuizService.cs
│   ├── MatchService.cs
│   └── ChatService.cs
├── Data/                 # Database context
│   └── ApplicationDbContext.cs
├── Hubs/                 # SignalR hubs
│   └── ChatHub.cs
├── Middleware/           # Custom middleware
│   └── ExceptionMiddleware.cs
└── Program.cs            # Application entry point
```

### Core Components

#### Auth Service
- Phone number registration with OTP verification
- JWT token generation and validation
- Token refresh mechanism

#### Quiz Service
- Retrieve 15 MBTI-style questions
- Calculate personality type from answers
- Store results in database

#### Match Service
- Random matching algorithm (MVP)
- Match creation and retrieval
- Match expiration handling

#### Chat Service
- Message persistence via EF Core
- Real-time delivery via SignalR
- Message history retrieval

## Frontend Architecture

### Project Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── ChatBubble/
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Quiz.tsx
│   │   ├── Result.tsx
│   │   ├── Login.tsx
│   │   └── Chat.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useQuiz.ts
│   │   └── useChat.ts
│   ├── api/              # API client functions
│   │   ├── auth.ts
│   │   ├── quiz.ts
│   │   ├── match.ts
│   │   └── chat.ts
│   ├── store/            # State management
│   │   ├── AuthContext.tsx
│   │   └── ChatContext.tsx
│   ├── utils/            # Utility functions
│   │   └── mbtiCalculator.ts
│   └── types/            # TypeScript interfaces
│       └── index.ts
├── public/               # Static assets
│   ├── manifest.json
│   └── icons/
├── service-worker.ts     # PWA service worker
└── vite.config.ts        # Vite configuration
```

### Component Hierarchy
```
App
├── Router
│   ├── PublicRoutes
│   │   ├── Home (Landing page)
│   │   └── Quiz (MBTI test)
│   └── ProtectedRoutes
│       ├── Result (Personality type display)
│       ├── Login (Phone verification)
│       ├── Dashboard (Match status)
│       └── Chat (Real-time messaging)
```

## Database Design

### Entity Relationships
```
User (1) ──────< (N) Answer
User (1) ──────< (N) Match (as UserA)
User (1) ──────< (N) Match (as UserB)
User (1) ──────< (N) Message
Match (1) ─────> (N) Message
```

### Tables

#### Users
| Column | Type | Constraints |
|--------|------|-------------|
| Id | Guid | PK, default newid() |
| PhoneNumber | nvarchar(20) | Unique, not null |
| PhoneVerified | bit | default false |
| MBTIType | nvarchar(4) | nullable |
| CreatedAt | datetime2 | default getutcdate() |
| UpdatedAt | datetime2 | default getutcdate() |

#### Questions
| Column | Type | Constraints |
|--------|------|-------------|
| Id | int | PK, identity |
| Text | nvarchar(500) | not null |
| Dimension | nvarchar(10) | not null (EI/SN/TJ/CP) |
| OptionA | nvarchar(100) | not null |
| OptionB | nvarchar(100) | not null |
| WeightA | int | default 1 |
| WeightB | int | default 0 |

#### Answers
| Column | Type | Constraints |
|--------|------|-------------|
| Id | Guid | PK, default newid() |
| UserId | Guid | FK → Users.Id |
| QuestionId | int | FK → Questions.Id |
| SelectedOption | nvarchar(10) | not null |
| CreatedAt | datetime2 | default getutcdate() |

#### Matches
| Column | Type | Constraints |
|--------|------|-------------|
| Id | Guid | PK, default newid() |
| UserAId | Guid | FK → Users.Id |
| UserBId | Guid | FK → Users.Id |
| Status | nvarchar(20) | not null (pending/active/expired) |
| MatchedAt | datetime2 | default getutcdate() |

#### Messages
| Column | Type | Constraints |
|--------|------|-------------|
| Id | Guid | PK, default newid() |
| MatchId | Guid | FK → Matches.Id |
| SenderId | Guid | FK → Users.Id |
| Content | nvarchar(2000) | not null |
| SentAt | datetime2 | default getutcdate() |

## Authentication Flow

```
┌──────┐          ┌───────┐          ┌──────┐
│ User │          │  API  │          │  DB  │
└──┬───┘          └───┬───┘          └──┬───┘
   │                   │                   │
   │ POST /register    │                   │
   │ {phone}           │                   │
   │──────────────────>│                   │
   │                   │  Generate OTP     │
   │                   │──────────────────>│
   │                   │  Store hashed OTP │
   │                   │<──────────────────│
   │  "Check SMS"      │                   │
   │<──────────────────│                   │
   │                   │                   │
   │ POST /verify      │                   │
   │ {phone, otp}      │                   │
   │──────────────────>│                   │
   │                   │  Validate OTP     │
   │                   │──────────────────>│
   │                   │  Generate JWT     │
   │<──────────────────│                   │
   │ {token}           │                   │
```

## Chat Architecture

### SignalR Hub Methods
- `SendMessage(string userId, string content)` - Send message to match
- `JoinMatch(string matchId)` - Join match group
- `LeaveMatch(string matchId)` - Leave match group

### Client-Side Flow
```
┌─────────┐          ┌──────────┐          ┌─────────┐
│ React   │          │ SignalR  │          │  API    │
│ Client  │          │  Hub     │          │  Server │
└────┬────┘          └────┬─────┘          └────┬────┘
     │                    │                      │
     │ JoinMatch(matchId) │                      │
     │───────────────────>│                      │
     │                    │  Subscribe to group  │
     │<───────────────────│                      │
     │                    │                      │
     │ SendMessage(msg)   │                      │
     │───────────────────>│                      │
     │                    │  Save to DB          │
     │                    │─────────────────────>│
     │                    │<─────────────────────│
     │                    │  Broadcast to group  │
     │<───────────────────│                      │
     │ {message}          │                      │
```

## Deployment Architecture

### Development Environment
- Local PostgreSQL instance
- Vite dev server (frontend)
- Kestrel server (backend)

### Production Environment
```
┌─────────────────┐
│  Azure Front    │
│  Door (CDN)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │  WAF    │
    └────┬────┘
         │
┌────────┴────────┐
│  Azure App      │
│  Service (PWA)  │
└────────┬────────┘
         │
┌────────┴────────┐
│  Azure App      │
│  Service (.NET) │
└────────┬────────┘
         │
┌────────┴────────┐
│  Azure SQL      │
│  Database       │
└─────────────────┘
```

## Security Considerations

1. **Authentication**: JWT with refresh tokens, 15-minute access token expiry
2. **Authorization**: Role-based access control (User, Admin)
3. **Data Protection**: HTTPS everywhere, encrypted PII in database
4. **Rate Limiting**: API rate limiting for auth endpoints
5. **Input Validation**: Server-side validation for all inputs

---
*Architect – MBTI Match Team*
