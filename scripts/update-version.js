#!/usr/bin/env node
// Update version in source files after release-it bumps package.json

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

// Get git commit hash (short version)
let gitHash = 'unknown';
try {
    gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
    console.warn('⚠ Could not get git commit hash:', error.message);
}

// Get git branch name
let gitBranch = 'unknown';
try {
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
} catch (error) {
    console.warn('⚠ Could not get git branch:', error.message);
}

// Get build timestamp
const buildDate = new Date().toISOString();

console.log(`Updating version to ${version} (${gitHash}) in source files...`);

// Update version.js
const versionJsPath = path.join('assets', 'js', 'version.js');
const versionJsContent = `// Auto-generated version file
// This file is automatically updated by release-it
export const VERSION = '${version}';
export const GIT_HASH = '${gitHash}';
export const GIT_BRANCH = '${gitBranch}';
export const BUILD_DATE = '${buildDate}';
`;
fs.writeFileSync(versionJsPath, versionJsContent);
console.log(`✓ Updated ${versionJsPath}`);

// Update index.html version footer fallback and add cache busting query strings
const indexPath = 'index.html';
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update version footer
indexContent = indexContent.replace(
    /(<div id="versionFooter"[^>]*>)\s*v[\d.]+[^\n]*/,
    `$1\n        v${version}`
);

// Add cache busting query strings to CSS files
indexContent = indexContent.replace(
    /href="assets\/css\/([\w-]+\.css)(\?v=[\w.-]+)?"/g,
    `href="assets/css/$1?v=${version}"`
);

// Add cache busting query strings to JS files
indexContent = indexContent.replace(
    /src="assets\/js\/([\w-]+\.js)(\?v=[\w.-]+)?"/g,
    `src="assets/js/$1?v=${version}"`
);

fs.writeFileSync(indexPath, indexContent);
console.log(`✓ Updated ${indexPath} with cache busting`);

console.log(`Version update complete! v${version} (${gitHash})`);
