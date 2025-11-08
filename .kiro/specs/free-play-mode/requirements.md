# Requirements Document

## Introduction

Free Play Mode is a streamlined gameplay experience that provides access to the core stress management and deck upgrade mechanics without the roleplay narrative elements. This mode allows players to engage with the blackjack-based stress system, earn zen points, and upgrade their deck in a pure gameplay-focused environment without thematic dialogs, surveys, or contextual flavor text.

## Glossary

- **Free Play Mode**: A gameplay mode that removes roleplay elements while maintaining core mechanics (stress, zen points, deck upgrades)
- **Game System**: The SoberLife III application including all game modes and mechanics
- **Roleplay Elements**: Thematic content including intro surveys, flavor text, contextual dialog options, stress management tips, and scenario-specific messaging
- **Core Mechanics**: The fundamental gameplay systems including blackjack rules, stress management, zen activities, zen points economy, and deck upgrades
- **Stress Meter**: Visual indicator showing player stress level from 0% to 100%
- **Zen Activities**: Stress relief options available during gameplay (breathing, stretching, meditation, premium activities)
- **Deck Upgrades**: Permanent improvements to the blackjack deck purchased with zen points
- **Generic Actions**: Un-themed gameplay options like "Hit", "Stand", "Double Down" that replace contextual dialog choices
- **Task Session**: A single playthrough in Free Play Mode from 0% stress to completion or failure
- **Shop System**: Interface for purchasing deck upgrades and premium activities using zen points
- **Campaign State**: Persistent player data including deck composition and unlocked premium activities

## Requirements

### Requirement 1

**User Story:** As a player who wants quick gameplay without narrative, I want to access Free Play Mode from the main menu, so that I can engage with core mechanics without roleplay elements

#### Acceptance Criteria

1. WHEN the Game System displays the mode selection screen, THE Game System SHALL display a "Free Play Mode" option alongside existing mode options
2. WHEN a player selects Free Play Mode, THE Game System SHALL initialize a Task Session with 0% stress without displaying an intro survey
3. WHEN Free Play Mode initializes, THE Game System SHALL load the player's current deck composition from Campaign State
4. WHEN Free Play Mode initializes, THE Game System SHALL load the player's unlocked premium activities from Campaign State
5. WHERE Free Play Mode is active, THE Game System SHALL skip all roleplay-specific initialization steps

### Requirement 2

**User Story:** As a player in Free Play Mode, I want to play blackjack with generic action buttons, so that I can focus on gameplay mechanics without thematic immersion

#### Acceptance Criteria

1. WHEN a player is in Free Play Mode during a blackjack hand, THE Game System SHALL display generic action buttons labeled "Hit", "Stand", and "Double Down"
2. WHEN a player is in Free Play Mode, THE Game System SHALL NOT display contextual dialog options or thematic action text
3. WHEN a player selects "Hit" in Free Play Mode, THE Game System SHALL deal one card to the player's hand following standard blackjack rules
4. WHEN a player selects "Stand" in Free Play Mode, THE Game System SHALL end the player's turn and trigger dealer play following standard blackjack rules
5. WHEN a player selects "Double Down" in Free Play Mode AND the player has sufficient conditions, THE Game System SHALL double the bet, deal one card, and end the player's turn

### Requirement 3

**User Story:** As a player in Free Play Mode, I want stress to increase based on game outcomes without roleplay messaging, so that I can experience the stress management system in a pure gameplay context

#### Acceptance Criteria

1. WHEN a player loses a blackjack hand in Free Play Mode, THE Game System SHALL increase the Stress Meter by a predefined amount
2. WHEN a player wins a blackjack hand in Free Play Mode, THE Game System SHALL decrease the Stress Meter by a predefined amount
3. WHEN a player busts in Free Play Mode, THE Game System SHALL display a generic bust message without thematic content
4. WHEN the Stress Meter reaches 100% in Free Play Mode, THE Game System SHALL trigger a game over state with generic failure messaging
5. WHERE Free Play Mode is active, THE Game System SHALL NOT display stress management tips or educational pop-ups

### Requirement 4

**User Story:** As a player in Free Play Mode, I want access to zen activities without thematic descriptions, so that I can manage stress using simplified activity labels

#### Acceptance Criteria

1. WHEN a player is in Free Play Mode, THE Game System SHALL display all unlocked Zen Activities with simplified labels
2. WHEN a player selects a Zen Activity in Free Play Mode, THE Game System SHALL reduce stress by the activity's defined amount
3. WHEN a player selects a Zen Activity in Free Play Mode, THE Game System SHALL deduct the activity's zen point cost from the player's balance
4. WHEN a Zen Activity is used in Free Play Mode, THE Game System SHALL NOT display thematic descriptions or stress management educational content
5. WHERE premium activities are unlocked in Campaign State, THE Game System SHALL make those activities available in Free Play Mode

