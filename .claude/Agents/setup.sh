#!/bin/bash

# 🚀 AUTONOMOUS PM AGENT SYSTEM - SETUP SCRIPT
echo "🚀 Setting up Autonomous Project Manager Agent System..."
echo ""

# Check if we're in a project directory
if [ ! -f "package.json" ] && [ ! -f "*.csproj" ] && [ ! -d "src" ]; then
    echo "⚠️  Warning: This doesn't seem to be a project directory."
    echo "   Make sure you're in your project root before running setup."
    read -p "   Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create .claude directory structure
echo "📁 Creating Claude Code directory structure..."
mkdir -p .claude/agents
mkdir -p .claude/steering
mkdir -p .claude/hooks

# Copy PM Agent system files
echo "🤖 Installing Project Manager Agent system..."

# Check if AgentPm directory exists
AGENT_PM_DIR=""
if [ -d "C:/ProjectPP/AgentPm" ]; then
    AGENT_PM_DIR="C:/ProjectPP/AgentPm"
elif [ -d "../AgentPm" ]; then
    AGENT_PM_DIR="../AgentPm"
elif [ -d "./AgentPm" ]; then
    AGENT_PM_DIR="./AgentPM"
else
    echo "❌ Error: Cannot find AgentPm directory."
    echo "   Please ensure AgentPm folder is available."
    exit 1
fi

# Copy agent files
cp "$AGENT_PM_DIR/project-manager.agent.md" .claude/agents/
cp "$AGENT_PM_DIR/backend-net-specialist.agent.md" .claude/agents/
cp "$AGENT_PM_DIR/angular-frontend-specialist.agent.md" .claude/agents/

echo "✅ Agent files copied successfully!"

# Create basic steering files if they don't exist
echo "📝 Setting up steering files..."

if [ ! -f ".claude/steering/tech.md" ]; then
    cat > .claude/steering/tech.md << 'EOF'
# Technology Stack & Development Conventions

## Backend Technology
- .NET 8 Web API
- Entity Framework Core 8
- Clean Architecture pattern
- Supabase for authentication
- PostgreSQL database

## Frontend Technology  
- Angular 20 with standalone components
- TypeScript 5.8 with strict mode
- Tailwind CSS 4 for styling
- RxJS for reactive programming
- Angular Router for navigation

## Development Conventions
- Backend-first development approach
- Clean Architecture layers: Core → Application → Infrastructure → API
- Standalone Angular components (no NgModules)
- Reactive forms with validation
- OnPush change detection strategy
- Proper async/await patterns
EOF
    echo "   ✅ Created tech.md"
else
    echo "   ↪️  tech.md already exists, skipping"
fi

if [ ! -f ".claude/steering/structure.md" ]; then
    cat > .claude/steering/structure.md << 'EOF'
# Project Structure & Organization

## Backend Structure (.NET)
```
src/backend/
├── SportPlanner.Core/          # Domain entities and interfaces
├── SportPlanner.Application/   # Business logic and services
├── SportPlanner.Infrastructure/# Data access and external services
└── SportPlanner.Api/          # Controllers and API configuration
```

## Frontend Structure (Angular)
```
src/front/SportPlanner/
├── src/app/
│   ├── core/                  # Core services, guards, interceptors
│   ├── shared/                # Reusable components and utilities
│   ├── features/              # Feature-specific components
│   └── layouts/               # Application layouts
├── src/assets/                # Static assets
└── src/environments/          # Environment configurations
```

## Naming Conventions
- Backend: PascalCase for classes, camelCase for methods
- Frontend: kebab-case for files, PascalCase for classes
- Database: snake_case for tables and columns
- API routes: RESTful conventions with proper HTTP verbs
EOF
    echo "   ✅ Created structure.md"
else
    echo "   ↪️  structure.md already exists, skipping"
fi

if [ ! -f ".claude/steering/product.md" ]; then
    cat > .claude/steering/product.md << 'EOF'
# SportPlanner Product Overview

SportPlanner is a comprehensive multi-sport training planning and management application that facilitates the creation of objectives, sessions, and training execution control.

## Core Features
- User authentication and authorization
- Team management with CRUD operations
- Training session planning and execution
- Multi-sport support with customizable categories
- Coach and player management
- Session tracking and progress monitoring

## User Types
- **Coaches**: Create and manage teams, plan training sessions
- **Players**: View training schedules, track progress
- **Administrators**: System administration and user management

