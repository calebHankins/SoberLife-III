# Implementation Plan

- [x] 1. Create achievement data structures and definitions
  - Create `assets/js/achievement-definitions.js` with all achievement definitions
  - Define achievement categories (campaign, free_play, wealth)
  - Define milestone thresholds for Free Play (5, 10, 25, 50, 100 tasks)
  - Define milestone thresholds for Wealth (1000, 5000, 10000, 25000, 50000 zen points)
  - Include emoji, names, descriptions, and flavor text for each achievement
  - _Requirements: 1.2, 3.1, 6.1, 6.2, 7.1, 7.2_

- [x] 2. Implement achievement manager core logic
  - Create `assets/js/achievement-manager.js` module
  - Implement achievement state object with statistics tracking
  - Implement `initializeAchievements()` function to load saved state
  - Implement `checkAchievement(achievementId)` to validate unlock conditions
  - Implement `unlockAchievement(achievementId)` to unlock and persist achievements
  - Implement `checkMilestones(type, value)` for milestone validation
  - Implement `updateStatistic(statName, value)` for stat tracking
  - Implement `getStatistics()` to retrieve current stats
  - Implement `getAllAchievements()` to get all achievements with status
  - Add localStorage persistence functions (`saveAchievementState()`, `loadAchievementState()`)
  - Add state validation and error recovery functions
  - _Requirements: 1.1, 1.5, 2.5, 4.1, 4.4, 4.5, 5.1, 5.4, 5.5, 6.3, 6.5, 7.3, 7.5_

- [x] 3. Create achievement UI components
  - Create `assets/js/achievement-ui.js` module
  - Implement `renderAchievementsInMindPalace()` to display achievements in Growth Journey section
  - Implement `createAchievementCard(achievement, isUnlocked, timestamp)` to generate achievement HTML
  - Implement `renderStatistics(stats)` to display max run and peak zen points
  - Add CSS styles for achievement cards (locked/unlocked states)
  - Add CSS styles for statistics display
  - Style locked achievements with grayscale and reduced opacity
  - Style unlocked achievements with gold gradient and glow effect
  - _Requirements: 1.1, 1.2, 1.3, 4.2, 5.2_

- [x] 4. Implement achievement notification system
  - Implement `showAchievementNotification(achievement)` in `achievement-ui.js`
  - Create notification HTML structure with achievement details
  - Add notification CSS with slide-in and bounce animations
  - Implement auto-dismiss after 5 seconds
  - Implement manual close button functionality
  - Add celebration particle effects for notifications
  - Ensure notifications don't overlap (queue system)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5. Integrate with campaign completion
  - Modify `assets/js/campaign-manager.js` - `completeCurrentTask()` function
  - Import achievement manager functions
  - Check if all campaign tasks are completed
  - Call `updateStatistic('campaignCompleted', true)` when campaign is complete
  - Call `checkAchievement('campaign_master')` to unlock achievement
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Integrate with Free Play task completion
  - Modify `assets/js/main.js` - Free Play task completion flow
  - Import achievement manager functions
  - Increment `freePlayTasksTotal` statistic on task completion
  - Increment `currentFreePlayRun` statistic on task completion
  - Call `checkMilestones('free_play', freePlayTasksTotal)` to check for unlocks
  - Update `freePlayMaxRun` if current run exceeds previous max
  - Reset `currentFreePlayRun` to 0 when Free Play session ends
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Integrate with zen points balance tracking
  - Modify `assets/js/zen-points-manager.js` - `addPoints()` function
  - Import achievement manager functions
  - Check current balance after adding points
  - Update `zenPointsPeak` statistic if current balance exceeds peak
  - Call `checkMilestones('wealth', zenPointsPeak)` to check for unlocks
  - Ensure spending doesn't affect peak tracking
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 8. Integrate with Mind Palace display
  - Modify `assets/js/shop-system.js` - `openShop()` function
  - Import achievement UI functions
  - Call `renderAchievementsInMindPalace()` when Mind Palace opens
  - Call `renderStatistics(getStatistics())` to display stats
  - Update HTML in `index.html` to include achievement display container
  - Replace or enhance existing "Your Growth Journey" section
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.2, 5.2_

- [x] 9. Add achievement initialization to game startup
  - Modify `assets/js/main.js` - game initialization
  - Import and call `initializeAchievements()` on game load
  - Ensure achievement state loads before game starts
  - Add error handling for corrupted achievement data
  - _Requirements: 1.5, 2.5_

- [x] 10. Write Playwright tests for achievements system
  - Create `tests/playwright/achievements.spec.js`
  - Test achievement display in Mind Palace (locked and unlocked states)
  - Test campaign completion achievement unlock
  - Test Free Play milestone achievements (5, 10 tasks)
  - Test wealth milestone achievements (1000, 5000 zen points)
  - Test achievement notification appearance and dismissal
  - Test statistics display (max run, peak zen points)
  - Test achievement persistence across browser sessions
  - Test duplicate notification prevention
  - Test achievement state validation and recovery
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
