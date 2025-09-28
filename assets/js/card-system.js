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

// Create a custom deck with specified Ace count
export function createCustomDeck(deckComposition) {
    try {
        const { aces, totalCards } = deckComposition;
        
        // Validate input
        if (aces < 4 || aces > totalCards || totalCards < 52) {
            console.warn('Invalid deck composition, using standard deck');
            return createDeck();
        }
        
        const deck = [];
        const extraAces = aces - 4; // Additional aces beyond standard 4
        
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
        
        // Add extra aces by replacing random non-ace cards
        if (extraAces > 0) {
            const nonAceCards = deck.filter(card => card.value !== 'A');
            
            for (let i = 0; i < extraAces && nonAceCards.length > 0; i++) {
                // Find a random non-ace card to replace
                const randomIndex = Math.floor(Math.random() * nonAceCards.length);
                const cardToReplace = nonAceCards[randomIndex];
                
                // Find this card in the main deck and replace it
                const deckIndex = deck.findIndex(card => 
                    card.suit === cardToReplace.suit && card.value === cardToReplace.value
                );
                
                if (deckIndex !== -1) {
                    // Replace with an ace (cycle through suits)
                    const suitIndex = i % suits.length;
                    deck[deckIndex] = {
                        suit: suits[suitIndex],
                        value: 'A',
                        display: 'A' + suits[suitIndex],
                        upgraded: true // Mark as upgraded ace
                    };
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
        faces: 0,
        numbers: 0,
        upgradedAces: 0
    };
    
    deck.forEach(card => {
        if (card.value === 'A') {
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
    const { aces, totalCards } = deckComposition;
    
    return (
        typeof aces === 'number' &&
        typeof totalCards === 'number' &&
        aces >= 4 &&
        aces <= totalCards &&
        totalCards >= 52 &&
        totalCards <= 104 // Reasonable upper limit
    );
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