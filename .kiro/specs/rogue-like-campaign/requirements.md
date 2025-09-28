# Requirements Document

## Introduction

This feature transforms SoberLife III from a single DMV task into a rogue-like campaign system where players progress through multiple stress management scenarios. After completing each task, players can spend remaining zen points to upgrade their blackjack deck by replacing cards with Aces, creating a progression system that makes players more "mindful" and capable as they advance through the campaign.

## Requirements

### Requirement 1

**User Story:** As a player, I want to progress through multiple different stressful life scenarios, so that I can practice stress management in various contexts and feel a sense of campaign progression.

#### Acceptance Criteria

1. WHEN the game starts THEN the system SHALL present a campaign overview showing available tasks
2. WHEN a player completes a task THEN the system SHALL unlock the next task in the sequence
3. WHEN viewing the campaign THEN the system SHALL display task completion status and current progress
4. IF a player has not completed the previous task THEN the system SHALL prevent access to locked tasks
5. WHEN a task is completed successfully THEN the system SHALL mark it as completed and save progress

### Requirement 2

**User Story:** As a player, I want to spend my remaining zen points on deck upgrades after completing a task, so that I can become more powerful and better equipped for future challenges.

#### Acceptance Criteria

1. WHEN a task is completed THEN the system SHALL display a shop interface with upgrade options
2. WHEN in the shop THEN the system SHALL show the player's current zen point balance
3. WHEN purchasing an upgrade THEN the system SHALL replace a random non-Ace card with an Ace
4. WHEN purchasing an upgrade THEN the system SHALL deduct the cost from zen points
5. IF the player has insufficient zen points THEN the system SHALL prevent the purchase
6. WHEN the deck has no non-Ace cards THEN the system SHALL disable further Ace upgrades
7. WHEN leaving the shop THEN the system SHALL save the upgraded deck for future tasks

### Requirement 3

**User Story:** As a player, I want to experience different types of stressful scenarios beyond the DMV, so that I can learn to apply stress management techniques in various real-world situations.

#### Acceptance Criteria

1. WHEN implementing Task 1 THEN the system SHALL use the existing DMV scenario
2. WHEN implementing Task 2 THEN the system SHALL present a different mundane/stressful scenario
3. WHEN starting a task THEN the system SHALL display task-specific context and objectives
4. WHEN playing different tasks THEN the system SHALL maintain consistent blackjack and stress mechanics
5. WHEN tasks have different difficulty THEN the system SHALL adjust stress gain rates or initial conditions appropriately

### Requirement 4

**User Story:** As a player, I want my deck upgrades to persist across tasks, so that I can feel meaningful progression and see the benefits of my investments.

#### Acceptance Criteria

1. WHEN starting a new task THEN the system SHALL use the player's upgraded deck from previous tasks
2. WHEN the game loads THEN the system SHALL restore the player's deck composition from saved data
3. WHEN a deck contains Aces THEN the system SHALL maintain the Ace functionality (1 or 11 value)
4. WHEN displaying the deck THEN the system SHALL show the current composition including upgrade count
5. WHEN resetting campaign progress THEN the system SHALL restore the deck to default composition

### Requirement 5

**User Story:** As a player, I want clear navigation between campaign overview, individual tasks, and the upgrade shop, so that I can easily understand and control my progression through the game.

#### Acceptance Criteria

1. WHEN on the campaign screen THEN the system SHALL provide buttons to start available tasks
2. WHEN completing a task THEN the system SHALL provide options to visit shop or return to campaign
3. WHEN in the shop THEN the system SHALL provide options to continue shopping or return to campaign
4. WHEN navigating between screens THEN the system SHALL maintain game state and progress
5. WHEN returning to campaign THEN the system SHALL reflect any changes made in tasks or shop

### Requirement 6

**User Story:** As a player, I want to see my overall campaign progress and deck power level, so that I can track my improvement and feel motivated to continue.

#### Acceptance Criteria

1. WHEN viewing campaign overview THEN the system SHALL display total tasks completed
2. WHEN viewing campaign overview THEN the system SHALL show current deck composition or power level
3. WHEN viewing campaign overview THEN the system SHALL display total zen points earned across all tasks
4. WHEN tasks are locked THEN the system SHALL clearly indicate requirements to unlock them
5. WHEN all tasks are completed THEN the system SHALL display campaign completion status