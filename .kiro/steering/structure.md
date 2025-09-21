# Project Structure

## Root Directory
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
├── README.md              # Project documentation and gameplay instructions
├── model_spec.md          # Comprehensive game design document
├── LICENSE                # MIT license
├── .github/               # GitHub Actions workflow for deployment
├── .vscode/               # VS Code settings
└── .kiro/                 # Kiro AI assistant configuration
```

## Multi-File Architecture
The game is now organized into separate files for better maintainability:

### HTML Structure (index.html)
- **Semantic Markup**: Clean HTML structure without inline styles or scripts
- **External References**: Links to CSS files and JavaScript modules
- **Game Container**: Main wrapper with rounded corners and shadow
- **Avatar & Stress Meter**: Visual feedback for player state
- **Survey Section**: Pre-task assessment for initial game state
- **Task Info**: Current step description and objectives
- **Zen Activities Panel**: Stress relief options with costs/benefits
- **Game Area**: Blackjack gameplay interface with cards and controls
- **Game Over/Success Screens**: End game states with restart options

### CSS Organization
- **main.css**: Base styles, layout, typography, and animations
- **components.css**: Specific UI component styling (cards, buttons, panels)
- **responsive.css**: Mobile and tablet optimizations with media queries

### JavaScript Modules
- **game-state.js**: Central state management with `gameState` object and constants
- **card-system.js**: Blackjack logic including deck creation, shuffling, and scoring
- **ui-manager.js**: DOM manipulation and visual updates for all game elements
- **stress-system.js**: Zen activities and stress management functionality
- **main.js**: Game controller that coordinates modules and handles user interactions

## File Conventions
- **Single responsibility**: Each file/module handles one specific concern
- **Clear separation**: HTML structure, CSS styling, and JS logic are separate
- **Module exports**: JavaScript functions and objects are properly exported/imported
- **State centralization**: All game data managed through `gameState` object
- **Event-driven**: User interactions trigger state changes across modules

## Development Workflow
1. Edit appropriate files based on change type:
   - HTML structure → `index.html`
   - Styling → CSS files in `assets/css/`
   - Game logic → JavaScript modules in `assets/js/`
2. Test locally by opening `index.html` in browser
3. For ES6 module testing, optionally serve via local HTTP server
4. Commit changes trigger automatic GitHub Pages deployment
5. No build process or compilation required