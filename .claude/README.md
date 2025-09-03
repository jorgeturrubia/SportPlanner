# ClaudePM - Claude Code Extension System

**Version**: 2.0 (Complete & Optimized)  
**Purpose**: Intelligent agent orchestration system with slash commands, hooks, and interactive enhancements

## 🎯 What is ClaudePM?

ClaudePM is a **complete extension system** for Claude Code that transforms it into an intelligent project management platform. It provides:

- **🔍 Project Intelligence**: Auto-discovery, health assessment, and systematic analysis
- **🤖 Expert Agents**: Technology specialists accessible via Task tool  
- **⚡ Slash Commands**: Purpose-built commands for project management
- **🔗 Hook System**: Automated workflows and intelligent suggestions
- **📋 Context Integration**: Business-aware technical decisions and recommendations
- **🛠️ Template System**: Context-aware code generation and scaffolding

## ⚡ Key Features

### **Slash Commands** 
```bash
/analyze-project [deep|quick] [focus]    # Comprehensive analysis
/enhance-testing [coverage] [framework]  # Add testing framework
/modernize-stack [framework] [pattern]   # Update technology patterns
/health-check [detailed|summary]         # Project health assessment
```

### **Intelligent Hooks**
- **SessionStart**: Welcome with project context and smart recommendations
- **PostToolUse**: Automatic suggestions after code changes  
- **Security Monitoring**: Alerts for security-sensitive file changes

### **Expert Agent System**
- **Orchestrators**: project-scanner, project-auditor, project-enhancer, product-interviewer
- **Tech Experts**: dotnet-expert, angular-expert
- **Domain Experts**: testing-expert

## 🚀 Quick Setup

### 1. Prerequisites
```bash
npm install -g @anthropic-ai/claude-code
```

### 2. Installation
```bash
cd your-project
cp -r /path/to/ClaudePM/.claudev2 ./.claude
```

### 3. First Session
```bash
claude
# 🤖 ClaudePM: Initializing intelligent project assistance...
# 🎯 ClaudePM Enhanced Session Started
# 📊 Project context loaded from CLAUDE.md
# 💚 Current Health Score: 73/100

# Try:
/analyze-project
# or
"Help me analyze and improve my project systematically"
```

## 🎯 Usage Examples

### **Systematic Project Analysis**
```
You: /analyze-project deep

Claude: I'll analyze your project comprehensively using specialized agents...

[Uses Task tool with project-scanner agent]
[Conducts contextual interview via project-auditor agent]

Result:
✅ Detected: .NET 8 + Angular 20 + PostgreSQL + Supabase
✅ Domain: Sports Management SaaS for Coaches  
✅ Health Score: 73/100
✅ Recommendations:
   1. Testing framework (45% → 80% coverage)
   2. CI/CD automation 
   3. Angular component modernization
```

### **Enhanced Testing Implementation**
```
You: /enhance-testing 85

Claude: I'll implement comprehensive testing tailored to your sports management platform...

[Uses Task tool with testing-expert agent with domain context]

Result:
- xUnit backend tests focused on team management logic
- Jasmine frontend tests for coach workflow components
- Cypress E2E tests for critical coach journeys
- Coverage improved: 45% → 78%
- Domain-specific test scenarios for sports workflows
```

### **Technology Modernization**
```
You: /modernize-stack angular

Claude: I'll modernize your Angular components with v20+ best practices...

[Uses Task tool with angular-expert agent]

Result:
- 23 components migrated to standalone architecture
- State management updated to signals
- Control flow syntax updated (@if, @for, @switch)
- OnPush change detection implemented
- Performance improvements documented
```

## 🔗 Hook System Automation

### **Session Start Welcome**
```
🤖 ClaudePM: Initializing intelligent project assistance...

🎯 ClaudePM Enhanced Session Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Project context loaded from CLAUDE.md
💚 Current Health Score: 73/100
🎯 Project Domain: Sports Management SaaS

🚀 Available ClaudePM Commands:
   /analyze-project     - Comprehensive project analysis
   /enhance-testing     - Add comprehensive testing framework
   /modernize-stack     - Update to latest technology patterns
   /health-check        - Quick project health assessment

🎯 Smart Recommendations:
   • Low test coverage detected - consider /enhance-testing
   • Angular legacy patterns found - try /modernize-stack angular
```

### **Automatic Code Change Monitoring**
```bash
# After modifying package.json or *.csproj:
🔄 ClaudePM: Post-code-change automation...
📊 Significant configuration change detected
💡 Consider running /analyze-project to update health assessment

# After modifying security-related files:
🔒 Security-sensitive change detected
📋 Security review reminder created
```

## 📊 Project Health Tracking

### **Health Score Components**
- **Code Quality** (25%): Architecture patterns, best practices adherence
- **Testing Coverage** (20%): Unit, integration, and E2E test coverage
- **Security** (20%): Authentication, validation, security headers
- **Documentation** (15%): API docs, README, architecture guides
- **Automation** (20%): CI/CD pipelines, deployment processes

