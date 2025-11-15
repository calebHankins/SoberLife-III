# Cache Busting Strategy

## Overview

SoberLife III implements cache busting to ensure users always receive the latest version of assets when code is updated. This prevents browsers from serving stale cached files after deployments.

## Implementation

### Version-Based Query Strings

All CSS and JavaScript assets include version query strings that automatically update on each release:

```html
<!-- CSS Files -->
<link rel="stylesheet" href="assets/css/main.css?v=0.22.2">
<link rel="stylesheet" href="assets/css/components.css?v=0.22.2">
<link rel="stylesheet" href="assets/css/responsive.css?v=0.22.2">

<!-- JavaScript Files -->
<script type="module" src="assets/js/main.js?v=0.22.2"></script>
```

### Automatic Updates

The version query strings are automatically updated during the release process:

1. **Release Command**: `npm run release`
2. **Version Bump**: `release-it` updates `package.json` version
3. **Hook Execution**: `scripts/update-version.js` runs after version bump
4. **Asset Updates**: Script updates all asset URLs in `index.html` with new version

### How It Works

When the version changes from `0.22.2` to `0.22.3`:

**Before:**
```html
<link rel="stylesheet" href="assets/css/main.css?v=0.22.2">
```

**After:**
```html
<link rel="stylesheet" href="assets/css/main.css?v=0.22.3">
```

The browser treats this as a completely new URL and fetches the latest file, bypassing the cache.

## Cache Headers

### GitHub Pages Limitations

GitHub Pages has limited support for custom cache headers, but we include `.htaccess` for documentation and compatibility with other hosting environments.

### Recommended Headers

**HTML Files** (always check for updates):
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

**CSS/JS Files** (cache aggressively with version strings):
```
Cache-Control: public, max-age=31536000, immutable
```

**Images/Fonts** (cache for 1 month):
```
Cache-Control: public, max-age=2592000
```

### ETags

ETags (Entity Tags) provide an additional validation mechanism:
- Server generates a unique identifier for each file version
- Browser sends ETag with requests to check if file changed
- Server responds with 304 Not Modified if file unchanged

GitHub Pages automatically generates ETags based on file content.

## Testing Cache Busting

### Manual Testing

1. **Deploy New Version:**
   ```bash
   npm run release
   git push origin main
   ```

2. **Check Asset URLs:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Load the page
   - Verify all assets have `?v=X.X.X` query strings

3. **Verify Cache Behavior:**
   - First load: Assets fetched from server (200 status)
   - Reload: Assets served from cache (from disk cache)
   - After version update: Assets fetched fresh (200 status)

### Browser DevTools

**Chrome/Edge:**
1. Open DevTools (F12)
2. Network tab
3. Disable cache checkbox (for testing)
4. Reload page
5. Check asset URLs and status codes

**Firefox:**
1. Open DevTools (F12)
2. Network tab
3. Click gear icon → Disable Cache
4. Reload page
5. Verify asset versions

### Hard Refresh

Force browser to bypass cache:
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

## Troubleshooting

### Issue: Users Report Seeing Old Version

**Symptoms:**
- Users see outdated UI or behavior
- Console shows old version number
- Features don't work as expected

**Solutions:**

1. **Verify Version Deployed:**
   ```bash
   # Check live site
   curl -I https://your-site.github.io/
   
   # Check version in HTML
   curl https://your-site.github.io/ | grep "v="
   ```

2. **Check Asset URLs:**
   - View page source
   - Verify all assets have current version query string
   - Ensure no assets are missing version parameter

3. **Clear Browser Cache:**
   - Instruct users to hard refresh
   - Or clear browser cache completely

4. **Verify Deployment:**
   - Check GitHub Actions for successful deployment
   - Verify commit hash matches deployed version

### Issue: Assets Not Updating After Release

**Symptoms:**
- Version number updated but assets unchanged
- Query strings not updated in HTML

**Solutions:**

1. **Check Update Script:**
   ```bash
   # Manually run update script
   node scripts/update-version.js
   ```

2. **Verify Git Commit:**
   ```bash
   # Check if changes were committed
   git log -1 --stat
   
   # Should show index.html and version.js changes
   ```

3. **Re-run Release:**
   ```bash
   # If update failed, manually fix and commit
   git add index.html assets/js/version.js
   git commit -m "fix: update asset versions"
   git push origin main
   ```

### Issue: Module Import Errors

**Symptoms:**
- Console errors about module imports
- JavaScript not loading correctly

**Solutions:**

1. **Check Module Paths:**
   - ES6 modules use relative imports
   - Version query strings don't affect imports
   - Verify all import statements are correct

2. **Verify MIME Types:**
   - GitHub Pages serves `.js` files with correct MIME type
   - No additional configuration needed

## Best Practices

### For Developers

1. **Always Use Release Command:**
   ```bash
   npm run release
   ```
   Never manually update version numbers.

2. **Test Locally First:**
   ```bash
   # Test with local server
   npx serve . -p 8000
   ```

3. **Verify After Deployment:**
   - Check live site after deployment
   - Verify version number in footer
   - Test key functionality

### For Users

1. **Hard Refresh After Updates:**
   - Use `Ctrl + Shift + R` (Windows/Linux)
   - Use `Cmd + Shift + R` (Mac)

2. **Clear Cache If Issues Persist:**
   - Browser settings → Clear browsing data
   - Select "Cached images and files"

3. **Check Version Number:**
   - Hover over version footer for build info
   - Verify version matches latest release

## Monitoring

### Version Logging

The game logs version information on startup:

```javascript
console.log(`🧘 SoberLife III v${VERSION} - Stress Management Game`);
console.log(`📦 Build: ${GIT_HASH} (${GIT_BRANCH}) - ${BUILD_DATE}`);
```

### User Reports

If users report issues:
1. Ask them to check console for version number
2. Compare with latest deployed version
3. Instruct to hard refresh if versions don't match

## Future Enhancements

### Service Worker

Consider implementing a service worker for:
- Offline functionality
- More granular cache control
- Background updates
- Push notifications

### CDN Integration

For better performance:
- Use CDN for static assets
- Implement edge caching
- Reduce latency for global users

### Automated Cache Invalidation

For advanced deployments:
- Integrate with CDN cache invalidation APIs
- Automatically purge cache on deployment
- Implement cache warming strategies

## Resources

- **MDN Cache Control**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
- **MDN ETags**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Web.dev Caching**: https://web.dev/http-cache/

## Summary

**Key Points:**
- Version query strings force cache invalidation
- Automatic updates via release process
- GitHub Pages has limited cache header support
- ETags provide additional validation
- Hard refresh bypasses all caching

**Quick Commands:**
```bash
npm run release              # Update version and assets
npm test && npm run release  # Test then release
node scripts/update-version.js  # Manual version update
```
