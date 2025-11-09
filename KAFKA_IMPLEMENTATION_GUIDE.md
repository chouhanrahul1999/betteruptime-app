# Kafka Notification System - Complete Implementation Guide

> **Comprehensive step-by-step guide to implement event-driven notifications using Kafka**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Phase 1: Infrastructure Setup](#phase-1-infrastructure-setup)
- [Phase 2: Database Schema](#phase-2-database-schema)
- [Phase 3: Update Monitor Worker](#phase-3-update-monitor-worker)
- [Phase 4: Notification Worker](#phase-4-notification-worker)
- [Phase 5: API Endpoints](#phase-5-api-endpoints)
- [Phase 6: Frontend UI](#phase-6-frontend-ui)
- [Phase 7: Testing](#phase-7-testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What You'll Build

A production-grade notification system that:
- Monitors websites for downtime
- Publishes events to Kafka when sites go down
- Consumes events and sends notifications via multiple channels
- Supports Email, Slack, Discord, Telegram, and Custom Webhooks
- Uses 100% free tier services

### Tech Stack

```
Frontend:  Next.js + TypeScript + TailwindCSS
Backend:   Express + TypeScript
Database:  PostgreSQL + Prisma
Cache:     Redis (for monitoring queue)
Messaging: Kafka (for event streaming)
Workers:   Node.js microservices
```

### Event Flow

```
User adds website → Monitor Worker checks every 3 min
                           ↓
                    Website is DOWN
                           ↓
                    Publish to Kafka
                           ↓
                Notification Worker receives event
                           ↓
                Query user's integrations
                           ↓
        Send to Email/Slack/Discord/Telegram/Webhooks
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER ADDS MONITOR                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  MONITOR WORKER (checks every 3 min)                    │
│  - Fetches website                                       │
│  - Saves to website_tick table                          │
│  - Publishes event to Kafka                             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  KAFKA TOPIC: "website.events"                          │
│  Event: { type: "website.down", userId, url, ... }     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  NOTIFICATION WORKER (Kafka Consumer)                   │
│  1. Receives event                                       │
│  2. Queries user's integrations                         │
│  3. Sends to all enabled channels                       │
│  4. Logs notification status                            │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │  Email  │        │  Slack  │        │ Webhook │
   │ (Gmail) │        │         │        │         │
   └─────────┘        └─────────┘        └─────────┘
```

---

## Prerequisites

### Required Software
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (running)
- Redis (running)
- Git

### Required Accounts (All Free)
- Gmail account (for email notifications)
- Slack workspace (optional, for Slack notifications)
- Discord server (optional, for Discord notifications)
- Telegram account (optional, for Telegram notifications)

### Verify Prerequisites

```bash
# Check Node.js
node --version  # Should be 18+

# Check Docker
docker --version
docker-compose --version

# Check if services are running
docker ps
```

---

## Phase 1: Infrastructure Setup

### Step 1.1: Add Kafka to Docker Compose

**File:** `docker-compose.yml`

Add these services at the end:

```yaml
services:
  # ... your existing services (postgres, redis, etc.) ...

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"
    networks:
      - uptime-network

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
    networks:
      - uptime-network

networks:
  uptime-network:
    driver: bridge
```

**Start Kafka:**

```bash
docker-compose up -d zookeeper kafka
```

**Verify Kafka is running:**

```bash
docker ps | grep kafka
# Should show both zookeeper and kafka containers

docker logs kafka
# Should see "Kafka Server started"
```

---

### Step 1.2: Create Kafka Package

**Create folder structure:**

```bash
mkdir -p packages/kafka
cd packages/kafka
```

**Initialize package:**

```bash
npm init -y
```

**Install dependencies:**

```bash
npm install kafkajs
npm install -D typescript @types/node
```

**File:** `packages/kafka/package.json`

```json
{
  "name": "kafka",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "kafkajs": "^2.2.4"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

**File:** `packages/kafka/tsconfig.json`

```json
{
  "extends": "../typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./",
    "declaration": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Step 1.3: Create Kafka Files

**File:** `packages/kafka/topics.ts`

```typescript
export const TOPICS = {
  WEBSITE_EVENTS: 'website.events',
  NOTIFICATIONS: 'notifications.send',
  ANALYTICS: 'analytics.events',
} as const;

export const EVENT_TYPES = {
  WEBSITE_DOWN: 'website.down',
  WEBSITE_UP: 'website.up',
  WEBSITE_SLOW: 'website.slow',
} as const;

export type Topic = typeof TOPICS[keyof typeof TOPICS];
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
```

**File:** `packages/kafka/client.ts`

```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'uptime-monitor',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export default kafka;
```

**File:** `packages/kafka/producer.ts`

```typescript
import kafka from './client';

const producer = kafka.producer();

let isConnected = false;

export async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log('✓ Kafka Producer connected');
  }
}

export async function publishEvent(topic: string, event: any) {
  try {
    await connectProducer();
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(event),
          timestamp: Date.now().toString(),
        },
      ],
    });
    console.log(`✓ Event published to ${topic}:`, event.type);
  } catch (error) {
    console.error('✗ Failed to publish event:', error);
    throw error;
  }
}

export async function disconnectProducer() {
  if (isConnected) {
    await producer.disconnect();
    isConnected = false;
  }
}
```

**File:** `packages/kafka/consumer.ts`

```typescript
import { Consumer, EachMessagePayload } from 'kafkajs';
import kafka from './client';

export class KafkaConsumer {
  private consumer: Consumer;
  private topics: string[];

  constructor(groupId: string, topics: string[]) {
    this.consumer = kafka.consumer({ groupId });
    this.topics = topics;
  }

  async start(handler: (message: any) => Promise<void>) {
    await this.consumer.connect();
    console.log(`✓ Kafka Consumer connected (group: ${this.consumer})`);

    await this.consumer.subscribe({
      topics: this.topics,
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        try {
          const event = JSON.parse(message.value?.toString() || '{}');
          console.log(`✓ Received event from ${topic}:`, event.type);
          await handler(event);
        } catch (error) {
          console.error('✗ Error processing message:', error);
        }
      },
    });
  }

  async stop() {
    await this.consumer.disconnect();
  }
}
```

**File:** `packages/kafka/index.ts`

```typescript
export { publishEvent, connectProducer, disconnectProducer } from './producer';
export { KafkaConsumer } from './consumer';
export { TOPICS, EVENT_TYPES } from './topics';
export type { Topic, EventType } from './topics';
```

**✅ Checkpoint 1:** Kafka package created successfully

---

## Phase 2: Database Schema

### Step 2.1: Update Prisma Schema

**File:** `packages/store/prisma/schema.prisma`

Add email field to user model and create new models:

```prisma
model user {
  id           String        @id @default(uuid())
  username     String        @unique
  password     String
  email        String        @unique  // ADD THIS LINE
  websites     website[]
  integrations integration[] // ADD THIS LINE
}

// ADD THIS ENTIRE MODEL
model integration {
  id         String          @id @default(uuid())
  user_id    String
  type       IntegrationType
  config     Json
  enabled    Boolean         @default(true)
  created_at DateTime        @default(now())
  user       user            @relation(fields: [user_id], references: [id], onDelete: Cascade)
  logs       notification_log[]
}

// ADD THIS ENUM
enum IntegrationType {
  EMAIL
  WEBHOOK
  SLACK
  DISCORD
  TELEGRAM
}

// ADD THIS ENTIRE MODEL
model notification_log {
  id             String             @id @default(uuid())
  event_type     String
  integration_id String
  status         NotificationStatus
  payload        Json
  error_message  String?
  sent_at        DateTime           @default(now())
  integration    integration        @relation(fields: [integration_id], references: [id], onDelete: Cascade)
}

// ADD THIS ENUM
enum NotificationStatus {
  PENDING
  SENT
  FAILED
  RETRYING
}
```

### Step 2.2: Run Migration

```bash
cd packages/store
npx prisma migrate dev --name add_notification_system
```

You'll see output like:
```
✔ Generated Prisma Client
✔ The migration has been created successfully
```

**Generate Prisma Client:**

```bash
npx prisma generate
```

**Verify in database:**

```bash
npx prisma studio
```

Check that these tables exist:
- `integration`
- `notification_log`

**✅ Checkpoint 2:** Database schema updated

---

## Phase 3: Update Monitor Worker

### Step 3.1: Install Kafka in Worker

```bash
cd apps/worker
npm install kafkajs
```

**Update:** `apps/worker/package.json`

Add kafka to dependencies:

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "kafkajs": "^2.2.4",
    "kafka": "workspace:*",
    "redisstream": "workspace:*",
    "store": "workspace:*"
  }
}
```

### Step 3.2: Update Worker Code

**File:** `apps/worker/index.ts`

Replace entire file with:

```typescript
import axios from "axios";
import { xAckBulk, xReadGroup, createConsumerGroup } from "redisstream/client";
import { prismaClient } from "store/client";
import { publishEvent, TOPICS, EVENT_TYPES } from "kafka";

const REGIONS = ["india", "usa"];
const WORKER_ID = "worker1";

async function startWorker(regionId: string) {
  console.log(`Starting worker for region: ${regionId}`);
  
  await createConsumerGroup(regionId);
  
  while (1) {
    const response = await xReadGroup(regionId, WORKER_ID);

    if (!response) {
      continue;
    }

    let promises = response.map(({message}: any) => 
      fetchWebsite(message.url, message.id, regionId)
    );

    await Promise.all(promises);
    console.log(`${regionId}: Processed ${promises.length} websites`);

    await xAckBulk(regionId, response.map(({id}: any) => id));
  }
}

async function fetchWebsite(url: string, websiteId: string, regionId: string) {
  const startTime = Date.now();

  try {
    await axios.get(url);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✓ ${regionId} - ${url}: ${responseTime}ms (UP)`);
    
    await prismaClient.website_tick.create({
      data: {
        response_time_ms: responseTime,
        status: "up",
        region_id: regionId,
        website_id: websiteId
      }
    });

    // Publish UP event to Kafka
    await publishEvent(TOPICS.WEBSITE_EVENTS, {
      type: EVENT_TYPES.WEBSITE_UP,
      websiteId,
      url,
      responseTime,
      regionId,
      timestamp: Date.now(),
    });

  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✗ ${regionId} - ${url}: ${responseTime}ms (DOWN)`);
    
    const website = await prismaClient.website.findUnique({ 
      where: { id: websiteId },
      include: { user: true }
    });
    
    await prismaClient.website_tick.create({
      data: {
        response_time_ms: responseTime,
        status: "Down",
        region_id: regionId,
        website_id: websiteId
      }
    });

    // Publish DOWN event to Kafka
    if (website) {
      await publishEvent(TOPICS.WEBSITE_EVENTS, {
        type: EVENT_TYPES.WEBSITE_DOWN,
        websiteId,
        userId: website.user_id,
        url,
        responseTime,
        regionId,
        timestamp: Date.now(),
      });
    }
  }
}

REGIONS.forEach(region => startWorker(region));
```

### Step 3.3: Test Worker

```bash
cd apps/worker
npm run dev
```

You should see:
```
Starting worker for region: india
Starting worker for region: usa
✓ Kafka Producer connected
```

**✅ Checkpoint 3:** Monitor worker publishes to Kafka

---

## Phase 4: Notification Worker

### Step 4.1: Create Notification Worker Structure

```bash
mkdir -p apps/notification-worker/handlers
cd apps/notification-worker
```

**Initialize:**

```bash
npm init -y
```

**Install dependencies:**

```bash
npm install kafkajs nodemailer axios
npm install -D typescript @types/node @types/nodemailer tsx
```

**File:** `apps/notification-worker/package.json`

```json
{
  "name": "notification-worker",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "kafkajs": "^2.2.4",
    "nodemailer": "^6.9.0",
    "kafka": "workspace:*",
    "store": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/nodemailer": "^6.4.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

**File:** `apps/notification-worker/tsconfig.json`

```json
{
  "extends": "../../packages/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./"
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Step 4.2: Setup Gmail for Email Notifications

**Enable 2-Factor Authentication:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

**Generate App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Uptime Monitor"
4. Copy the 16-character password

**File:** `apps/notification-worker/.env`

```env
KAFKA_BROKER=localhost:9092
DATABASE_URL=postgresql://user:password@localhost:5432/uptime

# Gmail
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Telegram (optional)
TELEGRAM_BOT_TOKEN=
```

---

### Step 4.3: Create Notification Handlers

**File:** `apps/notification-worker/handlers/email.ts`

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(config: any, event: any) {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: config.email,
    subject: `🚨 Website Down Alert: ${event.url}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🚨 Website Down Alert</h2>
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Website:</strong> ${event.url}</p>
          <p><strong>Status:</strong> Down</p>
          <p><strong>Region:</strong> ${event.regionId}</p>
          <p><strong>Time:</strong> ${new Date(event.timestamp).toLocaleString()}</p>
          <p><strong>Response Time:</strong> ${event.responseTime}ms</p>
        </div>
        <p style="color: #666;">This is an automated alert from your uptime monitoring system.</p>
      </div>
    `,
  });
}
```

**File:** `apps/notification-worker/handlers/webhook.ts`

```typescript
import axios from 'axios';

export async function sendWebhook(config: any, event: any) {
  await axios.post(
    config.webhookUrl,
    {
      event: event.type,
      url: event.url,
      status: 'down',
      region: event.regionId,
      responseTime: event.responseTime,
      timestamp: event.timestamp,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
      timeout: 5000,
    }
  );
}
```

**File:** `apps/notification-worker/handlers/slack.ts`

```typescript
import axios from 'axios';

export async function sendSlack(config: any, event: any) {
  await axios.post(config.webhookUrl, {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🚨 Website Down Alert',
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Website:*\n${event.url}` },
          { type: 'mrkdwn', text: `*Status:*\nDown` },
          { type: 'mrkdwn', text: `*Region:*\n${event.regionId}` },
          { type: 'mrkdwn', text: `*Response Time:*\n${event.responseTime}ms` },
        ],
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Time: ${new Date(event.timestamp).toLocaleString()}`,
          },
        ],
      },
    ],
  });
}
```

**File:** `apps/notification-worker/handlers/discord.ts`

```typescript
import axios from 'axios';

export async function sendDiscord(config: any, event: any) {
  await axios.post(config.webhookUrl, {
    embeds: [
      {
        title: '🚨 Website Down Alert',
        color: 0xff0000,
        fields: [
          { name: 'Website', value: event.url, inline: true },
          { name: 'Status', value: 'Down', inline: true },
          { name: 'Region', value: event.regionId, inline: true },
          { name: 'Response Time', value: `${event.responseTime}ms`, inline: true },
          { name: 'Time', value: new Date(event.timestamp).toLocaleString() },
        ],
        timestamp: new Date(event.timestamp).toISOString(),
      },
    ],
  });
}
```

**File:** `apps/notification-worker/handlers/telegram.ts`

```typescript
import axios from 'axios';

export async function sendTelegram(config: any, event: any) {
  const message = `
🚨 *Website Down Alert*

*Website:* ${event.url}
*Status:* Down
*Region:* ${event.regionId}
*Response Time:* ${event.responseTime}ms
*Time:* ${new Date(event.timestamp).toLocaleString()}
  `;

  await axios.post(
    `https://api.telegram.org/bot${config.botToken}/sendMessage`,
    {
      chat_id: config.chatId,
      text: message,
      parse_mode: 'Markdown',
    }
  );
}
```

---

### Step 4.4: Create Main Consumer

**File:** `apps/notification-worker/index.ts`

```typescript
import { KafkaConsumer, TOPICS, EVENT_TYPES } from 'kafka';
import { prismaClient } from 'store/client';
import { sendEmail } from './handlers/email';
import { sendWebhook } from './handlers/webhook';
import { sendSlack } from './handlers/slack';
import { sendDiscord } from './handlers/discord';
import { sendTelegram } from './handlers/telegram';

async function handleEvent(event: any) {
  // Only process DOWN events
  if (event.type !== EVENT_TYPES.WEBSITE_DOWN) {
    return;
  }

  console.log(`Processing notification for: ${event.url}`);

  // Get user's enabled integrations
  const integrations = await prismaClient.integration.findMany({
    where: {
      user_id: event.userId,
      enabled: true,
    },
  });

  console.log(`Found ${integrations.length} enabled integrations`);

  // Send to all enabled channels
  for (const integration of integrations) {
    try {
      console.log(`Sending ${integration.type} notification...`);

      switch (integration.type) {
        case 'EMAIL':
          await sendEmail(integration.config, event);
          break;
        case 'WEBHOOK':
          await sendWebhook(integration.config, event);
          break;
        case 'SLACK':
          await sendSlack(integration.config, event);
          break;
        case 'DISCORD':
          await sendDiscord(integration.config, event);
          break;
        case 'TELEGRAM':
          await sendTelegram(integration.config, event);
          break;
      }

      // Log success
      await prismaClient.notification_log.create({
        data: {
          event_type: event.type,
          integration_id: integration.id,
          status: 'SENT',
          payload: event,
        },
      });

      console.log(`✓ ${integration.type} notification sent`);
    } catch (error: any) {
      console.error(`✗ ${integration.type} notification failed:`, error.message);

      // Log failure
      await prismaClient.notification_log.create({
        data: {
          event_type: event.type,
          integration_id: integration.id,
          status: 'FAILED',
          payload: event,
          error_message: error.message,
        },
      });
    }
  }
}

async function main() {
  console.log('🚀 Starting Notification Worker...');

  const consumer = new KafkaConsumer('notification-group', [TOPICS.WEBSITE_EVENTS]);

  await consumer.start(handleEvent);

  console.log('✓ Notification Worker is running');
}

main().catch(console.error);
```

### Step 4.5: Test Notification Worker

```bash
cd apps/notification-worker
npm run dev
```

You should see:
```
🚀 Starting Notification Worker...
✓ Kafka Consumer connected (group: notification-group)
✓ Notification Worker is running
```

**✅ Checkpoint 4:** Notification worker created

---

## Phase 5: API Endpoints

### Step 5.1: Create Integration Routes

**File:** `apps/api/routes/v1/integrations.ts`

```typescript
import { Router } from 'express';
import { prismaClient } from 'store/client';

const router = Router();

// Create integration
router.post('/', async (req, res) => {
  try {
    const { type, config } = req.body;
    const userId = req.user?.id; // Assuming auth middleware

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const integration = await prismaClient.integration.create({
      data: {
        user_id: userId,
        type,
        config,
        enabled: true,
      },
    });

    res.json(integration);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List integrations
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const integrations = await prismaClient.integration.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    res.json(integrations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update integration
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { config } = req.body;
    const userId = req.user?.id;

    const integration = await prismaClient.integration.updateMany({
      where: {
        id,
        user_id: userId,
      },
      data: { config },
    });

    res.json(integration);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle integration
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const current = await prismaClient.integration.findFirst({
      where: { id, user_id: userId },
    });

    if (!current) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const updated = await prismaClient.integration.update({
      where: { id },
      data: { enabled: !current.enabled },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete integration
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await prismaClient.integration.deleteMany({
      where: {
        id,
        user_id: userId,
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### Step 5.2: Register Routes

**File:** `apps/api/index.ts`

Add this import and route:

```typescript
import integrationRoutes from './routes/v1/integrations';

// ... existing code ...

app.use('/api/v1/integrations', integrationRoutes);
```

### Step 5.3: Test API

```bash
# Start API server
cd apps/api
npm run dev
```

**Test with curl:**

```bash
# Create email integration
curl -X POST http://localhost:3001/api/v1/integrations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "EMAIL",
    "config": {
      "email": "test@example.com"
    }
  }'

# List integrations
curl http://localhost:3001/api/v1/integrations
```

**✅ Checkpoint 5:** API endpoints working

---

## Phase 6: Frontend UI

### Step 6.1: Update Dashboard Page

**File:** `apps/frontend/app/dashboard/[[...slug]]/page.tsx`

Add integration view check:

```typescript
const isIntegrationsView = pathParts[1] === "integrations";

// ... existing code ...

if (isIntegrationsView) {
  return <IntegrationsPage />;
}
```

### Step 6.2: Create Integration Components Folder

```bash
mkdir -p apps/frontend/components/integrations
```

### Step 6.3: Create Integrations Page

**File:** `apps/frontend/components/integrations/IntegrationsPage.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IntegrationCard } from "./IntegrationCard";
import { AddIntegrationModal } from "./AddIntegrationModal";

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch('/api/v1/integrations');
      const data = await res.json();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-950 text-white p-8">
        <div className="text-center">Loading integrations...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-slate-400 mt-2">
            Connect your notification channels
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Integration
        </Button>
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>No integrations configured yet.</p>
          <p className="mt-2">Click "Add Integration" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration: any) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onUpdate={fetchIntegrations}
            />
          ))}
        </div>
      )}

      <AddIntegrationModal
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchIntegrations}
      />
    </div>
  );
}
```

### Step 6.4: Create Integration Card

**File:** `apps/frontend/components/integrations/IntegrationCard.tsx`

```typescript
"use client";

import { Mail, Webhook, MessageSquare, Hash, Send, Trash2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ICONS = {
  EMAIL: Mail,
  WEBHOOK: Webhook,
  SLACK: MessageSquare,
  DISCORD: Hash,
  TELEGRAM: Send,
};

interface IntegrationCardProps {
  integration: any;
  onUpdate: () => void;
}

export function IntegrationCard({ integration, onUpdate }: IntegrationCardProps) {
  const Icon = ICONS[integration.type as keyof typeof ICONS];

  const handleToggle = async () => {
    await fetch(`/api/v1/integrations/${integration.id}/toggle`, {
      method: 'PATCH',
    });
    onUpdate();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this integration?')) {
      await fetch(`/api/v1/integrations/${integration.id}`, {
        method: 'DELETE',
      });
      onUpdate();
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <Icon size={20} className="text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{integration.type}</h3>
            <p className="text-sm text-slate-400">
              {integration.enabled ? 'Active' : 'Disabled'}
            </p>
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            integration.enabled ? 'bg-green-500' : 'bg-slate-600'
          }`}
        />
      </div>

      <div className="text-sm text-slate-400 mb-4">
        {integration.type === 'EMAIL' && `Email: ${integration.config.email}`}
        {integration.type === 'WEBHOOK' && `URL: ${integration.config.webhookUrl}`}
        {integration.type === 'SLACK' && 'Slack Workspace'}
        {integration.type === 'DISCORD' && 'Discord Server'}
        {integration.type === 'TELEGRAM' && 'Telegram Bot'}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          className="flex-1"
        >
          <Power size={14} className="mr-2" />
          {integration.enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </Card>
  );
}
```

### Step 6.5: Create Add Integration Modal

**File:** `apps/frontend/components/integrations/AddIntegrationModal.tsx`

```typescript
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddIntegrationModal({ open, onOpenChange, onSuccess }: AddIntegrationModalProps) {
  const [type, setType] = useState('EMAIL');
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config }),
      });

      onSuccess();
      onOpenChange(false);
      setConfig({});
    } catch (error) {
      console.error('Failed to create integration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Add Integration</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Integration Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="WEBHOOK">Webhook</SelectItem>
                <SelectItem value="SLACK">Slack</SelectItem>
                <SelectItem value="DISCORD">Discord</SelectItem>
                <SelectItem value="TELEGRAM">Telegram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'EMAIL' && (
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={config.email || ''}
                onChange={(e) => setConfig({ email: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
          )}

          {type === 'WEBHOOK' && (
            <div>
              <Label>Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://your-webhook-url.com"
                value={config.webhookUrl || ''}
                onChange={(e) => setConfig({ webhookUrl: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
          )}

          {type === 'SLACK' && (
            <div>
              <Label>Slack Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://hooks.slack.com/services/..."
                value={config.webhookUrl || ''}
                onChange={(e) => setConfig({ webhookUrl: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                Get your webhook URL from Slack App settings
              </p>
            </div>
          )}

          {type === 'DISCORD' && (
            <div>
              <Label>Discord Webhook URL</Label>
              <Input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={config.webhookUrl || ''}
                onChange={(e) => setConfig({ webhookUrl: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                Get your webhook URL from Discord Server Settings → Integrations
              </p>
            </div>
          )}

          {type === 'TELEGRAM' && (
            <div className="space-y-3">
              <div>
                <Label>Bot Token</Label>
                <Input
                  type="text"
                  placeholder="123456:ABC-DEF..."
                  value={config.botToken || ''}
                  onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  required
                />
              </div>
              <div>
                <Label>Chat ID</Label>
                <Input
                  type="text"
                  placeholder="123456789"
                  value={config.chatId || ''}
                  onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  required
                />
              </div>
              <p className="text-xs text-slate-400">
                Create a bot with @BotFather and get your chat ID
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Integration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 6.6: Export Components

**File:** `apps/frontend/components/integrations/index.ts`

```typescript
export { IntegrationsPage } from './IntegrationsPage';
export { IntegrationCard } from './IntegrationCard';
export { AddIntegrationModal } from './AddIntegrationModal';
```

### Step 6.7: Update Dashboard Page Import

**File:** `apps/frontend/app/dashboard/[[...slug]]/page.tsx`

Add import:

```typescript
import { IntegrationsPage } from "@/components/integrations";
```

**✅ Checkpoint 6:** Frontend UI complete

---

## Phase 7: Testing & Verification

### Step 7.1: Start All Services

**Terminal 1 - Start Docker services:**
```bash
docker-compose up -d
```

**Terminal 2 - Start API:**
```bash
cd apps/api
npm run dev
```

**Terminal 3 - Start Frontend:**
```bash
cd apps/frontend
npm run dev
```

**Terminal 4 - Start Worker:**
```bash
cd apps/worker
npm run dev
```

**Terminal 5 - Start Notification Worker:**
```bash
cd apps/notification-worker
npm run dev
```

### Step 7.2: End-to-End Test

**1. Add a website monitor:**
- Go to http://localhost:3000/dashboard
- Click "Create Monitor"
- Add URL: `https://httpstat.us/500` (this will always return 500 error)
- Save

**2. Add email integration:**
- Go to http://localhost:3000/dashboard/integrations
- Click "Add Integration"
- Select "Email"
- Enter your email address
- Click "Add Integration"

**3. Wait for notification:**
- Worker checks every 3 minutes
- When site is detected as down, you should see in notification-worker logs:
```
✓ Received event from website.events: website.down
Processing notification for: https://httpstat.us/500
Found 1 enabled integrations
Sending EMAIL notification...
✓ EMAIL notification sent
```

**4. Check your email:**
- You should receive an email with subject "🚨 Website Down Alert"

### Step 7.3: Test Other Integrations

**Slack:**
1. Create Slack workspace (free)
2. Go to https://api.slack.com/messaging/webhooks
3. Create Incoming Webhook
4. Copy webhook URL
5. Add Slack integration in UI
6. Trigger a down event
7. Check Slack channel

**Discord:**
1. Create Discord server
2. Server Settings → Integrations → Webhooks
3. Create webhook, copy URL
4. Add Discord integration in UI
5. Trigger a down event
6. Check Discord channel

**Webhook (Test with webhook.site):**
1. Go to https://webhook.site
2. Copy your unique URL
3. Add Webhook integration in UI
4. Trigger a down event
5. Check webhook.site for received payload

### Step 7.4: Verify Database

```bash
cd packages/store
npx prisma studio
```

Check:
- `integration` table has your integrations
- `notification_log` table has sent notifications
- `website_tick` table has monitoring data

**✅ Checkpoint 7:** System fully tested

---

## Troubleshooting

### Kafka Not Starting

**Problem:** Kafka container exits immediately

**Solution:**
```bash
# Check logs
docker logs kafka

# Restart with fresh state
docker-compose down -v
docker-compose up -d zookeeper
sleep 10
docker-compose up -d kafka
```

### Producer Connection Error

**Problem:** `KafkaJSConnectionError: Failed to connect`

**Solution:**
```bash
# Check Kafka is running
docker ps | grep kafka

# Check broker address in .env
KAFKA_BROKER=localhost:9092  # For local development

# If using Docker network
KAFKA_BROKER=kafka:29092  # For services in Docker
```

### Email Not Sending

**Problem:** Gmail authentication error

**Solution:**
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use 16-character password (remove spaces)
4. Update `.env`:
```env
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=abcdabcdabcdabcd
```

### Notification Worker Not Receiving Events

**Problem:** Worker starts but doesn't process events

**Solution:**
```bash
# Check consumer group
docker exec -it kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --list

# Reset consumer group (if needed)
docker exec -it kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group notification-group \
  --reset-offsets \
  --to-earliest \
  --execute \
  --topic website.events
```

### Database Connection Error

**Problem:** `Can't reach database server`

**Solution:**
```bash
# Check DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/uptime"

# Test connection
cd packages/store
npx prisma db push
```

### Integration Not Showing in UI

**Problem:** Added integration but not visible

**Solution:**
```bash
# Check API is running
curl http://localhost:3001/api/v1/integrations

# Check browser console for errors
# Check auth middleware is not blocking requests
```

---

## Project Structure

```
betteruptime-app/
├── apps/
│   ├── api/                       # Express API
│   │   └── routes/v1/
│   │       └── integrations.ts    # Integration endpoints
│   │
│   ├── worker/                    # Monitor worker
│   │   └── index.ts              # Publishes to Kafka
│   │
│   ├── notification-worker/       # NEW - Notification worker
│   │   ├── index.ts              # Kafka consumer
│   │   └── handlers/
│   │       ├── email.ts
│   │       ├── webhook.ts
│   │       ├── slack.ts
│   │       ├── discord.ts
│   │       └── telegram.ts
│   │
│   └── frontend/                  # Next.js frontend
│       ├── app/dashboard/[[...slug]]/
│       │   └── page.tsx          # Updated with integrations view
│       └── components/
│           └── integrations/      # NEW - Integration components
│               ├── IntegrationsPage.tsx
│               ├── IntegrationCard.tsx
│               └── AddIntegrationModal.tsx
│
├── packages/
│   ├── kafka/                     # NEW - Kafka package
│   │   ├── index.ts
│   │   ├── client.ts
│   │   ├── producer.ts
│   │   ├── consumer.ts
│   │   └── topics.ts
│   │
│   └── store/                     # Prisma
│       └── prisma/
│           └── schema.prisma     # Updated with integration tables
│
└── docker-compose.yml             # Updated with Kafka
```

---

## Environment Variables Reference

### apps/worker/.env
```env
KAFKA_BROKER=localhost:9092
DATABASE_URL=postgresql://user:password@localhost:5432/uptime
```

### apps/notification-worker/.env
```env
KAFKA_BROKER=localhost:9092
DATABASE_URL=postgresql://user:password@localhost:5432/uptime

# Gmail
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=abcdabcdabcdabcd

# Telegram (optional)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
```

### apps/api/.env
```env
DATABASE_URL=postgresql://user:password@localhost:5432/uptime
PORT=3001
```

### apps/frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Kafka Topics

### website.events
**Purpose:** All website monitoring events

**Event Types:**
- `website.down` - Website is unreachable
- `website.up` - Website is back online
- `website.slow` - Website response time is high

**Event Schema:**
```typescript
{
  type: 'website.down',
  websiteId: 'uuid',
  userId: 'uuid',
  url: 'https://example.com',
  responseTime: 5000,
  regionId: 'india',
  timestamp: 1234567890
}
```

### Consumer Groups
- `notification-group` - Notification worker
- `analytics-group` - Analytics worker (future)

---

## Database Schema

### integration
```sql
CREATE TABLE integration (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user(id),
  type VARCHAR (EMAIL, WEBHOOK, SLACK, DISCORD, TELEGRAM),
  config JSONB,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Config Examples:**

**Email:**
```json
{
  "email": "user@example.com"
}
```

**Webhook:**
```json
{
  "webhookUrl": "https://webhook.site/...",
  "headers": {
    "Authorization": "Bearer token"
  }
}
```

**Slack:**
```json
{
  "webhookUrl": "https://hooks.slack.com/services/..."
}
```

**Discord:**
```json
{
  "webhookUrl": "https://discord.com/api/webhooks/..."
}
```

**Telegram:**
```json
{
  "botToken": "123456:ABC-DEF...",
  "chatId": "123456789"
}
```

### notification_log
```sql
CREATE TABLE notification_log (
  id UUID PRIMARY KEY,
  event_type VARCHAR,
  integration_id UUID REFERENCES integration(id),
  status VARCHAR (PENDING, SENT, FAILED, RETRYING),
  payload JSONB,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### POST /api/v1/integrations
Create new integration

**Request:**
```json
{
  "type": "EMAIL",
  "config": {
    "email": "user@example.com"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "type": "EMAIL",
  "config": { "email": "user@example.com" },
  "enabled": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/v1/integrations
List user's integrations

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "EMAIL",
    "config": { "email": "user@example.com" },
    "enabled": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### PATCH /api/v1/integrations/:id/toggle
Enable/disable integration

**Response:**
```json
{
  "id": "uuid",
  "enabled": false
}
```

### DELETE /api/v1/integrations/:id
Delete integration

**Response:**
```json
{
  "success": true
}
```

---

## Setup Guides for Third-Party Services

### Gmail Setup

1. **Enable 2-Factor Authentication:**
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow setup instructions

2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Uptime Monitor"
   - Copy the 16-character password
   - Add to `.env` (remove spaces)

### Slack Setup

1. **Create Workspace:**
   - Go to https://slack.com/create
   - Follow setup instructions

2. **Create Incoming Webhook:**
   - Go to https://api.slack.com/messaging/webhooks
   - Click "Create your Slack app"
   - Choose "From scratch"
   - Name: "Uptime Monitor"
   - Select workspace
   - Click "Incoming Webhooks"
   - Toggle "Activate Incoming Webhooks" ON
   - Click "Add New Webhook to Workspace"
   - Select channel
   - Copy webhook URL

### Discord Setup

1. **Create Server:**
   - Open Discord
   - Click "+" → "Create My Own"
   - Name your server

2. **Create Webhook:**
   - Right-click channel → "Edit Channel"
   - Go to "Integrations"
   - Click "Webhooks" → "New Webhook"
   - Name: "Uptime Monitor"
   - Copy webhook URL

### Telegram Setup

1. **Create Bot:**
   - Open Telegram
   - Search for @BotFather
   - Send `/newbot`
   - Follow instructions
   - Copy bot token

2. **Get Chat ID:**
   - Start chat with your bot
   - Send any message
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `"chat":{"id":123456789}`
   - Copy the chat ID

---

## Performance Considerations

### Kafka Configuration

**For Development:**
```yaml
KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

**For Production:**
```yaml
KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 3
KAFKA_MIN_INSYNC_REPLICAS: 2
```

### Consumer Scaling

To scale notification workers:

```bash
# Start multiple instances with same group ID
# Kafka will automatically distribute partitions

# Terminal 1
WORKER_ID=worker-1 npm run dev

# Terminal 2
WORKER_ID=worker-2 npm run dev
```

### Rate Limiting

Add rate limiting to prevent notification spam:

```typescript
// In notification worker
const lastNotification = new Map();

async function handleEvent(event: any) {
  const key = `${event.userId}-${event.websiteId}`;
  const last = lastNotification.get(key);
  
  // Only send if last notification was > 5 minutes ago
  if (last && Date.now() - last < 5 * 60 * 1000) {
    console.log('Skipping notification (rate limited)');
    return;
  }
  
  lastNotification.set(key, Date.now());
  
  // ... send notifications
}
```

---

## Next Steps

### Phase 8: Advanced Features (Optional)

1. **Escalation Policies:**
   - Level 1: Email (immediate)
   - Level 2: SMS (after 5 min)
   - Level 3: Phone call (after 15 min)

2. **Analytics Worker:**
   - Consume from `analytics.events` topic
   - Calculate uptime percentages
   - Generate reports

3. **Incident Management:**
   - Auto-create incidents when site goes down
   - Track incident resolution
   - Post-mortem reports

4. **Status Pages:**
   - Public status page for each website
   - Subscribe to status updates
   - Historical uptime data

5. **Mobile App:**
   - React Native app
   - Push notifications
   - Real-time monitoring

---

## Resources

### Documentation
- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [KafkaJS Documentation](https://kafka.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

### Tools
- [Kafka UI](https://github.com/provectus/kafka-ui) - Web UI for Kafka
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Postman](https://www.postman.com/) - API testing

### Testing Services
- [webhook.site](https://webhook.site) - Test webhooks
- [httpstat.us](https://httpstat.us) - Test HTTP status codes
- [requestbin.com](https://requestbin.com) - Inspect HTTP requests

---

## Checklist

### Phase 1: Infrastructure
- [ ] Kafka added to docker-compose.yml
- [ ] Kafka running (`docker ps | grep kafka`)
- [ ] Kafka package created
- [ ] All Kafka files created (topics.ts, client.ts, producer.ts, consumer.ts, index.ts)

### Phase 2: Database
- [ ] Prisma schema updated
- [ ] Migration run (`npx prisma migrate dev`)
- [ ] Prisma client generated
- [ ] Tables verified in Prisma Studio

### Phase 3: Monitor Worker
- [ ] Kafka installed in worker
- [ ] Worker code updated to publish events
- [ ] Worker tested and publishing to Kafka

### Phase 4: Notification Worker
- [ ] Notification worker created
- [ ] All handlers created (email, webhook, slack, discord, telegram)
- [ ] Gmail app password configured
- [ ] Worker tested and consuming from Kafka

### Phase 5: API
- [ ] Integration routes created
- [ ] Routes registered in main API file
- [ ] API tested with curl/Postman

### Phase 6: Frontend
- [ ] IntegrationsPage component created
- [ ] IntegrationCard component created
- [ ] AddIntegrationModal component created
- [ ] Dashboard page updated
- [ ] UI tested in browser

### Phase 7: Testing
- [ ] All services started
- [ ] Website monitor added
- [ ] Email integration added
- [ ] Email notification received
- [ ] Other integrations tested

---

## Success Criteria

✅ **You've successfully implemented the Kafka notification system when:**

1. You can add a website monitor
2. You can add an email integration
3. When the website goes down, you receive an email
4. The notification is logged in the database
5. You can view integrations in the UI
6. You can enable/disable integrations
7. You can delete integrations
8. Multiple notification channels work (Email, Slack, Discord, etc.)

---

## Congratulations! 🎉

You've built a production-grade notification system with:
- ✅ Event-driven architecture using Kafka
- ✅ Multiple notification channels
- ✅ Scalable microservices
- ✅ Full-stack implementation
- ✅ Database persistence
- ✅ Modern UI

This project demonstrates:
- Distributed systems knowledge
- Event streaming with Kafka
- Microservices architecture
- API design
- Frontend development
- Database design
- Third-party integrations

**Perfect for your portfolio and interviews!**

---

## Questions?

If you encounter any issues:
1. Check the Troubleshooting section
2. Verify all environment variables
3. Check Docker logs: `docker logs <container-name>`
4. Check application logs in each terminal
5. Verify database state in Prisma Studio

---

**Last Updated:** 2024
**Version:** 1.0.0
