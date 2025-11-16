# BetterUptime App

A comprehensive website monitoring and alerting system built with modern technologies. Monitor your websites' uptime, response times, and get instant notifications when issues occur.

## 🚀 Features

- **Real-time Website Monitoring** - Monitor multiple websites with configurable intervals
- **Multi-region Monitoring** - Check websites from different geographical locations
- **Instant Alerts** - Get notified via Email, Slack, Discord, Telegram, or Webhooks when sites go down
- **Response Time Tracking** - Track and visualize website response times over time
- **Uptime Statistics** - Detailed uptime reports and analytics
- **Dashboard** - Clean, intuitive dashboard to manage all your monitors
- **Integration Management** - Configure multiple notification channels

## 🏗️ Architecture

This is a Turborepo monorepo containing:

### Apps
- **`frontend`** - Next.js dashboard application
- **`api`** - Express.js REST API server
- **`worker`** - Website monitoring workers (multi-region)
- **`notification-worker`** - Kafka consumer for sending notifications
- **`pusher`** - Redis stream publisher for monitoring tasks
- **`tests`** - End-to-end testing suite

### Packages
- **`store`** - Prisma database schema and client
- **`kafka`** - Kafka producer/consumer utilities
- **`redisstream`** - Redis stream utilities
- **`eslint-config`** - Shared ESLint configuration
- **`typescript-config`** - Shared TypeScript configuration

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Message Queue**: Apache Kafka
- **Caching**: Redis Streams
- **Monitoring**: Multi-region workers
- **Notifications**: Email, Slack, Discord, Telegram, Webhooks

## 📋 Prerequisites

### For Docker Setup
- Docker
- Docker Compose

### For Local Development
- Node.js 18+
- PostgreSQL
- Redis
- Apache Kafka
- Bun (recommended) or npm/yarn

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd betteruptime-app
   ```

2. **Start with Docker Compose**
   ```bash
   # Start all services including PostgreSQL, Redis, and Kafka
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8000

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd betteruptime-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Copy example.env files and configure:
   ```bash
   # Copy all example.env files to .env and configure
   cp apps/api/example.env apps/api/.env
   cp apps/worker/example.env apps/worker/.env
   cp apps/notification-worker/example.env apps/notification-worker/.env
   cp packages/store/example.env packages/store/.env
   # ... configure other .env files
   ```

4. **Set up the database**
   ```bash
   cd packages/store
   bunx prisma migrate dev
   bunx prisma generate
   ```

5. **Start services**
   ```bash
   # Start all services
   bun dev
   
   # Or start individual services
   bun dev --filter=frontend
   bun dev --filter=api
   bun dev --filter=worker
   ```

## 📁 Project Structure

```
betteruptime-app/
├── apps/
│   ├── frontend/          # Next.js dashboard
│   ├── api/              # REST API server
│   ├── worker/           # Website monitoring workers
│   ├── notification-worker/ # Notification sender
│   ├── pusher/           # Redis stream publisher
│   └── tests/            # E2E tests
├── packages/
│   ├── store/            # Database schema & client
│   ├── kafka/            # Kafka utilities
│   ├── redisstream/      # Redis stream utilities
│   └── typescript-config/ # Shared TS config
└── README.md
```

## 🔧 Configuration

### Environment Variables

Each service requires specific environment variables. Check the `example.env` files in each directory:

- **Database**: PostgreSQL connection string
- **JWT**: Secret for authentication
- **Email**: Gmail credentials for notifications
- **Kafka**: Broker configuration
- **Redis**: Connection details

### Adding Monitors

1. Access the dashboard at `http://localhost:3000`
2. Sign up/Login
3. Click "Add Monitor" and enter website URL
4. Configure notification integrations
5. Monitor will start checking automatically

## 📊 Monitoring Flow

1. **Pusher** adds websites to Redis streams
2. **Workers** (multi-region) consume from streams and check websites
3. **Workers** store results in database and publish events to Kafka
4. **Notification Worker** consumes Kafka events and sends alerts
5. **Frontend** displays real-time data from the database

## 🔔 Notification Channels

- **Email** - SMTP via Gmail
- **Slack** - Webhook integration
- **Discord** - Webhook integration  
- **Telegram** - Bot API
- **Webhook** - Custom HTTP endpoints

## 🧪 Testing

```bash
# Run all tests
bun test

# Run specific test suite
bun test --filter=tests
```

## 🐳 Docker Deployment

The project includes Docker configuration for easy deployment:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Scale workers for different regions
docker-compose up --scale worker=3

# View service status
docker-compose ps
```

## 📈 Scaling

- **Horizontal**: Add more worker instances for different regions
- **Database**: Use read replicas for analytics queries
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Multiple API instances behind load balancer
- **Containerization**: Docker support for easy deployment and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details