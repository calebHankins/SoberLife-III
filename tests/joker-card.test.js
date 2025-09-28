// SoberLife III - Joker Card Tests
// Unit tests for Joker card functionality

import { JokerCard, calculateScore, createCustomDeck, getDeckComposition } from '../assets/js/card-system.js';

// Test Joker card creation and basic properties
function testJokerCardCreation() {
    console.log('Testing Joker card creation...');
    
    const joker = new JokerCard();
    
    // Test basic properties
    if (joker.suit !== '🌈') {
        throw new Error('Joker suit should be rainbow emoji');
    }
    
    if (joker.value !== 'JOKER') {
        throw new Error('Joker value should be "JOKER"');
    }
    
    if (joker.display !== '🃏') {
        throw new Error('Joker display should be joker emoji');
    }
    
    if (!joker.isJoker) {
        throw new Error('Joker should have isJoker flag set to true');
    }
    
    if (!joker.upgraded) {
        throw new Error('Joker should be marked as upgraded');
    }
    
    console.log('✅ Joker card creation test passed');
}

// Test Joker value calculation logic
function testJokerValueCalculation() {
    console.log('Testing Joker value calculation...');
    
    const joker = new JokerCard();
    
    // Test perfect 21 scenario
    let value = joker.calculateOptimalValue(15); // Need 6 to reach 21
    if (value !== 6) {
        throw new Error(`Expected 6, got ${value} for perfect 21 scenario`);
    }
    
    // Test maximum value scenario
    value = joker.calculateOptimalValue(5); // Need 16, but max is 11
    if (value !== 11) {
        throw new Error(`Expected 11, got ${value} for maximum value scenario`);
    }
    
    // Test minimum value scenario (avoid bust)
    value = joker.calculateOptimalValue(20); // Need 1 to avoid bust
    if (value !== 1) {
        throw new Error(`Expected 1, got ${value} for minimum value scenario`);
    }
    
    // Test edge case - already at 21
    value = joker.calculateOptimalValue(21); // Already perfect, should use minimum
    if (value !== 1) {
        throw new Error(`Expected 1, got ${value} for already perfect scenario`);
    }
    
    console.log('✅ Joker value calculation test passed');
}

// Test score calculation with Jokers
function testScoreCalculationWithJokers() {
    console.log('Testing score calculation with Jokers...');
    
    // Create test cards
    const regularCard = { value: '10', suit: '♠', display: '10♠' };
    const aceCard = { value: 'A', suit: '♥', display: 'A♥' };
    const joker = new JokerCard();
    
    // Test Joker with regular card (should calculate to reach 21)
    let hand = [regularCard, joker]; // 10 + ? = should be 21
    let score = calculateScore(hand);
    if (score !== 21) {
        throw new Error(`Expected 21, got ${score} for 10 + Joker`);
    }
    if (joker.getCurrentValue() !== 11) {
        throw new Error(`Joker should have calculated value of 11, got ${joker.getCurrentValue()}`);
    }
    
    // Test Joker preventing bust
    joker.resetValue();
    hand = [{ value: 'K', suit: '♠', display: 'K♠' }, { value: 'Q', suit: '♥', display: 'Q♥' }, joker]; // 20 + ?
    score = calculateScore(hand);
    if (score !== 21) {
        throw new Error(`Expected 21, got ${score} for 20 + Joker`);
    }
    if (joker.getCurrentValue() !== 1) {
        throw new Error(`Joker should have calculated value of 1, got ${joker.getCurrentValue()}`);
    }
    
    console.log('✅ Score calculation with Jokers test passed');
}

// Test custom deck creation with Jokers
function testCustomDeckWithJokers() {
    console.log('Testing custom deck creation with Jokers...');
    
    const deckComposition = {
        aces: 4,
        jokers: 2,
        totalCards: 52
    };
    
    const deck = createCustomDeck(deckComposition);
    const composition = getDeckComposition(deck);
    
    if (composition.jokers !== 2) {
        throw new Error(`Expected 2 Jokers, got ${composition.jokers}`);
    }
    
    if (composition.aces !== 4) {
        throw new Error(`Expected 4 Aces, got ${composition.aces}`);
    }
    
    if (composition.total !== 52) {
        throw new Error(`Expected 52 total cards, got ${composition.total}`);
    }
    
    // Verify Jokers are actually JokerCard instances
    const jokers = deck.filter(card => card.isJoker);
    if (jokers.length !== 2) {
        throw new Error(`Expected 2 Joker instances, got ${jokers.length}`);
    }
    
    jokers.forEach(joker => {
        if (!(joker instanceof JokerCard)) {
            throw new Error('Joker should be instance of JokerCard class');
        }
    });
    
    console.log('✅ Custom deck with Jokers test passed');
}

// Test multiple Jokers in same hand
function testMultipleJokers() {
    console.log('Testing multiple Jokers in same hand...');
    
    const joker1 = new JokerCard();
    const joker2 = new JokerCard();
    const regularCard = { value: '5', suit: '♠', display: '5♠' };
    
    // Test two Jokers with a 5 (should calculate to reach 21)
    const hand = [regularCard, joker1, joker2]; // 5 + ? + ? = should be 21
    const score = calculateScore(hand);
    
    if (score !== 21) {
        throw new Error(`Expected 21, got ${score} for 5 + Joker + Joker`);
    }
    
    // Check that Jokers calculated reasonable values
    const joker1Value = joker1.getCurrentValue();
    const joker2Value = joker2.getCurrentValue();
    
    if (joker1Value + joker2Value !== 16) {
        throw new Error(`Jokers should sum to 16, got ${joker1Value} + ${joker2Value} = ${joker1Value + joker2Value}`);
    }
    
    console.log('✅ Multiple Jokers test passed');
}

// Run all tests
export function runJokerCardTests() {
    console.log('🃏 Running Joker Card Tests...');
    
    try {
        testJokerCardCreation();
        testJokerValueCalculation();
        testScoreCalculationWithJokers();
        testCustomDeckWithJokers();
        testMultipleJokers();
        
        console.log('🎉 All Joker Card tests passed!');
        return true;
    } catch (error) {
        console.error('❌ Joker Card test failed:', error.message);
        return false;
    }
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    runJokerCardTests();
}