# Requirements Document

## Introduction

This feature addresses critical user experience feedback from playtesting SoberLife III. Players are not noticing or reading the current task/step information, which is essential for understanding their objectives. Additionally, the constant display of gameplay rules is distracting, and the hit/stand actions lack contextual flavor that would make them more engaging and meaningful within the task scenario.

## Requirements

### Requirement 1

**User Story:** As a player, I want the current task to be prominently displayed and impossible to miss, so that I always understand what I'm supposed to accomplish in the current step.

#### Acceptance Criteria

1. WHEN a new task step begins THEN the system SHALL display the current task in a visually prominent way that draws immediate attention
2. WHEN the player is viewing the game interface THEN the current task SHALL be more noticeable than any other text on screen
3. WHEN a task step changes THEN the system SHALL use visual cues (animation, highlighting, or emphasis) to draw attention to the new task
4. IF the current task text is long THEN the system SHALL ensure it remains readable and prominent without overwhelming the interface

### Requirement 2

**User Story:** As a player, I want gameplay rules to be accessible but not constantly visible, so that I can focus on my current task without distraction.

#### Acceptance Criteria

1. WHEN the player first loads the game THEN the gameplay rules SHALL be hidden by default
2. WHEN the player clicks a help button or "?" icon THEN the system SHALL display all gameplay rules in a popup or overlay
3. WHEN the rules popup is displayed THEN it SHALL include the text "Complete each step by getting closer to 21 than the house without going over!" and all other gameplay instructions
4. WHEN the player closes the rules popup THEN the system SHALL return to the clean game interface without rule text
5. IF the player has never opened the help THEN the system SHALL provide a subtle indicator that help is available

### Requirement 3

**User Story:** As a player, I want hit and stand actions to have contextual flavor text that relates to my current task, so that my choices feel meaningful and immersive within the scenario.

#### Acceptance Criteria

1. WHEN the player can choose to hit or stand THEN the system SHALL display contextual action descriptions instead of generic "Hit" and "Stand" buttons
2. WHEN the player hovers over or selects an action THEN the system SHALL show flavor text that makes sense for both the blackjack action and the current task context
3. WHEN the current task changes THEN the system SHALL update the action flavor text to match the new scenario
4. IF the player chooses an action THEN the flavor text SHALL make logical sense for why that choice represents hitting or standing in blackjack
5. WHEN displaying action options THEN the system SHALL maintain clear connection between the contextual action and its blackjack equivalent

### Requirement 4

**User Story:** As a player, I want the interface to guide my attention naturally to the most important information, so that I can play effectively without missing critical details.

#### Acceptance Criteria

1. WHEN the game interface loads THEN the visual hierarchy SHALL prioritize current task information above all other elements
2. WHEN multiple UI elements compete for attention THEN the system SHALL use consistent visual design principles to guide focus appropriately
3. WHEN the player needs to make a decision THEN the system SHALL make the available actions and their context immediately clear
4. IF there are multiple pieces of information displayed THEN the system SHALL use visual weight, positioning, and styling to create clear information priority