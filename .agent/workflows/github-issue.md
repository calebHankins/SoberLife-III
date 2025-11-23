---
description: Process a GitHub issue by creating a reproduction test, fixing it, and verifying.
---

1.  **Analyze the Issue**
    *   Read the issue details using the `gh` CLI:
        ```bash
        gh issue view <ISSUE_NUMBER>
        ```
    *   Understand the reported bug or feature request.

2.  **Create a Feature Branch**
    *   Create and switch to a new branch for the issue:
        ```bash
        git checkout -b issue/<ISSUE_NUMBER>
        ```

3.  **Create Reproduction Test (If applicable)**
    *   If the issue is a bug in the web app, create a new Playwright test file in `tests/` (e.g., `tests/issue-<ISSUE_NUMBER>.spec.js`) that reproduces the failure.
    *   Run the test to confirm it fails:
        ```bash
        npx playwright test tests/issue-<ISSUE_NUMBER>.spec.js
        ```

4.  **Implement Fix / Feature**
    *   Modify the code to address the issue.

5.  **Verify Fix**
    *   Run the reproduction test again to ensure it passes:
        ```bash
        npx playwright test tests/issue-<ISSUE_NUMBER>.spec.js
        ```
    *   Run all tests to ensure no regressions:
        ```bash
        npm test
        ```

6.  **Push and Create Pull Request**
    *   Push the branch to the remote repository:
        ```bash
        git push origin issue/<ISSUE_NUMBER>
        ```
    *   Create a pull request using the `gh` CLI:
        ```bash
        gh pr create --title "fix: resolve issue #<ISSUE_NUMBER>" --body "Fixes #<ISSUE_NUMBER>"
        ```

7.  **Merge Pull Request**
    *   Merge the pull request (using regular merge to preserve history):
        ```bash
        gh pr merge --merge --delete-branch
        ```
    *   Switch back to main and pull latest changes:
        ```bash
        git checkout main
        git pull origin main
        ```
