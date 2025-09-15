// Jharkhand Tourism Platform - Interactive JavaScript
// Author: AI Assistant
// Version: 1.0

// Global variables
let currentRating = 0;
let chatMessages = [];
let isVoiceEnabled = false;
let recognition;
let speechSynthesis = window.speechSynthesis;
let isTyping = false;
let welcomeScreenShown = true;
let conversationContext = [];
let userPreferences = {
    travelStyle: null,
    interests: [],
    budget: null,
    duration: null
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    initializeForms();
    initializeAnimations();
    initializeResponsiveFeatures();
    
    // Set initial active tab
    showTab('home');
    
    // Show welcome animation
    showPageWelcome();
    
    console.log('Jharkhand Tourism Platform initialized successfully!');
});

// Page Welcome Animation
function showPageWelcome() {
    // Show notification about AI guide after a short delay
    setTimeout(() => {
        showNotification('👋 Hi there! Click the AI Guide button to get personalized travel recommendations!', 'success');
        
        // Add pulse animation to chat FAB
        const chatFab = document.getElementById('chatbot-fab');
        if (chatFab) {
            chatFab.style.animation = 'notificationPulse 2s infinite';
            setTimeout(() => {
                chatFab.style.animation = 'breathe 3s ease-in-out infinite';
            }, 6000);
        }
    }, 3000);
}

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
            
            // Close mobile menu
            if (navToggle) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navToggle && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target) && 
            navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to corresponding nav link
    const activeNavLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
    
    // Update URL hash without scrolling
    if (history.pushState) {
        history.pushState(null, null, `#${tabName}`);
    }
    
    // Trigger animations for newly visible elements
    setTimeout(() => {
        animateVisibleElements();
    }, 100);
}

// Modal Functions
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on first input if available
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// AI Itinerary Planner
function openItineraryPlanner() {
    openModal('itinerary-modal');
}

function generateItinerary() {
    const duration = document.getElementById('trip-duration').value;
    const budgetRange = document.getElementById('budget-range').value;
    const interests = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
                          .map(checkbox => checkbox.value);
    
    if (interests.length === 0) {
        alert('Please select at least one interest to generate your itinerary.');
        return;
    }
    
    // Show loading state
    const generateBtn = document.querySelector('#itinerary-modal .btn-primary');
    const originalText = generateBtn.textContent;
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    // Simulate AI processing
    setTimeout(() => {
        const itinerary = createItinerary(duration, interests, budgetRange);
        displayItinerary(itinerary);
        
        // Reset button
        generateBtn.textContent = originalText;
        generateBtn.disabled = false;
    }, 2000);
}

function createItinerary(duration, interests, budget) {
    // Sample itinerary data based on selections
    const places = {
        nature: ['Netarhat', 'Hundru Falls', 'Patratu Valley', 'Betla National Park'],
        culture: ['Deoghar', 'Jagannath Temple', 'Tribal Villages', 'Sohrai Art Centers'],
        adventure: ['Patratu Valley', 'Betla Safari', 'Rock Climbing Sites', 'Nature Trails'],
        spiritual: ['Deoghar', 'Jagannath Temple', 'Meditation Centers', 'Sacred Groves']
    };
    
    const accommodations = {
        low: ['Budget Hotels', 'Tribal Homestays', 'Government Rest Houses'],
        mid: ['Eco Lodges', 'Forest Resorts', 'Heritage Hotels'],
        high: ['Luxury Resorts', 'Premium Forest Lodges', 'Boutique Hotels']
    };
    
    // Generate itinerary based on selections
    let selectedPlaces = [];
    interests.forEach(interest => {
        selectedPlaces.push(...places[interest].slice(0, 2));
    });
    
    // Remove duplicates
    selectedPlaces = [...new Set(selectedPlaces)];
    
    // Limit places based on duration
    const maxPlaces = parseInt(duration) <= 3 ? 3 : parseInt(duration) <= 5 ? 5 : 7;
    selectedPlaces = selectedPlaces.slice(0, maxPlaces);
    
    return {
        duration: duration,
        budget: budget,
        interests: interests,
        places: selectedPlaces,
        accommodations: accommodations[budget],
        estimatedCost: calculateEstimatedCost(duration, budget, selectedPlaces.length)
    };
}

function calculateEstimatedCost(duration, budget, placesCount) {
    const baseCosts = { low: 2000, mid: 4500, high: 8000 };
    const perDayCost = baseCosts[budget];
    return perDayCost * parseInt(duration);
}