### **Progress Tracking Example**
```
Initial Assessment: 73/100
├── Testing: 45% coverage (needs improvement)
├── Documentation: Partial API docs
├── Automation: Manual deployment (45min)
└── Security: JWT present, missing validation

After ClaudePM Enhancement: 89/100 ✅
├── Testing: 78% coverage (xUnit + Jasmine + Cypress)
├── Documentation: Complete (API docs + README)
├── Automation: GitHub Actions CI/CD (8min)
└── Security: Comprehensive JWT + input validation

Health Improvement: +16 points
Time Investment: ~6 hours of systematic improvements
```

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────┐
│         Claude Code + ClaudePM             │
│                                             │
│  ⚡ Slash Commands    🔗 Hook System        │
│  🤖 Expert Agents    📊 Health Tracking    │
│  🖥️  Interactive Mode 📋 Context Memory     │
├─────────────────────────────────────────────┤
│          Enhanced CLAUDE.md                 │
│    (Project context + recommendations)     │
├─────────────────────────────────────────────┤
│            Your Project                     │
│   (Systematically improved codebase)       │
└─────────────────────────────────────────────┘
```

## 📁 Complete Directory Structure

```
.claude/                                     # ClaudePM system
├── README.md                               # This file
├── agents/                                 # Agent definitions (7 agents)
│   ├── orchestrators/                     # Project coordinators
│   │   ├── project-scanner.md             # Auto-discovery
│   │   ├── project-auditor.md             # Gap analysis + interviews  
│   │   ├── project-enhancer.md            # Implementation workflows
│   │   └── product-interviewer.md         # New project guidance
│   ├── tech-experts/                      # Technology specialists
│   │   ├── dotnet-expert.md               # .NET 8+ with C# 12
│   │   └── angular-expert.md              # Angular 20+ patterns
│   └── domain-experts/                    # Domain specialists
│       └── testing-expert.md              # Comprehensive testing
├── commands/                               # Slash commands (4 commands)
│   ├── analyze-project.md                 # /analyze-project command
│   ├── enhance-testing.md                 # /enhance-testing command
│   ├── modernize-stack.md                 # /modernize-stack command
│   └── health-check.md                    # /health-check command
├── hooks/                                  # Hook system (3 files)
│   ├── session-start.sh                   # SessionStart hook
│   ├── post-code-change.sh                # PostToolUse hook
│   └── claude-pm-hooks.json               # Hook configuration
└── templates/                              # Context-aware generation (3 files)
    ├── missing-files/                     # Project gap fillers
    │   ├── README-template.md             # Dynamic README
    │   └── docker-compose-template.yml    # Containerization
    └── enhancements/security/             # Feature additions
        └── jwt-middleware-template.cs     # JWT authentication
```

**Total: 19 files providing complete Claude Code enhancement**

## 🎯 Real-World Benefits

### **For Developers**
- **Seamless Experience**: Enhanced Claude Code with no separate tools
- **Intelligent Assistance**: Project-aware recommendations and automation
- **Systematic Approach**: Guided workflows with measurable outcomes
- **Time Efficiency**: Automated analysis and context-aware suggestions

### **For Projects**
- **Consistent Quality**: Standardized improvement patterns
- **Business Alignment**: Technical decisions informed by domain context
- **Reduced Technical Debt**: Proactive identification and systematic resolution
- **Knowledge Preservation**: Context and decisions maintained across sessions

## 🚀 Complete SportPlanner Example

```bash
# Initial state: Functional MVP with technical debt
cd SportPlanner
claude

# ClaudePM welcome with context
🤖 ClaudePM: Initializing intelligent project assistance...
📊 No project context found. Consider running: /analyze-project

# Comprehensive analysis
/analyze-project deep

Result:
✅ Detected: .NET 8 + Angular 20 + PostgreSQL + Supabase Auth
✅ Domain: Sports Management SaaS for Coaches and Team Administrators  
✅ Health Score: 73/100
✅ Critical Issues:
   - Test coverage: 45% (target: 80%+)
   - 23 Angular components using deprecated NgModules
   - Manual deployment taking 45+ minutes
   - Missing API documentation for team management endpoints

# Systematic improvements
/enhance-testing 85
Result: xUnit + Jasmine + Cypress focused on coach workflows (45% → 78% coverage)

/modernize-stack angular  
Result: Standalone components + signals + modern patterns (23 components updated)

"Add CI/CD pipeline for automated deployment"
Result: GitHub Actions workflow with quality gates (45min → 8min deployment)

# Final assessment
/health-check detailed
Result: Health Score improved from 73 → 89/100 (+16 points)

Total enhancement time: ~6 hours
Systematic improvements with measurable outcomes
```

## 🤝 Getting Started

1. **Install Claude Code**: `npm install -g @anthropic-ai/claude-code`
2. **Copy ClaudePM**: Copy `.claudev2/` as `.claude/` to your project
3. **Start Enhanced Session**: `claude` (hooks automatically initialize)
4. **Run Analysis**: `/analyze-project` or ask for systematic improvements
5. **Follow Recommendations**: Use suggested slash commands and workflows

## 📖 Complete Integration Guide

All documentation is integrated directly into this README:
- **Setup Guide**: See "🚀 Quick Setup" section above
- **Advanced Features**: Slash commands, hooks, and interactive mode examples throughout
- **Real-world Example**: Complete SportPlanner integration workflow demonstrated

---

**ClaudePM v2.0** - Complete intelligent project management for Claude Code  
*Transform your development workflow with expert agents, automation, and systematic intelligence*

**Optimized System**: 22 files providing comprehensive project enhancement capabilities through Claude Code's native interface with advanced features integration.