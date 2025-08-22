---
allowed-tools: Read, Bash(ng:*), Bash(dotnet:*), web_fetch
description: Validate full-stack compatibility and configuration
---

Run comprehensive validation across the entire stack:

1. **Angular 20 Validation**:
   - Check for standalone components usage
   - Validate modern control flow (@if/@for)
   - Verify Tailwind CSS v4 syntax
   - Test component compilation

2. **.NET 8 Validation**:
   - Verify minimal API patterns
   - Check Supabase integration
   - Validate CORS configuration
   - Test API endpoints

3. **Supabase Validation**:
   - Check RLS policies
   - Validate schema constraints
   - Test database connectivity
   - Verify performance indexes

4. **Integration Testing**:
   - Test API calls from Angular
   - Validate data flow
   - Check authentication
   - Performance benchmarks

Use integration-validator agent to run all validation checks.
