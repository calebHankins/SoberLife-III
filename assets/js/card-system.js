// SoberLife III - Card System
// Blackjack game logic and card management

// Card constants
export const suits = ['♠', '♥', '♦', '♣'];
export const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Joker card class with intelligent value calculation
export class JokerCard {
    constructor() {
        this.suit = '🌈';           // Rainbow suit indicator
        this.value = 'JOKER';       // Special value identifier
        this.display = '🃏';        // Joker display character
        this.isJoker = true;        // Flag for easy identification
        this.calculatedValue = null; // Determined dynamically
        this.upgraded = true;       // Mark as upgraded card
    }

    // Calculate optimal value to reach 21 or get as close as possible
    calculateOptimalValue(currentHandTotal, otherCards = []) {
        try {
            // Validate input
            if (typeof currentHandTotal !== 'number' || currentHandTotal < 0) {
                console.warn('Invalid hand total for Joker calculation, using fallback');
                this.calculatedValue = 1;
                return 1;
            }

            const targetScore = 21;
            const neededValue = targetScore - currentHandTotal;

            // Clamp between 1 and 11 (Ace range)
            if (neededValue >= 1 && neededValue <= 11) {
                this.calculatedValue = neededValue;
                return neededValue;
            } else if (neededValue > 11) {
                this.calculatedValue = 11; // Maximum value
                return 11;
            } else {
                this.calculatedValue = 1;  // Minimum value to avoid bust
                return 1;
            }
        } catch (error) {
            console.error('Error calculating Joker value:', error);
            this.calculatedValue = 1; // Safe fallback
            return 1;
        }
    }

    // Get the current calculated value (for display purposes)
    getCurrentValue() {
        return this.calculatedValue || 1;
    }

    // Reset calculated value (for new hands)
    resetValue() {
        this.calculatedValue = null;
    }
}

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

// Create a custom deck with specified Ace and Joker count
export function createCustomDeck(deckComposition) {
    try {
        // Validate input structure
        if (!deckComposition || typeof deckComposition !== 'object') {
            console.warn('Invalid deck composition object, using standard deck');
            return createDeck();
        }

        const { aces, jokers, totalCards } = deckComposition;

        // Validate numeric values
        if (typeof aces !== 'number' || typeof jokers !== 'number' || typeof totalCards !== 'number') {
            console.warn('Invalid deck composition values, using standard deck');
            return createDeck();
        }

        // Validate ranges
        if (aces < 4 || jokers < 0 || (aces + jokers) > totalCards || totalCards < 52) {
            console.warn(`Invalid deck composition ranges (aces: ${aces}, jokers: ${jokers}, total: ${totalCards}), using standard deck`);
            return createDeck();
        }

        const deck = [];
        const extraAces = aces - 4; // Additional aces beyond standard 4
        const totalUpgrades = extraAces + jokers;

        // Create standard deck first
        for (let suit of suits) {
            for (let value of values) {
                deck.push({
                    suit: suit,
                    value: value,
                    display: value + suit
                });
            }
        }

        // Add upgrades (extra aces and jokers) by replacing random non-ace cards
        if (totalUpgrades > 0) {
            const nonAceCards = deck.filter(card => card.value !== 'A');

            for (let i = 0; i < totalUpgrades && nonAceCards.length > 0; i++) {
                // Find a random non-ace card to replace
                const randomIndex = Math.floor(Math.random() * nonAceCards.length);
                const cardToReplace = nonAceCards[randomIndex];

                // Find this card in the main deck and replace it
                const deckIndex = deck.findIndex(card =>
                    card.suit === cardToReplace.suit && card.value === cardToReplace.value
                );

                if (deckIndex !== -1) {
                    if (i < jokers) {
                        // Add Joker card
                        deck[deckIndex] = new JokerCard();
                    } else {
                        // Add extra Ace (cycle through suits)
                        const suitIndex = (i - jokers) % suits.length;
                        deck[deckIndex] = {
                            suit: suits[suitIndex],
                            value: 'A',
                            display: 'A' + suits[suitIndex],
                            upgraded: true // Mark as upgraded ace
                        };
                    }
                }

                // Remove from non-ace list
                nonAceCards.splice(randomIndex, 1);
            }
        }

        return deck;

    } catch (error) {
        console.error('Error creating custom deck:', error);
        return createDeck();
    }
}