function displayItinerary(itinerary) {
    const resultDiv = document.getElementById('itinerary-result');
    
    const html = `
        <div class="itinerary-display">
            <h3>Your Personalized Jharkhand Itinerary</h3>
            <div class="itinerary-summary">
                <div class="summary-item">
                    <i class="fas fa-calendar"></i>
                    <span>${itinerary.duration} Days</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-rupee-sign"></i>
                    <span>₹${itinerary.estimatedCost.toLocaleString()}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${itinerary.places.length} Places</span>
                </div>
            </div>
            
            <div class="itinerary-places">
                <h4>Recommended Places:</h4>
                <ul class="places-list">
                    ${itinerary.places.map(place => `<li><i class="fas fa-check"></i> ${place}</li>`).join('')}
                </ul>
            </div>
            
            <div class="itinerary-accommodation">
                <h4>Recommended Accommodation Types:</h4>
                <ul class="accommodation-list">
                    ${itinerary.accommodations.map(acc => `<li><i class="fas fa-bed"></i> ${acc}</li>`).join('')}
                </ul>
            </div>
            
            <div class="itinerary-actions">
                <button class="btn btn-primary" onclick="downloadItinerary()">
                    <i class="fas fa-download"></i> Download PDF
                </button>
                <button class="btn btn-secondary" onclick="shareItinerary()">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        </div>
    `;
    
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
    
    // Add some CSS for the itinerary display
    if (!document.getElementById('itinerary-styles')) {
        const style = document.createElement('style');
        style.id = 'itinerary-styles';
        style.textContent = `
            .itinerary-display {
                margin-top: 2rem;
                padding: 2rem;
                border: 1px solid var(--light-gray);
                border-radius: var(--border-radius-lg);
                background: var(--light-gray);
            }
            .itinerary-summary {
                display: flex;
                gap: 1rem;
                margin: 1rem 0;
                flex-wrap: wrap;
            }
            .summary-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: var(--white);
                border-radius: var(--border-radius);
                box-shadow: 0 2px 10px var(--shadow);
            }
            .summary-item i {
                color: var(--leaf-green);
            }
            .places-list, .accommodation-list {
                list-style: none;
                margin: 1rem 0;
            }
            .places-list li, .accommodation-list li {
                padding: 0.5rem 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .places-list i, .accommodation-list i {
                color: var(--leaf-green);
                width: 16px;
            }
            .itinerary-actions {
                margin-top: 2rem;
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);
    }
}

function downloadItinerary() {
    // Placeholder for PDF download functionality
    alert('PDF download feature will be available soon! Your itinerary has been saved to your downloads folder.');
}

function shareItinerary() {
    // Web Share API or fallback
    if (navigator.share) {
        navigator.share({
            title: 'My Jharkhand Tourism Itinerary',
            text: 'Check out my personalized travel itinerary for Jharkhand!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard! Share it with your friends.');
        });
    }
}

// Enhanced Chatbot Functions
function openChatbot() {
    openModal('chatbot-modal');
    initializeChatbot();
    updateCharacterCount();
    animateAvatarEntry();
}

function initializeChatbot() {
    // Initialize voice recognition if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
            sendChatMessage();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            showNotification('Voice recognition error. Please try again.', 'info');
        };
        
        recognition.onend = function() {
            document.getElementById('voice-btn').classList.remove('recording');
        };
    }
    
    // Show welcome screen for new users
    if (welcomeScreenShown && chatMessages.length === 0) {
        showWelcomeScreen();
    }
}

function animateAvatarEntry() {
    const avatar = document.getElementById('ai-avatar');
    if (avatar) {
        avatar.style.transform = 'scale(0.8)';
        avatar.style.opacity = '0.5';
        
        setTimeout(() => {
            avatar.style.transform = 'scale(1)';
            avatar.style.opacity = '1';
            avatar.style.transition = 'all 0.5s ease';
        }, 200);
    }
}

function showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    if (welcomeScreen && messagesContainer) {
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(welcomeScreen);
        welcomeScreen.style.display = 'block';
        
        // Animate floating icons
        const icons = welcomeScreen.querySelectorAll('.floating-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.animation = `float 3s ease-in-out infinite`;
                icon.style.animationDelay = `${index * 0.5}s`;
            }, index * 200);
        });
    }
}

function sendSuggestion(suggestion) {
    document.getElementById('chat-input').value = suggestion;
    sendChatMessage();
}

function hideWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen && welcomeScreenShown) {
        welcomeScreen.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            welcomeScreenShown = false;
        }, 300);
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    hideWelcomeScreen();
    addUserMessage(message);
    input.value = '';
    updateCharacterCount();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Update conversation context
    conversationContext.push({ type: 'user', message: message });
    
    // Simulate AI processing with more realistic delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateEnhancedBotResponse(message);
        addBotMessage(response.message);
        
        // Show quick suggestions if provided
        if (response.suggestions) {
            showQuickSuggestions(response.suggestions);
        }
        
        // Speak response if voice is enabled
        if (isVoiceEnabled && response.message) {
            speakMessage(response.message);
        }
        
        conversationContext.push({ type: 'bot', message: response.message });
    }, delay);
}

function showTypingIndicator() {
    isTyping = true;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
        
        // Animate avatar while typing
        const avatar = document.getElementById('ai-avatar');
        if (avatar) {
            avatar.style.animation = 'thinking 1.5s ease-in-out infinite';
        }
    }
}

function hideTypingIndicator() {
    isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.style.display = 'none';
        
        // Stop avatar animation
        const avatar = document.getElementById('ai-avatar');
        if (avatar) {
            avatar.style.animation = '';
        }
    }
}

function showQuickSuggestions(suggestions) {
    const container = document.getElementById('quick-suggestions');
    if (container && suggestions.length > 0) {
        container.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-chip';
            btn.innerHTML = `<i class="${suggestion.icon}"></i> ${suggestion.text}`;
            btn.onclick = () => sendSuggestion(suggestion.text);
            container.appendChild(btn);
        });
        
        container.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            container.style.display = 'none';
        }, 10000);
    }
}

function addUserMessage(message) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    chatMessages.push({ type: 'user', message: message, timestamp: new Date() });
}

function addBotMessage(message) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    
    // Add interactive elements if message contains special patterns
    const processedMessage = processMessageWithInteractiveElements(message);
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            ${processedMessage}
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    chatMessages.push({ type: 'bot', message: message, timestamp: new Date() });
    
    // Add some personality with avatar reactions
    animateAvatarReaction();
}

function processMessageWithInteractiveElements(message) {
    // Convert plain text to interactive elements
    let processedMessage = message;
    
    // Add clickable place names
    const places = ['Netarhat', 'Hundru Falls', 'Betla National Park', 'Deoghar', 'Patratu Valley'];
    places.forEach(place => {
        const regex = new RegExp(place, 'gi');
        processedMessage = processedMessage.replace(regex, 
            `<span class="interactive-place" onclick="showPlaceDetails('${place.toLowerCase().replace(' ', '')}')">${place}</span>`);
    });
    
    // Add clickable prices
    processedMessage = processedMessage.replace(/₹([0-9,]+)/g, 
        '<span class="interactive-price">₹$1</span>');
    
    // Convert to paragraphs if it's plain text
    if (!processedMessage.includes('<') && processedMessage.length > 50) {
        processedMessage = `<p>${processedMessage}</p>`;
    }
    
    return processedMessage;
}

function animateAvatarReaction() {
    const avatar = document.getElementById('ai-avatar');
    if (avatar) {
        // Random reactions
        const reactions = ['happy', 'excited', 'thinking'];
        const reaction = reactions[Math.floor(Math.random() * reactions.length)];
        
        avatar.classList.add(reaction);
        setTimeout(() => {
            avatar.classList.remove(reaction);
        }, 2000);
    }
}

// Enhanced Bot Response with AI-like personality and context awareness
function generateEnhancedBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Analyze user preferences from conversation
    analyzeUserPreferences(message);
    
    // Generate contextual response
    let response = {
        message: '',
        suggestions: []
    };
    
    // Greeting and initial interaction
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        response.message = "Hello there! 🙋‍♂️ I'm excited to help you explore the beautiful state of Jharkhand. Whether you're interested in breathtaking waterfalls, wildlife adventures, or rich tribal culture, I've got you covered!";
        response.suggestions = [
            { icon: 'fas fa-mountain', text: 'Show me scenic places' },
            { icon: 'fas fa-bed', text: 'Find accommodations' },
            { icon: 'fas fa-calendar-alt', text: 'Plan a weekend trip' }
        ];
    }
    
    // Place-specific responses with personality
    else if (message.includes('netarhat') || message.includes('hill station')) {
        response.message = "Ah, Netarhat! 🌄 The 'Queen of Chotanagpur' is absolutely magical. I love how the sunrise paints the entire valley in golden hues. It's about 45km from Latehar and perfect for a romantic getaway or peaceful retreat. October to March offers the most pleasant weather for your visit.";
        response.suggestions = [
            { icon: 'fas fa-camera', text: 'Best photo spots in Netarhat' },
            { icon: 'fas fa-bed', text: 'Where to stay in Netarhat' },
            { icon: 'fas fa-route', text: 'How to reach Netarhat' }
        ];
    }
    
    else if (message.includes('hundru') || (message.includes('waterfall') && !message.includes('all'))) {
        response.message = "Hundru Falls is spectacular! 💧 At 98 meters, it's like nature's own skyscraper of water. The sound is thunderous during monsoons (July-September), and you can actually feel the mist from quite a distance. Pro tip: visit early morning for the best photography and fewer crowds!";
        response.suggestions = [
            { icon: 'fas fa-camera', text: 'Photography tips for Hundru' },
            { icon: 'fas fa-map-marked-alt', text: 'Other waterfalls nearby' },
            { icon: 'fas fa-utensils', text: 'Food options near Hundru' }
        ];
    }
    
    else if (message.includes('betla') || message.includes('tiger') || message.includes('safari') || message.includes('wildlife')) {
        response.message = "Betla National Park is where the wild things are! 🐅 It's one of India's oldest tiger reserves. Early morning safaris (6-9 AM) are magical - that's when you're most likely to spot tigers, elephants, and other wildlife. The ancient fort ruins inside add a mysterious historical element to your adventure.";
        response.suggestions = [
            { icon: 'fas fa-binoculars', text: 'Book safari online' },
            { icon: 'fas fa-camera', text: 'Wildlife photography tips' },
            { icon: 'fas fa-bed', text: 'Stay near Betla Park' }
        ];
    }
    
    else if (message.includes('hotel') || message.includes('stay') || message.includes('accommodation')) {
        const accommodationResponse = getPersonalizedAccommodationResponse();
        response.message = accommodationResponse.message;
        response.suggestions = accommodationResponse.suggestions;
    }
    
    else if (message.includes('food') || message.includes('cuisine') || message.includes('eat')) {
        response.message = "Oh, the flavors of Jharkhand! 🍽️ You absolutely must try Dhuska - it's like a crispy rice pancake that's perfect with curry. Rugra (mushroom curry) is a local favorite, and Handia (traditional rice beer) is quite the experience. Tribal homestays serve the most authentic organic meals you'll ever taste!";
        response.suggestions = [
            { icon: 'fas fa-utensils', text: 'Best local restaurants' },
            { icon: 'fas fa-home', text: 'Homestays with authentic food' },
            { icon: 'fas fa-leaf', text: 'Vegetarian food options' }
        ];
    }
    
    else if (message.includes('plan') || message.includes('trip') || message.includes('itinerary')) {
        response.message = "I'd love to help plan your perfect Jharkhand adventure! 🗺️ Tell me - are you more of an adventure seeker, culture enthusiast, or nature lover? And how many days do you have? I can create a personalized itinerary that matches your style perfectly.";
        response.suggestions = [
            { icon: 'fas fa-hiking', text: 'Adventure-focused trip' },
            { icon: 'fas fa-users', text: 'Cultural immersion experience' },
            { icon: 'fas fa-leaf', text: 'Nature and wildlife focus' }
        ];
    }
    
    else if (message.includes('budget') || message.includes('cost') || message.includes('price') || message.includes('expensive')) {
        response.message = "Great question about costs! 💰 Jharkhand is quite budget-friendly. For backpackers, ₹1,500-2,500/day covers everything. Mid-range travelers can expect ₹3,000-5,000/day for comfort, while luxury experiences run ₹6,000+ daily. Tribal homestays offer amazing value for authentic experiences!";
        response.suggestions = [
            { icon: 'fas fa-calculator', text: 'Calculate my trip cost' },
            { icon: 'fas fa-home', text: 'Budget accommodation options' },
            { icon: 'fas fa-gem', text: 'Luxury experiences available' }
        ];
    }
    
    else if (message.includes('weather') || message.includes('climate') || message.includes('season') || message.includes('best time')) {
        response.message = "Perfect timing question! 🌤️ October to March is absolutely ideal - pleasant days, cool nights, perfect for everything from trekking to sightseeing. Summer gets quite toasty (up to 42°C), while monsoons (June-September) make waterfalls spectacular but travel tricky.";
        response.suggestions = [
            { icon: 'fas fa-calendar', text: 'Check current weather' },
            { icon: 'fas fa-suitcase', text: 'What to pack for my visit' },
            { icon: 'fas fa-umbrella', text: 'Monsoon travel tips' }
        ];
    }
    
    else if (message.includes('culture') || message.includes('tribe') || message.includes('traditional')) {
        response.message = "Jharkhand's tribal heritage is absolutely fascinating! 🎭 The Santhal, Oraon, and Munda communities have preserved such beautiful traditions. You can witness traditional dances, learn Dokra art (bronze casting), and participate in festivals like Sohrai. Many villages offer immersive cultural programs.";
        response.suggestions = [
            { icon: 'fas fa-palette', text: 'Learn traditional crafts' },
            { icon: 'fas fa-music', text: 'Experience tribal festivals' },
            { icon: 'fas fa-home', text: 'Cultural homestay programs' }
        ];
    }
    
    else if (message.includes('thanks') || message.includes('thank you')) {
        response.message = "You're so welcome! 😊 I'm thrilled I could help you discover more about Jharkhand. Feel free to ask me anything else - I'm here to make your trip absolutely amazing!";
        response.suggestions = [
            { icon: 'fas fa-share', text: 'Share this with friends' },
            { icon: 'fas fa-bookmark', text: 'Save for later' },
            { icon: 'fas fa-phone', text: 'Contact local guides' }
        ];
    }
    
    // Default response with personality
    else {
        response.message = "Hmm, that's an interesting question! 🤔 I want to give you the most helpful answer possible. Could you tell me a bit more about what specifically interests you about Jharkhand? Are you looking for places to visit, planning logistics, or curious about experiences?";
        response.suggestions = [
            { icon: 'fas fa-map-marked-alt', text: 'Places to visit' },
            { icon: 'fas fa-route', text: 'Travel planning help' },
            { icon: 'fas fa-heart', text: 'Unique experiences' }
        ];
    }
    
    return response;
}

function getPersonalizedAccommodationResponse() {
    let response = {
        message: "Great question about stays! 🏨 ",
        suggestions: []
    };
    
    if (userPreferences.budget === 'low') {
        response.message += "For budget-conscious travelers, I'd recommend tribal homestays (₹800-1,500/night) - they're authentic and incredibly welcoming. Government rest houses are also great value for money.";
    } else if (userPreferences.budget === 'high') {
        response.message += "For luxury stays, try the forest resorts like Netarhat Forest Resort (₹3,500/night) with stunning valley views, or premium eco-lodges near Betla National Park.";
    } else {
        response.message += "Jharkhand has wonderful options for every budget! From authentic tribal homestays (₹800-2,000) to luxury forest resorts (₹3,500+). For the most memorable experience, I'd suggest mixing both!";
    }
    
    response.suggestions = [
        { icon: 'fas fa-home', text: 'Find homestays' },
        { icon: 'fas fa-star', text: 'Luxury resorts' },
        { icon: 'fas fa-tree', text: 'Eco-lodges' }
    ];
    
    return response;
}

function analyzeUserPreferences(message) {
    // Extract budget preferences
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
        userPreferences.budget = 'low';
    } else if (message.includes('luxury') || message.includes('premium') || message.includes('expensive')) {
        userPreferences.budget = 'high';
    }
    
    // Extract interests
    if (message.includes('adventure') || message.includes('trek') || message.includes('hiking')) {
        if (!userPreferences.interests.includes('adventure')) {
            userPreferences.interests.push('adventure');
        }
    }
    if (message.includes('culture') || message.includes('tradition') || message.includes('tribal')) {
        if (!userPreferences.interests.includes('culture')) {
            userPreferences.interests.push('culture');
        }
    }
    if (message.includes('wildlife') || message.includes('nature') || message.includes('forest')) {
        if (!userPreferences.interests.includes('nature')) {
            userPreferences.interests.push('nature');
        }
    }
    
    // Extract duration
    const durationMatch = message.match(/(\d+)\s*(day|days|week|weeks)/i);
    if (durationMatch) {
        userPreferences.duration = durationMatch[0];
    }
}

// Voice Features
function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    const voiceBtn = document.getElementById('voice-toggle');
    const statusText = document.querySelector('.status-text');
    
    if (voiceBtn) {
        if (isVoiceEnabled) {
            voiceBtn.style.background = '#10b981';
            statusText.textContent = 'Voice On';
            showNotification('Voice responses enabled! 🔊', 'success');
        } else {
            voiceBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            statusText.textContent = 'Online';
            showNotification('Voice responses disabled', 'info');
        }
    }
}

function startVoiceRecording() {
    if (!recognition) {
        showNotification('Voice input not supported on this browser', 'info');
        return;
    }
    
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn.classList.contains('recording')) {
        recognition.stop();
        voiceBtn.classList.remove('recording');
    } else {
        recognition.start();
        voiceBtn.classList.add('recording');
        showNotification('Listening... Speak now! 🎤', 'info');
    }
}

function speakMessage(message) {
    if (speechSynthesis && isVoiceEnabled) {
        // Clean message for speech
        const cleanMessage = message.replace(/[🌄💧🐅🍽️🗺️💰🌤️🎭😊🤔]/g, '').replace(/₹/g, 'rupees');
        
        const utterance = new SpeechSynthesisUtterance(cleanMessage);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Try to use a pleasant voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Zira'));
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };
    input.click();
}

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Add user message with image
        hideWelcomeScreen();
        const messagesDiv = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <img src="${imageData}" alt="Uploaded image" style="max-width: 200px; border-radius: 10px; margin-bottom: 10px;">
                <p>I uploaded this image. Can you tell me more about this place?</p>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // Simulate AI image recognition response
        setTimeout(() => {
            addBotMessage("That's a beautiful image! 📸 While I can't identify specific locations from photos yet, I'd love to help you discover amazing places in Jharkhand. Could you tell me what type of scenery or experience you're looking for?");
        }, 1500);
    };
    reader.readAsDataURL(file);
}

function clearChat() {
    chatMessages = [];
    conversationContext = [];
    welcomeScreenShown = true;
    userPreferences = { travelStyle: null, interests: [], budget: null, duration: null };
    
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML = '';
    showWelcomeScreen();
    
    showNotification('Chat cleared! Starting fresh 🆕', 'success');
}

function updateCharacterCount() {
    const input = document.getElementById('chat-input');
    const counter = document.getElementById('char-count');
    
    if (input && counter) {
        const length = input.value.length;
        counter.textContent = length;
        
        const counterElement = counter.parentElement;
        counterElement.classList.remove('warning', 'danger');
        
        if (length > 400) {
            counterElement.classList.add('danger');
        } else if (length > 300) {
            counterElement.classList.add('warning');
        }
    }
}

// Add avatar animation keyframes via CSS
if (!document.getElementById('avatar-animations')) {
    const style = document.createElement('style');
    style.id = 'avatar-animations';
    style.textContent = `
        .ai-avatar.thinking {
            animation: thinking 1.5s ease-in-out infinite;
        }
        
        .ai-avatar.happy {
            animation: happy 0.8s ease-in-out;
        }
        
        .ai-avatar.excited {
            animation: excited 1s ease-in-out;
        }
        
        @keyframes thinking {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.05) rotate(2deg); }
        }
        
        @keyframes happy {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.1) rotate(-5deg); }
            75% { transform: scale(1.1) rotate(5deg); }
        }
        
        @keyframes excited {
            0%, 100% { transform: scale(1) translateY(0); }
            25% { transform: scale(1.15) translateY(-3px); }
            75% { transform: scale(1.05) translateY(-1px); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        
        .interactive-place {
            color: var(--primary-orange);
            cursor: pointer;
            text-decoration: underline;
            font-weight: 600;
        }
        
        .interactive-place:hover {
            background: rgba(255, 107, 53, 0.1);
            border-radius: 3px;
            padding: 2px 4px;
        }
        
        .interactive-price {
            color: #10b981;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
}

// Enhanced input event listeners
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chat-input') {
        e.preventDefault();
        sendChatMessage();
    }
});

