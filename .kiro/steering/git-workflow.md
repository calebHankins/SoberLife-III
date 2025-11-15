# Git Workflow Guidelines

## Branch Strategy

### Never Commit Directly to Main

**ALWAYS create a feature or bugfix branch for changes:**

```bash
# For new features
git checkout -b feature/descriptive-name

# For bug fixes
git checkout -b bugfix/descriptive-name

# For documentation
git checkout -b docs/descriptive-name

# For refactoring
git checkout -b refactor/descriptive-name
```

### Branch Naming Conventions

- `feature/` - New features or enhancements
- `bugfix/` - Bug fixes
- `fix/` - Quick fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

**Examples:**
- `feature/automated-releases`
- `bugfix/playwright-installation`
- `docs/update-readme`
- `refactor/remove-duplicate-tests`

## Pull Request Workflow

### 1. Create Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes and Commit

```bash
git add .
git commit -m "feat: descriptive commit message"
```

### 3. Push Branch

```bash
git push origin feature/my-feature
```

### 4. Create Pull Request

```bash
# Using GitHub CLI
gh pr create --title "feat: My Feature" --body "Description of changes"

# Or via GitHub web interface
```

### 5. Add Appropriate Labels

For releases, add one of:
- `release:patch` - Bug fixes
- `release:minor` - New features
- `release:major` - Breaking changes

**How to add labels:**

```bash
# Method 1: Using gh CLI with API (RECOMMENDED - works reliably)
echo '{"labels":["release:patch"]}' | gh api repos/OWNER/REPO/issues/PR-NUMBER/labels --method POST --input -

# Example:
echo '{"labels":["release:patch"]}' | gh api repos/calebHankins/SoberLife-III/issues/29/labels --method POST --input -

# Method 2: Using gh pr edit (may have issues with some configurations)
gh pr edit PR-NUMBER --add-label "release:patch"

# Method 3: Via GitHub web interface
# Go to PR page → Labels section → Select appropriate release label
```

### 6. Wait for CI Checks

- All tests must pass
- Review any warnings or errors
- Fix issues in the branch, don't commit to main

### 7. Merge Pull Request

**Default merge strategy: Regular merge (NOT squash)**

```bash
# Use regular merge to preserve commit history
gh pr merge <PR-NUMBER> --merge --delete-branch

# Only use squash if explicitly requested
gh pr merge <PR-NUMBER> --squash --delete-branch
```

**Why regular merge?**
- Preserves full commit history
- Shows individual commits in the branch
- Better for understanding development process
- Easier to revert specific changes

**When to use squash merge:**
- Only when explicitly requested
- For cleaning up messy commit history
- For combining many small commits

### 8. Pull Latest Changes

```bash
git checkout main
git pull origin main
```

## What NOT to Do

### ❌ Never Commit Directly to Main

```bash
# DON'T DO THIS
git checkout main
git add .
git commit -m "fix: something"
git push origin main
```

### ❌ Never Force Push to Main

```bash
# DON'T DO THIS
git push --force origin main
```

### ❌ Don't Use Squash Merge by Default

```bash
# DON'T DO THIS (unless explicitly requested)
gh pr merge --squash
```

## Correct Workflow Example

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/add-caching

# 3. Make changes
# ... edit files ...

# 4. Commit changes
git add .
git commit -m "feat: add Playwright browser caching"

# 5. Push branch
git push origin feature/add-caching

# 6. Create PR
gh pr create --title "feat: add Playwright browser caching" \
  --body "Adds caching for Playwright browsers to speed up CI"

# 7. Add label if needed
gh pr edit <PR-NUMBER> --add-label "release:minor"

# 8. Wait for CI, get review, then merge
gh pr merge <PR-NUMBER> --merge --delete-branch

# 9. Switch back to main and pull
git checkout main
git pull origin main
```

## Emergency Hotfixes

Even for urgent fixes, create a branch:

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug

# Make fix
git add .
git commit -m "fix: critical bug in production"

# Push and create PR
git push origin hotfix/critical-bug
gh pr create --title "fix: critical bug" --body "Urgent fix" --label "release:patch"

# Merge immediately after CI passes
gh pr merge --merge --delete-branch
```

## Working with Release Workflows

### Automated Releases via PR Labels

1. Create feature/bugfix branch
2. Make changes and push
3. Create PR
4. Add appropriate release label:
   - `release:patch` for bug fixes
   - `release:minor` for new features
   - `release:major` for breaking changes
5. Merge PR (regular merge, not squash)
6. Release workflow automatically creates version bump
7. Deploy workflow tests and deploys the release

### Manual Releases

Only use manual releases for special cases:

```bash
# Trigger via GitHub Actions UI
# Actions → Release → Run workflow → Select version
```

## Branch Protection (Recommended)

Consider enabling branch protection on main:

1. Go to: Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (enforce for everyone)

## Summary

**Always:**
- ✅ Create a branch for changes
- ✅ Create a PR for review
- ✅ Wait for CI checks to pass
- ✅ Use regular merge (preserve history)
- ✅ Delete branch after merge

**Never:**
- ❌ Commit directly to main
- ❌ Force push to main
- ❌ Use squash merge (unless requested)
- ❌ Skip CI checks
- ❌ Merge failing PRs

**Remember:** Even small changes deserve a branch and PR. It ensures:
- CI tests run before merging
- Changes are reviewed
- History is preserved
- Rollback is easier if needed
