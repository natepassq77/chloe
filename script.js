// Global variables
let feedingCount = 0;
let customFavorites = [];
let draggedItem = null;

// Compliments array
const compliments = [
    "You are absolutely amazing, Chloé! Your smile lights up the world! ✨",
    "You have the most beautiful heart, filled with kindness and love! 💖",
    "Your creativity and imagination inspire everyone around you! 🌟",
    "You are stronger and braver than you know, dear Chloé! 🦋",
    "The world is a better place because you're in it! 🌸",
    "Your laughter is like music that brings joy to everyone! 🎵",
    "You have a magical way of making everything more beautiful! ✨",
    "Your gentle spirit and caring nature make you truly special! 💝",
    "You are loved beyond measure, beautiful Chloé! 🌺",
    "Every day you grow more wonderful than the day before! 🌙"
];

// Flower messages
const flowerMessages = {
    lily: "Beautiful lilies, just like you! 🌺",
    bluebell: "Magical bluebells for a magical person! 🔔",
    daffodil: "Sunny daffodils to brighten your day! ☀️",
    shirui: "Rare Shirui lilies, as special as you are! 🌸",
    peony: "Gorgeous peonies, soft and lovely like your heart! 🌸",
    sunflower: "Bright sunflowers that shine as radiantly as you do! 🌻"
};

// DOM Elements
const elements = {
    secretBtn: document.getElementById('secretBtn'),
    complimentModal: document.getElementById('complimentModal'),
    complimentText: document.getElementById('complimentText'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    favoriteInput: document.getElementById('favoriteInput'),
    addFavoriteBtn: document.getElementById('addFavoriteBtn'),
    favoritesList: document.getElementById('favoritesList'),
    favoritesPlaceholder: document.getElementById('favoritesPlaceholder'),
    catZone: document.getElementById('catZone'),
    catStatus: document.getElementById('catStatus'),
    feedingCounter: document.getElementById('feedingCounter'),
    resetBtn: document.getElementById('resetBtn'),
    resetButtonContainer: document.getElementById('resetButtonContainer'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// Utility Functions
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('toast-show');
    
    setTimeout(() => {
        elements.toast.classList.remove('toast-show');
    }, 3000);
}

function getRandomCompliment() {
    return compliments[Math.floor(Math.random() * compliments.length)];
}

function createHeartParticles() {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + 'px';
        heart.style.top = Math.random() * 100 + 'px';
        heart.style.fontSize = '20px';
        heart.style.animation = 'float 2s ease-out forwards';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '10';
        
        elements.catZone.style.position = 'relative';
        elements.catZone.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 2000);
    }
}

// Compliment Modal Functions
function showComplimentModal() {
    const randomCompliment = getRandomCompliment();
    elements.complimentText.textContent = randomCompliment;
    elements.complimentModal.classList.remove('hidden');
}

function hideComplimentModal() {
    elements.complimentModal.classList.add('hidden');
}

// Favorites Functions
function addFavorite() {
    const newFavorite = elements.favoriteInput.value.trim();
    if (newFavorite) {
        customFavorites.push(newFavorite);
        elements.favoriteInput.value = '';
        renderFavorites();
        showToast(`Added "${newFavorite}" to your favorites! 💖`);
    }
}

function removeFavorite(index) {
    customFavorites.splice(index, 1);
    renderFavorites();
}

function renderFavorites() {
    if (customFavorites.length > 0) {
        elements.favoritesList.classList.remove('hidden');
        elements.favoritesPlaceholder.classList.add('hidden');
        
        elements.favoritesList.innerHTML = customFavorites.map((favorite, index) => `
            <div class="bg-pink-800/50 border border-pink-500/30 rounded-full px-4 py-2 text-center font-pacifico text-pink-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                <span>${favorite}</span>
                <button onclick="removeFavorite(${index})" class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-pink-400 hover:text-red-400 p-1 h-auto">
                    ✕
                </button>
            </div>
        `).join('');
    } else {
        elements.favoritesList.classList.add('hidden');
        elements.favoritesPlaceholder.classList.remove('hidden');
    }
}

