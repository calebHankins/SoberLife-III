# 🚀 Quick Start: Automated Releases

Get started with automated releases in 5 minutes!

## ⚡ Super Quick Setup

### 1. Enable Permissions (2 minutes)

```
Settings → Actions → General → Workflow permissions
→ Select "Read and write permissions"
→ Check "Allow GitHub Actions to create and approve pull requests"
→ Save
```

### 2. Verify Pages (30 seconds)

```
Settings → Pages → Source
→ Select "GitHub Actions"
→ Save
```

### 3. Test It! (2 minutes)

```
Actions → Release → Run workflow
→ Select: main branch
→ Choose: patch
→ Click: Run workflow
→ Watch it work! ✨
```

## 🎯 Two Ways to Release

### Option A: Manual Button

**When:** Planned releases, multiple changes

**How:**
1. Go to Actions tab
2. Click "Release"
3. Click "Run workflow"
4. Pick version type
5. Done! ✅

### Option B: PR Labels

**When:** Feature releases, hotfixes

**How:**
1. Create PR
2. Add label: `release:patch` (or minor/major)
3. Merge PR
4. Auto-releases! ✅

## 📊 Version Types

| Type      | Example         | Use For            |
| --------- | --------------- | ------------------ |
| **patch** | 0.22.2 → 0.22.3 | 🐛 Bug fixes        |
| **minor** | 0.22.2 → 0.23.0 | ✨ New features     |
| **major** | 0.22.2 → 1.0.0  | 💥 Breaking changes |

## ✅ That's It!

You can now create releases from anywhere with just a web browser.

## 📚 Learn More

- **Detailed Guide:** `.github/RELEASE_GUIDE.md`
- **Setup Checklist:** `.github/SETUP_CHECKLIST.md`
- **Visual Diagrams:** `.github/RELEASE_WORKFLOW_DIAGRAM.md`
- **Full Docs:** `.kiro/steering/releases.md`

## 🆘 Need Help?

**Tests fail?** Run `npm test` locally first

**Permission error?** Check Step 1 above

**Not deploying?** Check Step 2 above

**More help:** Check Actions tab → Click failed workflow → Read logs

---

**Pro Tip:** Bookmark the Actions tab for quick access to releases!