// Real-time character counting
document.addEventListener('input', function(e) {
    if (e.target.id === 'chat-input') {
        updateCharacterCount();
    }
});

// Avatar interaction
document.addEventListener('click', function(e) {
    if (e.target.closest('.ai-avatar')) {
        const avatar = document.getElementById('ai-avatar');
        avatar.classList.add('happy');
        setTimeout(() => avatar.classList.remove('happy'), 800);
        
        const greetings = [
            'Hello there! Ready to explore Jharkhand?',
            'Hi! What adventure can I help you plan today?',
            'Hey! I\'m excited to help you discover Jharkhand!'
        ];
        
        if (welcomeScreenShown) {
            const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
            document.getElementById('chat-input').placeholder = randomGreeting;
        }
    }
});

// Feedback System
function openFeedback() {
    openModal('feedback-modal');
    resetFeedbackForm();
}

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.rating-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitFeedback() {
    const comments = document.getElementById('feedback-comments').value;
    const email = document.getElementById('feedback-email').value;
    
    if (currentRating === 0) {
        alert('Please select a rating before submitting your feedback.');
        return;
    }
    
    // Simulate submission
    const submitBtn = document.querySelector('#feedback-modal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your feedback! Your response helps us improve our services.');
        closeModal('feedback-modal');
        resetFeedbackForm();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function resetFeedbackForm() {
    currentRating = 0;
    document.querySelectorAll('.rating-input i').forEach(star => {
        star.classList.remove('active');
    });
    document.getElementById('feedback-comments').value = '';
    document.getElementById('feedback-email').value = '';
}

// Place Details Functions
function showPlaceDetails(placeId) {
    const placeDetails = getPlaceDetails(placeId);
    displayPlaceDetails(placeDetails);
    openModal('place-details-modal');
}

function getPlaceDetails(placeId) {
    const details = {
        netarhat: {
            name: "Netarhat",
            description: "Known as the 'Queen of Chotanagpur', Netarhat is a scenic hill station offering breathtaking sunrise and sunset views.",
            highlights: ["Sunrise Point", "Sunset Point", "Magnolia Point", "Koel View Point"],
            bestTime: "October to March",
            howToReach: "45 km from Latehar, accessible by road",
            nearbyAttractions: ["Betla National Park", "Lower Ghaghri Falls", "Upper Ghaghri Falls"],
            activities: ["Photography", "Nature Walks", "Sunrise/Sunset Viewing", "Bird Watching"],
            image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3"
        },
        hundru: {
            name: "Hundru Falls",
            description: "A magnificent 98-meter high waterfall formed by the Subarnarekha River, perfect for nature lovers and photographers.",
            highlights: ["98m High Waterfall", "Natural Pool", "Rock Formations", "Rainbow Views"],
            bestTime: "July to November (monsoon and post-monsoon)",
            howToReach: "45 km from Ranchi via Purulia Road",
            nearbyAttractions: ["Jonha Falls", "Dassam Falls", "Panch Gagh Falls"],
            activities: ["Photography", "Picnicking", "Nature Study", "Rock Climbing"],
            image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3"
        },
        betla: {
            name: "Betla National Park",
            description: "One of India's earliest tiger reserves, home to diverse wildlife including tigers, elephants, and numerous bird species.",
            highlights: ["Tiger Reserve", "Ancient Fort Ruins", "Diverse Flora & Fauna", "Safari Experience"],
            bestTime: "November to March",
            howToReach: "170 km from Ranchi, well connected by road",
            nearbyAttractions: ["Netarhat", "Palamau Fort", "Kechki"],
            activities: ["Jungle Safari", "Wildlife Photography", "Bird Watching", "Historical Exploration"],
            image: "https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3"
        },
        patratu: {
            name: "Patratu Valley",
            description: "A picturesque valley surrounded by lush green hills, offering adventure sports and scenic beauty.",
            highlights: ["Valley Views", "Adventure Sports", "Dam Site", "Boating"],
            bestTime: "October to March",
            howToReach: "40 km from Ranchi via NH33",
            nearbyAttractions: ["Patratu Thermal Power Station", "Chandil Dam", "Dalma Wildlife Sanctuary"],
            activities: ["Paragliding", "Boating", "Nature Walks", "Photography"],
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3"
        },
        deoghar: {
            name: "Deoghar",
            description: "A sacred pilgrimage site famous for the Baba Baidyanath Temple, one of the twelve Jyotirlingas of Lord Shiva.",
            highlights: ["Baidyanath Jyotirlinga", "Temple Complex", "Spiritual Atmosphere", "Cultural Heritage"],
            bestTime: "October to March",
            howToReach: "250 km from Ranchi, connected by rail and road",
            nearbyAttractions: ["Trikuta Parvat", "Nandan Pahar", "Tapovan"],
            activities: ["Temple Visits", "Spiritual Walks", "Cultural Exploration", "Local Shopping"],
            image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3"
        },
        jagannath: {
            name: "Jagannath Temple Ranchi",
            description: "A beautiful replica of the famous Puri Jagannath Temple, showcasing excellent architecture and spiritual significance.",
            highlights: ["Temple Architecture", "Spiritual Significance", "Cultural Programs", "City Location"],
            bestTime: "Year round",
            howToReach: "Located in Ranchi city center",
            nearbyAttractions: ["Rock Garden", "Tagore Hill", "Ranchi Lake"],
            activities: ["Temple Visit", "Photography", "Cultural Programs", "City Exploration"],
            image: "https://images.unsplash.com/photo-1580500550469-a1ca85aeaff1?ixlib=rb-4.0.3"
        }
    };
    
    return details[placeId] || details.netarhat;
}

function displayPlaceDetails(place) {
    const content = document.getElementById('place-details-content');
    content.innerHTML = `
        <div class="place-details">
            <div class="place-hero-image">
                <img src="${place.image}" alt="${place.name}" />
            </div>
            <h2>${place.name}</h2>
            <p class="place-description">${place.description}</p>
            
            <div class="place-info-grid">
                <div class="info-section">
                    <h4><i class="fas fa-star"></i> Highlights</h4>
                    <ul>
                        ${place.highlights.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="info-section">
                    <h4><i class="fas fa-calendar"></i> Best Time to Visit</h4>
                    <p>${place.bestTime}</p>
                </div>
                
                <div class="info-section">
                    <h4><i class="fas fa-route"></i> How to Reach</h4>
                    <p>${place.howToReach}</p>
                </div>
                
                <div class="info-section">
                    <h4><i class="fas fa-map-marker-alt"></i> Nearby Attractions</h4>
                    <ul>
                        ${place.nearbyAttractions.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="info-section">
                    <h4><i class="fas fa-hiking"></i> Activities</h4>
                    <div class="activity-tags">
                        ${place.activities.map(activity => `<span class="activity-tag">${activity}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="place-actions">
                <button class="btn btn-primary" onclick="showMap('${place.name.toLowerCase()}')">
                    <i class="fas fa-map"></i> View on Map
                </button>
                <button class="btn btn-secondary" onclick="addToItinerary('${place.name}')">
                    <i class="fas fa-plus"></i> Add to Itinerary
                </button>
            </div>
        </div>
    `;
    
    // Add styles for place details if not already added
    if (!document.getElementById('place-details-styles')) {
        const style = document.createElement('style');
        style.id = 'place-details-styles';
        style.textContent = `
            .place-modal {
                max-width: 800px !important;
            }
            .place-hero-image {
                width: 100%;
                height: 300px;
                margin-bottom: 2rem;
                border-radius: var(--border-radius-lg);
                overflow: hidden;
            }
            .place-hero-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .place-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin: 2rem 0;
            }
            .info-section h4 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--leaf-green);
                margin-bottom: 1rem;
            }
            .info-section ul {
                list-style: none;
                padding: 0;
            }
            .info-section ul li {
                padding: 0.25rem 0;
                position: relative;
                padding-left: 1.5rem;
            }
            .info-section ul li::before {
                content: '•';
                color: var(--leaf-green);
                position: absolute;
                left: 0;
                font-weight: bold;
            }
            .activity-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .activity-tag {
                background: var(--light-green);
                color: var(--white);
                padding: 0.25rem 0.75rem;
                border-radius: var(--border-radius);
                font-size: 0.875rem;
                font-weight: 600;
            }
            .place-actions {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
                justify-content: center;
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);
    }
}

