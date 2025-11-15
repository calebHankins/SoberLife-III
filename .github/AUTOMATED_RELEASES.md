# Automated Releases via GitHub Actions

## Overview

SoberLife III now supports fully automated releases through GitHub Actions. You can create releases entirely through the web interface without running any local commands.

## Why Automated Releases?

**Benefits:**
- ✅ No local setup required
- ✅ Works from any device with web access
- ✅ Consistent release process
- ✅ Automatic testing before release
- ✅ Clear audit trail
- ✅ Team collaboration friendly
- ✅ Integrates with PR workflow

## Two Methods Available

### Method 1: Manual Trigger

**Best for:** Planned releases, multiple PR merges, major versions

**How it works:**
1. Navigate to Actions tab on GitHub
2. Select "Release" workflow
3. Click "Run workflow"
4. Choose version increment (patch/minor/major)
5. Workflow runs tests, creates release, deploys

**Use cases:**
- Scheduled releases
- After merging several PRs
- When you want explicit control
- Major version bumps

### Method 2: PR Labels

**Best for:** Feature releases, hotfixes, single-PR releases

**How it works:**
1. Create PR as normal
2. Add label: `release:patch`, `release:minor`, or `release:major`
3. Merge PR
4. Release happens automatically

**Use cases:**
- Feature branches that warrant immediate release
- Hotfix deployments
- When PR directly represents a release
- Streamlined workflow

## Quick Start

### First Time Setup (5 minutes)

1. **Enable Workflow Permissions:**
   - Settings → Actions → General
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
   - Save

2. **Verify GitHub Pages:**
   - Settings → Pages
   - Source: "GitHub Actions"

3. **Create Labels (for PR method):**
   - Issues → Labels → New label
   - Create: `release:patch`, `release:minor`, `release:major`

4. **Test It:**
   - Actions → Release → Run workflow
   - Select `patch` increment
   - Verify it works

**Detailed checklist:** See `.github/SETUP_CHECKLIST.md`

### Creating Your First Release

**Option A: Manual Trigger**
```
1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Click: "Release" in left sidebar
3. Click: "Run workflow" button (top right)
4. Select: main branch
5. Choose: patch (for first test)
6. Click: "Run workflow"
7. Watch: Workflow runs in real-time
8. Verify: New version appears in repository
```

**Option B: PR Label**
```
1. Create: Pull request with your changes
2. Add: Label "release:patch"
3. Review: Get code review as normal
4. Merge: Merge the PR
5. Watch: Release workflow triggers automatically
6. Verify: New version deployed
```

## What Happens During a Release?

### Automated Steps

1. **Tests Run:**
   - HTML validation
   - Node.js unit tests
   - Playwright e2e tests
   - If tests fail, release stops

2. **Version Bump:**
   - Updates `package.json`
   - Updates `assets/js/version.js`
   - Updates asset URLs in `index.html`
   - Includes git hash and build date

3. **Git Operations:**
   - Creates commit: `chore: release vX.Y.Z`
   - Creates tag: `vX.Y.Z`
   - Pushes to repository

4. **Deployment:**
   - Triggers deploy workflow
   - Publishes to GitHub Pages
   - Site updates automatically

### Timeline

Typical release takes 3-5 minutes:
- Tests: 2-3 minutes
- Version bump: 10 seconds
- Git operations: 10 seconds
- Deployment: 1-2 minutes

## Monitoring Releases

### Watch in Real-Time

1. Go to Actions tab
2. Click on running workflow
3. Expand steps to see progress
4. View logs for each step

### Verify Success

After workflow completes:

1. **Check Repository:**
   - New tag appears in tags list
   - New commit in history
   - Version updated in package.json

2. **Check Live Site:**
   - Visit GitHub Pages URL
   - Hover over version footer
   - Verify version number updated
   - Test new features

3. **Check Console:**
   - Open browser DevTools
   - Look for version log
   - Verify build info

