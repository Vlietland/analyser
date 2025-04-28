#!/bin/bash

#set -e
run_tests=false
open_browser=false
start_server=true

for arg in "$@"; do
  case $arg in
    test)
      run_tests=true
      shift
      ;;
    browser)
      open_browser=true
      shift
      ;;
    *)
      # Ignore unknown args or handle them if needed
      ;;
  esac
done

echo "📦 Building the project..."
npm run dev

if [ "$run_tests" = true ]; then
  echo "🧪 Running tests..."
  npx vitest run --reporter verbose
  test_status=$?

  if [ $test_status -ne 0 ]; then
    echo "❌ Tests failed."
    exit 1
  else
    echo "✅ Tests passed."
    if [ "$open_browser" = false ]; then
        start_server=false
        exit 0
    fi
  fi
fi

if [ "$start_server" = true ]; then
    echo "🌐 Checking for existing preview server..."
    existing_pid=$(lsof -t -i:4173)

    if [ -n "$existing_pid" ]; then
      echo "🛑 Killing existing server on port 4173 (PID $existing_pid)..."
      kill "$existing_pid" || true   # Try graceful shutdown
      sleep 1
      kill -9 "$existing_pid" 2>/dev/null || true  # Force kill if still running
      sleep 1
    fi

    echo "🚀 Starting new preview server..."
    nohup npm run preview > /dev/null 2>&1 &
    server_pid=$!

    if [ "$open_browser" = true ]; then
      echo "⏳ Waiting for server to start..."
      sleep 3

      echo "🌍 Opening browser..."
      if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:4173
      elif command -v open > /dev/null; then
        open http://localhost:4173
      elif command -v start > /dev/null; then
        start http://localhost:4173
      else
          echo "⚠️ Could not detect command to open browser."
      fi
    fi

    #wait $server_pid
fi
