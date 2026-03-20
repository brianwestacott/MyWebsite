/* ==================================================================================
   UMD CARD MATCHING GAME - JAVASCRIPT
   ==================================================================================
   
   This file contains all the game logic for the UMD-themed card matching game.
   
   ================================================================================== */

// Game state variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let startTime = null;
let timerInterval = null;

// Card data - UMD themed images and emojis
const cardImages = [
    { id: 1, emoji: '🐾', name: 'Bulldog Paw' },
    { id: 2, emoji: '🏒', name: 'Hockey' },
    { id: 3, emoji: '🏫', name: 'Campus' },
    { id: 4, emoji: '🌊', name: 'Lake Superior' },
    { id: 5, emoji: '📚', name: 'Library' },
    { id: 6, emoji: '🎓', name: 'Graduation' },
    { id: 7, emoji: '⛷️', name: 'Skiing' },
    { id: 8, emoji: '🏔️', name: 'Duluth Hills' }
];

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // Add event listeners for reset buttons
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('playAgainBtn').addEventListener('click', resetGame);
});

// Initialize the game
function initGame() {
    // Create pairs of cards (duplicate each card)
    cards = [...cardImages, ...cardImages]
        .map((card, index) => ({
            ...card,
            uniqueId: index,
            matched: false
        }))
        .sort(() => Math.random() - 0.5); // Shuffle the cards
    
    renderCards();
    resetStats();
}

// Render cards to the game board
function renderCards() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    🐶
                </div>
                <div class="card-back">
                    <div style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 100%;">
                        ${card.emoji}
                    </div>
                </div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => flipCard(index));
        gameBoard.appendChild(cardElement);
    });
}

// Flip a card
function flipCard(index) {
    // Start timer on first move
    if (!gameStarted) {
        startGame();
    }
    
    const card = cards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    
    // Prevent flipping if:
    // - Card is already matched
    // - Card is already flipped
    // - Two cards are already flipped
    if (card.matched || cardElement.classList.contains('flipped') || flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    flippedCards.push({ index, card });
    
    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        updateMoves();
        setTimeout(checkMatch, 800);
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [first, second] = flippedCards;
    
    if (first.card.id === second.card.id) {
        // Match found!
        cards[first.index].matched = true;
        cards[second.index].matched = true;
        
        const firstElement = document.querySelector(`[data-index="${first.index}"]`);
        const secondElement = document.querySelector(`[data-index="${second.index}"]`);
        
        firstElement.classList.add('matched');
        secondElement.classList.add('matched');
        
        matchedPairs++;
        updateMatches();
        
        // Check if game is won
        if (matchedPairs === cardImages.length) {
            setTimeout(winGame, 500);
        }
    } else {
        // No match - flip cards back
        const firstElement = document.querySelector(`[data-index="${first.index}"]`);
        const secondElement = document.querySelector(`[data-index="${second.index}"]`);
        
        firstElement.classList.remove('flipped');
        secondElement.classList.remove('flipped');
    }
    
    flippedCards = [];
}

// Start the game timer
function startGame() {
    gameStarted = true;
    startTime = Date.now();
    
    timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer display
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('timer').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update moves display
function updateMoves() {
    document.getElementById('moves').textContent = moves;
}

// Update matches display
function updateMatches() {
    document.getElementById('matches').textContent = `${matchedPairs} / ${cardImages.length}`;
}

// Reset game statistics
function resetStats() {
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    gameStarted = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    document.getElementById('moves').textContent = '0';
    document.getElementById('matches').textContent = `0 / ${cardImages.length}`;
    document.getElementById('timer').textContent = '0:00';
}

// Reset the game
function resetGame() {
    // Hide win message
    document.getElementById('winMessage').classList.add('hidden');
    
    // Reset and reinitialize
    resetStats();
    initGame();
}

// Win the game
function winGame() {
    // Stop the timer
    clearInterval(timerInterval);
    
    // Calculate final time
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update win message
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalTime').textContent = timeString;
    
    // Show win message
    document.getElementById('winMessage').classList.remove('hidden');
}
