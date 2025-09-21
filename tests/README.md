# SoberLife III - UI Features Test Suite

This directory contains comprehensive tests for the task visibility improvements implemented in SoberLife III.

## Test Files

### `ui-features.test.js`
Main test suite containing unit tests for:
- Contextual action mapping and retrieval functions
- Help modal show/hide functionality 
- Task prominence and animation systems
- Contextual button updates
- Error handling and fallback systems

### `test-runner.html`
Browser-based test runner that provides:
- Visual test execution interface
- Formatted test output with color coding
- Manual testing checklist
- Test coverage overview

## Running Tests

### Browser Testing
1. Open `test-runner.html` in a web browser
2. Click "Run All Tests" to execute the test suite
3. Review the output for any failures or warnings

### Command Line Testing (Node.js)
```bash
node ui-features.test.js
```

## Test Coverage

### 1. Contextual Action Mapping Tests
- ✅ Valid step returns correct contextual actions
- ✅ Invalid step returns fallback actions
- ✅ Null/undefined data handled gracefully
- ✅ Error conditions trigger appropriate fallbacks

### 2. Help Modal Functionality Tests
- ✅ Modal shows/hides correctly with valid elements
- ✅ Focus management works properly
- ✅ Missing elements handled gracefully
- ✅ Error conditions logged appropriately

### 3. Task Prominence System Tests
- ✅ Task description updates correctly
- ✅ Step indicator updates properly
- ✅ Animation classes applied correctly
- ✅ Fallback text used when step data missing
- ✅ Missing DOM elements handled gracefully

### 4. Contextual Button Update Tests
- ✅ Button text updates with contextual actions
- ✅ Button tooltips set correctly
- ✅ Fallback text used on errors
- ✅ Missing button elements handled gracefully
- ✅ Error conditions logged with warnings

### 5. Error Handling and Edge Cases Tests
- ✅ Flavor text displays correctly
- ✅ XSS attempts sanitized properly
- ✅ Missing DOM elements handled gracefully
- ✅ Function errors caught and logged
- ✅ Empty/null data handled appropriately

## Manual Testing Checklist

After running automated tests, manually verify:

### Visual Elements
- [ ] Task info has prominent gradient background
- [ ] Task info is visually distinct from other elements
- [ ] Step indicator shows correct "Step X of 5" format
- [ ] Help button is visible and accessible

### Interactions
- [ ] Help button opens modal with game instructions
- [ ] Help modal closes with X button, ESC key, or backdrop click
- [ ] Hit/Stand buttons show contextual text (e.g., "Ask Questions" vs "Hit")
- [ ] Flavor text appears briefly when actions are taken

### Animations
- [ ] Task info animates when new steps begin
- [ ] Task change animation plays when advancing steps
- [ ] Task emphasis effect works during game flow

### Keyboard Accessibility
- [ ] H key triggers Hit action
- [ ] S key triggers Stand action
- [ ] ? or / key opens help modal
- [ ] ESC key closes help modal
- [ ] Tab navigation works within modal

### Mobile Responsiveness
- [ ] Task info remains prominent on mobile devices
- [ ] Help modal works properly on touch devices
- [ ] Contextual buttons are touch-friendly
- [ ] Text remains readable at all screen sizes

### Error Handling
- [ ] Game continues to function if contextual actions fail
- [ ] Fallback "Hit"/"Stand" text appears if needed
- [ ] Help modal gracefully handles missing elements
- [ ] Console shows appropriate warnings/errors for debugging

## Test Results Interpretation

### Success Indicators
- All test suites show "✓ [Test Name] tests passed"
- No assertion failures or unhandled errors
- Console warnings only for expected error conditions

### Failure Indicators
- "❌" symbols in test output
- Assertion failed messages
- Unhandled exceptions during test execution

### Performance Notes
- Tests run in under 1 second
- No memory leaks from event listeners
- DOM manipulation is efficient and clean

## Adding New Tests

To add tests for new features:

1. Create new test functions following the existing pattern
2. Add comprehensive error handling tests
3. Include edge cases and boundary conditions
4. Update this README with new test coverage
5. Add manual testing steps to the checklist

## Dependencies

Tests are designed to run without external dependencies:
- Pure JavaScript (ES6+)
- Mock DOM objects for isolated testing
- No testing frameworks required
- Compatible with all modern browsers