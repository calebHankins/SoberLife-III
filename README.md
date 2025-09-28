# 🧘 SoberLife - III 🧘

A fun, interactive stress management game that combines blackjack mechanics with real-world scenarios. Practice stress management techniques through engaging gameplay in both single-task and campaign modes.

## 🎮 Play the Game

Visit the [live game on github pages](https://calebhankins.github.io/SoberLife-III/)!

## 🎯 Game Modes

### 🏛️ Single Task Mode
The classic experience focusing on a single DMV visit:
1. **Pre-Assessment**: Answer questions about your current state
2. **Complete DMV Steps**: Navigate through 5 DMV tasks using blackjack-style gameplay
3. **Manage Stress**: Use zen points for breathing exercises, stretches, and meditation
4. **Stay Calm**: Keep your stress level below 100% to successfully complete your visit

### 🎯 Campaign Mode (NEW!)
A rogue-like progression system with multiple scenarios:
1. **Multiple Tasks**: Progress through DMV visits, job interviews, and more
2. **Deck Upgrades**: Spend zen points between tasks to add Aces to your deck
3. **Progressive Difficulty**: Unlock new challenges as you complete tasks
4. **Persistent Progress**: Your upgraded deck carries over to future challenges

## 🧘 Features

- **Two Game Modes**: Single task or progressive campaign
- **Interactive Stress Management**: Visual stress meter with zen activities
- **Deck Progression**: Upgrade your blackjack deck with more Aces
- **Multiple Scenarios**: DMV visits, job interviews, and more stress situations
- **Contextual Actions**: Task-specific choices that affect gameplay
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Persistence**: Campaign progress saves automatically

## 🚀 Local Development

### File Structure
The game is organized into separate modules for maintainability:

```
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
- **Add Aces**: Replace random cards with Aces (cost increases with each purchase)
- **Persistent Power**: Upgraded decks carry over to all future tasks
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
3. No build process required - files are served directly

### Serving with a Local Server (Optional)
For testing ES6 modules, you may want to serve the files through a local server:

```bash
# Node.js
npx serve . -p 8000
```

Then visit `http://localhost:8000` in your browser.

## 📝 License

This project is open source and available under the MIT License.