## Comparison: Automated vs Local

| Aspect          | Automated (GitHub)      | Local (npm run release) |
| --------------- | ----------------------- | ----------------------- |
| **Setup**       | One-time repo config    | Node.js + npm installed |
| **Location**    | Any device with web     | Local machine only      |
| **Testing**     | Automatic               | Manual                  |
| **Consistency** | Always same process     | Depends on local setup  |
| **Audit Trail** | Full logs in Actions    | Local git history       |
| **Team Access** | Anyone with repo access | Requires local clone    |
| **Rollback**    | Easy via git revert     | Manual git operations   |
| **Speed**       | 3-5 minutes             | 1-2 minutes             |

## Best Practices

### Before Releasing

- ✅ All tests pass locally
- ✅ Documentation updated
- ✅ Breaking changes noted
- ✅ Code reviewed (for PR method)
- ✅ No security vulnerabilities

### Choosing Version Increment

**Patch (0.22.2 → 0.22.3):**
- Bug fixes
- Documentation updates
- Test improvements
- Performance optimizations

**Minor (0.22.2 → 0.23.0):**
- New features
- New game tasks
- New zen activities
- UI enhancements

**Major (0.22.2 → 1.0.0):**
- Breaking changes
- Complete redesigns
- Removed features
- Major architectural changes

### After Releasing

- ✅ Verify deployment succeeded
- ✅ Test critical functionality
- ✅ Announce to team
- ✅ Update project board
- ✅ Close related issues

## Troubleshooting

### Common Issues

**"Permission denied" error:**
- Fix: Settings → Actions → General → "Read and write permissions"

**Tests fail in workflow:**
- Fix: Run `npm test` locally first, fix failures, retry

**Deployment doesn't trigger:**
- Fix: Verify GitHub Pages source is "GitHub Actions"

**Version already exists:**
- Fix: Delete tag, retry release

**Multiple labels on PR:**
- Fix: Keep only one release label

### Getting Help

1. Check workflow logs in Actions tab
2. Review `.github/workflows/README.md`
3. See `.kiro/steering/releases.md`
4. Test locally: `npm run release -- --dry-run`

## Migration from Local Releases

If you've been using local releases:

1. **Complete setup** (see Quick Start above)
2. **Test automated release** with patch increment
3. **Verify it works** end-to-end
4. **Switch to automated** for future releases
5. **Keep local as backup** (still works if needed)

**No breaking changes:** Local releases still work exactly as before.

## Advanced Usage

### Custom Workflows

You can customize the workflows in `.github/workflows/`:

- `release.yml` - Manual trigger workflow
- `release-on-pr.yml` - PR label workflow
- `deploy.yml` - Deployment workflow

### Environment Variables

Add secrets/variables in Settings → Secrets and variables → Actions:

- `ACTIONS_STEP_DEBUG: true` - Enable debug logging
- Custom tokens for external services
- Environment-specific configuration

### Branch Protection

Recommended settings for main/master:

- Require pull request reviews
- Require status checks (tests) to pass
- Require branches to be up to date
- Include administrators

## Resources

### Documentation

- **Quick Guide:** `.github/RELEASE_GUIDE.md`
- **Setup Checklist:** `.github/SETUP_CHECKLIST.md`
- **Workflow Details:** `.github/workflows/README.md`
- **Full Documentation:** `.kiro/steering/releases.md`

### External Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [release-it Documentation](https://github.com/release-it/release-it)
- [Semantic Versioning](https://semver.org/)

## Summary

**Automated releases make it easy to:**
- Create releases from anywhere
- Ensure consistent process
- Integrate with PR workflow
- Maintain audit trail
- Collaborate with team

**Get started in 3 steps:**
1. Complete one-time setup (5 minutes)
2. Test with manual trigger
3. Use for all future releases

**Questions?** Check the documentation files or workflow logs in Actions tab.
