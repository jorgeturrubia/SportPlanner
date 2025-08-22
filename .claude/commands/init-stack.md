---
allowed-tools: Bash(npm:*), Bash(dotnet:*), Bash(ng:*), angular-cli:get_best_practices, Write, Edit
argument-hint: [project-name]
description: Initialize a complete Angular 20 + .NET 8 + Supabase + Tailwind CSS v4 project
---

Initialize a complete full-stack project with modern architecture:

1. **Frontend Setup (Angular 20)**:
   - Create Angular 20 project with standalone components
   - Configure Tailwind CSS v4
   - Set up Hero Icons
   - Configure environments for API integration

2. **Backend Setup (.NET 8)**:
   - Create .NET 8 minimal API project
   - Configure Supabase integration
   - Set up CORS for Angular
   - Create health check endpoints

3. **Database Setup (Supabase)**:
   - Initialize database schema
   - Set up Row Level Security
   - Create initial tables and policies

4. **Integration Configuration**:
   - Configure API endpoints
   - Set up environment variables
   - Test connectivity between all components

Project name: $ARGUMENTS

Use stack-coordinator agent to orchestrate this setup process.
