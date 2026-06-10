# MBTI Match - Docker Deployment

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- At least 2GB RAM available

## Quick Start (One Command)

```bash
docker-compose up --build
```

That's it! The entire application stack will start:

| Service | URL | Port |
|---------|-----|------|
| Frontend (React PWA) | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8080/api | 8080 |
| PostgreSQL Database | localhost:5432 | 5432 |

## Services

- **postgres** - PostgreSQL 16 database with MBTI Match schema
- **backend** - ASP.NET Core 9 API (JWT auth, SignalR chat, safety filter)
- **frontend** - React 18 PWA with nginx reverse proxy

## Stopping the Application

```bash
docker-compose down
```

## Stopping and Deleting Data (Fresh Start)

```bash
docker-compose down -v
```

## Accessing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Database Credentials

| Setting | Value |
|---------|-------|
| Host | postgres (inside Docker) / localhost (outside) |
| Port | 5432 |
| Database | mbtimatch |
| Username | postgres |
| Password | postgres |

## Production Deployment

For production, update `backend/appsettings.Production.json` with:
- A secure JWT key (at least 32 characters)
- A strong database password
- CORS origins for your domain

## Troubleshooting

### Port conflicts
If ports 3000, 8080, or 5432 are already in use, edit `docker-compose.yml` and change the host port mappings:
```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

### Database connection issues
Ensure the postgres service is healthy:
```bash
docker-compose ps
```

### Backend not starting
Check backend logs for migration errors:
```bash
docker-compose logs backend
```
