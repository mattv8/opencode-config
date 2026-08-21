# Design: @coder-fast Agent with Claude 3.5 Haiku

## Overview

Add a fast, cost-efficient coder agent using Claude 3.5 Haiku for bounded implementation tasks where speed matters more than deep reasoning.

## Agent Characteristics

### When to use @coder-fast

- **Simple, well-defined file edits**: Type changes, imports, minor refactors
- **Quick fixes with clear scope**: Bug fixes where the solution is known
- **Mechanical refactors**: Renaming, extracting constants, formatting

### When NOT to use @coder-fast

- Complex problem-solving requiring reasoning
- Architectural decisions or design choices
- Unclear scope or exploration-heavy tasks
- Rate-limited sessions (stick to GPT-based @coder)

## Implementation

### Agent Configuration

**Model**: `anthropic/claude-3-5-haiku-20241022`

**Description**: "Fast implementation worker for simple, well-defined changes. Best for mechanical edits, quick fixes, and bounded refactors."

**Permissions**: Same as @coder agent
- `doom_loop`: ask
- `question`: deny
- `plan_enter`/`plan_exit`: deny
- `task`: deny
- `bash`: allow
- Environment files: ask (except .example)
- External directories: specific allowlist

### Haiku-Optimized Prompt

Tailored to Haiku's strengths (speed, instruction-following) and weaknesses (less reasoning depth):

> You are a fast bounded implementation worker optimized for speed and simple execution. Your strength is rapidly executing well-defined changes with clear instructions. Execute the orchestrator's scoped patch literally and mechanically: change only the requested files or the smallest adjacent files needed, make the exact code change specified, preserve unrelated user changes, follow repository instructions, and verify with focused checks when practical.
>
> The orchestrator should provide a concrete goal, files in scope, expected changes, constraints, non-goals, and verification commands. If the assignment requires architectural decisions, complex problem-solving, or unclear scope, return NEEDS_SCOPE immediately—you are optimized for speed on bounded tasks, not exploration or design.
>
> Work patterns you excel at: type changes, import corrections, mechanical refactors (renaming, extracting constants), applying known fixes, updating configurations, formatting changes, and other well-defined single-purpose edits.
>
> If the orchestrator gives you a session folder path (e.g. .opencode/sessions/<slug>/), read the named handoff file there first and write your summary and changed-file notes back into that folder.

### Updated /rate-limit Command

**Before**:
```
Do not dispatch @reviewer or @designer, including when another command requests a final @reviewer gate.
```

**After**:
```
Do not dispatch @reviewer, @designer, or @coder-fast, including when another command requests these agents. Use @reviewer-alt for all code-review gates, @designer-alt for design or UI work, and @coder (not @coder-fast) for implementation.
```

## Key Design Decisions

1. **Similar permissions to @coder** - Not more restrictive, just faster execution
2. **Explicit scope signaling** - Prompt emphasizes returning NEEDS_SCOPE for complex tasks rather than attempting them
3. **Speed optimization language** - "mechanically", "literally", "rapidly" to leverage Haiku's fast token generation
4. **Work pattern examples** - Lists specific tasks Haiku handles well to guide orchestrator delegation
5. **Rate-limit exclusion** - Explicitly blocks @coder-fast during Anthropic rate limits since it's an Anthropic model

## Usage Examples

### Good uses for @coder-fast

```bash
# Type change across a file
@coder-fast: Change all `userId: number` to `userId: string` in src/types/user.ts

# Mechanical refactor
@coder-fast: Extract magic string "https://api.example.com" to constant API_BASE_URL in src/config.ts

# Known fix
@coder-fast: Add missing import for React in src/components/Button.tsx
```

### Bad uses for @coder-fast

```bash
# Too complex/exploratory
@coder-fast: Refactor the auth system to support multiple providers

# Architectural decision
@coder-fast: Decide how to structure the new feature module

# During rate limits
/rate-limit
@coder-fast: <any task>  # Will be blocked by rate-limit rules
```

## Verification

- [x] JSON syntax valid
- [x] Config loads in OpenCode
- [x] Agent added between coder and reviewer
- [x] Rate-limit command updated to exclude @coder-fast
- [x] Design doc written to session folder
