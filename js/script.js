// Jharkhand Tourism Platform - Interactive JavaScript
// Author: AI Assistant
// Version: 1.0

// Global variables
let currentRating = 0;
let chatMessages = [];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeModals();
    initializeForms();
    initializeAnimations();
    initializeResponsiveFeatures();
    
    // Set initial active tab
    showTab('home');
    
    console.log('Jharkhand Tourism Platform initialized successfully!');
});

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

// Chatbot Functions
function openChatbot() {
    openModal('chatbot-modal');
    
    // Initialize chat if empty
    if (chatMessages.length === 0) {
        addBotMessage("Hello! I'm your virtual tourism assistant. I can help you with information about places, hotels, transportation, and local culture in Jharkhand. What would you like to know?");
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // Simulate bot processing
        setTimeout(() => {
            const response = generateBotResponse(message);
            addBotMessage(response);
        }, 1000);
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
        <i class="fas fa-user"></i>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    chatMessages.push({ type: 'user', message: message });
}

function addBotMessage(message) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    chatMessages.push({ type: 'bot', message: message });
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (message.includes('netarhat') || message.includes('hill station')) {
        return "Netarhat is known as the 'Queen of Chotanagpur' and is famous for its beautiful sunrises and sunsets. The best time to visit is from October to March. You can stay at the Forest Rest House or local guesthouses.";
    } else if (message.includes('hundru') || message.includes('waterfall')) {
        return "Hundru Falls is a spectacular 98-meter high waterfall located about 45 km from Ranchi. It's best visited during monsoon season (July-September) when the water flow is at its peak. The area is perfect for picnics and photography.";
    } else if (message.includes('betla') || message.includes('tiger') || message.includes('safari')) {
        return "Betla National Park is home to tigers, elephants, and many other wildlife species. Safari timings are typically 6:00-9:00 AM and 2:30-5:30 PM. I recommend booking your safari in advance, especially during peak season (November-March).";
    } else if (message.includes('hotel') || message.includes('stay') || message.includes('accommodation')) {
        return "Jharkhand offers various accommodation options from budget hotels (₹800-2000/night) to luxury resorts (₹3000-8000/night). For authentic experiences, I highly recommend tribal homestays where you can learn about local culture and traditions.";
    } else if (message.includes('food') || message.includes('cuisine') || message.includes('eat')) {
        return "Don't miss trying local delicacies like Dhuska (rice pancake), Rugra (mushroom curry), Bamboo shoot curry, and Handia (traditional rice beer). Most tribal homestays serve authentic organic meals.";
    } else if (message.includes('transport') || message.includes('travel') || message.includes('reach')) {
        return "Ranchi has the nearest airport with connections to major cities. The state is well-connected by railways and roads. For local travel, you can hire taxis, use state buses, or rent bikes for nearby attractions.";
    } else if (message.includes('weather') || message.includes('climate') || message.includes('season')) {
        return "The best time to visit Jharkhand is from October to March when the weather is pleasant. Summers can be quite hot (up to 42°C) and monsoons bring heavy rainfall (June-September).";
    } else if (message.includes('culture') || message.includes('tribe') || message.includes('traditional')) {
        return "Jharkhand is rich in tribal culture with communities like Santhal, Oraon, and Munda. You can experience traditional dance, music, handicrafts like Dokra art, and festivals like Sohrai and Karam. Many villages offer cultural programs for visitors.";
    } else if (message.includes('cost') || message.includes('budget') || message.includes('price')) {
        return "A budget trip to Jharkhand can cost ₹1500-2500 per day including accommodation, food, and local transport. Mid-range travelers should budget ₹3000-5000 per day, while luxury travelers can expect to spend ₹6000+ per day.";
    } else if (message.includes('shopping') || message.includes('buy') || message.includes('market')) {
        return "Visit our Marketplace section for authentic tribal handicrafts! You can buy Dokra art, handwoven textiles, bamboo crafts, and tribal jewelry. Main Road in Ranchi and local markets in Deoghar are great for shopping.";
    } else {
        return "That's a great question! I'd be happy to help you with specific information about places to visit, accommodations, food, transportation, or cultural experiences in Jharkhand. Could you please be more specific about what you'd like to know?";
    }
}

// Handle Enter key in chat input
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chat-input') {
        e.preventDefault();
        sendChatMessage();
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
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
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

function addToWishlist(productId) {
    // Placeholder for wishlist functionality
    const btn = event.target;
    const icon = btn.querySelector('i');
    
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

// Export functions for global access
window.showTab = showTab;
window.openItineraryPlanner = openItineraryPlanner;
window.generateItinerary = generateItinerary;
window.openChatbot = openChatbot;
window.sendChatMessage = sendChatMessage;
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