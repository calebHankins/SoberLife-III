# Contributing Guide

- [Contributing Guide](#contributing-guide)
  - [File Structure](#file-structure)
  - [Development Workflow](#development-workflow)
  - [Install Dependencies](#install-dependencies)
  - [Serving with a Local Server](#serving-with-a-local-server)
  - [Testing](#testing)
  - [Release Management](#release-management)

## File Structure

The game is organized into separate modules for maintainability:

```md
/
├── index.html              # Main HTML structure with campaign interface
├── assets/
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Base styles and layout
│   │   ├── components.css # UI component styles (includes campaign UI)
│   │   └── responsive.css # Mobile and responsive styles
│   └── js/                # JavaScript modules
│       ├── game-state.js  # Game state and campaign state management
│       ├── card-system.js # Blackjack logic with custom deck support
│       ├── ui-manager.js  # DOM manipulation and updates
│       ├── stress-system.js # Stress and zen point management
│       ├── campaign-manager.js # Campaign progression and navigation
│       ├── shop-system.js # Deck upgrade purchasing system
│       ├── task-definitions.js # Modular task configurations
│       └── main.js        # Game initialization and coordination
├── tests/                 # Test files
│   └── campaign-system.test.js # Campaign system tests
├── README.md              # This file
└── model_spec.md          # Comprehensive game design document
```

## Development Workflow

0. [Install Dependencies](#install-dependencies)
1. [Serve the app locally](#serving-with-a-local-server)
2. Make changes to the [appropriate files (HTML, CSS, or JavaScript modules)](#file-structure)
3. Refresh your browser to see changes
4. [**Run regression tests**](#testing) to verify your changes don't break existing functionality
5. If your changes look good, open a [Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) for review!

## Install Dependencies

- Install [node.js](https://nodejs.org/en/download), recommendation is v22+.

```bash
# Install dependencies
npm install
```

## Serving with a Local Server

For development and testing, serve the files through a local server:

```bash
# Node.js
npx serve . -p 8000
```

Then visit `http://localhost:8000` in your browser.

## Testing

The project includes comprehensive Playwright end-to-end tests for regression testing:

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run mobile tests specifically
npm run test:mobile

# Run tests with UI mode for debugging
npm run test:ui
```

**When to run tests:**

- Before committing changes
- After adding new features
- When modifying game mechanics
- When updating UI components

**Test coverage includes:**

- All three game modes (Jump Into Task, Campaign, Free Play)
- Mobile viewports (iPhone, iPad, landscape)
- Accessibility compliance
- Shop and Mind Palace features
- Gameplay mechanics and stress management

See [`tests/playwright/README.md`](./tests/playwright/README.md) for detailed testing documentation.

## Release Management

The project supports multiple release methods:

**GitHub Actions (Recommended):**

- **Manual Trigger:** Actions tab → Release → Run workflow → Select version
- **PR Labels:** Add `release:patch/minor/major` label → Merge PR → Auto-release

**Local Release:**

```bash
npm run release              # Interactive
npm run release -- --dry-run # Preview changes
```

**Version guidelines:**

- **Patch** (0.21.0 → 0.21.1): Bug fixes, documentation updates
- **Minor** (0.21.0 → 0.22.0): New features, new tasks, UI improvements
- **Major** (0.21.0 → 1.0.0): Breaking changes, major redesigns

**Setup:** See [`.github/SETUP_CHECKLIST.md`](./.github/SETUP_CHECKLIST.md) for first-time configuration.

**Documentation:** See [`.github/RELEASE_GUIDE.md`](./.github/RELEASE_GUIDE.md) for detailed instructions.

All releases automatically deploy to GitHub Pages via GitHub Actions.
