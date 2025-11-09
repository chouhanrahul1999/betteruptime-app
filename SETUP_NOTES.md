# Setup Notes - Current State

## ✅ What's Already Done

### 1. Docker Services
- **File:** `docker-compose.yml`
- **Services:** Postgres (port 5432), Redis (port 6379)
- **Credentials:** 
  - Username: `postgres`
  - Password: `postgres`
  - Database: `uptime`

### 2. Environment Variables
All services have `.env` files with correct DATABASE_URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uptime"
```

**Files:**
- `packages/store/.env`
- `apps/api/.env` (also has JWT_SECRET)
- `apps/worker/.env`
- `apps/pusher/.env`

### 3. Start Script
**File:** `start.sh`

**What it does:**
1. Starts Docker (Postgres + Redis)
2. Waits 5 seconds
3. Runs Prisma migrations
4. Starts all apps with Turborepo

**Usage:**
```bash
./start.sh
```

### 4. Running Services
When you run `./start.sh`, these start automatically:
- ✅ **Frontend** - http://localhost:3001
- ✅ **API** - http://localhost:3000
- ✅ **Worker** - Monitors websites every 3 minutes
- ✅ **Pusher** - Pushes websites to Redis queue

### 5. Database
- ✅ Migrations applied
- ✅ Tables created (user, website, website_tick, region)
- ✅ Prisma Client generated

---

## 🚀 Next: Kafka Notification System

### What Needs to Be Added

Refer to `KAFKA_IMPLEMENTATION_GUIDE.md` but note these changes:

#### Phase 1 - Kafka Setup
**Instead of creating new docker-compose.yml, UPDATE existing one:**

Add to your existing `docker-compose.yml`:
```yaml
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    container_name: kafka
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

#### Phase 2 - Database Schema
**Your current schema already has:**
- ✅ user table
- ✅ website table
- ✅ website_tick table
- ✅ region table

**Need to ADD:**
- ❌ integration table
- ❌ notification_log table
- ❌ email field to user table

#### Phases 3-7
Follow the guide as written - no changes needed.

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

# Terminal 4 - Pusher
cd apps/pusher && bun --watch index.ts

# Terminal 5 - Frontend
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

### "Port already in use"
- API uses port 3000
- Frontend uses port 3001 (auto-switches if 3000 is taken)
- Kill process: `lsof -ti:3000 | xargs kill -9`

### Prisma Client issues
```bash
cd packages/store
rm -rf node_modules generated
npm install
npx prisma generate
```

---

## 📊 Current Architecture

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
└─────────────────────────────────────────────────────────┘
```

**After Kafka Implementation:**
```
Worker → Kafka → Notification Worker → Email/Slack/Discord/etc.
```

---

## ✅ Ready for Kafka Implementation

Your project is now properly set up and ready to add the Kafka notification system!

Follow `KAFKA_IMPLEMENTATION_GUIDE.md` starting from Phase 1, with the note about updating (not creating) docker-compose.yml.
