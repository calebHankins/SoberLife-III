# Design Document

## Overview

This design outlines the refactoring of SoberLife III from a single-file architecture to a well-organized multi-file structure. The refactoring will separate concerns into logical files and directories while maintaining all existing functionality, visual appearance, and deployment compatibility with GitHub Pages.

## Architecture

### Current State Analysis
The existing `index.html` contains approximately:
- 1000+ lines of CSS embedded in `<style>` tags
- 500+ lines of JavaScript embedded in `<script>` tags  
- HTML structure with semantic sections for game components
- All assets (fonts, colors, animations) defined inline

### Target Architecture
```
/
├── index.html              # Main HTML structure with external references
├── assets/                 # Static assets directory
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Base styles and layout
│   │   ├── components.css # UI component styles
│   │   └── responsive.css # Mobile and responsive styles
│   └── js/                # JavaScript modules
│       ├── game-state.js  # Game state management
│       ├── card-system.js # Blackjack card logic
│       ├── ui-manager.js  # DOM manipulation and updates
│       ├── stress-system.js # Stress and zen point management
│       └── main.js        # Game initialization and coordination
├── README.md              # Updated project documentation
├── model_spec.md          # Updated design document
├── LICENSE                # MIT license (unchanged)
├── .github/               # GitHub Actions (unchanged)
├── .vscode/               # VS Code settings (unchanged)
└── .kiro/                 # Kiro configuration
    └── steering/          # Updated steering files
        ├── structure.md   # Updated project structure
        └── tech.md        # Updated technical stack
```

## Components and Interfaces

### 1. HTML Structure (index.html)
**Purpose**: Semantic markup and external resource references
**Content**:
- DOCTYPE and meta tags
- External CSS and JavaScript references
- Semantic HTML structure for all game components
- No inline styles or scripts

**Key Changes**:
- Remove all `<style>` content → external CSS files
- Remove all `<script>` content → external JS files
- Add `<link>` tags for CSS files
- Add `<script>` tags for JavaScript modules

### 2. CSS Architecture

#### 2.1 Main Styles (assets/css/main.css)
**Purpose**: Base styles, layout, and core visual design
**Content**:
- CSS reset and universal styles
- Body and container layout
- Color scheme and typography
- Base button and form styles
- Gradient backgrounds

#### 2.2 Component Styles (assets/css/components.css)
**Purpose**: Specific UI component styling
**Content**:
- Avatar and stress meter styles
- Card display and game area styles
- Survey and task info panels
- Zen activities panel
- Game over and success screens
- Modal overlays

#### 2.3 Responsive Styles (assets/css/responsive.css)
**Purpose**: Mobile and tablet optimizations
**Content**:
- Mobile-first media queries
- Tablet-specific optimizations
- Landscape orientation handling
- Touch target optimizations
- Viewport unit fallbacks

### 3. JavaScript Architecture

#### 3.1 Game State Management (assets/js/game-state.js)
**Purpose**: Central state management and data structures
**Exports**:
```javascript
// Game state object
export const gameState = {
    currentStep: 0,
    zenPoints: 100,
    stressLevel: 0,
    // ... other state properties
};

// State update functions
export function updateGameState(updates);
export function resetGameState();
```

#### 3.2 Card System (assets/js/card-system.js)
**Purpose**: Blackjack game logic and card management
**Exports**:
```javascript
// Card and deck functions
export function createDeck();
export function shuffleDeck(deck);
export function getCardValue(value);
export function calculateScore(cards);

// Game constants
export const suits = ['♠', '♥', '♦', '♣'];
export const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
```

#### 3.3 UI Manager (assets/js/ui-manager.js)
**Purpose**: DOM manipulation and visual updates
**Exports**:
```javascript
// Display update functions
export function updateDisplay();
export function updateCards();
export function updateZenActivities();
export function showGameOver();
export function showGameSuccess();

// UI utility functions
export function hideElement(id);
export function showElement(id);
```

#### 3.4 Stress System (assets/js/stress-system.js)
**Purpose**: Stress management and zen activities
**Exports**:
```javascript
// Zen activity functions
export function useZenActivity(activity);
export function updateStressLevel(change);
export function calculateSurveyStress();

// Activity definitions
export const zenActivities = {
    breath: { cost: 10, reduction: 10 },
    stretch: { cost: 25, reduction: 20 },
    meditation: { cost: 50, reduction: 35 }
};
```

#### 3.5 Main Controller (assets/js/main.js)
**Purpose**: Game initialization and coordination
**Exports**:
```javascript
// Core game functions
export function startGame();
export function startNewRound();
export function hit();
export function stand();
export function nextStep();
export function endRound(result);

// Initialization
export function initializeGame();
```

