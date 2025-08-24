# Check Project Status

Get a comprehensive status report of the current project including tasks, token usage, and blockers.

## Current Status Check

Check the following:
1. Sprint progress in `.claude/project-state/current-sprint.json`
2. Task status in `.claude/project-state/tasks.json`
3. Token usage in `.claude/project-state/token-usage.json`
4. Any blockers or errors

## Report Format

```markdown
# Project Status Report

## Sprint Progress
- Current Sprint: [ID]
- Tasks Completed: X/Y
- Days Remaining: Z

## Token Usage
- Total Budget: X
- Used: Y (Z%)
- Remaining: W

## Active Tasks
[List of in-progress tasks]

## Blockers
[Any blocking issues]

## Next Actions
[Prioritized next steps]
```

Generate report and save to `.claude/project-state/status-report.md`
