# Technical Stack

## Architecture
- **Single-file application**: Complete game contained in one HTML file (`index.html`)
- **No external dependencies**: Self-contained with embedded CSS and JavaScript
- **Client-side only**: Pure frontend implementation with no backend requirements

## Technologies
- **HTML5**: Semantic markup and structure
- **CSS3**: Styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: Game logic, state management, and DOM manipulation
- **No frameworks or libraries**: Zero dependencies for maximum portability

## Deployment
- **GitHub Pages**: Automated deployment via GitHub Actions
- **Static hosting**: Can be deployed to any web server or CDN
- **No build process**: Direct file serving without compilation

## Browser Compatibility
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Responsive design**: Works on desktop and mobile devices
- **Progressive enhancement**: Graceful degradation for older browsers

## Development Commands
Since this is a static HTML file, development is straightforward:

```bash
# Local development - open in browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux

# Or serve via local server for testing
python -m http.server 8000    # Python 3
python -m SimpleHTTPServer    # Python 2
npx serve .                   # Node.js
```

## Code Style
- **Comic Sans MS font**: Maintains friendly, approachable aesthetic
- **Camel case**: JavaScript variables and functions
- **Semantic naming**: Clear, descriptive identifiers
- **Inline styles**: CSS embedded in HTML head for portability
- **ES5 compatibility**: Avoids modern JS features for broader support