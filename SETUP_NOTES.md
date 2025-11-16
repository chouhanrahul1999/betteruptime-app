# Setup Notes - Current State

## ✅ What's Already Done

### 1. Docker Services
- **File:** `docker-compose.yml`
- **Services:** Postgres (port 5432), Redis (port 6379), Kafka (port 9092), Zookeeper (port 2181)
- **Credentials:** 
  - Username: `postgres`
  - Password: `postgres`
  - Database: `uptime`

### 2. Environment Variables
All services have `.env` and `example.env` files with correct DATABASE_URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uptime"
```

**Files:**
- `packages/store/.env` & `example.env`
- `apps/api/.env` & `example.env` (also has JWT_SECRET, Gmail config)
- `apps/worker/.env` & `example.env`
- `apps/pusher/.env` & `example.env`
- `apps/notification-worker/.env` & `example.env` (Kafka + Gmail config)
- `apps/tests/.env` & `example.env`

### 3. Start Script
**File:** `start.sh`

**What it does:**
1. Starts Docker (Postgres + Redis + Kafka + Zookeeper)
2. Waits 5 seconds
3. Runs Prisma migrations
4. Starts all apps with Turborepo

**Usage:**
```bash
./start.sh
```

### 4. Running Services
When you run `./start.sh`, these start automatically:
- ✅ **Frontend** - http://localhost:3000
- ✅ **API** - http://localhost:8000
- ✅ **Worker** - Monitors websites and publishes to Kafka
- ✅ **Notification Worker** - Consumes Kafka events and sends alerts
- ✅ **Pusher** - Pushes websites to Redis queue

### 5. Database
- ✅ Migrations applied
- ✅ Tables created (user, website, website_tick, integration, notification_log)
- ✅ Prisma Client generated

### 6. Kafka System
- ✅ Kafka and Zookeeper containers
- ✅ Worker publishes DOWN events to Kafka
- ✅ Notification worker consumes events and sends alerts
- ✅ Support for Email, Slack, Discord, Telegram, Webhook notifications

---

## 🚀 Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER ADDS MONITOR                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  PUSHER (every 3 min)                                   │
│  - Fetches all websites from DB                         │
│  - Pushes to Redis Stream                               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  REDIS STREAM (india, usa)                              │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  WORKER (2 regions)                                     │
│  - Consumes from Redis Stream                           │
│  - Checks website availability                          │
│  - Saves to website_tick table                          │
│  - Publishes DOWN events to Kafka                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  KAFKA                                                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  NOTIFICATION WORKER                                    │
│  - Consumes Kafka events                               │
│  - Sends Email/Slack/Discord/Telegram/Webhook alerts   │
│  - Logs notifications to database                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Quick Commands

### Start Everything
```bash
./start.sh
```

### Stop Everything
```bash
# Ctrl+C to stop apps
docker-compose down
```

### View Logs
```bash
# Docker logs
docker logs uptime-postgres
docker logs uptime-redis
docker logs kafka
docker logs zookeeper

# App logs are shown in terminal when running ./start.sh
```

### Database Management
```bash
cd packages/store

# View database in GUI
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Regenerate Prisma Client
npx prisma generate
```

### Manual Start (if needed)
```bash
# Terminal 1 - Docker
docker-compose up

# Terminal 2 - API
cd apps/api && bun --watch index.ts

# Terminal 3 - Worker
cd apps/worker && bun --watch index.ts

# Terminal 4 - Notification Worker
cd apps/notification-worker && bun --watch index.ts

# Terminal 5 - Pusher
cd apps/pusher && bun --watch index.ts

# Terminal 6 - Frontend
cd apps/frontend && npm run dev
```

---

## 🔧 Troubleshooting

### "Authentication failed" error
- Check all `.env` files have: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uptime"`
- Run: `cd packages/store && npx prisma generate`

### "Cannot connect to Redis"
- Check Redis is running: `docker ps | grep redis`
- Restart: `docker-compose restart redis`

### "Cannot connect to Kafka"
- Check Kafka is running: `docker ps | grep kafka`
- Restart: `docker-compose restart kafka zookeeper`

### "Port already in use"
- Frontend uses port 3000
- API uses port 8000
- Kill process: `lsof -ti:3000 | xargs kill -9`

### Prisma Client issues
```bash
cd packages/store
rm -rf node_modules generated
npm install
npx prisma generate
```

---

## ✅ System is Complete

The BetterUptime monitoring system is fully implemented with:

- ✅ Multi-region website monitoring
- ✅ Real-time notifications via multiple channels
- ✅ Kafka-based event system
- ✅ Database logging of all notifications
- ✅ Modern React dashboard
- ✅ Docker containerization
- ✅ Complete API endpoints

Ready for production deployment!