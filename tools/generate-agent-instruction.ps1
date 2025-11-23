Param()

# Simple generator script for agent instructions
$agent = Read-Host 'Agent name (default: dotnet-backend-expert)'
if ([string]::IsNullOrWhiteSpace($agent)) { $agent = 'dotnet-backend-expert' }
$context = Read-Host 'Context (default: back/SportPlanner)'
if ([string]::IsNullOrWhiteSpace($context)) { $context = 'back/SportPlanner' }
$taskSize = Read-Host 'Task size (PEQUEÑA/MEDIANA/GRANDE)'
if ([string]::IsNullOrWhiteSpace($taskSize)) { $taskSize = 'MEDIANA' }
$title = Read-Host 'Title for the instruction'

# Create a safe filename
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$slug = $title -replace '[^a-zA-Z0-9\-]', '-' -replace '--+', '-'
$filename = "$timestamp`_$slug.md"
$folder = Join-Path -Path (Resolve-Path '..\back\instructions').Path -ChildPath '.'
if (-not (Test-Path $folder)) { New-Item -ItemType Directory -Path $folder | Out-Null }
$filepath = Join-Path -Path $folder -ChildPath $filename

$frontMatter = @"---
agent: $agent
context: $context
task-size: $taskSize
---
"@

$content = "# $title

$frontMatter

## Summary

Describe what you'll implement.

## Plan

Phase 1: ...

## Checklist
- [ ] Build and tests run locally
- [ ] Plan included if MEDIANA/GRANDE
- [ ] Add migrations if required

";

Set-Content -Path $filepath -Value $content -Encoding UTF8
Write-Host "Instruction file created: $filepath" -ForegroundColor Green
