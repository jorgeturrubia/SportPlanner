---
allowed-tools: Read, Grep, Bash, web_fetch
description: Debug and fix integration issues between frontend and backend
---

Debug integration issues between Angular and .NET:

1. **Identify the Problem**:
   - Check browser console for errors
   - Verify API endpoint accessibility
   - Test CORS configuration
   - Validate request/response formats

2. **Common Issues to Check**:
   - API URL mismatches between environments
   - CORS policy problems
   - Authentication token handling
   - Data model synchronization
   - Supabase connection issues

3. **Automated Diagnostics**:
   - Test API endpoints directly
   - Validate Angular service calls
   - Check Supabase RLS policies
   - Performance analysis

4. **Fix Implementation**:
   - Update configuration files
   - Synchronize data models
   - Fix CORS settings
   - Update API routes

Use integration-validator agent to diagnose and resolve issues.
