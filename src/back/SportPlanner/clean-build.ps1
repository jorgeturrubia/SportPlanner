# Clean and Build Script for SportPlanner.Api

Write-Host "Cleaning SportPlanner.Api project..." -ForegroundColor Yellow

# Kill any processes that might be locking files
$processes = @("dotnet", "MSBuild", "VBCSCompiler", "ServiceHub.Host.dotnet.x64")
foreach ($proc in $processes) {
    Get-Process -Name $proc -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

# Clean directories
$dirsToClean = @(
    "SportPlanner.Api\bin",
    "SportPlanner.Api\obj",
    ".vs"
)

foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Write-Host "Removing $dir..." -ForegroundColor Gray
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Restoring packages..." -ForegroundColor Green
dotnet restore SportPlanner.Api/SportPlanner.Api.csproj

Write-Host "Building project..." -ForegroundColor Green
dotnet build SportPlanner.Api/SportPlanner.Api.csproj --configuration Debug

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed. Try closing Visual Studio if it's open." -ForegroundColor Red
}