## Data Models

### Game State Object
```javascript
const gameState = {
    // Game progression
    currentStep: 0,
    gameInProgress: false,
    
    // Player resources
    zenPoints: 100,
    stressLevel: 0,
    
    // Card game state
    deck: [],
    playerCards: [],
    houseCards: [],
    
    // Task information
    steps: [/* array of step descriptions */],
    
    // UI state
    surveyCompleted: false
};
```

### Card Object
```javascript
const card = {
    suit: '♠',      // ♠, ♥, ♦, ♣
    value: 'A',     // A, 2-10, J, Q, K
    display: 'A♠'   // Combined display string
};
```

## Error Handling

### File Loading Errors
- **CSS Loading**: Graceful degradation if CSS files fail to load
- **JavaScript Loading**: Error messages if critical JS files are missing
- **Module Dependencies**: Clear error messages for missing exports

### Game State Errors
- **Invalid State**: Validation functions to ensure game state consistency
- **DOM Errors**: Null checks for DOM elements before manipulation
- **Storage Errors**: Fallback behavior if localStorage is unavailable

### User Input Errors
- **Survey Validation**: Maintain existing validation for required questions
- **Button State Management**: Proper enabling/disabling of interactive elements
- **Card Game Logic**: Robust handling of edge cases in blackjack rules

## Testing Strategy

### Manual Testing Approach
1. **Functionality Testing**: Verify all game features work identically
2. **Visual Testing**: Confirm identical appearance across browsers
3. **Responsive Testing**: Test mobile and tablet layouts
4. **Performance Testing**: Ensure no degradation in load times
5. **Deployment Testing**: Verify GitHub Pages compatibility

### Test Scenarios
- **Complete Game Flow**: Survey → All 5 steps → Success screen
- **Failure Scenarios**: Stress overload → Game over screen
- **Zen Activities**: All three activities with various zen point levels
- **Edge Cases**: Blackjack edge cases (aces, busting, ties)
- **Browser Compatibility**: Test in Chrome, Firefox, Safari, Edge

### Regression Testing
- **Before/After Comparison**: Screenshot comparison of all game states
- **Feature Checklist**: Verify every existing feature still works
- **Performance Baseline**: Compare load times and responsiveness

## Migration Strategy

### Phase 1: File Structure Setup
1. Create `assets/css/` and `assets/js/` directories
2. Extract CSS from `index.html` into separate files
3. Extract JavaScript from `index.html` into separate modules
4. Update `index.html` with external references

### Phase 2: Code Organization
1. Organize CSS by logical groupings (main, components, responsive)
2. Split JavaScript into functional modules with clear exports
3. Establish module dependencies and import/export structure
4. Test each module independently

### Phase 3: Integration Testing
1. Verify all external references load correctly
2. Test complete game functionality
3. Validate responsive design across devices
4. Confirm GitHub Pages deployment works

### Phase 4: Documentation Updates
1. Update README.md with new structure information
2. Revise model_spec.md to reflect architectural changes
3. Update steering files (structure.md, tech.md)
4. Add development workflow documentation

## Deployment Considerations

### GitHub Pages Compatibility
- **Static File Serving**: All files must be static (no server-side processing)
- **Relative Paths**: Use relative paths for all asset references
- **MIME Types**: Ensure proper file extensions for CSS (.css) and JS (.js)
- **Caching**: Consider cache-busting strategies for updates

### Browser Compatibility
- **ES6 Modules**: Use modern module syntax with fallbacks if needed
- **CSS Loading**: Ensure CSS loads before JavaScript execution
- **Progressive Enhancement**: Maintain graceful degradation

### Performance Optimization
- **File Size**: Monitor total file size compared to single-file version
- **Load Order**: Optimize CSS and JavaScript loading sequence
- **Caching**: Leverage browser caching for static assets

## Security Considerations

### Content Security Policy
- **Inline Scripts**: Remove all inline JavaScript (already planned)
- **Inline Styles**: Remove all inline CSS (already planned)
- **External Resources**: No external dependencies to manage

### File Access
- **Local File Protocol**: Ensure game works when opened directly in browser
- **Cross-Origin Restrictions**: Handle any CORS issues with local development

## Future Extensibility

### Modular Architecture Benefits
- **Feature Addition**: New game features can be added as separate modules
- **Code Maintenance**: Easier to locate and modify specific functionality
- **Testing**: Individual modules can be tested in isolation
- **Collaboration**: Multiple developers can work on different modules

### Potential Enhancements
- **Build Process**: Future addition of bundling/minification tools
- **Asset Management**: Organized structure for future images/sounds
- **Code Splitting**: Lazy loading of non-critical game features
- **Module Bundling**: Optional webpack/rollup integration for optimization