---
allowed-tools: Write, Read, LS, Glob, Bash
argument-hint: [feature-name]
description: Generate comprehensive project specifications (requirements, design, tasks) for a feature using all steering context
---

# Create Feature Specification

Use the specs-generator agent to create detailed specifications for a new feature or functionality.

## What This Command Does

This command activates the `specs-generator` agent which will:

1. **Read All Steering Context**: Automatically loads product.md, tech.md, structure.md, and all convention files
2. **Generate Requirements**: Create detailed user stories with EARS notation
3. **Design Technical Architecture**: Plan implementation following project conventions
4. **Create Implementation Tasks**: Break down work into actionable, technology-tagged tasks

## Specification Process

The agent follows a structured 3-phase approach:

### Phase 1: Requirements Analysis
- Analyzes your feature request against product context
- Creates structured user stories with acceptance criteria
- Uses EARS notation for clear, testable requirements
- Aligns with business objectives from steering files

### Phase 2: Technical Design
- References technology stack from tech.md
- Applies architectural patterns from structure.md
- Incorporates technology-specific conventions
- Designs APIs, components, and data models

### Phase 3: Implementation Planning
- Creates discrete, actionable tasks
- Tags tasks for appropriate development agents:
  - **angular-developer** for frontend tasks
  - **dotnet-developer** for backend tasks
  - **integration-developer** for cross-technology work
- Identifies dependencies and execution order
- Defines clear acceptance criteria for each task

## Generated Files

The agent creates a complete specification in `specs/[feature-name]/`:

- **requirements.md**: User stories and acceptance criteria
- **design.md**: Technical architecture and implementation approach
- **tasks.md**: Implementation tasks tagged for specific agents

## How to Use

1. **Describe Your Feature**: Provide a clear description of what you want to build
2. **Agent Guidance**: The specs-generator will ask clarifying questions if needed
3. **Review Each Phase**: Validate requirements, design, and tasks before proceeding
4. **Ready for Development**: Hand off completed specs to development-coordinator

## Example Usage

```bash
# Create specs for a user authentication feature
/create-spec user-authentication

# The agent will guide you through:
# - Understanding the feature requirements
# - Designing the technical implementation
# - Planning the development tasks
```

## Integration with Development

Once specs are complete, use the development-coordinator to implement:

```bash
# After specs are created
Use the development-coordinator agent to implement the user-authentication feature
```

The development-coordinator will:
- Read the completed specs
- Route tasks to appropriate specialized agents
- Coordinate the overall implementation
- Ensure integration between different technology components

## Quality Assurance

The specs-generator ensures:
- **Completeness**: All aspects of the feature are documented
- **Consistency**: Aligns with all project steering files and conventions
- **Actionability**: Tasks are concrete and implementable
- **Traceability**: Clear connection from requirements to implementation

Ready to create comprehensive specifications that bridge the gap between ideas and implementation!
