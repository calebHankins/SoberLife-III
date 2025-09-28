# Project Structure

## Root Directory
```
/
├── index.html              # Main HTML structure with campaign interface
├── assets/                 # Static assets directory
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
│   ├── campaign-system.test.js # Campaign system tests
│   ├── step-reset.test.js # Step reset functionality tests
│   └── *.test.js          # Other test files
├── README.md              # Project documentation and gameplay instructions
├── model_spec.md          # Comprehensive game design document
├── LICENSE                # MIT license
├── .github/               # GitHub Actions workflow for deployment
├── .vscode/               # VS Code settings
└── .kiro/                 # Kiro AI assistant configuration
    ├── specs/             # Feature specifications
    └── steering/          # Development guidance files
```

## Multi-File Architecture
The game is now organized into separate files for better maintainability:

### HTML Structure (index.html)
- **Semantic Markup**: Clean HTML structure without inline styles or scripts
- **External References**: Links to CSS files and JavaScript modules
- **Game Mode Selection**: Choose between single task or campaign mode
- **Campaign Overview**: Task selection and progress display
- **Game Container**: Main wrapper with rounded corners and shadow
- **Avatar & Stress Meter**: Visual feedback for player state
- **Survey Section**: Pre-task assessment for initial game state (task-aware)
- **Task Info**: Current step description and objectives (task-specific)
- **Zen Activities Panel**: Stress relief options with costs/benefits
- **Game Area**: Blackjack gameplay interface with cards and controls
- **Upgrade Shop**: Post-task deck upgrade interface
- **Game Over/Success Screens**: End game states with task-specific messages

### CSS Organization
- **main.css**: Base styles, layout, typography, and animations
- **components.css**: UI component styling including campaign interface, shop, and task cards
- **responsive.css**: Mobile and tablet optimizations with media queries for all interfaces

### JavaScript Modules
- **game-state.js**: Central state management with `gameState`, `campaignState`, and persistence
- **card-system.js**: Blackjack logic with custom deck creation and composition tracking
- **ui-manager.js**: DOM manipulation and visual updates for all game elements (task-aware)
- **stress-system.js**: Zen activities and stress management functionality
- **campaign-manager.js**: Campaign progression, navigation, and state coordination
- **shop-system.js**: Deck upgrade purchasing, validation, and feedback
- **task-definitions.js**: Modular task configurations with contextual actions and flavor text
- **main.js**: Game controller that coordinates modules and handles dual-mode functionality

## File Conventions
- **Single responsibility**: Each file/module handles one specific concern
- **Clear separation**: HTML structure, CSS styling, and JS logic are separate
- **Module exports**: JavaScript functions and objects are properly exported/imported
- **State centralization**: Game data managed through `gameState` and `campaignState` objects
- **Event-driven**: User interactions trigger state changes across modules
- **Task modularity**: Each task is self-contained with its own configuration
- **Error handling**: Graceful fallbacks and validation throughout the system

## Campaign System Architecture
- **Modular tasks**: Each task defined in `task-definitions.js` with complete configuration
- **State persistence**: Campaign progress automatically saved to localStorage with error recovery
- **Progressive unlocking**: Tasks unlock based on completion requirements
- **Deck progression**: Custom deck compositions persist across tasks
- **Shop integration**: Zen points can be spent on permanent deck upgrades

## Development Workflow
1. Edit appropriate files based on change type:
   - HTML structure → `index.html`
   - Styling → CSS files in `assets/css/`
   - Game logic → JavaScript modules in `assets/js/`
   - New tasks → Add to `task-definitions.js`
   - Campaign features → `campaign-manager.js` or `shop-system.js`
2. Test locally by opening `index.html` in browser
3. For ES6 module testing, optionally serve via local HTTP server
4. Run tests in `tests/` directory to verify functionality
5. Commit changes trigger automatic GitHub Pages deployment
6. No build process or compilation required

## Adding New Tasks
1. Define task in `task-definitions.js` with:
   - Steps array
   - Contextual actions for each step
   - Initial flavor text
   - Progressive flavor text
   - Success messages
2. Add task to `taskDefinitions` registry
3. Set unlock requirements if needed
4. Test task progression and completion