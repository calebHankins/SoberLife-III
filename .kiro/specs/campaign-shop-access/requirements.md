# Requirements Document

## Introduction

This feature adds direct access to the zen points shop from the Stress Management Campaign overview screen and introduces a new Joker card upgrade system. Currently, players can only access the shop after completing a task, which limits their ability to strategically manage their deck upgrades. This enhancement will provide players with more control over their campaign progression by allowing them to access the shop at any time during the campaign. Additionally, the shop will now offer Joker cards instead of Aces - these wild cards automatically adjust their value to help the player achieve the optimal score (ideally 21), creating more strategic and visually exciting gameplay.

## Requirements

### Requirement 1

**User Story:** As a campaign player, I want to access the zen points shop from the campaign overview screen, so that I can review and purchase deck upgrades without having to complete a task first.

#### Acceptance Criteria

1. WHEN the campaign overview screen is displayed THEN the system SHALL show a "Visit Shop" button or link
2. WHEN the user clicks the "Visit Shop" button THEN the system SHALL open the zen points shop interface
3. WHEN the shop is opened from the campaign overview THEN the system SHALL display the user's current zen points balance
4. WHEN the shop is opened from the campaign overview THEN the system SHALL show all available upgrades with current pricing
5. WHEN the user makes a purchase in the shop THEN the system SHALL update their zen points balance and deck composition
6. WHEN the user closes the shop THEN the system SHALL return them to the campaign overview screen

### Requirement 2

**User Story:** As a campaign player, I want the shop button to be clearly visible and accessible, so that I can easily find and use this feature.

#### Acceptance Criteria

1. WHEN the campaign overview is displayed THEN the shop access button SHALL be prominently placed in the campaign actions section
2. WHEN the user has sufficient zen points for upgrades THEN the shop button SHALL be enabled and clearly actionable
3. WHEN the user has insufficient zen points for any upgrades THEN the shop button SHALL still be accessible but may indicate limited options
4. WHEN the shop button is displayed THEN it SHALL use consistent styling with other campaign interface elements

### Requirement 3

**User Story:** As a campaign player, I want to purchase Joker cards that intelligently help me achieve optimal scores, so that I can improve my chances of success in future tasks through strategic deck building.

#### Acceptance Criteria

1. WHEN the shop displays upgrade options THEN it SHALL offer "Add Joker to Deck" instead of "Add Ace to Deck"
2. WHEN a Joker card is drawn during gameplay THEN it SHALL automatically calculate the optimal value to help the player reach 21 (or the best possible score under 21)
3. WHEN a Joker card is drawn THEN its maximum value SHALL be 11 (same as an Ace high)
4. WHEN a Joker card is drawn THEN its minimum value SHALL be 1 (same as an Ace low)
5. WHEN a Joker card is in play THEN it SHALL display with special visual effects (rainbow/holographic/circus theme)
6. WHEN a Joker card contributes to the player's score THEN the system SHALL clearly indicate how the Joker helped (e.g., "Joker = 7 for perfect 21!")
7. WHEN multiple Jokers are in a hand THEN each SHALL calculate its optimal value independently to achieve the best possible total score

### Requirement 4

**User Story:** As a campaign player, I want to view my current deck composition including Jokers, so that I can verify my shop purchases and understand my deck's current power level.

#### Acceptance Criteria

1. WHEN the campaign overview screen is displayed THEN the system SHALL show a "View Deck" button or link
2. WHEN the user clicks the "View Deck" button THEN the system SHALL display a detailed breakdown of their current deck composition
3. WHEN the deck view is displayed THEN it SHALL show the total number of Jokers, Aces, regular cards, and overall deck statistics
4. WHEN the deck view is displayed THEN it SHALL show the history of upgrades purchased (e.g., "4 base Aces + 2 purchased Jokers")
5. WHEN the user closes the deck view THEN the system SHALL return them to the campaign overview screen
6. WHEN deck upgrades are purchased THEN the deck view SHALL reflect the updated composition immediately

### Requirement 5

**User Story:** As a campaign player, I want visual feedback when Joker cards are active, so that I can understand their impact and enjoy the enhanced gameplay experience.

#### Acceptance Criteria

1. WHEN a Joker card is displayed THEN it SHALL have distinctive visual styling (rainbow border, holographic effect, or circus-themed design)
2. WHEN a Joker card calculates its value THEN the system SHALL show an animated indicator of the value selection process
3. WHEN a Joker card contributes to achieving 21 THEN the system SHALL display a special celebration effect
4. WHEN a Joker card prevents a bust THEN the system SHALL show appropriate visual feedback indicating the save
5. WHEN the player's hand contains Jokers THEN the score display SHALL clearly indicate which cards are Jokers and their current values

### Requirement 6

**User Story:** As a campaign player, I want the shop to work seamlessly from the campaign overview, so that my experience is consistent regardless of how I access the shop.

#### Acceptance Criteria

1. WHEN the shop is accessed from the campaign overview THEN it SHALL function identically to the post-task shop experience
2. WHEN purchases are made from the campaign overview shop THEN the changes SHALL persist and be reflected in subsequent tasks
3. WHEN the user returns from the shop to the campaign overview THEN the deck status SHALL be updated to reflect any purchases
4. WHEN the shop is accessed from the campaign overview THEN it SHALL include the same Joker upgrade options and functionality as the post-task shop
5. WHEN the campaign overview displays deck composition THEN it SHALL show both Aces and Jokers in the deck power indicator