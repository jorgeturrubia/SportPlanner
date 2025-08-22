---
allowed-tools: angular-cli:get_best_practices, angular-cli:search_documentation, Write, Edit, Bash(ng:*)
argument-hint: [feature-name] [description]
description: Create a complete feature across Angular frontend and .NET backend
---

Create a complete feature implementation:

**Feature**: $ARGUMENTS

**Implementation Plan**:
1. **Frontend (Angular)**:
   - Generate standalone components
   - Create services with signals
   - Implement routing
   - Add form validation
   - Style with Tailwind CSS v4

2. **Backend (.NET)**:
   - Create minimal API endpoints
   - Add validation logic
   - Implement business logic
   - Add error handling

3. **Database (Supabase)**:
   - Design schema changes
   - Create RLS policies
   - Add indexes for performance
   - Set up real-time subscriptions

4. **Integration**:
   - Connect Angular services to APIs
   - Test end-to-end functionality
   - Validate security policies

Use angular-specialist for frontend, api-architect for backend, and supabase-manager for database components.