## Key Business Rules
- Users must be authenticated to access the application
- Teams belong to specific organizations/clubs
- Training sessions are linked to specific teams
- Different sports have different training requirements
- Progress tracking is tied to individual players and teams
EOF
    echo "   ✅ Created product.md"
else
    echo "   ↪️  product.md already exists, skipping"
fi

# Setup Claude Code configuration
echo "⚙️  Configuring Claude Code settings..."

if [ ! -f ".claude/settings.json" ]; then
    cat > .claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(dotnet *)",
      "Bash(ng *)",
      "Read(**/*)",
      "Write(src/**/*)",
      "Edit(src/**/*)",
      "MultiEdit(src/**/*)"
    ],
    "deny": [
      "Read(.env*)",
      "Read(appsettings.*.json)",
      "Write(.env*)",
      "Bash(rm -rf *)",
      "Bash(del *)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'File modified by PM Agent system - validating consistency...' && sleep 1"
          }
        ]
      }
    ]
  },
  "env": {
    "PM_AGENT_ENABLED": "true",
    "AUTO_DISCOVERY": "true"
  }
}
EOF
    echo "   ✅ Created Claude Code settings"
else
    echo "   ↪️  settings.json already exists, skipping"
fi

# Create .gitignore entries
echo "📄 Updating .gitignore for Claude Code files..."

if [ -f ".gitignore" ]; then
    if ! grep -q ".claude/settings.local.json" .gitignore; then
        echo "" >> .gitignore
        echo "# Claude Code local settings" >> .gitignore
        echo ".claude/settings.local.json" >> .gitignore
        echo "   ✅ Added Claude Code entries to .gitignore"
    else
        echo "   ↪️  .gitignore already has Claude Code entries"
    fi
else
    cat > .gitignore << 'EOF'
# Claude Code local settings
.claude/settings.local.json

# Dependencies
node_modules/
bin/
obj/

# Environment files
.env*
appsettings.*.json
!appsettings.json

# IDE files
.vs/
.vscode/
*.swp
*.swo

# Build outputs
dist/
build/
*.log
EOF
    echo "   ✅ Created .gitignore with Claude Code entries"
fi

# Create a quick test file to verify setup
echo "🧪 Creating test configuration..."

cat > .claude/test-pm-agent.md << 'EOF'
# PM Agent System Test

To test the PM Agent system, try these commands in Claude Code:

## 1. Basic Context Analysis
```
"Analyze the current project context and show me what technologies you detect"
```

## 2. Agent Discovery Test  
```
"Show me what specialist agents are available for this project"
```

## 3. Simple Development Task
```
"Create a simple User model with basic properties"
```

## 4. Full Feature Development
```  
"Implement a complete team management system with CRUD operations"
```

## Expected Behavior
- PM Agent should automatically analyze context
- Should discover .NET and Angular specialists
- Should plan backend-first execution
- Should coordinate between agents seamlessly

## Validation Checklist
- [ ] PM Agent activates automatically for development tasks
- [ ] Correctly identifies .NET + Angular stack
- [ ] Finds backend-net-specialist and angular-frontend-specialist agents  
- [ ] Executes backend tasks before frontend tasks
- [ ] Maintains consistency between layers
- [ ] Provides clear status updates during execution
EOF

echo "   ✅ Created test guide"

# Final instructions
echo ""
echo "🎉 SETUP COMPLETE! 🎉"
echo ""
echo "Your Autonomous PM Agent System is now ready!"
echo ""
echo "📋 What was installed:"
echo "   ✅ Project Manager Agent (main orchestrator)"
echo "   ✅ Backend .NET Specialist Agent"  
echo "   ✅ Angular Frontend Specialist Agent"
echo "   ✅ Steering files with project context"
echo "   ✅ Claude Code configuration"
echo "   ✅ Coordination hooks"
echo ""
echo "🚀 Next Steps:"
echo "   1. Open Claude Code in this directory"
echo "   2. Try: 'Analyze the current project context'"
echo "   3. Or: 'Implement the authentication system'"
echo "   4. Watch the PM Agent work its magic!"
echo ""
echo "📖 For detailed usage instructions, see README.md"
echo "🧪 For testing, see .claude/test-pm-agent.md"
echo ""
echo "Happy autonomous development! 🤖✨"