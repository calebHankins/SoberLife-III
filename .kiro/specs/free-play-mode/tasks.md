# Implementation Plan

- [x] 1. Add Free Play Mode to game state and mode selection
  - Add `freePlayMode`, `freePlayRounds`, `freePlayTasksCompleted`, `freePlayCurrentTaskRounds`, and `freePlayStressMultiplier` properties to gameState in `assets/js/game-state.js`
  - Add Free Play Mode card to mode selection UI in `index.html` with onclick handler
  - Style the new mode card to match existing mode cards in `assets/css/components.css`
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Implement Free Play Mode initialization
  - Create `startFreePlayMode()` function in `assets/js/main.js` that sets Free Play flags, skips survey, loads deck/activities from campaign, and starts first round
  - Add error handling and fallback to mode selection if initialization fails
  - Test that Free Play Mode starts at 0% stress without survey
  - _Requirements: 1.4, 1.5, 2.1, 3.1, 3.2, 4.5, 5.3_

- [x] 3. Update UI manager for Free Play Mode
  - Create `updateFreePlayUI()` function in `assets/js/ui-manager.js` to show task/round progress and difficulty level
  - Create `updateGenericActionButtons()` function to set "Hit" and "Stand" labels
  - Modify `updateContextualButtons()` to check for Free Play Mode and call generic button update
  - Modify `showFlavorText()`, `showInitialFlavorText()`, and `showStressManagementTip()` to skip in Free Play Mode
  - _Requirements: 2.2, 2.3, 2.4, 3.5, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 4. Implement generic outcome messaging
  - Create `getGenericOutcomeMessage()` function in `assets/js/main.js` with simple win/lose/tie/bust messages
  - Modify `endRound()` to use generic messages in Free Play Mode
  - Apply stress multiplier to stress changes in Free Play Mode
  - _Requirements: 3.3, 3.4_

- [x] 5. Implement task-based progression system
  - Modify `checkStepCompletion()` in `assets/js/main.js` to handle Free Play Mode with task structure
  - Increment `freePlayRounds` and `freePlayCurrentTaskRounds` after each round
  - Check for task completion (5 rounds) and offer continuation choice
  - _Requirements: 5.1, 5.2_

- [x] 6. Create task completion modal and risk/reward system
  - Create `offerFreePlayTaskCompletion()` function to show completion modal
  - Create `createFreePlayCompletionModal()` function to build modal HTML with stats and options
  - Create `continueFreePlayTask()` function to award bonus, increment task counter, increase difficulty multiplier, and start new task
  - Create `endFreePlaySession()` function to award bonus and show final success screen
  - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3_

- [x] 7. Implement completion bonus calculation
  - Create `calculateFreePlayTaskBonus()` function that calculates bonus based on stress level and difficulty multiplier
  - Award higher bonuses for lower stress (risk/reward)
  - Apply difficulty multiplier to bonus amount
  - _Requirements: 5.1, 5.2_

- [x] 8. Update success screen for Free Play Mode
  - Create `showFreePlaySuccess()` function to display session summary with tasks completed, total rounds, and final stats
  - Create `updateFreePlaySuccessButtons()` function to configure shop, menu, and play again buttons
  - Create `restartFreePlay()` function to reset and start new Free Play session
  - Create `returnToModeSelection()` function to return to mode selection screen
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Update game over screen for Free Play Mode
  - Modify `showGameOver()` in `assets/js/main.js` to handle Free Play Mode buttons
  - Create `addReturnToMenuButton()` function to add menu button to game over screen
  - Configure try again button to call `restartFreePlay()` in Free Play Mode
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Implement zen activities integration
  - Verify zen activities work correctly in Free Play Mode using existing `useZenActivity()` function
  - Test that premium activities (if unlocked) are available in Free Play Mode
  - Confirm zen point costs and stress reductions apply correctly
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 11. Ensure deck upgrade persistence
  - Verify Free Play Mode loads custom deck from campaign state
  - Test that deck upgrades purchased in Free Play Mode persist to campaign state
  - Confirm upgraded deck is available in next Free Play session
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 12. Add CSS styling for Free Play Mode elements
  - Style task completion modal in `assets/css/components.css`
  - Add styles for risk/reward text and completion options
  - Ensure modal is responsive on mobile devices in `assets/css/responsive.css`
  - _Requirements: 8.3, 8.4, 8.5_

- [x] 13. Update documentation
  - Add Free Play Mode section to README.md explaining task-based structure, progressive difficulty, and risk/reward system
  - Update `.kiro/steering/product.md` with Free Play Mode details
  - Update `.kiro/steering/tech.md` with Free Play Mode integration notes
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. Testing and validation
  - [x] 14.1 Test Free Play Mode initialization and first task
  - [x] 14.2 Test task completion modal and continuation choice
  - [x] 14.3 Test progressive difficulty (stress multiplier increases)
  - [x] 14.4 Test session completion and final success screen
  - [x] 14.5 Test game over flow in Free Play Mode
  - [x] 14.6 Test zen activities and deck upgrades in Free Play Mode
  - [x] 14.7 Test mode switching (Free Play → Shop → Campaign)
  - [x] 14.8 Test persistence across browser refresh
  - _Requirements: All requirements_
