# Release Management

## Overview

SoberLife III uses `release-it` for version management and releases. The tool automates version bumping, git tagging, and changelog generation without publishing to npm.

## Quick Start

```bash
# Run interactive release
npm run release

# Dry run to preview changes
npm run release -- --dry-run

# Non-interactive release with specific version
npm run release -- --ci --increment patch
```

## Release Process

### 1. Pre-Release Checklist

Before creating a release, ensure:

- ✅ All tests pass: `npm test`
- ✅ No uncommitted changes (or use `--no-git.requireCleanWorkingDir`)
- ✅ All features are documented
- ✅ README.md is up to date
- ✅ No security vulnerabilities: `npm audit`

### 2. Running a Release

**Interactive Mode (Recommended):**
```bash
npm run release
```

This will:
1. Prompt you to select version increment (patch, minor, major)
2. Show you the changes that will be made
3. Ask for confirmation before proceeding
4. Update version in package.json
5. Create a git commit with message: `chore: release v{version}`
6. Create a git tag: `v{version}`
7. Push changes and tags to remote

**Non-Interactive Mode:**
```bash
# Patch release (0.21.0 → 0.21.1)
npm run release -- --ci --increment patch

# Minor release (0.21.0 → 0.22.0)
npm run release -- --ci --increment minor

# Major release (0.21.0 → 1.0.0)
npm run release -- --ci --increment major
```

### 3. Version Increment Guidelines

**Patch (0.21.0 → 0.21.1):**
- Bug fixes
- Documentation updates
- Test improvements
- Minor refactoring

**Minor (0.21.0 → 0.22.0):**
- New features
- New tasks or game modes
- New zen activities
- Significant UI improvements

**Major (0.21.0 → 1.0.0):**
- Breaking changes
- Complete redesigns
- Major architectural changes
- Public API changes

### 4. Post-Release

After release completes:

1. **Verify Git Tags:**
   ```bash
   git tag -l
   ```

2. **Check Remote:**
   ```bash
   git log --oneline -5
   ```

3. **Verify Deployment:**
   - GitHub Actions will automatically deploy to GitHub Pages
   - Check Actions tab for deployment status
   - Visit live site to verify changes

## Configuration

Release configuration is in `.release-it.json`:

```json
{
  "npm": {
    "publish": false  // Never publish to npm registry
  },
  "git": {
    "commitMessage": "chore: release v${version}",
    "tagName": "v${version}",
    "requireCleanWorkingDir": false
  },
  "github": {
    "release": false  // No GitHub releases (using tags only)
  },
  "hooks": {
    "after:bump": [
      "node scripts/update-version.js"  // Auto-update version in source files
    ]
  }
}
```

### Version Management

The version is automatically synchronized across:
- `package.json` (source of truth)
- `assets/js/version.js` (imported by JavaScript modules)
- `index.html` (version footer fallback)

When you run `npm run release`, the `scripts/update-version.js` script automatically updates all version references after bumping package.json.

#### Build Information

The version system includes additional build metadata:
- **VERSION**: Semantic version from package.json (e.g., "0.21.0")
- **GIT_HASH**: Short commit hash (e.g., "56ca618")
- **GIT_BRANCH**: Current git branch (e.g., "main")
- **BUILD_DATE**: ISO timestamp of when version was updated

This information is:
- Logged to console on game initialization
- Displayed in tooltip when hovering over version footer
- Available for debugging and support purposes

Example console output:
```
🧘 SoberLife III v0.21.0 - Stress Management Game
📦 Build: 56ca618 (main) - 11/15/2025, 11:58:06 AM
```

## Common Scenarios

### Dry Run (Preview Changes)

```bash
npm run release -- --dry-run
```

This shows what would happen without making any changes.

### Skip Git Checks

```bash
npm run release -- --no-git.requireCleanWorkingDir
```

Useful when you have uncommitted changes you want to keep separate.

### Custom Version

```bash
npm run release -- --increment 0.22.0
```

Set a specific version number.

### Skip Prompts

```bash
npm run release -- --ci --increment patch
```

Useful for automated releases or CI/CD pipelines.

## Troubleshooting

### Issue: "Working directory is not clean"

**Solution:**
```bash
# Commit your changes first
git add .
git commit -m "feat: your changes"

# Or skip the check
npm run release -- --no-git.requireCleanWorkingDir
```

### Issue: "Git push failed"

**Solution:**
```bash
# Ensure you have push permissions
git push origin main

# Or skip git push
npm run release -- --no-git.push
```

