# MBTI Match Backend

ASP.NET Core 9 Web API for the MBTI Match application.

## Prerequisites

- .NET 9 SDK
- PostgreSQL 15+
- Docker (optional)

## Setup

1. Restore packages:
   ```bash
   dotnet restore
   ```

2. Update connection string in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=mbtimatch;Username=postgres;Password=postgres"
     }
   }
   ```

3. Run migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the application:
   ```bash
   dotnet run
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register with phone number |
| POST | /api/auth/verify | Verify OTP and get JWT token |
| POST | /api/quiz/submit | Submit quiz answers |
| GET | /api/quiz/result/{userId} | Get personality result |
| POST | /api/match/create | Create a random match |
| GET | /api/match/me/{userId} | Get current match |
| POST | /api/chat/send | Send a message |
| GET | /api/chat/history/{matchId} | Get chat history |

### SignalR Hub

- **Endpoint**: `/chatHub`
- **Methods**: `JoinMatch`, `LeaveMatch`, `SendMessage`

## Docker

Build and run:
```bash
docker build -t mbtimatch-backend .
docker run -p 8080:8080 -e ConnectionStrings__DefaultConnection="Host=db;Database=mbtimatch;Username=postgres;Password=postgres" mbtimatch-backend
```

## Project Structure

```
backend/
├── Controllers/      # API endpoints
├── DTOs/            # Data Transfer Objects
├── Data/            # DbContext, migrations, seeder
├── Hubs/            # SignalR hubs
├── Models/          # Entity classes
├── Program.cs       # Application entry point
├── appsettings.json # Configuration
└── MBTIMatch.csproj # Project file
```
