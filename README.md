# 🧘 SoberLife - III 🧘

A fun, interactive stress management game that simulates a DMV visit using blackjack mechanics. Help your character manage stress levels through various zen activities while completing bureaucratic tasks.

## 🎮 Play the Game

Visit the[ live game on github pages](https://calebhankins.github.io/SoberLife-III/)!

## 🎯 How to Play

1. **Pre-Assessment**: Answer questions about your current state
2. **Complete DMV Steps**: Navigate through 5 DMV tasks using blackjack-style gameplay
3. **Manage Stress**: Use zen points for breathing exercises, stretches, and meditation
4. **Stay Calm**: Keep your stress level below 100% to successfully complete your DMV visit

## 🧘 Features

- Interactive stress meter with visual feedback
- Zen point system for stress management activities
- Progressive difficulty through 5 DMV steps
- Engaging blackjack-based gameplay mechanics
- Responsive design for desktop and mobile

## 🚀 Local Development

### File Structure
The game is now organized into separate files for better maintainability:

```
/
├── index.html              # Main HTML structure
├── assets/
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
├── README.md              # This file
└── model_spec.md          # Comprehensive game design document
```

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