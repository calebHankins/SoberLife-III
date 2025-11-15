# Workflow Environment Consistency

This document describes the consistent environment used across all GitHub Actions workflows to ensure reliable testing and deployment.

## Environment Specifications

All workflows use identical base environments:

| Component              | Version/Configuration                                   | Shared Across All Workflows |
| ---------------------- | ------------------------------------------------------- | --------------------------- |
| **Runner OS**          | `ubuntu-latest`                                         | ✅ Yes                       |
| **Node.js**            | `20`                                                    | ✅ Yes                       |
| **Package Manager**    | `npm`                                                   | ✅ Yes                       |
| **npm Cache**          | Enabled via `actions/setup-node@v4`                     | ✅ Yes                       |
| **Playwright Browser** | `chromium` (latest)                                     | ✅ Yes                       |
| **Playwright Cache**   | `~/.cache/ms-playwright`                                | ✅ Yes                       |
| **Cache Key**          | `playwright-${{ runner.os }}-${{ playwright-version }}` | ✅ Yes                       |

## Workflows

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to main/master
- Pull requests to main/master

**Environment:**
- Runner: `ubuntu-latest`
- Node.js: `20` with npm cache
- Playwright: Cached by version

**Optimization:**
- Skips tests/deployment when PR has release label (release workflow will handle it)
- Uses sophisticated Playwright browser caching
- Caches npm dependencies

### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers:**
- Manual workflow dispatch

**Environment:**
- Runner: `ubuntu-latest`
- Node.js: `20` with npm cache
- Playwright: Cached by version (same as deploy)

**Optimization:**
- Reuses Playwright browser cache from deploy workflow
- Reuses npm cache from previous runs
- Only installs browsers if cache miss

### 3. Release on PR Merge (`.github/workflows/release-on-pr.yml`)

**Triggers:**
- PR merged with `release:patch`, `release:minor`, or `release:major` label

**Environment:**
- Runner: `ubuntu-latest`
- Node.js: `20` with npm cache
- Playwright: Cached by version (same as deploy)

**Optimization:**
- Reuses Playwright browser cache from deploy workflow
- Reuses npm cache from previous runs
- Only installs browsers if cache miss

## Cache Strategy

### npm Dependencies

All workflows use `actions/setup-node@v4` with `cache: "npm"`:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"
```

**Cache Key:** Automatically generated based on `package-lock.json` hash

**Benefits:**
- Fast dependency installation (seconds instead of minutes)
- Shared across all workflows
- Automatically invalidated when dependencies change

### Playwright Browsers

All workflows use identical Playwright caching:

```yaml
- name: Get Playwright version
  id: playwright-version
  run: echo "version=$(npm list @playwright/test --depth=0 --json | jq -r '.dependencies["@playwright/test"].version')" >> $GITHUB_OUTPUT

- name: Cache Playwright browsers
  uses: actions/cache@v4
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}

- name: Install Playwright Browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps chromium

- name: Install Playwright system dependencies
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: npx playwright install-deps chromium
```

**Cache Key:** `playwright-Linux-<playwright-version>`

**Benefits:**
- Browsers downloaded once per Playwright version
- Shared across all workflows (deploy, release, release-on-pr)
- Saves ~2 minutes per workflow run on cache hit
- System dependencies installed separately when using cached browsers

## Cache Sharing

GitHub Actions caches are shared across workflows in the same repository:

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Cache                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  npm Cache (package-lock.json hash)                          │
│  ├─ Used by: deploy.yml                                      │
│  ├─ Used by: release.yml                                     │
│  └─ Used by: release-on-pr.yml                               │
│                                                               │
│  Playwright Cache (playwright-Linux-<version>)               │
│  ├─ Used by: deploy.yml                                      │
│  ├─ Used by: release.yml                                     │
│  └─ Used by: release-on-pr.yml                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Example Flow:**

1. **First PR:** Deploy workflow runs, downloads Playwright browsers, caches them
2. **Second PR:** Deploy workflow runs, uses cached browsers (saves ~2 min)
3. **PR Merge with release label:** 
   - Deploy workflow skips (detects release label)
   - Release-on-pr workflow runs, uses cached browsers (saves ~2 min)
4. **Manual Release:** Release workflow runs, uses cached browsers (saves ~2 min)

## Environment Consistency Benefits

### 1. Reliable Testing
- Same OS, Node.js, and browser versions across all workflows
- Tests run in identical environments
- No "works in CI but not in release" issues

### 2. Cache Efficiency
- Playwright browsers cached once, used everywhere
- npm dependencies cached once, used everywhere
- Significant time savings on every workflow run

### 3. Cost Optimization
- Reduced CI minutes usage
- Faster feedback loops
- Skip redundant test runs when release workflow will handle it

### 4. Maintenance
- Single source of truth for environment configuration
- Easy to update (change in one place applies everywhere)
- Consistent behavior across all workflows

## Verification

To verify environment consistency:

```bash
# Check all workflows use same runner
grep -r "runs-on:" .github/workflows/

# Check all workflows use same Node.js version
grep -r "node-version:" .github/workflows/

# Check all workflows use same Playwright cache key
grep -r "playwright-" .github/workflows/
```

Expected output should show:
- All workflows: `runs-on: ubuntu-latest`
- All workflows: `node-version: "20"`
- All workflows: Same cache key pattern

## Updating the Environment

When updating the environment (e.g., Node.js version, Playwright version):

1. **Update all three workflows simultaneously**
2. **Test in a PR first** (deploy workflow will run)
3. **Verify cache invalidation** (new cache keys generated)
4. **Monitor first run** (will be slower due to cache miss)
5. **Subsequent runs** (will be fast with new cache)

## Cache Invalidation

Caches are automatically invalidated when:

- **npm cache:** `package-lock.json` changes
- **Playwright cache:** Playwright version in `package.json` changes
- **Manual:** Delete cache via GitHub UI (Settings → Actions → Caches)

## Performance Metrics

Typical workflow run times:

| Workflow          | With Cache | Without Cache | Savings |
| ----------------- | ---------- | ------------- | ------- |
| Deploy (test job) | ~3 minutes | ~5 minutes    | ~40%    |
| Release           | ~3 minutes | ~5 minutes    | ~40%    |
| Release-on-PR     | ~3 minutes | ~5 minutes    | ~40%    |

**Note:** Times vary based on test suite size and complexity.

## Troubleshooting

### Cache Not Working

**Symptoms:** Workflows always download Playwright browsers

**Solutions:**
1. Check cache key matches across workflows
2. Verify Playwright version detection works
3. Check GitHub Actions cache storage limits (10GB per repo)
4. Review cache logs in workflow runs

### Different Test Results

**Symptoms:** Tests pass in one workflow but fail in another

**Solutions:**
1. Verify all workflows use same Node.js version
2. Check Playwright version is consistent
3. Ensure `package-lock.json` is committed
4. Review environment variables

### Slow Workflow Runs

**Symptoms:** Workflows taking longer than expected

**Solutions:**
1. Check cache hit rate in workflow logs
2. Verify cache keys are stable
3. Review Playwright browser installation logs
4. Consider cache size limits

## Summary

All workflows use:
- ✅ Same OS: `ubuntu-latest`
- ✅ Same Node.js: `20`
- ✅ Same npm caching
- ✅ Same Playwright version
- ✅ Same Playwright caching strategy
- ✅ Same cache keys

This ensures consistent, reliable, and efficient CI/CD pipeline.