// Get deck composition statistics
export function getDeckComposition(deck) {
    const composition = {
        total: deck.length,
        aces: 0,
        jokers: 0,
        faces: 0,
        numbers: 0,
        upgradedAces: 0
    };

    deck.forEach(card => {
        if (card.isJoker) {
            composition.jokers++;
        } else if (card.value === 'A') {
            composition.aces++;
            if (card.upgraded) {
                composition.upgradedAces++;
            }
        } else if (['J', 'Q', 'K'].includes(card.value)) {
            composition.faces++;
        } else {
            composition.numbers++;
        }
    });

    return composition;
}

// Validate deck composition for campaign mode
export function validateDeckComposition(deckComposition) {
    const { aces, jokers, totalCards } = deckComposition;

    return (
        typeof aces === 'number' &&
        typeof jokers === 'number' &&
        typeof totalCards === 'number' &&
        aces >= 4 &&
        jokers >= 0 &&
        (aces + jokers) <= totalCards &&
        totalCards >= 52 &&
        totalCards <= 104 // Reasonable upper limit
    );
}

// Reset all Joker values in a hand (for new hands)
export function resetJokerValues(cards) {
    if (!cards || !Array.isArray(cards)) return;

    cards.forEach(card => {
        if (card.isJoker && typeof card.resetValue === 'function') {
            card.resetValue();
        }
    });
}

// Get all Jokers from a hand
export function getJokersFromHand(cards) {
    if (!cards || !Array.isArray(cards)) return [];
    return cards.filter(card => card.isJoker);
}

// Check if a hand contains any Jokers
export function handContainsJokers(cards) {
    if (!cards || !Array.isArray(cards)) return false;
    return cards.some(card => card.isJoker);
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
export function getCardValue(card) {
    // Handle Joker cards
    if (card.isJoker) {
        return card.getCurrentValue();
    }

    const value = card.value || card;
    if (value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(value)) return 10;
    return parseInt(value);
}

// Calculate blackjack score for a hand of cards with Joker support
export function calculateScore(cards) {
    if (!cards || cards.length === 0) return 0;

    try {
        // First, calculate Joker values intelligently
        const jokers = cards.filter(card => card.isJoker);
        const nonJokers = cards.filter(card => !card.isJoker);

        // Calculate base score from non-Joker cards
        let baseScore = 0;
        let aces = 0;

        for (let card of nonJokers) {
            const value = getCardValue(card);
            if (card.value === 'A') {
                aces++;
            }
            baseScore += value;
        }

        // Adjust aces in base score
        while (baseScore > 21 && aces > 0) {
            baseScore -= 10;
            aces--;
        }

        // Calculate optimal values for Jokers collectively
        let currentScore = baseScore;

        if (jokers.length > 0) {
            // First, check if we can avoid busting with all jokers as 1
            const minPossibleScore = currentScore + jokers.length; // All jokers = 1

            if (minPossibleScore > 21) {
                // Even with all jokers as 1, we bust - set all to 1 (best we can do)
                for (let joker of jokers) {
                    joker.calculatedValue = 1;
                    currentScore += 1;
                }
            } else {
                // We can potentially avoid busting, calculate optimal values
                for (let joker of jokers) {
                    const remainingSpace = 21 - currentScore;

                    if (remainingSpace >= 11) {
                        // We have room for an 11
                        joker.calculatedValue = 11;
                        currentScore += 11;
                    } else if (remainingSpace >= 1) {
                        // Use exactly what we need (or can fit)
                        joker.calculatedValue = Math.max(1, remainingSpace);
                        currentScore += joker.calculatedValue;
                    } else {
                        // No room left, use 1
                        joker.calculatedValue = 1;
                        currentScore += 1;
                    }
                }
            }
        }

        // Final adjustment: if we're still over 21, try to reduce Aces first, then Jokers
        while (currentScore > 21 && aces > 0) {
            currentScore -= 10;
            aces--;
        }

        // If still over 21, reduce Jokers to 1 (they should already be optimized, but double-check)
        while (currentScore > 21 && jokers.length > 0) {
            for (let joker of jokers) {
                if (joker.calculatedValue > 1) {
                    const reduction = Math.min(joker.calculatedValue - 1, currentScore - 21);
                    joker.calculatedValue -= reduction;
                    currentScore -= reduction;
                    if (currentScore <= 21) break;
                }
            }
            break; // Prevent infinite loop
        }

        return currentScore;

    } catch (error) {
        console.error('Error calculating score with Jokers:', error);
        // Fallback to basic calculation
        return calculateScoreBasic(cards);
    }
}

// Fallback basic score calculation (legacy support)
function calculateScoreBasic(cards) {
    let score = 0;
    let aces = 0;

    for (let card of cards) {
        if (card.isJoker) {
            score += 1; // Safe fallback for Jokers
            continue;
        }

        const value = getCardValue(card);
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