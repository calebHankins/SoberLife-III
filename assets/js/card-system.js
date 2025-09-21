// SoberLife III - Card System
// Blackjack game logic and card management

// Card constants
export const suits = ['♠', '♥', '♦', '♣'];
export const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Create a standard deck of cards
export function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({
                suit: suit,
                value: value,
                display: value + suit
            });
        }
    }
    return deck;
}

// Shuffle deck using Fisher-Yates algorithm
export function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Get numeric value of a card for blackjack scoring
export function getCardValue(value) {
    if (value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(value)) return 10;
    return parseInt(value);
}

// Calculate blackjack score for a hand of cards
export function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    for (let card of cards) {
        const value = getCardValue(card.value);
        if (card.value === 'A') {
            aces++;
        }
        score += value;
    }

    // Adjust for aces (convert from 11 to 1 if needed)
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}