// Cat Feeding Game Functions
function feedCat(foodName) {
    feedingCount++;
    
    // Animate cat happiness
    elements.catZone.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.catZone.style.transform = 'scale(1)';
    }, 300);
    
    // Update status message
    if (feedingCount === 1) {
        elements.catStatus.textContent = `Yummy ${foodName}! Thank you! 😺`;
    } else if (feedingCount >= 5) {
        elements.catStatus.textContent = "I'm so full and happy! 😻";
    } else {
        elements.catStatus.textContent = `More ${foodName} please! 😸`;
    }
    
    // Update counter
    elements.feedingCounter.textContent = `Fed: ${feedingCount} times`;
    
    // Show reset button
    if (feedingCount > 0) {
        elements.resetButtonContainer.classList.remove('hidden');
    }
    
    // Create heart particles
    createHeartParticles();
}

function resetGame() {
    feedingCount = 0;
    elements.catStatus.textContent = "I'm hungry! 😿";
    elements.feedingCounter.textContent = "Fed: 0 times";
    elements.resetButtonContainer.classList.add('hidden');
    elements.catZone.classList.remove('cat-zone-hover');
}

// Drag and Drop Functions
function handleDragStart(event) {
    const foodType = event.target.getAttribute('data-food');
    if (foodType) {
        event.dataTransfer.setData('text/plain', foodType);
        draggedItem = foodType;
        event.target.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
    }
}

function handleDragEnd(event) {
    draggedItem = null;
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    elements.catZone.classList.add('cat-zone-hover');
}

function handleDragLeave(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        elements.catZone.classList.remove('cat-zone-hover');
    }
}

function handleDrop(event) {
    event.preventDefault();
    elements.catZone.classList.remove('cat-zone-hover');
    
    const droppedFood = event.dataTransfer.getData('text/plain');
    const foodNames = {
        fish: 'Fish',
        milk: 'Milk',
        meat: 'Meat',
        cheese: 'Cheese'
    };
    
    if (droppedFood && foodNames[droppedFood]) {
        feedCat(foodNames[droppedFood]);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Secret button
    elements.secretBtn.addEventListener('click', showComplimentModal);
    
    // Close modal
    elements.closeModalBtn.addEventListener('click', hideComplimentModal);
    elements.complimentModal.addEventListener('click', function(event) {
        if (event.target === elements.complimentModal) {
            hideComplimentModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideComplimentModal();
        }
    });
    
    // Favorites
    elements.addFavoriteBtn.addEventListener('click', addFavorite);
    elements.favoriteInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addFavorite();
        }
    });
    
    // Cat feeding game - reset button
    elements.resetBtn.addEventListener('click', resetGame);
    
    // Drag and drop events for cat zone
    elements.catZone.addEventListener('dragover', handleDragOver);
    elements.catZone.addEventListener('dragleave', handleDragLeave);
    elements.catZone.addEventListener('drop', handleDrop);
    
    // Food items - drag and click events
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(item => {
        // Drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        // Click events (alternative to dragging)
        item.addEventListener('click', function() {
            const foodType = this.getAttribute('data-food');
            const foodNames = {
                fish: 'Fish',
                milk: 'Milk',
                meat: 'Meat',
                cheese: 'Cheese'
            };
            
            if (foodNames[foodType]) {
                feedCat(foodNames[foodType]);
            }
        });
    });
    
    // Flower cards
    const flowerCards = document.querySelectorAll('.flower-card');
    flowerCards.forEach(card => {
        card.addEventListener('click', function() {
            const flowerType = this.getAttribute('data-flower');
            if (flowerMessages[flowerType]) {
                showToast(flowerMessages[flowerType]);
            }
        });
    });
});

// Make functions available globally for inline event handlers
window.removeFavorite = removeFavorite;
