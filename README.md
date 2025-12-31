# SoberLife-III

A stress management game that combines blackjack mechanics with real-world scenarios. Practice stress management techniques through gameplay.

- [SoberLife-III](#soberlife-iii)
  - [🎮 Play the Game](#-play-the-game)
  - [Inspirations](#inspirations)
    - [Part of the SoberLife Series](#part-of-the-soberlife-series)
  - [General Gameplay Loop](#general-gameplay-loop)
  - [Game Modes](#game-modes)
    - [Jump Into Task Mode](#jump-into-task-mode)
    - [Campaign Mode](#campaign-mode)
    - [Free Play Mode](#free-play-mode)
  - [Features](#features)
    - [Deck Upgrades](#deck-upgrades)
    - [Progression System](#progression-system)
  - [Contributing](#contributing)
  - [License](#license)

## 🎮 Play the Game

Visit the [live game on github pages](https://calebhankins.github.io/SoberLife-III/)!

## Inspirations

This game takes inspiration from Douglas Adams' [_Bureaucracy_](https://en.wikipedia.org/wiki/Bureaucracy_(video_game)), LocalThunk's [_Balatro_](https://en.wikipedia.org/wiki/Balatro), and Bruce Baskir's [_SoberLife-II_](https://github.com/calebHankins/SoberLife-II).

### Part of the SoberLife Series

This is the third installment in the _SoberLife_ series! If you enjoy stress management gameplay, check out the prequel:

**[SoberLife-II](https://github.com/calebHankins/SoberLife-II)** - A Pygame-based board game where you navigate through a full day, managing stress as you move between activities. Written by Bruce Baskir, this turn-based strategy game challenges you to complete your daily tasks without letting stress levels get too high. [Play it here!](https://calebhankins.github.io/SoberLife-II/)

## General Gameplay Loop

1. **Pre-Assessment**: Answer questions about your current state (unless Free Play mode)
2. **Complete Task Steps**: Navigate through 5 task steps using blackjack-style gameplay
3. **Manage Stress**: Use zen points for breathing exercises, stretches, and meditation
4. **Upgrade Your Deck**: Access the full shop to purchase jokers and premium activities
5. **Stay Calm**: Keep your stress level below 100% to successfully complete your task

**After Task Completion:**

- **Visit Shop**: Access the full upgrade shop with your earned zen points
- **Overview**: Return to the Campaign/Free Play landing page to see your progress
  - Visit the `Mind Palace` to see the state of your upgrades and achievements
- **Next Task**: Jump directly into the next available challenge

## Game Modes

### Jump Into Task Mode

Quick access to your next uncompleted challenge!

### Campaign Mode

A rogue-like progression system with multiple scenarios:

1. **Multiple Tasks**: Progress through DMV visits, job interviews, and more
2. **Deck Upgrades**: Spend zen points between tasks to add jokers and premium activities
3. **Progressive Difficulty**: Unlock new challenges as you complete tasks
4. **Persistent Progress**: Your upgraded deck carries over to future challenges

### Free Play Mode

Pure gameplay without roleplay elements with progressive difficulty. Note: Free Play now lands on a dedicated "Free Play Mode" overview screen (matching the campaign flow) instead of launching the game directly from the mode selection.

1. **Overview First**: Enter a Free Play Campaign Screen that shows your deck, session stats, shop access, and a `Play` (or `Play Again`) button to start the session
2. **Generic Actions**: Simple "Hit" and "Stand" buttons
3. **Task-Based Structure**: Complete 5 rounds per task
4. **Progressive Difficulty**: Stress increases more as you continue
5. **Risk/Reward System**: Choose to continue for better bonuses or cash out safely

**Gameplay Loop:**

- Complete 5 rounds to finish a task
- Choose to continue (higher difficulty, better rewards) or end session
- Each task increases stress multiplier by 15%
- Earn bonus zen points based on performance and difficulty

**Metrics Tracked:**

- Tasks completed in session
- Total rounds played
- Current difficulty level
- Performance bonuses

**Perfect For:**

- Quick gameplay sessions
- Practicing stress management mechanics
- Testing deck upgrades
- Pushing your limits for maximum rewards

This mode uses your campaign progress and upgraded deck, making it ideal for players who want to focus on gameplay mechanics without narrative immersion while still experiencing meaningful progression and challenge.

Note: The campaign overview's start button text will be `Play` on the first visit and switch to `Play Again` after you've completed a session, matching the behavior of other campaign mode screens.

## Features

- **Three Game Modes**: `Jump Into Task`, `Campaign`, and `Free Play`
- **Interactive Stress Management**: Visual stress meter with zen activities
- **Deck Progression**: Upgrade your blackjack deck with more Aces
- **Multiple Scenarios**: DMV visits, job interviews, and more stress situations
- **Contextual Actions**: Task-specific choices that affect gameplay
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Persistence**: Campaign progress saves automatically

### Deck Upgrades

- **Add Jokers**: Replace random cards with Wild Jokers that automatically calculate optimal values (cost increases with each purchase)
- **Premium Activities**: Unlock advanced stress management techniques like Mindful Breathing and Compartmentalize
- **Persistent Power**: Upgraded decks and unlocked activities carry over to all future tasks and Jump Into Task mode
- **Strategic Investment**: Save zen points for meaningful upgrades

### Progression System

- Tasks unlock sequentially as you complete previous challenges
- Campaign completion unlocks special achievements

## Contributing

If you are interesting in contributing to the project, please check out the [Contributing Guide](./CONTRIBUTING.md)!

## License

This project is open source and available under the MIT License.
