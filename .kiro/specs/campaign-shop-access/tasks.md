# Implementation Plan

- [x] 1. Update campaign state structure for Joker support
  - Modify campaignState object in game-state.js to include jokers in deckComposition
  - Add jokersAdded to shopUpgrades tracking
  - Implement migration logic for existing campaigns with only Ace upgrades
  - _Requirements: 3.1, 4.4, 6.5_

- [x] 2. Implement Joker card class and intelligent value calculation
  - Create JokerCard class with rainbow suit and special display properties
  - Implement calculateOptimalValue method that determines best value (1-11) to reach 21
  - Add logic to handle multiple Jokers in same hand with coordinated value calculation
  - Write unit tests for Joker value calculation edge cases
  - _Requirements: 3.2, 3.3, 3.4, 3.7_

- [x] 3. Update card system to support Joker cards in deck creation
  - Modify createCustomDeck function in card-system.js to include Jokers based on campaign state
  - Update calculateScore function to handle Joker cards with dynamic values
  - Ensure Joker cards are properly shuffled and distributed in deck
  - _Requirements: 3.1, 3.2, 6.2_

- [x] 4. Create Joker visual effects and styling
  - Add CSS animations for rainbow/holographic Joker card effects
  - Implement joker-calculate animation for value selection process
  - Create joker-perfect celebration effect for achieving 21
  - Add responsive styling for Joker effects on mobile devices
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 5. Update shop system to offer Joker upgrades instead of Aces
  - Modify shop-system.js to use jokerUpgrade configuration
  - Update purchaseJokerUpgrade function (renamed from purchaseAceUpgrade)
  - Adjust pricing and limits for Joker cards (higher cost, lower max count)
  - Update shop UI text and descriptions for Joker functionality
  - _Requirements: 3.1, 6.4_

- [x] 6. Add shop access button to campaign overview screen
  - Add "Visit Shop" button to campaign-actions section in index.html
  - Implement openCampaignShop function in campaign-manager.js
  - Ensure shop opens with current zen points balance from campaign state
  - Add proper button styling and positioning in components.css
  - _Requirements: 1.1, 1.2, 2.1, 2.4_

- [x] 7. Create deck composition viewer modal
  - Add deck viewer modal HTML structure to index.html
  - Implement viewDeckComposition and closeDeckViewer functions in ui-manager.js
  - Display breakdown of Jokers, Aces, and regular cards with upgrade history
  - Add modal styling with proper responsive design and accessibility
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 8. Implement Joker card rendering with visual effects
  - Update updateCards function in ui-manager.js to detect and style Joker cards
  - Add special rendering for Joker cards with rainbow borders and effects
  - Implement value calculation indicator that shows when Joker determines its value
  - Create celebration effects when Joker contributes to perfect score
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 9. Update campaign overview to show Joker count in deck status
  - Modify updateCampaignUI function to display both Aces and Jokers
  - Update deck composition display format to show "Aces: X, Jokers: Y / 52 Cards"
  - Ensure deck power calculation includes both card types appropriately
  - _Requirements: 4.3, 6.5_

- [x] 10. Add shop return navigation from campaign overview
  - Implement returnToCampaignFromShop function to properly close shop and return to overview
  - Update shop close buttons to use campaign-aware navigation
  - Ensure deck status updates immediately after shop purchases
  - Test complete flow: Campaign → Shop → Purchase → Return → Updated Display
  - _Requirements: 1.6, 6.1, 6.3_

- [x] 11. Implement Joker gameplay integration and feedback
  - Add logic to show Joker value calculation process during gameplay
  - Display helpful messages when Joker prevents bust or achieves 21
  - Update score display to clearly indicate Joker contributions
  - Add sound effects or enhanced visual feedback for Joker actions (optional)
  - _Requirements: 3.6, 5.4, 5.5_

- [x] 12. Add comprehensive error handling and validation
  - Implement validation for Joker card state and value calculations
  - Add error recovery for shop access failures from campaign overview
  - Ensure graceful handling of corrupted campaign state with Jokers
  - Add fallback behavior if Joker visual effects fail to load
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 13. Create integration tests for complete campaign shop flow
  - Write tests for campaign overview → shop → purchase → return flow
  - Test Joker cards in actual blackjack gameplay scenarios
  - Verify campaign state persistence with Joker purchases
  - Test deck viewer modal functionality and data accuracy
  - _Requirements: 1.1-1.6, 3.1-3.7, 4.1-4.6, 6.1-6.5_

- [x] 14. Update help documentation and user guidance
  - Add Joker card explanation to help modal content
  - Update campaign mode instructions to mention shop access from overview
  - Add tooltips or hints for new deck viewer functionality
  - Ensure all new features are properly documented for users
  - _Requirements: 2.2, 5.1, 5.2_