# Activity System Revamp Implementation Plan

- [ ] 1. Implement activity state management and cooldown system
  - Create new activity state tracking in game-state.js with cooldown flags and available activities
  - Add activity state reset function that integrates with existing hand state reset
  - Implement activity validation function to check cooldown and availability
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 2. Enhance stress system with premium activities and cooldown logic
  - [ ] 2.1 Add premium activity definitions to zenActivities configuration
    - Define mindfulBreathing premium activity with 50% stress reduction
    - Define compartmentalize reactive activity with special properties
    - Add activity type classification (default, premium, reactive)
    - _Requirements: 3.1, 3.2, 3.5_

  - [ ] 2.2 Implement enhanced useZenActivity function with cooldown enforcement
    - Add cooldown validation before allowing activity usage
    - Update activity state to mark activity as used for current hand
    - Integrate with existing zen points manager and transaction logging
    - _Requirements: 1.1, 1.3, 5.4_

  - [ ] 2.3 Create activity cooldown reset mechanism
    - Integrate cooldown reset with existing resetHandState function
    - Ensure cooldown resets on hand completion (win, lose, bust, tie)
    - Add activity state persistence for campaign mode
    - _Requirements: 1.2, 5.3_

- [ ] 3. Implement compartmentalize system and split hand mechanics
  - [ ] 3.1 Create compartmentalize activation and validation logic
    - Implement handleCompartmentalize function for bust recovery
    - Add validation to ensure compartmentalize only works on busted hands
    - Create split hand state management with dual hand tracking
    - _Requirements: 4.2, 4.3, 4.5_

  - [ ] 3.2 Develop card splitting algorithm for optimal hand distribution
    - Implement splitBustedHand function to create two manageable hands
    - Add logic to distribute cards optimally to minimize bust risk
    - Handle special cards (Aces, Jokers) correctly in split scenarios
    - _Requirements: 4.3_

  - [ ] 3.3 Create split hand gameplay mechanics
    - Implement hand switching logic for playing both split hands
    - Add split hand completion detection and scoring
    - Integrate split hand results with existing outcome system
    - _Requirements: 4.4_

- [ ] 4. Enhance shop system with premium activity purchases
  - [ ] 4.1 Add premium activity shop items and purchase interface
    - Create premiumActivities configuration with costs and descriptions
    - Add premium activity section to existing shop UI
    - Implement purchasePremiumActivity function with zen point validation
    - _Requirements: 2.1, 2.2, 3.3_

  - [ ] 4.2 Implement premium activity unlock and persistence system
    - Add activity unlock tracking to campaign state
    - Create activity state loading and saving functions
    - Ensure premium activity purchases persist across sessions
    - _Requirements: 2.3, 2.5_

  - [ ] 4.3 Update shop UI to display premium activities
    - Add premium activity cards to shop interface
    - Implement purchase buttons with cost validation
    - Add educational descriptions and thematic styling
    - _Requirements: 3.4, 3.5_

- [ ] 5. Update UI components for activity cooldown and premium features
  - [ ] 5.1 Enhance activity panel with cooldown indicators
    - Add visual feedback when activities are on cooldown
    - Implement activity button disabling during cooldown
    - Create cooldown status message display
    - _Requirements: 1.4_

  - [ ] 5.2 Create compartmentalize UI for split hand display
    - Implement split hand visualization with both hands shown
    - Add active hand highlighting and switching controls
    - Create progress indicators for split hand gameplay
    - _Requirements: 4.4_

  - [ ] 5.3 Add premium activity badges and special styling
    - Create visual distinction for premium vs default activities
    - Add unlock status indicators in activity panel
    - Implement premium activity availability feedback
    - _Requirements: 3.4_

- [ ] 6. Integrate activity system with existing game flow
  - [ ] 6.1 Update main game loop to handle activity cooldown
    - Integrate activity state updates with existing game state management
    - Ensure cooldown resets work with both single-task and campaign modes
    - Add activity state validation and error recovery
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 6.2 Implement compartmentalize integration with card system
    - Add split hand support to existing card dealing and scoring logic
    - Integrate compartmentalize with existing bust detection
    - Ensure split hands work correctly with custom deck compositions
    - _Requirements: 4.3, 4.4_

  - [ ] 6.3 Update campaign manager for premium activity persistence
    - Add premium activity unlock tracking to campaign state
    - Implement activity state migration for existing save files
    - Create activity statistics tracking for campaign progression
    - _Requirements: 2.5, 5.1_

- [ ] 7. Create comprehensive testing for activity system
  - [ ] 7.1 Write unit tests for activity cooldown logic
    - Test one-activity-per-hand limitation enforcement
    - Test cooldown reset on hand completion
    - Test activity validation with various game states
    - _Requirements: 1.1, 1.2, 1.5_

  - [ ] 7.2 Write integration tests for compartmentalize system
    - Test full compartmentalize flow from bust to completion
    - Test card splitting algorithm with various hand compositions
    - Test split hand gameplay and outcome handling
    - _Requirements: 4.2, 4.3, 4.4_

  - [ ] 7.3 Write tests for premium activity shop integration
    - Test premium activity purchase and unlock flow
    - Test activity persistence across campaign sessions
    - Test shop UI updates and validation
    - _Requirements: 2.1, 2.2, 2.3, 2.5_