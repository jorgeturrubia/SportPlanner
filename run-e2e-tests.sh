#!/bin/bash

# PlanSport E2E Test Runner
# Bash script to run E2E tests locally

set -e

# Default values
TEST_SUITE="all"
HEADED=false
DEBUG=false
UI=false
BROWSER="chromium"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --suite)
      TEST_SUITE="$2"
      shift 2
      ;;
    --headed)
      HEADED=true
      shift
      ;;
    --debug)
      DEBUG=true
      shift
      ;;
    --ui)
      UI=true
      shift
      ;;
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --suite SUITE     Test suite to run (all, teams, exercises, objectives, auth, performance, validation, smoke)"
      echo "  --headed          Run in headed mode"
      echo "  --debug           Run in debug mode"
      echo "  --ui              Run with UI mode"
      echo "  --browser BROWSER Browser to use (chromium, firefox, webkit)"
      echo "  -h, --help        Show this help"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

echo "🚀 Starting PlanSport E2E Tests..."
echo "Test Suite: $TEST_SUITE"
echo "Browser: $BROWSER"

# Set environment variables
export PLAYWRIGHT_API_URL="http://localhost:5000"
export PLAYWRIGHT_FRONTEND_URL="http://localhost:4200"

# Change to frontend directory
cd src/front/SportPlanner

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Build the application
echo "🔨 Building application..."
npm run build

# Start services in background
echo "🏗️ Starting backend API..."
cd ../../../back/SportPlanner/SportPlanner.Api
dotnet run &
API_PID=$!
cd ../../../src/front/SportPlanner

echo "🏗️ Starting frontend server..."
npm start &
FRONTEND_PID=$!

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🧹 Cleaning up..."
    kill $API_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit $1
}

# Set trap to cleanup on exit
trap 'cleanup $?' EXIT

# Wait for services to start
echo "⏳ Waiting for services to be ready..."
timeout=120
elapsed=0

while [ $elapsed -lt $timeout ]; do
    sleep 2
    elapsed=$((elapsed + 2))
    
    if curl -s http://localhost:4200 >/dev/null 2>&1 && curl -s http://localhost:5000/api/health >/dev/null 2>&1; then
        echo "✅ Services are ready!"
        break
    fi
    
    echo "Still waiting... ($elapsed/$timeout seconds)"
done

if [ $elapsed -ge $timeout ]; then
    echo "❌ Timeout waiting for services"
    exit 1
fi

# Build test command
TEST_COMMAND="npx playwright test"

# Add test suite filter
case $TEST_SUITE in
    "teams")
        TEST_COMMAND="$TEST_COMMAND e2e/tests/teams/"
        ;;
    "exercises")
        TEST_COMMAND="$TEST_COMMAND e2e/tests/exercises/"
        ;;
    "objectives")
        TEST_COMMAND="$TEST_COMMAND e2e/tests/objectives/"
        ;;
    "auth")
        TEST_COMMAND="$TEST_COMMAND e2e/tests/auth/"
        ;;
    "performance")
        TEST_COMMAND="$TEST_COMMAND e2e/tests/performance/"
        ;;
    "validation")
        TEST_COMMAND="$TEST_COMMAND e2e/tests/validation/"
        ;;
    "smoke")
        TEST_COMMAND="$TEST_COMMAND --grep '@smoke'"
        ;;
    "all")
        # Run all tests
        ;;
    *)
        echo "❌ Unknown test suite: $TEST_SUITE"
        echo "Available options: all, teams, exercises, objectives, auth, performance, validation, smoke"
        exit 1
        ;;
esac

# Add browser selection
TEST_COMMAND="$TEST_COMMAND --project=$BROWSER"

# Add execution mode
if [ "$HEADED" = true ]; then
    TEST_COMMAND="$TEST_COMMAND --headed"
fi

if [ "$DEBUG" = true ]; then
    TEST_COMMAND="$TEST_COMMAND --debug"
fi

if [ "$UI" = true ]; then
    TEST_COMMAND="$TEST_COMMAND --ui"
fi

# Run tests
echo "🧪 Running tests: $TEST_COMMAND"
echo ""

if eval $TEST_COMMAND; then
    echo ""
    echo "✅ All tests passed!"
    TEST_EXIT_CODE=0
else
    echo ""
    echo "❌ Some tests failed"
    echo "📊 Check the HTML report: npx playwright show-report"
    TEST_EXIT_CODE=1
fi

exit $TEST_EXIT_CODE