### Issue: "Version already exists"

**Solution:**
```bash
# Check current version
npm version

# Delete tag if needed
git tag -d v0.21.0
git push origin :refs/tags/v0.21.0

# Try release again
npm run release
```

## Best Practices

1. **Always run tests before releasing:**
   ```bash
   npm test && npm run release
   ```

2. **Use semantic versioning:**
   - Follow semver guidelines for version increments
   - Document breaking changes clearly

3. **Write meaningful commit messages:**
   - Release commits are auto-generated
   - Ensure previous commits are descriptive

4. **Tag releases consistently:**
   - Always use `v` prefix (v0.21.0)
   - Never manually create version tags

5. **Coordinate with team:**
   - Announce releases in team channels
   - Document significant changes
   - Update README.md before releasing

## CI/CD Integration

### Automated Releases via GitHub Actions

SoberLife III supports two automated release workflows:

#### Option 1: Manual Trigger (Recommended)

Trigger releases directly from GitHub's Actions tab:

1. **Navigate to Actions Tab:**
   - Go to your repository on GitHub
   - Click "Actions" tab
   - Select "Release" workflow

2. **Run Workflow:**
   - Click "Run workflow" button
   - Select branch (usually `main` or `master`)
   - Choose version increment: `patch`, `minor`, or `major`
   - Click "Run workflow"

3. **Automated Process:**
   - Runs full test suite
   - Creates version bump commit
   - Creates git tag
   - Pushes changes to repository
   - Triggers deployment workflow

**Benefits:**
- Full control over release timing
- No local setup required
- Works from any device with web access
- Clear audit trail in Actions tab

#### Option 2: PR Label-Based Releases

Automatically create releases when PRs are merged with specific labels:

1. **Add Label to PR:**
   - `release:patch` - Bug fixes and minor updates
   - `release:minor` - New features
   - `release:major` - Breaking changes

2. **Merge PR:**
   - When PR is merged to main/master
   - Workflow automatically triggers
   - Creates release based on label

3. **Automated Process:**
   - Detects release label
   - Runs full test suite
   - Creates appropriate version bump
   - Pushes changes and tags
   - Triggers deployment

**Benefits:**
- Seamless integration with PR workflow
- No manual trigger needed
- Release tied to specific PR
- Team can see release intent before merge

### Local Releases (Still Supported)

You can still run releases locally if preferred:

```bash
# Interactive release
npm run release

# Non-interactive release
npm run release -- --ci --increment patch
```

### Workflow Files

The automated release workflows are defined in:
- `.github/workflows/release.yml` - Manual trigger workflow
- `.github/workflows/release-on-pr.yml` - PR label-based workflow
- `.github/workflows/deploy.yml` - Deployment workflow (triggered after release)

## Resources

- **release-it Documentation:** https://github.com/release-it/release-it
- **Semantic Versioning:** https://semver.org/
- **Conventional Commits:** https://www.conventionalcommits.org/

## Troubleshooting GitHub Actions Releases

### Issue: Workflow Permission Denied

**Symptoms:**
- Workflow fails with "permission denied" error
- Cannot push tags or commits

**Solution:**
1. Go to repository Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Save changes

### Issue: Tests Fail in Workflow

**Symptoms:**
- Release workflow fails during test step
- Tests pass locally but fail in CI

**Solution:**
1. Check test output in Actions tab
2. Verify all dependencies are installed
3. Ensure Playwright browsers are cached correctly
4. Run tests locally with `npm test` before triggering release

### Issue: Deployment Not Triggered

**Symptoms:**
- Release completes but site doesn't update
- No deployment workflow runs

**Solution:**
1. Check that release workflow pushed to correct branch
2. Verify deployment workflow is enabled
3. Check GitHub Pages settings are correct
4. Manually trigger deployment workflow if needed

## Summary

**Automated Release Options:**
```
GitHub Actions (Manual):  Actions tab → Release → Run workflow → Select version
GitHub Actions (PR):      Add release:patch/minor/major label → Merge PR
Local (Traditional):      npm run release
```

**Quick Commands:**
```bash
npm run release              # Interactive local release
npm run release -- --dry-run # Preview changes locally
npm test && npm run release  # Test then release locally
```

**Remember:**
- Automated releases run tests automatically
- Manual trigger gives most control
- PR labels integrate with review process
- Local releases still work if needed
- Follow semantic versioning guidelines
- Never publish to npm (configured to skip)
- All releases auto-deploy via GitHub Actions