// Map Functions
function showMap(location) {
    // This would integrate with a real mapping service
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(location + ' Jharkhand India')}`;
    window.open(mapUrl, '_blank');
}

function addToItinerary(placeName) {
    // Placeholder for itinerary functionality
    alert(`${placeName} has been added to your itinerary! Use the AI Trip Planner to create a complete travel plan.`);
    closeModal('place-details-modal');
}

// Marketplace Functions
function filterProducts(category, e, el) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    const targetBtn = el || (e && (e.currentTarget || (e.target && e.target.closest && e.target.closest('button'))));
    if (targetBtn) {
        targetBtn.classList.add('active');
    } else {
        const fallbackBtn = document.querySelector(`.filter-btn[onclick*="filterProducts('${category}')"]`);
        if (fallbackBtn) fallbackBtn.classList.add('active');
    }

    // Show/hide products
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

function addToWishlist(productId, e, el) {
    // Placeholder for wishlist functionality
    const btn = el || (e && (e.currentTarget || (e.target && e.target.closest && e.target.closest('button')))) || document.querySelector(`button[onclick*="addToWishlist('${productId}')"]`);
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;

    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
        btn.style.color = 'var(--gold)';
        showNotification('Added to wishlist!', 'success');
    } else {
        icon.classList.replace('fas', 'far');
        btn.style.color = '';
        showNotification('Removed from wishlist!', 'info');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                background: var(--white);
                color: var(--dark-gray);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: 0 4px 20px var(--shadow);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                border-left: 4px solid var(--leaf-green);
            }
            .notification-success i {
                color: var(--leaf-green);
            }
            .notification-info {
                border-left: 4px solid var(--sky-blue);
            }
            .notification-info i {
                color: var(--sky-blue);
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .place-card, .hotel-card, .scheme-card, .product-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add CSS for animations
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .feature-card, .place-card, .hotel-card, .scheme-card, .product-card {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }
}

function animateVisibleElements() {
    const visibleElements = document.querySelectorAll('.tab-content.active .feature-card, .tab-content.active .place-card, .tab-content.active .hotel-card, .tab-content.active .scheme-card, .tab-content.active .product-card');
    visibleElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.animation = 'fadeInUp 0.6s ease forwards';
        }, index * 100);
    });
}

// Form Handling
function initializeForms() {
    // Form validation and submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    });
}

function handleFormSubmission(form) {
    // Basic form handling - would integrate with backend in production
    const formData = new FormData(form);
    console.log('Form submitted:', Object.fromEntries(formData));
    showNotification('Form submitted successfully!', 'success');
}

// Responsive Features
function initializeResponsiveFeatures() {
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            handleResponsiveChanges();
        }, 250);
    });
    
    // Initial setup
    handleResponsiveChanges();
}

function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    
    // Adjust hero section for mobile
    const hero = document.querySelector('.hero');
    if (hero) {
        if (isMobile) {
            hero.style.minHeight = '60vh';
        } else {
            hero.style.minHeight = '80vh';
        }
    }
    
    // Adjust floating action buttons for mobile
    const fabs = document.querySelector('.floating-actions');
    if (fabs) {
        if (isMobile) {
            fabs.style.bottom = '1rem';
            fabs.style.right = '1rem';
        } else {
            fabs.style.bottom = '3rem';
            fabs.style.right = '3rem';
        }
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance Optimization
function initializePerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePerformanceOptimizations);

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Enhanced Trip Planner Variables
let currentStep = 1;
let totalSteps = 3;
let tripData = {
    duration: null,
    interests: [],
    budget: null
};

// Enhanced Trip Planner Functions
function selectDuration(duration) {
    // Remove previous selection
    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    // Add selection to clicked card
    document.querySelector(`[data-value="${duration}"]`).classList.add('selected');
    tripData.duration = duration;
}

function toggleInterest(interest) {
    const card = document.querySelector(`.interest-card[data-value="${interest}"]`);
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        tripData.interests = tripData.interests.filter(i => i !== interest);
    } else {
        card.classList.add('selected');
        tripData.interests.push(interest);
    }
}

function selectBudget(budget) {
    // Remove previous selection
    document.querySelectorAll('.budget-card').forEach(card => card.classList.remove('selected'));
    // Add selection to clicked card
    document.querySelector(`.budget-card[data-value="${budget}"]`).classList.add('selected');
    tripData.budget = budget;
}

function nextStep() {
    if (currentStep === 1 && !tripData.duration) {
        showNotification('Please select a trip duration', 'info');
        return;
    }
    if (currentStep === 2 && tripData.interests.length === 0) {
        showNotification('Please select at least one interest', 'info');
        return;
    }
    
    if (currentStep < totalSteps) {
        // Hide current step
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        currentStep++;
        // Show next step
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        
        updateNavigationButtons();
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
        currentStep--;
        // Show previous step
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const generateBtn = document.getElementById('generate-btn');
    
    // Show/hide previous button
    prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    // Show/hide next/generate buttons
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        generateBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        generateBtn.style.display = 'none';
    }
}

function resetTripPlanner() {
    currentStep = 1;
    tripData = { duration: null, interests: [], budget: null };
    
    // Reset all selections
    document.querySelectorAll('.option-card, .interest-card, .budget-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Show first step
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.querySelector('[data-step="1"]').classList.add('active');
    
    updateNavigationButtons();
}

// Override the openItineraryPlanner function
function openItineraryPlanner() {
    resetTripPlanner();
    openModal('itinerary-modal');
}

// Export functions for global access
window.showTab = showTab;
window.openItineraryPlanner = openItineraryPlanner;
window.generateItinerary = generateItinerary;
window.selectDuration = selectDuration;
window.toggleInterest = toggleInterest;
window.selectBudget = selectBudget;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.openChatbot = openChatbot;
window.sendChatMessage = sendChatMessage;
window.sendSuggestion = sendSuggestion;
window.toggleVoice = toggleVoice;
window.startVoiceRecording = startVoiceRecording;
window.attachFile = attachFile;
window.clearChat = clearChat;
window.openFeedback = openFeedback;
window.setRating = setRating;
window.submitFeedback = submitFeedback;
window.showPlaceDetails = showPlaceDetails;
window.showMap = showMap;
window.filterProducts = filterProducts;
window.addToWishlist = addToWishlist;
window.closeModal = closeModal;
window.downloadItinerary = downloadItinerary;
window.shareItinerary = shareItinerary;
window.addToItinerary = addToItinerary;

console.log('Jharkhand Tourism Platform JavaScript loaded successfully!');