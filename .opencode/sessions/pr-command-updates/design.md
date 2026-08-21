# Design: Update /pr and /implement-and-pr Commands

## Overview

Redesign `/pr` and `/implement-and-pr` commands to match typical workflow where user is already in a worktree and wants to either update an existing PR or create a new one.

## User Workflow Context

**Typical scenario**: User is finishing design/spec phase, already in a worktree, and wants to direct the agent to finish planning and start building. They may be:
- Continuing work on an existing PR (add more commits)
- Starting a new feature branch (create first PR)

**Key requirement**: Commands should work in current location without worktree switching logic.

## Command Changes

### `/implement-and-pr`

**Before**:
- Description: "Implement the approved plan in a worktree and open a pull request."
- Behavior: Create/use isolated worktree, refuse to modify current checkout
- PR: Always create new

**After**:
- Description: "Implement the approved plan and create or update a pull request."
- Behavior: Work in current checkout, no worktree switching
- PR: Update existing if present, create new if not

**Removed language**:
- ❌ "Use an isolated worktree: create or use one for a new descriptive branch, and make all edits there."
- ❌ "Do not modify the current checkout, its branch, index, or uncommitted files."
- ❌ "If you cannot create or access a worktree, report the blocker and stop without editing the current checkout."
- ❌ "push the worktree branch"

**Added language**:
- ✅ "Work in the current checkout—do not create or switch worktrees."
- ✅ "push the current branch"
- ✅ "Check if this branch already has an open pull request: if yes, the push updates it; if no, open a new pull request"
- ✅ "PR URL (existing or new)" in return values

### `/pr`

**Before**:
- Description: "Commit this conversation's changes and open a pull request."
- Behavior: Work in current location
- PR: Always create new

**After**:
- Description: "Commit this conversation's changes and create or update a pull request."
- Behavior: Work in current location (unchanged)
- PR: Update existing if present, create new if not

**Added language**:
- ✅ "Create or update a pull request" (in description and template)
- ✅ "Check if this branch already has an open pull request: if yes, the push updates it; if no, open a new pull request"
- ✅ "PR URL (existing or new)" in return values

## Behavior Summary

| Command | Works In | Worktree Logic | PR Behavior |
|---------|----------|----------------|-------------|
| `/pr` | Current checkout | None (works in place) | Smart: update existing or create new |
| `/implement-and-pr` | Current checkout | None (works in place) | Smart: update existing or create new |

## Implementation Details

Both commands now:
1. ✅ Work in the current checkout (no worktree creation/switching)
2. ✅ Check for existing PR on current branch using `gh pr view` or equivalent
3. ✅ If PR exists: just push commits (GitHub automatically updates PR)
4. ✅ If no PR exists: create new PR with `gh pr create`
5. ✅ Return clear indication of whether PR was new or updated

## Expected Agent Behavior

When user runs `/implement-and-pr`:
```bash
# Agent should:
git status                    # Check current state
# ... implement changes ...
# ... run verification ...
git add <files>
git commit -m "..."
git push origin <current-branch>
gh pr view --json url         # Check for existing PR
# If PR exists: done (push updated it)
# If no PR: gh pr create ...
```

## Verification

- [x] JSON syntax valid
- [x] Both command templates updated
- [x] Descriptions updated to reflect new behavior
- [x] Worktree creation logic removed from /implement-and-pr
- [x] PR detection logic added to both commands
- [x] Design spec written
