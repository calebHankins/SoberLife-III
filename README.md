# 🧘 SoberLife - III 🧘

A fun, interactive stress management game that combines blackjack mechanics with real-world scenarios. Practice stress management techniques through engaging gameplay in both single-task and campaign modes.

## 🎮 Play the Game

Visit the [live game on github pages](https://calebhankins.github.io/SoberLife-III/)!

## 🎯 Game Modes

### 🎯 Jump Into Task Mode

Quick access to your next uncompleted challenge:

1. **Pre-Assessment**: Answer questions about your current state
2. **Complete Task Steps**: Navigate through 5 task steps using blackjack-style gameplay
3. **Manage Stress**: Use zen points for breathing exercises, stretches, and meditation
4. **Upgrade Your Deck**: Access the full shop to purchase jokers and premium activities
5. **Stay Calm**: Keep your stress level below 100% to successfully complete your task

**After Task Completion:**
- **Visit Shop**: Access the full upgrade shop with your earned zen points
- **Campaign Overview**: Return to the campaign to see your progress
- **Next Task**: Jump directly into the next available challenge

This mode uses your campaign progress and upgraded deck, making it a perfect shortcut for quick play sessions without campaign navigation.

### 🎯 Campaign Mode

A rogue-like progression system with multiple scenarios:

1. **Multiple Tasks**: Progress through DMV visits, job interviews, and more
2. **Deck Upgrades**: Spend zen points between tasks to add jokers and premium activities
3. **Progressive Difficulty**: Unlock new challenges as you complete tasks
4. **Persistent Progress**: Your upgraded deck carries over to future challenges

### 🎮 Free Play Mode

Pure gameplay without roleplay elements with progressive difficulty:

1. **Instant Start**: Begin at 0% stress without survey
2. **Generic Actions**: Simple "Hit" and "Stand" buttons
3. **Task-Based Structure**: Complete 5 rounds per task
4. **Progressive Difficulty**: Stress increases more as you continue
5. **Risk/Reward System**: Choose to continue for better bonuses or cash out safely

**Gameplay Loop:**
- Complete 5 rounds to finish a task
- Choose to continue (higher difficulty, better rewards) or end session
- Each task increases stress multiplier by 15%
- Earn bonus zen points based on performance and difficulty

**Metrics Tracked:**
- Tasks completed in session
- Total rounds played
- Current difficulty level
- Performance bonuses

**Perfect For:**
- Quick gameplay sessions
- Practicing stress management mechanics
- Testing deck upgrades
- Pushing your limits for maximum rewards

This mode uses your campaign progress and upgraded deck, making it ideal for players who want to focus on gameplay mechanics without narrative immersion while still experiencing meaningful progression and challenge.

## 🧘 Features

- **Three Game Modes**: Jump Into Task, Campaign, and Free Play
- **Interactive Stress Management**: Visual stress meter with zen activities
- **Deck Progression**: Upgrade your blackjack deck with more Aces
- **Multiple Scenarios**: DMV visits, job interviews, and more stress situations
- **Contextual Actions**: Task-specific choices that affect gameplay
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Persistence**: Campaign progress saves automatically
- **Comprehensive Testing**: 220+ automated tests for quality assurance

## 🚀 Local Development

### File Structure

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

## 🛒 Campaign Mode Details

### Deck Upgrades

- **Add Jokers**: Replace random cards with Wild Jokers that automatically calculate optimal values (cost increases with each purchase)
- **Premium Activities**: Unlock advanced stress management techniques like Mindful Breathing and Compartmentalize
- **Persistent Power**: Upgraded decks and unlocked activities carry over to all future tasks and Jump Into Task mode
- **Strategic Investment**: Save zen points for meaningful upgrades

### Available Tasks

1. **DMV License Renewal** - Navigate bureaucratic processes and paperwork
2. **Job Interview Challenge** - Handle performance anxiety and professional pressure
3. **More Coming Soon** - Additional scenarios planned for future updates

### Progression System

- Tasks unlock sequentially as you complete previous challenges
- Each task teaches different stress management techniques
- Campaign completion unlocks special achievements

### Development Workflow

1. Make changes to the appropriate files (HTML, CSS, or JavaScript modules)
2. Refresh your browser to see changes
3. **Run regression tests** to verify your changes don't break existing functionality
4. No build process required - files are served directly

### Testing

The project includes comprehensive Playwright end-to-end tests for regression testing:

```bash
# Install dependencies (first time only)
npm install

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

See `tests/playwright/README.md` for detailed testing documentation.

### Serving with a Local Server

For development and testing, serve the files through a local server:

```bash
# Node.js (required for Playwright tests)
npx serve . -p 8000
```

Then visit `http://localhost:8000` in your browser.

## 💎 Zen Points System

### Overview

Zen points serve as the game's primary currency, earned through gameplay and spent on stress relief activities and permanent deck upgrades.

### Earning Zen Points

- **Task Start Bonus**: +100 zen points when beginning any task
- **Round Wins**: +15 zen points for winning blackjack rounds
- **House Bust**: +15 zen points when the house busts
- **Task Completion**: +1000-2000 zen points based on performance (lower stress = higher bonus)

### Spending Zen Points

- **Stress Relief Activities**: Deep breathing (10), stretching (25), meditation (50)
- **Deck Upgrades**: Add Wild Jokers (75, 125, 175, 225... progressive pricing)
- **Premium Activities**: Mindful Breathing (1000 zen), Compartmentalize (2000 zen)

### Persistence Architecture

The zen points system uses a centralized manager (`ZenPointsManager`) that:

- Maintains the authoritative balance across all game modes
- Automatically syncs with campaign state for persistence
- Handles all transactions with proper logging and validation
- Ensures UI consistency across all screens

## 🔧 Recent Updates

### Zen Points Persistence Fix (Critical)

- **Root Issue**: Task completion bonuses weren't persisting when returning to campaign overview
- **Cause**: Timing issue where completion bonus was awarded after campaign state was saved
- **Solution**: Reordered task completion flow to award bonus before saving state
- **UI Sync Fix**: Added `updateDisplay()` calls to campaign navigation functions
- **Testing**: Comprehensive end-to-end testing of task completion → shop purchase → campaign return flow

### Campaign System Implementation

- **Rogue-like progression**: Complete tasks to unlock new challenges
- **Deck upgrades**: Spend zen points to add Aces between tasks
- **Task-specific content**: Each scenario has unique actions and success messages
- **Progress persistence**: Campaign state saves automatically

### Bug Fixes

- **Step counter reset**: Tasks now properly start at step 1 instead of continuing from previous task
- **Task-specific success screens**: Completion messages now match the completed task (DMV vs Job Interview)
- **Campaign reset functionality**: Reset and New Campaign buttons properly clear all state
- **Error recovery**: Robust state validation and repair mechanisms

## 📝 License

This project is open source and available under the MIT License.
