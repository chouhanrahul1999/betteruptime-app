#!/bin/bash

echo "🚀 Starting BetterUptime App..."

# Start Docker services
echo "📦 Starting Docker services (Postgres, Redis)..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run database migrations
echo "📊 Running database migrations..."
cd packages/store
npx prisma generate
npx prisma migrate deploy
cd ../..
echo "✓ Migrations complete"

# Start all apps with Turborepo
echo "🔥 Starting all applications..."
npm run dev
