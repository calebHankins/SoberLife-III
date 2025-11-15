# GitHub Actions Workflows

This directory contains automated workflows for SoberLife III.

## Workflows Overview

### 1. Deploy (`deploy.yml`)

**Trigger:** Push to main/master, or pull request
**Purpose:** Test and deploy the application

**Jobs:**
- `test` - Runs on all pushes and PRs
  - Validates HTML structure
  - Runs Node.js tests
  - Runs Playwright e2e tests
  - Uploads test reports
- `deploy` - Runs only on main/master pushes
  - Deploys to GitHub Pages
  - Only runs after tests pass

### 2. Release (`release.yml`)

**Trigger:** Manual workflow dispatch
**Purpose:** Create versioned releases via GitHub UI

**How to Use:**
1. Go to Actions tab
2. Select "Release" workflow
3. Click "Run workflow"
4. Choose version increment (patch/minor/major)
5. Click "Run workflow" button

**Process:**
1. Runs full test suite
2. Bumps version in package.json
3. Updates version in source files
4. Creates git commit and tag
5. Pushes to repository
6. Triggers deployment

**Permissions Required:**
- `contents: write` - To push commits and tags
- `pages: write` - To trigger deployment
- `id-token: write` - For GitHub Pages

### 3. Release on PR (`release-on-pr.yml`)

**Trigger:** Pull request merged to main/master
**Purpose:** Automatic releases based on PR labels

**How to Use:**
1. Create pull request as normal
2. Add one of these labels:
   - `release:patch` - Bug fixes (0.22.2 → 0.22.3)
   - `release:minor` - New features (0.22.2 → 0.23.0)
   - `release:major` - Breaking changes (0.22.2 → 1.0.0)
3. Merge the PR
4. Release happens automatically

**Process:**
1. Detects release label on merged PR
2. Runs full test suite
3. Determines version increment from label
4. Creates release commit and tag
5. Pushes to repository
6. Triggers deployment

**Label Priority:**
If multiple labels present: major > minor > patch

## Workflow Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                     Release Triggers                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Manual Trigger              PR with Label                   │
│  (Actions Tab)               (release:patch/minor/major)     │
│       │                              │                       │
│       ├──────────────┬───────────────┤                       │
│       │              │               │                       │
│       ▼              ▼               ▼                       │
│  release.yml    release-on-pr.yml                            │
│       │              │                                       │
│       └──────────────┴───────────────┐                       │
│                                      │                       │
│                                      ▼                       │
│                              Run Tests                       │
│                                      │                       │
│                                      ▼                       │
│                           Bump Version                       │
│                                      │                       │
│                                      ▼                       │
│                         Create Commit & Tag                  │
│                                      │                       │
│                                      ▼                       │
│                            Push to Repo                      │
│                                      │                       │
│                                      ▼                       │
│                              deploy.yml                      │
│                                      │                       │
│                                      ▼                       │
│                          Deploy to GitHub Pages              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Setup Requirements

### Repository Settings

For workflows to function properly, configure these settings:

1. **Workflow Permissions:**
   - Go to: Settings → Actions → General
   - Under "Workflow permissions":
     - Select "Read and write permissions"
     - Check "Allow GitHub Actions to create and approve pull requests"
   - Click "Save"

2. **GitHub Pages:**
   - Go to: Settings → Pages
   - Source: "GitHub Actions"
   - Branch: main (or master)

3. **Branch Protection (Optional but Recommended):**
   - Go to: Settings → Branches
   - Add rule for main/master:
     - Require pull request reviews
     - Require status checks (tests) to pass
     - Require branches to be up to date

### Labels for PR-Based Releases

Create these labels in your repository:

1. Go to: Issues → Labels → New label
2. Create:
   - Name: `release:patch`, Color: `#0e8a16`, Description: "Bug fixes and patches"
   - Name: `release:minor`, Color: `#fbca04`, Description: "New features"
   - Name: `release:major`, Color: `#d73a4a`, Description: "Breaking changes"

## Testing Workflows

### Test Without Making Changes

Use workflow dispatch with a test branch:

1. Create test branch: `git checkout -b test-release`
2. Push to GitHub: `git push origin test-release`
3. Go to Actions → Release → Run workflow
4. Select `test-release` branch
5. Choose version increment
6. Run workflow
7. Verify it works without affecting main

### Dry Run Locally

Test release process locally before using workflows:

```bash
npm run release -- --dry-run
```

This shows what would happen without making changes.

## Monitoring Workflows

### View Workflow Runs

1. Go to Actions tab
2. Select workflow from left sidebar
3. Click on specific run to see details
4. View logs for each step
5. Download artifacts (test reports)

### Notifications

Configure notifications for workflow failures:

1. Go to: Settings → Notifications
2. Under "Actions":
   - Check "Send notifications for failed workflows"
   - Choose notification method (email, web, mobile)

## Troubleshooting

### Common Issues

**Issue: Permission Denied**
- Fix: Check workflow permissions in Settings → Actions → General
- Ensure "Read and write permissions" is selected

**Issue: Tests Fail in CI**
- Fix: Run `npm test` locally first
- Check Playwright browser installation
- Review test logs in Actions tab

**Issue: Deployment Not Triggered**
- Fix: Verify GitHub Pages source is "GitHub Actions"
- Check that release pushed to correct branch
- Manually trigger deploy workflow if needed

**Issue: Version Already Exists**
- Fix: Delete tag locally and remotely:
  ```bash
  git tag -d v0.22.3
  git push origin :refs/tags/v0.22.3
  ```
- Retry release

**Issue: Multiple Release Labels on PR**
- Fix: Remove extra labels, keep only one
- Priority: major > minor > patch

### Debug Mode

Enable debug logging for workflows:

1. Go to: Settings → Secrets and variables → Actions
2. Add repository variable:
   - Name: `ACTIONS_STEP_DEBUG`
   - Value: `true`
3. Re-run workflow to see detailed logs

## Best Practices

1. **Always Test First:**
   - Run `npm test` locally before releasing
   - Verify all tests pass in CI before merging

2. **Use Semantic Versioning:**
   - Patch: Bug fixes only
   - Minor: New features, backward compatible
   - Major: Breaking changes

3. **Document Changes:**
   - Update README.md before releasing
   - Add comments to PRs explaining changes
   - Use clear commit messages

4. **Monitor Deployments:**
   - Check Actions tab after release
   - Verify live site after deployment
   - Test critical functionality

5. **Coordinate Releases:**
   - Announce releases to team
   - Schedule releases during low-traffic times
   - Have rollback plan ready

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [release-it Documentation](https://github.com/release-it/release-it)
- [Semantic Versioning](https://semver.org/)

## Quick Reference

| Task               | Command/Action                            |
| ------------------ | ----------------------------------------- |
| Manual release     | Actions → Release → Run workflow          |
| PR-based release   | Add `release:*` label → Merge PR          |
| View workflow runs | Actions tab → Select workflow             |
| Test locally       | `npm run release -- --dry-run`            |
| Check permissions  | Settings → Actions → General              |
| Configure Pages    | Settings → Pages → Source: GitHub Actions |
