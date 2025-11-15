# Technical Stack

## Architecture
- **Multi-file application**: Game organized into separate HTML, CSS, and JavaScript files
- **Modular JavaScript**: ES6 modules for better code organization and maintainability
- **Campaign system**: Rogue-like progression with persistent state management
- **No external dependencies**: Self-contained with no frameworks or libraries
- **Client-side only**: Pure frontend implementation with localStorage persistence
- **Triple-mode design**: Supports Jump Into Task, Campaign, and Free Play gameplay

### Free Play Mode Integration

Free Play Mode integrates with existing modules:
- **game-state.js**: Adds `freePlayMode`, `freePlayRounds`, `freePlayTasksCompleted`, `freePlayCurrentTaskRounds`, and `freePlayStressMultiplier` flags
- **main.js**: Adds `startFreePlayMode()`, task completion modal functions, and generic outcome messaging
- **ui-manager.js**: Adds conditional rendering for Free Play UI (`updateFreePlayUI()`, `updateGenericActionButtons()`)
- **No new files**: Leverages existing architecture with minimal additions

## Technologies
- **HTML5**: Semantic markup and structure with external resource references
- **CSS3**: Styling with gradients, animations, and responsive design organized into separate files
- **ES6 JavaScript**: Modern JavaScript with modules, imports/exports for game logic and state management
- **No frameworks or libraries**: Zero dependencies for maximum portability

## File Organization
```
assets/
├── css/                    # Stylesheets
│   ├── main.css           # Base styles, layout, typography
│   ├── components.css     # UI component styles (includes campaign UI)
│   └── responsive.css     # Mobile and responsive design
└── js/                    # JavaScript modules
    ├── game-state.js      # Central state management (game + campaign)
    ├── card-system.js     # Blackjack logic with custom deck support
    ├── ui-manager.js      # DOM manipulation (task-aware)
    ├── stress-system.js   # Zen activities and stress management
    ├── campaign-manager.js # Campaign progression and navigation
    ├── shop-system.js     # Deck upgrade purchasing system
    ├── task-definitions.js # Modular task configurations (all tasks must define bustMessages and hand loss messages)
    └── main.js            # Game controller and initialization
```

## Deployment
- **GitHub Pages**: Automated deployment via GitHub Actions
- **Static hosting**: Can be deployed to any web server or CDN
- **No build process**: Direct file serving without compilation
- **ES6 Module Support**: Requires modern browsers with module support

## Browser Compatibility
- **Modern browsers**: Chrome, Firefox, Safari, Edge (ES6 module support required)
- **Responsive design**: Works on desktop and mobile devices
- **Progressive enhancement**: Graceful degradation for older browsers

## Development Commands
Development workflow supports both direct file access and local server:

```bash
# Local development - open in browser (basic functionality)
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux

# Serve via local server for full ES6 module support (REQUIRED for proper testing)
npx serve . -p 8000          # Node.js (PREFERRED METHOD)

# Then visit http://localhost:8000
```

## Code Style
- **Comic Sans MS font**: Maintains friendly, approachable aesthetic
  - **DO NOT USE CURSIVE AS A FALLBACK FONT**: It is not legible on mobile devices
- **Camel case**: JavaScript variables and functions
- **Semantic naming**: Clear, descriptive identifiers
- **External stylesheets**: CSS organized in separate files by purpose
- **ES6 modules**: Modern JavaScript with proper import/export structure
- **Modular architecture**: Each file has single responsibility and clear interfaces
- **Error handling**: Graceful fallbacks and validation throughout
- **State management**: Centralized state with persistence and recovery mechanisms

## Data Persistence
- **localStorage**: Campaign progress and deck upgrades persist across sessions
- **Error recovery**: Automatic state validation and repair mechanisms
- **Backup system**: Campaign backup and restore functionality
- **State validation**: Comprehensive validation to prevent corrupted data

## Testing Strategy

### Automated Testing with Playwright

The project uses Playwright for comprehensive end-to-end regression testing:

**Test Coverage:**
- **Game Modes**: All three modes (Jump Into Task, Campaign, Free Play)
- **Mobile Viewports**: iPhone SE, iPad Pro, landscape orientations
- **Accessibility**: ARIA labels, keyboard navigation, screen readers
- **Core Features**: Gameplay mechanics, shop system, stress management
- **UI Components**: Modals, forms, buttons, navigation

**Running Tests:**
```bash
npm test                    # Run all tests
npm run test:headed         # Run with visible browser
npm run test:mobile         # Run mobile-specific tests
npm run test:ui             # Interactive UI mode for debugging
```

**When to Run Tests:**
- **Before committing**: Always run tests before pushing changes
- **After feature additions**: Verify new features don't break existing functionality
- **UI changes**: Test responsive design and mobile viewports
- **State management changes**: Verify persistence and navigation flows

**Test Maintenance:**
- Tests are located in `tests/playwright/`
- Each spec file covers a specific feature area
- Update tests when adding new features or changing UI
- Fix failing tests before merging changes
- See `tests/playwright/README.md` for detailed documentation

**CI/CD Integration:**
- Tests run automatically on all PRs and pushes to main/master
- GitHub Actions workflow installs browsers and runs full test suite
- Test reports are uploaded as artifacts for review
- Failing tests block deployment to prevent regressions

### Manual Testing
- **User experience**: Edge case validation and usability testing
- **Error simulation**: Testing recovery mechanisms and fallbacks
- **Cross-browser**: Verify functionality in different browsers
- **Performance**: Monitor load times and responsiveness

## Debugging & QA Guidelines

### Zen Points System Debugging
The zen points system is critical for campaign progression. When debugging zen point issues:

1. **Check Console Logs**: All zen point transactions are logged with transaction type and new balance
2. **Verify Manager State**: Use `ZenPointsManager.getCurrentBalance()` to get authoritative balance
3. **Campaign State Sync**: Ensure `campaignState.zenPointBalance` matches manager balance
4. **UI Synchronization**: Verify header display matches backend state after navigation

### Common Zen Points Issues
- **Completion Bonus Not Persisting**: Check task completion flow order - bonus must be awarded before `completeCurrentTask()` call
- **UI Desync**: Missing `updateDisplay()` calls in navigation functions (campaign-manager.js)
- **Shop Purchase Issues**: Verify `ZenPointsManager.spend()` is called before updating campaign state
- **Balance Mismatch**: Check for race conditions between zen points manager and campaign state updates

### Critical Testing Scenarios
1. **End-to-End Campaign Flow**: Complete task → earn completion bonus → visit shop → make purchase → return to campaign → verify all balances match
2. **Cross-Session Persistence**: Complete actions → refresh browser → verify state persists correctly
3. **UI Consistency**: Navigate between all screens and verify header zen points display is always accurate
4. **Error Recovery**: Test with corrupted localStorage data to ensure graceful fallbacks

### State Management Architecture
- **ZenPointsManager**: Authoritative source for zen point balance across all modes
- **Campaign State**: Persistent storage layer that syncs with zen points manager
- **Game State**: Temporary state for current gameplay session
- **UI Layer**: Always reads from ZenPointsManager for display consistency

### Debugging Tools
- Browser console logs show all zen point transactions with context
- `ZenPointsManager.getCurrentBalance()` provides authoritative balance
- Campaign state validation runs automatically on load with repair mechanisms
- localStorage inspection shows raw persistence data

## Performance Considerations
- **Lazy loading**: Task definitions loaded as needed
- **Efficient rendering**: Minimal DOM manipulation and smart updates
- **Memory management**: Proper cleanup and state reset mechanisms
- **Responsive design**: Optimized for both desktop and mobile performance