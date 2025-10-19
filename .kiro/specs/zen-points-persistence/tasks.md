# Zen Points Persistence System Implementation Tasks

## Task Overview

Transform the zen points system into a persistent currency with enhanced rewards, visual feedback, and seamless campaign integration.

## Implementation Tasks

### 1. Create Zen Points Manager Core System

- [ ] 1.1 Create `assets/js/zen-points-manager.js` with core balance management functions
  - Implement getCurrentBalance(), addPoints(), spendPoints(), setBalance()
  - Add transaction logging and validation
  - Include error handling and recovery mechanisms
  - _Requirements: 1.1, 1.2, 7.1, 7.2_

- [ ] 1.2 Create bonus calculation system in `assets/js/bonus-calculator.js`
  - Implement task start bonus calculation (100 * difficulty)
  - Implement completion bonus with performance multiplier (1000 * (2.0 - stress/100))
  - Add bonus validation and capping logic
  - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3_

- [ ] 1.3 Integrate zen points manager with existing game state
  - Update game-state.js to use ZenPointsManager for all zen point operations
  - Replace direct gameState.zenPoints modifications with manager calls
  - Ensure backward compatibility with existing code
  - _Requirements: 1.1, 1.4_

### 2. Implement Campaign Mode Persistence

- [ ] 2.1 Add zen point balance to campaign state structure
  - Add zenPointBalance field to campaignState
  - Add zenPointTransactions array for transaction history
  - Update saveCampaignProgress() to include zen point data
  - _Requirements: 1.3, 5.3, 5.4_

- [ ] 2.2 Update campaign initialization to load zen point balance
  - Modify loadCampaignProgress() to restore zen point balance
  - Add migration logic for existing saves without zen point balance
  - Implement balance validation on load
  - _Requirements: 1.3, 5.4, 7.1_

- [ ] 2.3 Update campaign task flow to preserve zen points
  - Modify startCampaignTask() to maintain existing balance
  - Update completeCurrentTask() to add completion bonuses
  - Ensure zen points persist when switching between tasks
  - _Requirements: 1.1, 1.4, 5.1, 5.2_

### 3. Implement Task Start and Completion Bonuses

- [ ] 3.1 Add task start bonus system
  - Modify startTask() to award task start bonus instead of resetting points
  - Calculate bonus based on task difficulty (default 1.0x multiplier)
  - Show celebratory notification for start bonus
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3.2 Implement task completion bonus system
  - Add completion bonus calculation to nextStep() when task completes
  - Calculate performance multiplier based on final stress level
  - Award base 1000 points plus performance bonus
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 3.3 Update success screen to show bonus breakdown
  - Modify showGameSuccess() to display zen point bonuses earned
  - Show base completion bonus and performance multiplier separately
  - Include total zen points earned during the task
  - _Requirements: 3.4, 3.5, 4.1_

### 4. Create Enhanced Visual Feedback System

- [ ] 4.1 Implement zen point animation system
  - Add showZenPointAnimation() function to ui-manager.js
  - Create different animation styles for different bonus types
  - Implement smooth counter animations for balance changes
  - _Requirements: 4.1, 4.2, 4.4, 4.5_

- [ ] 4.2 Create completion celebration effects
  - Add showCompletionCelebration() function with particle effects
  - Implement large bonus celebration animations
  - Create performance multiplier visual feedback
  - _Requirements: 4.2, 4.3, 4.5_

- [ ] 4.3 Add CSS animations for zen point effects
  - Create keyframe animations for zen point popups
  - Add particle effect styles for celebrations
  - Implement smooth counter transition animations
  - _Requirements: 4.1, 4.2, 4.4_

### 5. Update Campaign Integration

- [ ] 5.1 Add zen point balance to campaign overview
  - Display current zen point balance prominently in campaign UI
  - Show total zen points earned across all tasks
  - Add zen point statistics to campaign progress display
  - _Requirements: 5.5, 1.1_

- [ ] 5.2 Enable zen point grinding through task replay
  - Ensure replayed tasks award full bonuses including start bonus
  - Maintain zen point persistence across task replays
  - Update task cards to show potential zen point rewards
  - _Requirements: 5.2, 2.4_

- [ ] 5.3 Update shop system integration
  - Modify shop functions to use ZenPointsManager for balance checks
  - Update shop UI to reflect persistent zen point balance
  - Ensure shop purchases properly deduct from persistent balance
  - _Requirements: 1.1, 5.1_

### 6. Implement Single Task Mode Compatibility

- [ ] 6.1 Add session-based zen points for single task mode
  - Modify single task mode to use session-only zen point balance
  - Ensure start and completion bonuses work in single task mode
  - Prevent single task zen points from persisting to campaign
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 6.2 Update single task UI to indicate session-based points
  - Add visual indicator that zen points are session-only
  - Update success screen to clarify non-persistent nature
  - Ensure clear distinction from campaign mode
  - _Requirements: 6.5_

### 7. Add Error Handling and Validation

- [ ] 7.1 Implement balance validation and recovery
  - Add validateBalance() function to detect and fix corrupted data
  - Implement automatic correction for negative balances
  - Add overflow protection for extremely large balances
  - _Requirements: 7.1, 7.2, 7.4_

- [ ] 7.2 Add transaction logging and debugging
  - Implement transaction history logging for all zen point changes
  - Add debug logging for balance operations
  - Create recovery mechanisms for failed transactions
  - _Requirements: 7.5, 7.1_

- [ ] 7.3 Handle storage failures gracefully
  - Add fallback to session-based points when localStorage fails
  - Implement user notification for storage issues
  - Ensure game continues to function without persistence
  - _Requirements: 7.3, 6.1_

### 8. Testing and Integration

- [ ]* 8.1 Create unit tests for zen points manager
  - Test bonus calculations with various stress levels
  - Test balance persistence and recovery scenarios
  - Test error handling and validation functions
  - _Requirements: All_

- [ ]* 8.2 Create integration tests for campaign flow
  - Test zen point persistence across task switches
  - Test shop integration with new balance system
  - Test migration from legacy save data
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ]* 8.3 Test visual effects and animations
  - Verify animation performance across different devices
  - Test celebration effects for various bonus amounts
  - Ensure animations don't interfere with gameplay
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

### 9. Polish and Optimization

- [ ]* 9.1 Optimize animation performance
  - Implement animation queuing for multiple simultaneous effects
  - Add performance-based particle effect scaling
  - Optimize DOM manipulation for smooth animations
  - _Requirements: 4.1, 4.2_

- [ ]* 9.2 Add accessibility features for visual effects
  - Implement reduced motion support for animations
  - Add screen reader announcements for zen point changes
  - Ensure color contrast for zen point displays
  - _Requirements: 4.1, 4.5_

- [ ]* 9.3 Performance testing and optimization
  - Test memory usage with extended gameplay sessions
  - Optimize localStorage usage and transaction history
  - Ensure smooth performance on lower-end devices
  - _Requirements: All_