### Requirement 5

**User Story:** As a player in Free Play Mode, I want to earn zen points for successful gameplay, so that I can purchase deck upgrades that persist across all game modes

#### Acceptance Criteria

1. WHEN a player wins a blackjack hand in Free Play Mode, THE Game System SHALL award zen points based on the win type (regular win, blackjack, etc.)
2. WHEN a player completes a Task Session successfully in Free Play Mode, THE Game System SHALL award a completion bonus of zen points
3. WHEN zen points are earned in Free Play Mode, THE Game System SHALL update the Campaign State zen point balance
4. WHEN zen points are earned in Free Play Mode, THE Game System SHALL display the updated balance in the UI header
5. WHERE zen points are earned in Free Play Mode, THE Game System SHALL persist the balance to localStorage for use across all game modes

### Requirement 6

**User Story:** As a player who completes a Free Play session, I want access to the shop and continuation options, so that I can upgrade my deck and continue playing

#### Acceptance Criteria

1. WHEN a player successfully completes a Task Session in Free Play Mode, THE Game System SHALL display a success screen with generic congratulatory messaging
2. WHEN the success screen displays in Free Play Mode, THE Game System SHALL show options to "Visit Shop", "Play Again", or "Return to Menu"
3. WHEN a player selects "Visit Shop" from Free Play Mode success screen, THE Game System SHALL display the Shop System with all available upgrades
4. WHEN a player selects "Play Again" from Free Play Mode success screen, THE Game System SHALL initialize a new Task Session in Free Play Mode with 0% stress
5. WHEN a player selects "Return to Menu" from Free Play Mode success screen, THE Game System SHALL return to the mode selection screen

### Requirement 7

**User Story:** As a player in Free Play Mode, I want my deck upgrades to persist across all game modes, so that improvements I purchase benefit my entire gameplay experience

#### Acceptance Criteria

1. WHEN a player purchases a deck upgrade in Free Play Mode, THE Game System SHALL update the Campaign State deck composition
2. WHEN a player purchases a premium activity in Free Play Mode, THE Game System SHALL update the Campaign State unlocked activities list
3. WHEN Campaign State is updated from Free Play Mode, THE Game System SHALL persist changes to localStorage
4. WHEN a player starts a new game session in any mode, THE Game System SHALL load deck composition and unlocked activities from Campaign State
5. WHERE deck upgrades are purchased in Free Play Mode, THE Game System SHALL make those upgrades available in Campaign Mode and Jump Into Task Mode

### Requirement 8

**User Story:** As a player in Free Play Mode, I want a clean UI without roleplay elements, so that I can focus on core gameplay mechanics

#### Acceptance Criteria

1. WHEN Free Play Mode is active, THE Game System SHALL NOT display task-specific flavor text or narrative descriptions
2. WHEN Free Play Mode is active, THE Game System SHALL NOT display step progression indicators or multi-step task structures
3. WHEN Free Play Mode is active, THE Game System SHALL display the Stress Meter, zen point balance, and current hand information
4. WHEN Free Play Mode is active, THE Game System SHALL display generic game state messages without thematic content
5. WHERE Free Play Mode is active, THE Game System SHALL maintain visual consistency with other game modes while removing narrative UI elements

### Requirement 9

**User Story:** As a player who fails in Free Play Mode, I want clear options to retry or return to menu, so that I can quickly continue playing or exit

#### Acceptance Criteria

1. WHEN a player reaches 100% stress in Free Play Mode, THE Game System SHALL display a game over screen with generic failure messaging
2. WHEN the game over screen displays in Free Play Mode, THE Game System SHALL show options to "Try Again" or "Return to Menu"
3. WHEN a player selects "Try Again" from Free Play Mode game over screen, THE Game System SHALL initialize a new Task Session in Free Play Mode with 0% stress
4. WHEN a player selects "Return to Menu" from Free Play Mode game over screen, THE Game System SHALL return to the mode selection screen
5. WHERE a game over occurs in Free Play Mode, THE Game System SHALL NOT display stress management tips or educational content

### Requirement 10

**User Story:** As a developer or player seeking information about Free Play Mode, I want comprehensive documentation, so that I can understand how to use and maintain this gameplay mode

#### Acceptance Criteria

1. WHEN Free Play Mode is implemented, THE Game System SHALL include Free Play Mode documentation in the README file
2. WHEN Free Play Mode documentation is added to README, THE Game System SHALL describe the mode's purpose, mechanics, and differences from other modes
3. WHEN Free Play Mode is implemented, THE Game System SHALL update relevant steering documentation files to include Free Play Mode development guidelines
4. WHEN steering documentation is updated, THE Game System SHALL specify how Free Play Mode integrates with existing systems (stress, zen points, deck upgrades)
5. WHERE help or documentation is accessed, THE Game System SHALL provide clear explanations of Free Play Mode features and usage
