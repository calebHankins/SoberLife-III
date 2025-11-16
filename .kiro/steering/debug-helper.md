---
title: Debug Helper
category: Development Tools
inclusion: always
---

# Debug Helper

## Overview

SoberLife III includes a built-in debug helper (`assets/js/debug-helper.js`) that provides convenient commands for testing and debugging during development. The helper is automatically loaded and available in the browser console.

## Accessing the Debug Helper

Open the browser console (F12) and type:

```javascript
DebugHelper.help()
```

This displays all available commands with examples.

## Available Commands

### Zen Points Management

**Add Zen Points:**
```javascript
DebugHelper.addZenPoints(amount)
```
- Adds the specified amount of zen points to the player's balance
- Default: 1000 points if no amount specified
- Example: `DebugHelper.addZenPoints(5000)` adds 5000 zen points

### Deck Management

**Add Jokers:**
```javascript
DebugHelper.addJokers(count)
```
- Adds the specified number of jokers to the deck composition
- Updates both `campaignState.deckComposition` and `shopUpgrades`
- Default: 1 joker if no count specified
- Example: `DebugHelper.addJokers(3)` adds 3 jokers to the deck

**Show Deck Composition:**
```javascript
DebugHelper.showDeckComposition()
```
- Displays current deck composition in console
- Shows aces, jokers, total cards, and shop upgrades
- Returns the deck composition object

### Gameplay Shortcuts

**Auto-Win Current Hand:**
```javascript
DebugHelper.autoWin()
```
- Sets player cards to 21 (Ace + King)
- Sets house cards to 19 (10 + 9)
- Automatically triggers stand to complete the hand
- Useful for quickly testing win scenarios

### Stress Management

**Reset Stress:**
```javascript
DebugHelper.resetStress()
```
- Sets stress level to 0%
- Updates UI immediately

**Set Stress Level:**
```javascript
DebugHelper.setStress(level)
```
- Sets stress to a specific level (0-100)
- Automatically clamps to valid range
- Example: `DebugHelper.setStress(75)` sets stress to 75%

## Common Testing Scenarios

### Testing Shop Purchases

```javascript
// Add zen points for purchasing
DebugHelper.addZenPoints(5000);

// Open shop and make purchases
// (use UI or call shop functions)

// Verify deck composition
DebugHelper.showDeckComposition();
```

### Testing Joker Functionality

```javascript
// Add jokers to deck
DebugHelper.addJokers(5);

// Start a new round to see jokers in play
window.startNewRound();

// Check if jokers are in the deck
console.log(window.gameState.deck.filter(card => card.isJoker));
```

### Testing Stress Mechanics

```javascript
// Set high stress
DebugHelper.setStress(90);

// Test stress-related features
// (zen activities, game over conditions, etc.)

// Reset stress
DebugHelper.resetStress();
```

### Quick Win Testing

```javascript
// Start a game mode
// Deal initial cards

// Auto-win the hand
DebugHelper.autoWin();

// Verify win logic, zen points earned, etc.
```

## Implementation Details

### File Location
`assets/js/debug-helper.js`

### Module Structure
- Exports `DebugHelper` object with all commands
- Automatically exposes to `window.DebugHelper` for console access
- Imports necessary game state and manager modules
- Includes error handling for all operations

### Console Logging
All debug commands log their results to the console:
- Success messages with ✅ emoji
- Current state after operations
- Error messages if operations fail

## Usage in Playwright Tests

The debug helper is also useful in Playwright tests:

```javascript
test('should test with debug helper', async ({ page }) => {
    await page.goto('/');
    
    // Use debug helper in test
    await page.evaluate(() => {
        window.DebugHelper.addZenPoints(5000);
        window.DebugHelper.addJokers(3);
    });
    
    // Verify results
    const jokerCount = await page.evaluate(() => {
        return window.campaignState.deckComposition.jokers;
    });
    expect(jokerCount).toBe(3);
});
```

## Best Practices

### DO:
- ✅ Use debug helper for manual testing and exploration
- ✅ Use in Playwright tests to set up test scenarios quickly
- ✅ Call `showDeckComposition()` to verify state changes
- ✅ Use `help()` to remember available commands

### DON'T:
- ❌ Leave debug helper calls in production code
- ❌ Rely on debug helper for normal gameplay
- ❌ Use debug helper to bypass game mechanics in production
- ❌ Modify debug helper for production features (create proper functions instead)

## Extending the Debug Helper

To add new debug commands:

1. Open `assets/js/debug-helper.js`
2. Add new method to `DebugHelper` object:

```javascript
export const DebugHelper = {
    // ... existing methods ...
    
    // New method
    myNewCommand(param) {
        try {
            // Implementation
            console.log('✅ Command executed');
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
};
```

3. Update the `help()` method to document the new command
4. Test the new command in browser console

## Troubleshooting

### Debug Helper Not Available

**Issue**: `DebugHelper is not defined` in console

**Solutions**:
1. Ensure page has fully loaded
2. Check browser console for import errors
3. Verify `assets/js/debug-helper.js` is loaded in `main.js`
4. Refresh the page

### Commands Not Working

**Issue**: Debug commands execute but don't have expected effect

**Solutions**:
1. Check console for error messages
2. Verify you're in the correct game mode
3. Ensure game state is initialized (not on landing page)
4. Try refreshing and starting a game mode first

### State Not Updating

**Issue**: Debug commands succeed but UI doesn't update

**Solutions**:
1. Some commands require manual UI refresh
2. Try calling `window.updateDisplay()` after debug commands
3. For deck changes, start a new round: `window.startNewRound()`

## Related Documentation

- **Testing Guidelines**: `.kiro/steering/testing.md` - How to run tests
- **Technical Stack**: `.kiro/steering/tech.md` - Architecture overview
- **Debugging Guide**: `.kiro/steering/debugging.md` - General debugging tips

## Summary

The debug helper is a powerful tool for:
- Rapid manual testing
- Setting up test scenarios
- Exploring game mechanics
- Debugging issues

Always use `DebugHelper.help()` to see the latest available commands and examples.
