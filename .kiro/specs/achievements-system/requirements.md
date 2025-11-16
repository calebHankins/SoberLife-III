# Requirements Document

## Introduction

The Achievements System adds milestone tracking and recognition to SoberLife III, recording significant player accomplishments across all game modes. This feature enhances replay value by providing goals beyond immediate gameplay, encourages strategic spending in the Mind Palace shop, and motivates players to push further into Free Play mode runs. Achievements are displayed in the Mind Palace's "Your Growth Journey" section and celebrated with themed pop-up notifications when unlocked.

## Glossary

- **Achievement System**: The subsystem responsible for tracking, validating, and displaying player milestones
- **Achievement**: A specific milestone or accomplishment that can be unlocked through gameplay
- **Mind Palace**: The shop interface where players spend zen points and view their progress
- **Growth Journey Section**: The area within the Mind Palace that displays achievement progress
- **Free Play Run**: A continuous session of Free Play mode where players complete multiple tasks with increasing difficulty
- **Zen Points Peak**: The maximum number of zen points a player has possessed at any single moment
- **Achievement Pop-up**: A modal notification that appears when a player unlocks an achievement
- **Campaign Completion**: Successfully finishing all tasks in the Stress Management Campaign mode
- **Task Milestone**: Achievements earned by completing a specific number of Free Play tasks
- **Wealth Milestone**: Achievements earned by accumulating a specific amount of zen points at one time

## Requirements

### Requirement 1

**User Story:** As a player, I want to see my achievements displayed in the Mind Palace, so that I can track my progress and feel a sense of accomplishment

#### Acceptance Criteria

1. WHEN the player opens the Mind Palace, THE Achievement System SHALL display all achievements in the "Your Growth Journey" section
2. THE Achievement System SHALL display each achievement with its name, description, and unlock status (locked or unlocked)
3. THE Achievement System SHALL display unlock timestamps for completed achievements
4. THE Achievement System SHALL organize achievements into logical categories (Campaign, Free Play, Wealth)
5. THE Achievement System SHALL persist achievement data in localStorage across browser sessions

### Requirement 2

**User Story:** As a player, I want to receive a celebratory notification when I unlock an achievement, so that I feel recognized for my accomplishment

#### Acceptance Criteria

1. WHEN the player unlocks an achievement, THE Achievement System SHALL display a themed pop-up notification
2. THE Achievement System SHALL include the achievement name and description in the pop-up
3. THE Achievement System SHALL style the pop-up to match the game's aesthetic with Comic Sans MS font
4. THE Achievement System SHALL automatically dismiss the pop-up after 5 seconds or when the player clicks a close button
5. THE Achievement System SHALL prevent duplicate notifications for already-unlocked achievements

### Requirement 3

**User Story:** As a player, I want to earn an achievement for completing the Campaign, so that my dedication to finishing all stress management scenarios is recognized

#### Acceptance Criteria

1. WHEN the player completes the final task in the Stress Management Campaign, THE Achievement System SHALL unlock the "Campaign Master" achievement
2. THE Achievement System SHALL verify that all campaign tasks are marked as completed before awarding the achievement
3. THE Achievement System SHALL display the achievement pop-up immediately after campaign completion
4. THE Achievement System SHALL persist the campaign completion achievement across sessions
5. THE Achievement System SHALL display the campaign completion achievement in the Growth Journey section

### Requirement 4

**User Story:** As a player, I want to see my best Free Play run statistics, so that I can challenge myself to beat my personal records

#### Acceptance Criteria

1. THE Achievement System SHALL track the maximum number of tasks completed in a single Free Play run
2. THE Achievement System SHALL display the "Max Tasks in One Run" statistic in the Growth Journey section
3. WHEN the player completes a Free Play run, THE Achievement System SHALL compare the run length to the stored maximum
4. IF the current run exceeds the stored maximum, THEN THE Achievement System SHALL update the maximum value
5. THE Achievement System SHALL persist the maximum run length across browser sessions

### Requirement 5

**User Story:** As a player, I want to see my peak zen points balance, so that I can track my best financial achievement

#### Acceptance Criteria

1. THE Achievement System SHALL track the maximum zen points balance the player has achieved at any single moment
2. THE Achievement System SHALL display the "Peak Zen Points" statistic in the Growth Journey section
3. WHEN the player's zen points balance changes, THE Achievement System SHALL compare it to the stored peak
4. IF the current balance exceeds the stored peak, THEN THE Achievement System SHALL update the peak value
5. THE Achievement System SHALL persist the peak zen points value across browser sessions

### Requirement 6

**User Story:** As a player, I want to earn milestone achievements for completing Free Play tasks, so that I have long-term goals to work toward

#### Acceptance Criteria

1. THE Achievement System SHALL define milestone achievements for completing 5, 10, 25, 50, and 100 Free Play tasks
2. WHEN the player completes a Free Play task, THE Achievement System SHALL increment the total task counter
3. WHEN the total task counter reaches a milestone threshold, THE Achievement System SHALL unlock the corresponding achievement
4. THE Achievement System SHALL display an achievement pop-up when each milestone is reached
5. THE Achievement System SHALL persist the total Free Play tasks completed across browser sessions

### Requirement 7

**User Story:** As a player, I want to earn milestone achievements for accumulating zen points, so that I am motivated to save and grow my balance

#### Acceptance Criteria

1. THE Achievement System SHALL define milestone achievements for reaching 1000, 5000, 10000, 25000, and 50000 zen points at one time
2. WHEN the player's zen points balance changes, THE Achievement System SHALL check if any wealth milestone thresholds are crossed
3. WHEN a wealth milestone threshold is reached for the first time, THE Achievement System SHALL unlock the corresponding achievement
4. THE Achievement System SHALL display an achievement pop-up when each wealth milestone is reached
5. THE Achievement System SHALL persist unlocked wealth milestones across browser sessions

### Requirement 8

**User Story:** As a developer, I want comprehensive Playwright tests for the achievements system, so that I can ensure the feature works correctly across all scenarios

#### Acceptance Criteria

1. THE Test Suite SHALL verify that achievements are displayed correctly in the Mind Palace
2. THE Test Suite SHALL verify that achievement pop-ups appear when milestones are unlocked
3. THE Test Suite SHALL verify that campaign completion awards the appropriate achievement
4. THE Test Suite SHALL verify that Free Play task milestones are tracked and awarded correctly
5. THE Test Suite SHALL verify that zen points wealth milestones are tracked and awarded correctly
6. THE Test Suite SHALL verify that achievement data persists across browser sessions
7. THE Test Suite SHALL verify that duplicate achievement notifications do not appear
8. THE Test Suite SHALL verify that statistics (max run length, peak zen points) update correctly
