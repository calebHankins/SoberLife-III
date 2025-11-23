# Agent Workflows

This document outlines specific workflows that AI agents can execute to perform complex tasks autonomously.

## GitHub Issue Workflow

**Trigger**: "Please review and fix issue #<number>"

**Description**:
This workflow allows the agent to take a GitHub issue number, analyze it, reproduce it (if it's a bug), fix it, and verify the fix.

**Steps**:
1.  **Read Issue**: The agent uses `gh issue view <number>` to understand the requirements.
2.  **Branch**: Creates a dedicated branch `issue/<number>`.
3.  **Reproduce**: Writes a Playwright test to reproduce the issue.
4.  **Fix**: Implements the necessary code changes.
5.  **Verify**: Runs the test to confirm the fix and ensures no regressions.
6.  **Commit**: Commits the changes with a reference to the issue.
7.  **PR**: Pushes the branch and creates a Pull Request using `gh pr create`.
8.  **Merge**: Merges the PR using `gh pr merge --merge --delete-branch` (use merge commits, not squash) and updates the local main branch.

**Usage**:
Ensure the `gh` CLI is authenticated and available.
