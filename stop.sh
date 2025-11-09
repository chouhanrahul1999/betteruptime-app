#!/bin/bash

echo "🛑 Stopping BetterUptime App..."

# Stop Docker services
echo "📦 Stopping Docker services..."
docker-compose down

echo "✓ All services stopped"
