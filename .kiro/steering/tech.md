# Technical Stack

## Architecture
- **Multi-file application**: Game organized into separate HTML, CSS, and JavaScript files
- **Modular JavaScript**: ES6 modules for better code organization and maintainability
- **No external dependencies**: Self-contained with no frameworks or libraries
- **Client-side only**: Pure frontend implementation with no backend requirements

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
│   ├── components.css     # UI component specific styles
│   └── responsive.css     # Mobile and responsive design
└── js/                    # JavaScript modules
    ├── game-state.js      # Central state management
    ├── card-system.js     # Blackjack game logic
    ├── ui-manager.js      # DOM manipulation
    ├── stress-system.js   # Zen activities and stress management
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

# Serve via local server for full ES6 module support
python -m http.server 8000    # Python 3
python -m SimpleHTTPServer    # Python 2
npx serve . -p 8000          # Node.js

# Then visit http://localhost:8000
```

## Code Style
- **Comic Sans MS font**: Maintains friendly, approachable aesthetic
- **Camel case**: JavaScript variables and functions
- **Semantic naming**: Clear, descriptive identifiers
- **External stylesheets**: CSS organized in separate files by purpose
- **ES6 modules**: Modern JavaScript with proper import/export structure
- **Modular architecture**: Each file has single responsibility and clear interfaces