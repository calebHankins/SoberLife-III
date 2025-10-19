# Zen Points Persistence System Requirements

## Introduction

The zen points system needs to function as a persistent currency that carries across tasks, activities, and game sessions. Players should be able to accumulate zen points through gameplay and use them strategically for stress management and deck upgrades.

## Glossary

- **Zen Points**: The primary currency in the game used for stress relief activities and deck upgrades
- **Task Start Bonus**: Zen points awarded when beginning a new task
- **Task Completion Bonus**: Large zen point reward for successfully completing a task
- **Performance Multiplier**: Bonus multiplier based on final stress level when completing a task
- **Persistent Balance**: Zen points that carry over between tasks and game sessions
- **Campaign Mode**: Progressive gameplay mode where zen points persist across multiple tasks
- **Single Task Mode**: Standalone gameplay mode with session-based zen points

## Requirements

### Requirement 1: Persistent Zen Point Balance

**User Story:** As a player, I want my zen points to persist across tasks and game sessions, so that I can accumulate currency and make strategic decisions about spending.

#### Acceptance Criteria

1. WHEN a player completes a task, THE System SHALL preserve their remaining zen points for future tasks
2. WHEN a player starts a new task in campaign mode, THE System SHALL maintain their existing zen point balance
3. WHEN a player closes and reopens the game, THE System SHALL restore their saved zen point balance
4. WHEN a player switches between tasks, THE System SHALL carry over their zen point balance
5. WHERE campaign mode is active, THE System SHALL persist zen points in localStorage with the campaign state

### Requirement 2: Task Start Bonus System

**User Story:** As a player, I want to receive zen points when starting a task, so that I have resources to manage stress and feel rewarded for taking on challenges.

#### Acceptance Criteria

1. WHEN a player starts any task, THE System SHALL award 100 zen points as a base bonus
2. WHERE a task has a difficulty modifier, THE System SHALL multiply the base bonus by the difficulty value
3. WHEN the task start bonus is awarded, THE System SHALL display a celebratory notification with animations
4. WHEN a player replays a completed task, THE System SHALL still award the task start bonus
5. THE System SHALL add the task start bonus to the player's existing zen point balance

### Requirement 3: Task Completion Bonus System

**User Story:** As a player, I want to receive substantial zen points for completing tasks, with bonuses based on my performance, so that I feel rewarded for success and motivated to manage stress effectively.

#### Acceptance Criteria

1. WHEN a player successfully completes a task, THE System SHALL award a base completion bonus of 1000 zen points
2. WHEN a player completes a task with low stress levels, THE System SHALL apply a performance multiplier up to 2.0x
3. WHEN the performance multiplier is calculated, THE System SHALL use the formula: multiplier = 2.0 - (finalStressLevel / 100)
4. WHEN task completion bonuses are awarded, THE System SHALL display celebratory animations and clear point breakdowns
5. THE System SHALL show both the base bonus and performance bonus separately in the completion screen

### Requirement 4: Enhanced Visual Feedback System

**User Story:** As a player, I want zen point changes to be visually obvious and celebratory, so that I understand the impact of my actions and feel motivated by progress.

#### Acceptance Criteria

1. WHEN zen points are awarded, THE System SHALL display animated popup notifications with appropriate emojis
2. WHEN large zen point bonuses are awarded, THE System SHALL trigger celebratory particle effects
3. WHEN zen points are spent, THE System SHALL show clear deduction animations
4. WHEN the zen point balance changes, THE System SHALL animate the counter with smooth transitions
5. THE System SHALL use different visual styles for different types of zen point changes (earned, spent, bonus)

### Requirement 5: Campaign Integration

**User Story:** As a campaign player, I want my zen points to be part of my overall progression, so that I can grind earlier tasks to prepare for harder challenges.

#### Acceptance Criteria

1. WHEN in campaign mode, THE System SHALL maintain a persistent zen point balance across all tasks
2. WHEN a player replays completed tasks, THE System SHALL allow them to earn zen points for grinding currency
3. WHEN campaign progress is saved, THE System SHALL include the current zen point balance
4. WHEN campaign data is loaded, THE System SHALL restore the saved zen point balance
5. THE System SHALL display the persistent zen point balance in the campaign overview screen

### Requirement 6: Single Task Mode Compatibility

**User Story:** As a single task player, I want zen points to work within my session while maintaining the enhanced reward system.

#### Acceptance Criteria

1. WHEN in single task mode, THE System SHALL use session-based zen points that reset between games
2. WHEN starting a single task, THE System SHALL still award the task start bonus
3. WHEN completing a single task, THE System SHALL still award completion bonuses with performance multipliers
4. WHEN a single task session ends, THE System SHALL not persist zen points to campaign state
5. THE System SHALL clearly indicate the session-based nature of zen points in single task mode

### Requirement 7: Balance Validation and Recovery

**User Story:** As a player, I want the zen point system to be reliable and recover gracefully from errors, so that I don't lose progress due to technical issues.

#### Acceptance Criteria

1. WHEN zen point data is corrupted, THE System SHALL validate and repair the balance using fallback values
2. WHEN negative zen point values are detected, THE System SHALL correct them to zero with user notification
3. WHEN localStorage fails, THE System SHALL continue with session-based zen points and notify the user
4. WHEN zen point calculations overflow, THE System SHALL cap values at reasonable maximums
5. THE System SHALL log zen point transactions for debugging and recovery purposes