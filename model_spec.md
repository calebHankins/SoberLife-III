# SoberLife - Stress Management Game Design Document

## Game Overview

**SoberLife** is a web-based stress management game that combines blackjack mechanics with everyday task completion. Players navigate stressful real-world scenarios (like DMV visits) while managing their stress levels through strategic gameplay and zen activities.

## Core Concept

The game uses familiar blackjack rules as a metaphor for handling life's challenges - getting as close to success (21) as possible without "busting" (losing control). Each successful hand represents successfully managing a step in a stressful task.

## Game Mechanics

### Primary Systems

#### 1. Blackjack Gameplay
- **Traditional Rules**: Standard blackjack against the house
- **Win Condition**: Get closer to 21 than house without going over
- **Card Values**: Aces (1/11), Face cards (10), Numbers (face value)
- **House Rules**: Dealer hits on 16, stands on 17

#### 2. Stress Management System
- **Stress Meter**: Visual bar showing current stress level (0-100%)
- **Stress Sources**: 
  - Losing blackjack hands (+15% stress)
  - Busting (+30% stress)
  - Ties (+5% stress)
- **Stress Relief**: 
  - Winning hands (-5% stress)
  - Zen activities (variable reduction)
- **Game Over**: Reaching 100% stress triggers failure

#### 3. Zen Points Economy
- **Currency System**: Earned through successful gameplay
- **Earning**: Win blackjack hands (+15 points), house busts (+15 points), ties (+5 points)
- **Spending**: Purchase stress relief activities
- **No Lose Condition**: 0 zen points doesn't end game, just limits options

#### 4. Zen Activities (Stress Relief)
- **Deep Breath**: 10 zen points → -10% stress
- **Quick Stretch**: 25 zen points → -20% stress  
- **Mini Meditation**: 50 zen points → -35% stress
- **Strategic Timing**: Can be used between rounds for stress management

### Task Structure

#### Multi-Step Scenarios
- **Current Task**: DMV License Renewal & Real ID
- **5 Steps Total**:
  1. Check in at front desk
  2. Wait in line for number to be called
  3. Present documents to clerk
  4. Take photo for Real ID
  5. Pay renewal fee and receive temporary license

#### Step Progression
- Each step requires winning a blackjack round
- Failure doesn't reset progress, just increases stress
- Players can retry steps until stress reaches 100%

## User Experience Flow

### 1. Pre-Task Assessment (Survey)
- **Sleep Quality**: Affects starting zen points
- **Preparation Level**: Affects starting zen points  
- **Daily Stress**: Affects starting zen points
- **Zen Point Range**: 50-150 based on survey responses
- **Validation**: All questions must be answered to proceed

### 2. Active Gameplay
- **Visual Feedback**: Avatar changes expression based on stress
- **Real-time Updates**: Stress meter and zen points update immediately
- **Strategic Choices**: Balance blackjack risk vs zen point spending
- **Activity Access**: Zen activities available throughout gameplay

### 3. Win/Loss Conditions
- **Success**: Complete all 5 task steps
- **Failure**: Stress meter reaches 100%
- **Game Over Screen**: Humorous message with restart option

## Visual Design

### Art Style
- **Cartoony/Stylized**: Comic Sans font, bright colors
- **Friendly Aesthetic**: Approachable, non-intimidating design
- **Gradient Backgrounds**: Sky blue to light green

### UI Components

#### Avatar System
- **Emoji-based**: 😊 → 🙂 → 😐 → 😰 → 😵
- **Color-coded Background**: Green (calm) → Red (stressed)
- **Real-time Updates**: Changes with stress level

#### Stress Meter
- **Visual Bar**: Horizontal progress bar
- **Color Coding**: Green (low) → Yellow (medium) → Red (high)
- **Percentage Display**: Clear numerical feedback

#### Card Display
- **Traditional Look**: White cards with suit symbols
- **Color Coding**: Red suits (♥♦), Black suits (♠♣)
- **Hidden Cards**: House hole card shows as "?" during play

## Technical Implementation

### Architecture
- **Single File**: Complete game in one HTML file
- **No Dependencies**: Self-contained with embedded CSS/JS
- **Web Distribution**: Easily shareable via any web host

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Responsive Design**: Works on desktop and mobile
- **No External Resources**: Fonts, icons all embedded

## Game Balance

### Difficulty Scaling
- **Survey Impact**: Starting conditions based on player state
- **Progressive Challenge**: Stress accumulates over multiple steps
- **Player Agency**: Zen activities provide stress management options

### Resource Management
- **Zen Point Economy**: Balanced earning vs spending
- **Strategic Depth**: Multiple activity options with different costs/benefits
- **Risk/Reward**: Blackjack skill vs stress relief spending

## Future Expansion Possibilities

### Additional Tasks
- **Job Interview**: Multi-step professional scenario
- **Medical Appointment**: Healthcare navigation challenges
- **Moving Day**: Logistics and coordination stress
- **Tax Filing**: Bureaucratic complexity scenario

### Enhanced Features
- **Achievement System**: Unlock new activities or bonuses
- **Difficulty Levels**: Adjustable stress sensitivity
- **Progress Tracking**: Statistics across multiple sessions
- **Social Features**: Share completion times or strategies

### Zen Activity Expansion
- **Progressive Unlocks**: More activities as player advances
- **Combo Effects**: Activity chains for enhanced benefits
- **Personalization**: Custom activities based on player preferences

## Success Metrics

### Player Engagement
- **Completion Rate**: Percentage of players finishing tasks
- **Retry Behavior**: How often players restart after failure
- **Activity Usage**: Which zen activities are most popular

### Educational Value
- **Stress Awareness**: Players learn stress management techniques
- **Real-world Application**: Skills transfer to actual stressful situations
- **Positive Reinforcement**: Success builds confidence for real scenarios

## Conclusion

SoberLife combines familiar game mechanics with practical stress management education. The blackjack metaphor makes abstract concepts concrete, while the zen point economy encourages proactive stress management. The game's approachable design and humorous tone make stress management engaging rather than intimidating.