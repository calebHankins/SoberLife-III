# Project Structure

## Root Directory
```
/
├── index.html          # Complete game application (HTML + CSS + JS)
├── README.md           # Project documentation and gameplay instructions
├── model_spec.md       # Comprehensive game design document
├── LICENSE             # MIT license
├── .github/            # GitHub Actions workflow for deployment
├── .vscode/            # VS Code settings
└── .kiro/              # Kiro AI assistant configuration
```

## Single-File Architecture
The entire game is contained within `index.html` with three main sections:

### HTML Structure
- **Game Container**: Main wrapper with rounded corners and shadow
- **Avatar & Stress Meter**: Visual feedback for player state
- **Survey Section**: Pre-task assessment for initial game state
- **Task Info**: Current step description and objectives
- **Zen Activities Panel**: Stress relief options with costs/benefits
- **Game Area**: Blackjack gameplay interface with cards and controls
- **Game Over Screen**: Failure state with restart option

### CSS Organization
- **Reset & Base Styles**: Universal box-sizing and body setup
- **Layout Components**: Flexbox-based responsive design
- **Visual Elements**: Gradients, shadows, and animations
- **Interactive States**: Hover effects and disabled states
- **Responsive Design**: Mobile-friendly adaptations

### JavaScript Modules
- **Game State Management**: Central `gameState` object
- **Card System**: Deck creation, shuffling, and scoring
- **UI Updates**: DOM manipulation and visual feedback
- **Game Logic**: Blackjack rules and win/loss conditions
- **Stress Management**: Zen activities and stress calculations

## File Conventions
- **Single responsibility**: Each function handles one specific task
- **State centralization**: All game data in `gameState` object
- **Event-driven**: User interactions trigger state changes
- **Immediate feedback**: UI updates reflect state changes instantly

## Development Workflow
1. Edit `index.html` directly for all changes
2. Test locally by opening in browser
3. Commit changes trigger automatic GitHub Pages deployment
4. No build process or compilation required