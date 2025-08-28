---
allowed-tools: Write, Read, LS, Glob, Bash
argument-hint: [project-name]
description: Initialize comprehensive project steering files through guided conversation
---

# Initialize Project Steering Files

Start the process of creating comprehensive steering documentation for your project.

## What This Does

This command activates the `SteeringAgent` agent to create three essential steering files:

1. **product.md** - Product overview, users, features, business objectives
2. **tech.md** - Technology stack, development conventions, workflow
3. **structure.md** - Project organization, naming patterns, architecture

## Process Overview

The agent will guide you through a structured 3-phase conversation:

### Phase 1: Product Information
- Product purpose and value proposition
- Target users and use cases  
- Key features and functionality
- Business objectives and success metrics

### Phase 2: Technical Details
- Technology stack and architecture
- Development conventions and rules
- Frameworks, libraries, and tools
- Development workflow and practices

### Phase 3: Project Structure  
- Directory organization and layout
- Naming conventions and patterns
- Configuration management
- Build and deployment structure

## How It Works

1. **One question at a time** - No overwhelming questionnaires
2. **Complete answers expected** - Agent waits for thorough responses
3. **Iterative validation** - Review and approve each file before continuing
4. **Refinement supported** - Make changes based on your feedback

## Generated Files

Files are created in the `Steering/` directory with proper frontmatter:
- Marked with `inclusion: always` for automatic loading
- Professional markdown formatting
- Ready for immediate use by Claude Code

## Usage

Simply invoke this command and the steering-context-generator agent will begin the guided conversation to create your project's steering documentation.

Ready to begin? The agent will start with a friendly introduction and Phase 1 questions.
