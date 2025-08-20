# Code Style Guide - PlanSport

## Context

Estándares de código específicos para PlanSport (Angular 20 + .NET 8 + Supabase).

## General Formatting

### Indentation
- Use 2 spaces for indentation (never tabs)
- Maintain consistent indentation throughout files
- Align nested structures for readability

### Naming Conventions

#### TypeScript/Angular
- **Variables and Functions**: Use camelCase (e.g., `teamService`, `calculateTotal`)
- **Classes and Interfaces**: Use PascalCase (e.g., `TeamService`, `ITeamData`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_TEAM_SIZE`)
- **Components**: kebab-case for files, PascalCase for classes (e.g., `team-list.component.ts`, `TeamListComponent`)

#### C#/.NET
- **Methods and Properties**: Use PascalCase (e.g., `GetTeams`, `UserId`)
- **Variables**: Use camelCase (e.g., `teamCount`, `userId`)
- **Classes and Interfaces**: Use PascalCase (e.g., `TeamService`, `ITeamRepository`)
- **Constants**: Use PascalCase (e.g., `MaxTeamSize`)

### String Formatting
- **TypeScript**: Use single quotes for strings: `'Hello World'`
- **C#**: Use double quotes for strings: `"Hello World"`
- Use template literals/string interpolation for complex strings

### Code Comments
- **IMPORTANT**: DO NOT ADD COMMENTS unless explicitly requested
- Focus on self-documenting code through clear naming
- Only add comments for complex business logic when necessary
- Keep comments in Spanish for business context, English for technical details

## Technology-Specific Style Guides

### Tailwind CSS 4
For comprehensive Tailwind CSS 4 guidelines including modern utility patterns, design system integration, responsive design, dark mode implementation, and Angular component integration:

📖 **[Tailwind CSS 4 Style Guide](./tailwind-style.md)**

Key highlights:
- Modern CSS-in-JS patterns with @config
- Sports-focused design system and color palette
- Angular 20 integration with signals and standalone components
- Performance optimization and accessibility guidelines
- Spanish sports app UI patterns (teams, planning, marketplace)
</conditional-block>

<conditional-block task-condition="html-css-tailwind" context-check="html-css-style">
IF current task involves writing or updating HTML, CSS, or TailwindCSS:
  IF html-style.md AND css-style.md AND tailwind-style.md already in context:
    SKIP: Re-reading these files
    NOTE: "Using HTML/CSS/Tailwind style guides already in context"
  ELSE:
    <context_fetcher_strategy>
      IF current agent is Claude Code AND context-fetcher agent exists:
        USE: @agent:context-fetcher
        REQUEST: "Get HTML formatting rules from code-style/html-style.md"
        REQUEST: "Get CSS and TailwindCSS rules from code-style/css-style.md"
        REQUEST: "Get Tailwind CSS 4 guidelines from code-style/tailwind-style.md"
        PROCESS: Returned style rules
      ELSE:
        READ the following style guides (only if not already in context):
        - @.agent-os/standards/code-style/html-style.md (if not in context)
        - @.agent-os/standards/code-style/css-style.md (if not in context)
        - @.agent-os/standards/code-style/tailwind-style.md (if not in context)
    </context_fetcher_strategy>
ELSE:
  SKIP: HTML/CSS style guides not relevant to current task
</conditional-block>

<conditional-block task-condition="javascript" context-check="javascript-style">
IF current task involves writing or updating JavaScript:
  IF javascript-style.md already in context:
    SKIP: Re-reading this file
    NOTE: "Using JavaScript style guide already in context"
  ELSE:
    <context_fetcher_strategy>
      IF current agent is Claude Code AND context-fetcher agent exists:
        USE: @agent:context-fetcher
        REQUEST: "Get JavaScript style rules from code-style/javascript-style.md"
        PROCESS: Returned style rules
      ELSE:
        READ: @.agent-os/standards/code-style/javascript-style.md
    </context_fetcher_strategy>
ELSE:
  SKIP: JavaScript style guide not relevant to current task
</conditional-block>
