# Release Guide

Quick reference for creating releases via GitHub Actions.

## Method 1: Manual Trigger (Recommended)

Perfect for planned releases with full control.

### Steps:

1. **Go to Actions Tab**
   - Navigate to: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
   - Click on "Release" workflow in the left sidebar

2. **Run Workflow**
   - Click "Run workflow" dropdown (top right)
   - Select branch: `main` (or `master`)
   - Choose version increment:
     - `patch` - Bug fixes (0.22.2 → 0.22.3)
     - `minor` - New features (0.22.2 → 0.23.0)
     - `major` - Breaking changes (0.22.2 → 1.0.0)
   - Click green "Run workflow" button

3. **Monitor Progress**
   - Watch workflow run in real-time
   - Tests run automatically
   - Version bumped and tagged
   - Changes pushed to repository
   - Deployment triggered automatically

### When to Use:
- Scheduled releases
- After merging multiple PRs
- When you want explicit control
- For major version bumps

## Method 2: PR Labels

Automatic releases when merging PRs with release labels.

### Steps:

1. **Create PR as Normal**
   - Make your changes
   - Create pull request
   - Get code review

2. **Add Release Label**
   - Before merging, add one of:
     - `release:patch` - Bug fixes
     - `release:minor` - New features
     - `release:major` - Breaking changes

3. **Merge PR**
   - Merge the pull request
   - Release workflow triggers automatically
   - Version bumped based on label
   - Deployment happens automatically

### When to Use:
- Single-feature releases
- Hotfix deployments
- When PR directly represents a release
- For streamlined workflow

## Method 3: Local Release

Traditional method using your local machine.

### Steps:

```bash
# Interactive (prompts for version)
npm run release

# Non-interactive (specify version)
npm run release -- --ci --increment patch
```

### When to Use:
- Offline development
- Testing release process
- When GitHub Actions unavailable
- Personal preference

## Version Guidelines

### Patch (X.Y.Z → X.Y.Z+1)
- Bug fixes
- Documentation updates
- Test improvements
- Performance optimizations
- Minor refactoring

### Minor (X.Y.Z → X.Y+1.0)
- New features
- New game tasks
- New zen activities
- UI enhancements
- Non-breaking API changes

### Major (X.Y.Z → X+1.0.0)
- Breaking changes
- Complete redesigns
- Major architectural changes
- Removed features
- Changed game mechanics

## Pre-Release Checklist

Before triggering any release:

- [ ] All tests passing locally
- [ ] README.md updated
- [ ] New features documented
- [ ] Breaking changes noted
- [ ] No security vulnerabilities
- [ ] Code reviewed (for PR method)

## Post-Release Verification

After release completes:

1. **Check Actions Tab**
   - Verify release workflow succeeded
   - Verify deployment workflow succeeded

2. **Check Repository**
   - New tag created (e.g., `v0.22.3`)
   - Version commit pushed
   - package.json updated

3. **Check Live Site**
   - Visit GitHub Pages URL
   - Verify version in footer
   - Test new features
   - Check console for version log

## Troubleshooting

### Workflow Fails with Permission Error

**Fix:** Repository Settings → Actions → General → Workflow permissions → "Read and write permissions"

### Tests Fail in CI

**Fix:** Run `npm test` locally first, fix any failures, then retry release

### Deployment Doesn't Trigger

**Fix:** Check that release pushed to correct branch (main/master)

### Multiple Labels on PR

**Fix:** Only add ONE release label. Priority: major > minor > patch

## Quick Reference

| Method         | Command/Action                   | Best For         |
| -------------- | -------------------------------- | ---------------- |
| Manual Trigger | Actions → Release → Run workflow | Planned releases |
| PR Label       | Add `release:*` label → Merge    | Feature releases |
| Local          | `npm run release`                | Offline/testing  |

## Need Help?

- Check `.kiro/steering/releases.md` for detailed documentation
- Review workflow files in `.github/workflows/`
- Check Actions tab for error logs
- Verify repository permissions
