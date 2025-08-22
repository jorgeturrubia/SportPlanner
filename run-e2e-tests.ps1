# PlanSport E2E Test Runner
# PowerShell script to run E2E tests locally

param(
    [string]$TestSuite = "all",
    [switch]$Headed = $false,
    [switch]$Debug = $false,
    [switch]$UI = $false,
    [string]$Browser = "chromium"
)

Write-Host "🚀 Starting PlanSport E2E Tests..." -ForegroundColor Green
Write-Host "Test Suite: $TestSuite" -ForegroundColor Yellow
Write-Host "Browser: $Browser" -ForegroundColor Yellow

# Set environment variables
$env:PLAYWRIGHT_API_URL = "http://localhost:5000"
$env:PLAYWRIGHT_FRONTEND_URL = "http://localhost:4200"

# Change to frontend directory
Set-Location "src\front\SportPlanner"

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
}

# Check if Playwright browsers are installed
Write-Host "🌐 Installing Playwright browsers..." -ForegroundColor Blue
npx playwright install

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Blue
npm run build

# Start services in background
Write-Host "🏗️ Starting backend API..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "cd '..\..\..\back\SportPlanner\SportPlanner.Api'; dotnet run" -WindowStyle Hidden

Write-Host "🏗️ Starting frontend server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-Command", "npm start" -WindowStyle Hidden

# Wait for services to start
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Blue
$timeout = 120
$elapsed = 0

do {
    Start-Sleep -Seconds 2
    $elapsed += 2
    
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:4200" -UseBasicParsing -TimeoutSec 2
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 2
        
        if ($frontendResponse.StatusCode -eq 200 -and $apiResponse.StatusCode -eq 200) {
            Write-Host "✅ Services are ready!" -ForegroundColor Green
            break
        }
    }
    catch {
        # Services not ready yet
    }
    
    if ($elapsed -ge $timeout) {
        Write-Host "❌ Timeout waiting for services" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Still waiting... ($elapsed/$timeout seconds)" -ForegroundColor Yellow
} while ($true)

# Build test command
$testCommand = "npx playwright test"

# Add test suite filter
switch ($TestSuite.ToLower()) {
    "teams" { $testCommand += " e2e/tests/teams/" }
    "exercises" { $testCommand += " e2e/tests/exercises/" }
    "objectives" { $testCommand += " e2e/tests/objectives/" }
    "auth" { $testCommand += " e2e/tests/auth/" }
    "performance" { $testCommand += " e2e/tests/performance/" }
    "validation" { $testCommand += " e2e/tests/validation/" }
    "smoke" { $testCommand += " --grep '@smoke'" }
    "all" { } # Run all tests
    default { 
        Write-Host "❌ Unknown test suite: $TestSuite" -ForegroundColor Red
        Write-Host "Available options: all, teams, exercises, objectives, auth, performance, validation, smoke" -ForegroundColor Yellow
        exit 1
    }
}

# Add browser selection
$testCommand += " --project=$Browser"

# Add execution mode
if ($Headed) {
    $testCommand += " --headed"
}

if ($Debug) {
    $testCommand += " --debug"
}

if ($UI) {
    $testCommand += " --ui"
}

# Run tests
Write-Host "🧪 Running tests: $testCommand" -ForegroundColor Blue
Write-Host ""

try {
    Invoke-Expression $testCommand
    $testExitCode = $LASTEXITCODE
}
catch {
    Write-Host "❌ Test execution failed: $_" -ForegroundColor Red
    $testExitCode = 1
}

# Cleanup
Write-Host ""
Write-Host "🧹 Cleaning up..." -ForegroundColor Blue

# Stop background processes
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -eq "" } | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*ng serve*" } | Stop-Process -Force

# Show results
if ($testExitCode -eq 0) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some tests failed" -ForegroundColor Red
    Write-Host "📊 Check the HTML report: npx playwright show-report" -ForegroundColor Yellow
}

# Return to original directory
Set-Location "..\..\..\"

exit $testExitCode