---
allowed-tools: Read, LS, Glob
argument-hint: [feature-name or spec-path]
description: Validate that specifications include all necessary technical details from steering files (CSS frameworks, libraries, etc.)
---

# Validate Specification Completeness

Validates that generated specifications properly include technical details from steering files.

## What This Command Does

This command performs a comprehensive check to ensure specifications are complete and implementation-ready:

1. **Steering Context Check**: Verify all steering files are referenced
2. **Technology Stack Validation**: Ensure CSS frameworks, libraries, and tools from tech.md are included
3. **Convention Compliance**: Check that relevant conventions are applied
4. **Implementation Readiness**: Verify specs contain enough detail for development agents

## Validation Checklist

### Requirements Validation
- [ ] Business objectives align with product.md
- [ ] User stories follow EARS notation
- [ ] Success metrics are defined
- [ ] All user scenarios are covered

### Design Validation
- [ ] **CSS Framework**: Specific framework and version mentioned (e.g., "Tailwind CSS v4")
- [ ] **Icon Library**: Icon system specified (e.g., "Hero Icons")
- [ ] **Responsive Strategy**: Mobile-first approach documented
- [ ] **Component Patterns**: UI implementation strategy defined
- [ ] **Architecture**: Follows tech.md patterns
- [ ] **API Design**: Endpoints and data flow documented
- [ ] **Integration Points**: Dependencies clearly identified

### Task Validation
- [ ] Tasks are technology-tagged for appropriate agents
- [ ] Dependencies are clearly identified
- [ ] Acceptance criteria are actionable
- [ ] Implementation order is logical

### Steering Integration Check
- [ ] **product.md**: Business context applied
- [ ] **tech.md**: Technology stack details included
- [ ] **structure.md**: File organization respected
- [ ] **Conventions/shared.md**: Cross-cutting patterns applied
- [ ] **Conventions/ui.md**: UI/UX patterns referenced
- [ ] **Conventions/[tech].md**: Technology-specific patterns used

## Common Issues Found

### Missing Technical Details
```
❌ Issue: "Use modern CSS framework"
✅ Should be: "Use Tailwind CSS v4 with utility-first approach"

❌ Issue: "Add icons to interface"
✅ Should be: "Implement Hero Icons with consistent sizing (w-5 h-5)"

❌ Issue: "Make responsive"
✅ Should be: "Mobile-first responsive design using Tailwind breakpoints"
```

### Vague Implementation Guidance
```
❌ Issue: "Style the components"
✅ Should be: "Apply Tailwind utility classes following Conventions/ui.md patterns"

❌ Issue: "Add error handling"
✅ Should be: "Implement error states with consistent color scheme from Conventions/ui.md"
```

### Missing Convention References
```
❌ Issue: "Follow project conventions"
✅ Should be: "Apply Angular conventions from Conventions/angular.md and UI patterns from Conventions/ui.md"
```

## Output Format

### Validation Results
```
📋 **Specification Validation Report**

**Feature**: user-authentication
**Status**: ⚠️ NEEDS IMPROVEMENT

**Missing Technical Details**:
- CSS Framework version not specified in design.md
- Icon library not mentioned
- Responsive strategy not documented

**Convention Compliance**:
- ✅ Angular patterns referenced
- ❌ UI conventions not applied
- ✅ Shared conventions followed

**Recommendations**:
1. Add UI/UX Implementation Strategy section to design.md
2. Specify "Tailwind CSS v4" and "Hero Icons" explicitly
3. Reference Conventions/ui.md for styling patterns
```

### Auto-Improvement Suggestions
When issues are found, the command provides specific suggestions:

```
💡 **Suggested Improvements**

Add to design.md:
```markdown
### UI/UX Implementation Strategy
**CSS Framework**: Tailwind CSS v4 with utility-first approach
**Icons**: Hero Icons with consistent sizing patterns
**Responsive Design**: Mobile-first using Tailwind breakpoints (sm:, md:, lg:)
**Component Styling**: Follow Conventions/ui.md patterns for buttons, forms, modals
```

This ensures development agents have clear, specific guidance for implementation.

## Usage Examples

```bash
# Validate specific feature
/validate-spec user-authentication

# Validate specification by path
/validate-spec specs/team-management/

# The command will analyze all three files and provide comprehensive feedback
```

## Integration with Workflow

Use this command:
- **After generating specs**: Before handing off to development
- **During reviews**: To ensure quality standards
- **Before implementation**: Final check before development starts

This validation ensures that specifications are truly implementation-ready and contain all necessary technical details from your steering files.
