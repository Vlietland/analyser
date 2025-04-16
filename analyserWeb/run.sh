#!/bin/bash

set -e

echo "📦 Building the project..."
npm run build

echo "🧪 Running tests..."
npx vitest run --reporter verbose
test_status=$?

if [ $test_status -ne 0 ]; then
  echo "❌ Tests failed. Aborting."
  exit 1
fi

echo "✅ Tests passed. Launching app..."

echo "🌐 Starting preview server..."
npm run preview &

# Wait for Vite to boot (adjust delay if needed)
sleep 2

# Open in default browser (cross-platform support)
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:4173
elif command -v open > /dev/null; then
  open http://localhost:4173
elif command -v start > /dev/null; then
  start http://localhost:4173
fi

wait
 
