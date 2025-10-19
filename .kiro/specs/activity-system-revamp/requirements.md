# Activity System Revamp Requirements

## Introduction

The current zen activity system in SoberLife III allows unlimited use of stress-relief activities during gameplay, leading to a "spamming" problem where players can repeatedly use the cheapest activity (Deep Breath) to trivialize stress management. This revamp will introduce activity limitations per hand and premium purchasable activities to create more strategic gameplay and meaningful progression.

## Glossary

- **Activity_System**: The zen point-based stress relief mechanism that allows players to reduce stress during gameplay
- **Hand_Limit**: A restriction that allows only one activity use per blackjack hand/round
- **Premium_Activity**: A more powerful stress-relief option available for purchase in the shop using zen points
- **Activity_Cooldown**: The restriction preventing multiple activity uses within a single hand
- **Shop_System**: The existing upgrade purchasing interface where players spend zen points on deck improvements

## Requirements

### Requirement 1

**User Story:** As a player, I want activity usage to be limited per hand, so that stress management becomes more strategic rather than spammable.

#### Acceptance Criteria

1. WHEN a player uses any zen activity during a blackjack hand, THE Activity_System SHALL prevent further activity usage until the next hand begins
2. WHEN a new blackjack hand starts, THE Activity_System SHALL reset the activity usage allowance to permit one activity use
3. WHEN a player attempts to use an activity after already using one in the current hand, THE Activity_System SHALL display a message indicating activities are on cooldown
4. WHEN the activity cooldown is active, THE Activity_System SHALL visually disable all activity buttons until the next hand
5. THE Activity_System SHALL track activity usage state independently for each blackjack hand

### Requirement 2

**User Story:** As a player, I want to purchase premium activities in the shop, so that I can access more powerful stress management tools as I progress through the campaign.

#### Acceptance Criteria

1. WHEN a player visits the shop, THE Shop_System SHALL display available premium activities for purchase
2. WHEN a player purchases a premium activity, THE Shop_System SHALL deduct the appropriate zen points and unlock the activity permanently
3. WHEN a premium activity is unlocked, THE Activity_System SHALL make it available in the zen activities panel during gameplay
4. WHERE a premium activity is purchased, THE Activity_System SHALL provide significantly more stress reduction than default activities
5. THE Shop_System SHALL persist premium activity purchases across campaign sessions

### Requirement 3

**User Story:** As a player, I want premium activities to fit the game's theming, so that they feel integrated and meaningful within the stress management context.

#### Acceptance Criteria

1. THE Premium_Activity SHALL use thematically appropriate names and descriptions that align with mindfulness and stress management
2. THE Premium_Activity SHALL provide stress reduction values between 40-60% to be meaningfully more powerful than the default 35% maximum
3. THE Premium_Activity SHALL cost between 100-200 zen points to purchase, making it a significant investment
4. THE Premium_Activity SHALL use appropriate emoji and visual styling consistent with existing activities
5. THE Premium_Activity SHALL include educational descriptions about advanced stress management techniques

### Requirement 4

**User Story:** As a player, I want access to a unique "Compartmentalize" premium activity, so that I can recover from bust situations by applying advanced stress management techniques.

#### Acceptance Criteria

1. WHEN a player purchases the "Compartmentalize" premium activity, THE Shop_System SHALL unlock this special reactive ability permanently
2. WHEN a player busts during a hand AND has the Compartmentalize ability unlocked, THE Activity_System SHALL offer the option to use Compartmentalize instead of ending the hand
3. WHEN Compartmentalize is activated on a bust, THE Activity_System SHALL split the busted hand into two separate hands with the cards redistributed
4. WHEN hands are split via Compartmentalize, THE Activity_System SHALL allow the player to continue playing both hands to completion
5. THE Compartmentalize ability SHALL cost zen points to use (separate from the purchase cost) and SHALL count as the one activity use for that round

### Requirement 5

**User Story:** As a player, I want the activity system changes to work seamlessly with existing gameplay, so that my current progress and experience remain intact.

#### Acceptance Criteria

1. WHEN the revamped system loads, THE Activity_System SHALL maintain compatibility with existing save data and zen point balances
2. WHEN in single-task mode, THE Activity_System SHALL apply the same one-per-hand limitation as campaign mode
3. WHEN a hand ends (win, lose, bust, or tie), THE Activity_System SHALL automatically reset the activity cooldown for the next hand
4. THE Activity_System SHALL continue to integrate with the existing zen points manager and transaction logging
5. THE Activity_System SHALL maintain all existing activity feedback and notification systems