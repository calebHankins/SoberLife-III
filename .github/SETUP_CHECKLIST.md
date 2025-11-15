# GitHub Actions Release Setup Checklist

Complete these steps to enable automated releases via GitHub Actions.

## ✅ One-Time Setup

### Step 1: Configure Workflow Permissions

**Required for workflows to push commits and tags**

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Actions** in left sidebar
4. Click **General**
5. Scroll to "Workflow permissions"
6. Select **"Read and write permissions"**
7. Check **"Allow GitHub Actions to create and approve pull requests"**
8. Click **Save**

**Why:** Workflows need permission to create commits, tags, and trigger other workflows.

### Step 2: Verify GitHub Pages Configuration

**Required for automatic deployment**

1. Go to **Settings** → **Pages**
2. Under "Source", select **"GitHub Actions"**
3. Click **Save** (if needed)

**Why:** This allows the deploy workflow to publish to GitHub Pages.

### Step 3: Create Release Labels (Optional)

**Only needed if using PR-based releases**

1. Go to **Issues** tab
2. Click **Labels**
3. Click **New label**
4. Create these three labels:

| Name            | Color              | Description           |
| --------------- | ------------------ | --------------------- |
| `release:patch` | `#0e8a16` (green)  | Bug fixes and patches |
| `release:minor` | `#fbca04` (yellow) | New features          |
| `release:major` | `#d73a4a` (red)    | Breaking changes      |

**Why:** These labels trigger automatic releases when PRs are merged.

### Step 4: Test the Workflow

**Verify everything works**

1. Go to **Actions** tab
2. Click **Release** workflow
3. Click **Run workflow** dropdown
4. Select branch: `main` (or `master`)
5. Choose: `patch`
6. Click **Run workflow**
7. Watch it run and verify success

**Expected Result:**
- Tests pass ✅
- Version bumped ✅
- Commit and tag created ✅
- Changes pushed ✅
- Deployment triggered ✅

## 📋 Usage Checklist

### Before Every Release

- [ ] All tests pass locally (`npm test`)
- [ ] README.md is up to date
- [ ] New features are documented
- [ ] No uncommitted changes (or commit them first)
- [ ] Breaking changes are noted (for major releases)

### Creating a Release

**Option A: Manual Trigger**
- [ ] Go to Actions → Release → Run workflow
- [ ] Select correct branch
- [ ] Choose version increment
- [ ] Click Run workflow
- [ ] Monitor progress in Actions tab

**Option B: PR Label**
- [ ] Create pull request
- [ ] Add appropriate `release:*` label
- [ ] Get code review
- [ ] Merge PR
- [ ] Verify release workflow runs

### After Release

- [ ] Check Actions tab for successful completion
- [ ] Verify new tag exists in repository
- [ ] Check live site for updated version
- [ ] Test critical functionality
- [ ] Announce release to team (if applicable)

## 🔧 Troubleshooting

### If Workflow Fails

1. **Check Actions Tab:**
   - Click on failed workflow run
   - Expand failed step
   - Read error message

2. **Common Fixes:**
   - Permission denied → Check Step 1 above
   - Tests fail → Run `npm test` locally and fix
   - Push failed → Verify branch protection rules
   - Version exists → Delete tag and retry

3. **Get Help:**
   - Check `.github/workflows/README.md`
   - Review `.kiro/steering/releases.md`
   - Check workflow logs for details

## 📚 Documentation

- **Quick Guide:** `.github/RELEASE_GUIDE.md`
- **Workflow Details:** `.github/workflows/README.md`
- **Full Documentation:** `.kiro/steering/releases.md`
- **Cache Busting:** `.kiro/steering/cache-busting.md`

## 🎯 Quick Reference

| What              | Where        | Action                 |
| ----------------- | ------------ | ---------------------- |
| Manual release    | Actions tab  | Release → Run workflow |
| PR release        | Pull request | Add `release:*` label  |
| Check permissions | Settings     | Actions → General      |
| View releases     | Repository   | Tags or Releases       |
| Monitor workflow  | Actions tab  | Click workflow run     |

## ✨ You're All Set!

Once you've completed the one-time setup, you can create releases entirely through GitHub's web interface. No local commands needed!

**Next Steps:**
1. Try a test release with `patch` increment
2. Verify it works end-to-end
3. Use for real releases going forward

**Questions?**
- Check the documentation files listed above
- Review workflow logs in Actions tab
- Test locally with `npm run release -- --dry-run`
