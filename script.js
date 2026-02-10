/* ========================================
   INTEL SUSTAINABILITY TIMELINE - JAVASCRIPT
   PURE CAROUSEL MODE (NO SCROLLING)
   ======================================== */

// Global state for timeline
const timelineState = {
  currentCard: 0,
  totalCards: 9,
  autoScrollEnabled: true,
  autoScrollInterval: null,
  autoScrollDelay: 5000, // 5 seconds between auto-scrolls
  cardWidth: 0,
  cardHeight: 0,
  cardGap: 30,
  touchStartX: 0,
  touchEndX: 0,
  touchStartY: 0,
  touchEndY: 0
};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait for CSS to be applied and DOM to fully render
  setTimeout(function() {
    initializeCarousel();
    calculateCardDimensions();
    setupScrollListener();
    setupNavigationButtons();
    setupAutoScroll();
    setupTouchSupport();
    setupExploreButton();
    setupFixedNav();
    updateCarouselPosition();
    
    console.log('✅ Carousel initialized', {
      totalCards: timelineState.totalCards,
      cardWidth: timelineState.cardWidth,
      cardGap: timelineState.cardGap
    });
  }, 300);
});

// Recalculate dimensions after all resources (images, etc.) are loaded
window.addEventListener('load', function() {
  // Wait a bit for everything to fully settle
  setTimeout(function() {
    calculateCardDimensions();
    updateCarouselPosition();
    console.log('✅ Page fully loaded - carousel repositioned');
    console.log(`📊 Final dimensions: Card=${timelineState.cardWidth}px, Gap=${timelineState.cardGap}px`);
  }, 100);
});

/* ========================================
   CAROUSEL INITIALIZATION & POSITIONING
   ======================================== */

/**
 * Initialize the carousel by calculating card positions
 */
function initializeCarousel() {
  const timelineContainer = document.getElementById('timeline-container');
  const carouselWrapper = document.getElementById('carousel-wrapper');
  const cards = document.querySelectorAll('.timeline-card');
  
  // Store card references and total count
  timelineState.cards = cards;
  timelineState.container = timelineContainer;
  timelineState.wrapper = carouselWrapper;
  timelineState.totalCards = cards.length;
  
  console.log(`🎠 Carousel initialized with ${timelineState.totalCards} cards`);
}

/**
 * Calculate card dimensions for carousel positioning
 */
function calculateCardDimensions() {
  const cards = document.querySelectorAll('.timeline-card');
  const wrapper = document.getElementById('carousel-wrapper');
  
  if (cards.length > 0 && wrapper) {
    // Get actual card width and height from the DOM
    const cardWidth = cards[0].offsetWidth;
    const cardHeight = cards[0].offsetHeight;
    
    // Ensure we have valid dimensions (should be > 0)
    if (cardWidth === 0) {
      console.warn('⚠️  Card width is 0, cards may not be rendered yet');
      return;
    }
    
    // Get gap from the carousel-wrapper's computed gap property
    const wrapperStyle = window.getComputedStyle(wrapper);
    let gapValue = wrapperStyle.gap;
    
    let gap = 30; // Default gap
    
    // Parse gap value (it could be "30px" or similar)
    if (gapValue && gapValue !== 'normal' && gapValue !== '') {
      const parsedGap = parseInt(gapValue);
      if (!isNaN(parsedGap)) {
        gap = parsedGap;
      }
    }
    
    timelineState.cardWidth = cardWidth;
    timelineState.cardHeight = cardHeight;
    timelineState.cardGap = gap;
    
    console.log(`📏 Card dimensions: Width=${cardWidth}px, Height=${cardHeight}px, Gap=${gap}px`);
  }
}

/**
 * Update carousel position based on current card index
 * Centers the current card in the viewport
 */
function updateCarouselPosition() {
  const wrapper = document.getElementById('carousel-wrapper');
  if (!wrapper) return;
  
  const viewportWidth = window.innerWidth;
  const isMobileLayout = viewportWidth <= 768;
  
  if (isMobileLayout) {
    // Vertical layout on mobile
    const cardHeight = timelineState.cardHeight || 500;
    const gap = timelineState.cardGap || 20;
    
    const cardIndex = timelineState.currentCard;
    const cardPositionInFlow = cardIndex * (cardHeight + gap);
    const cardCenter = cardPositionInFlow + (cardHeight / 2);
    
    // Calculate the offset needed to center this card in viewport
    const viewportCenter = window.innerHeight / 2;
    let offset = cardCenter - viewportCenter;
    
    // Clamp offset to prevent cards from going above the container start
    offset = Math.max(0, offset);
    
    // Apply transform for vertical positioning
    wrapper.style.transform = `translateY(-${offset}px)`;
    
    console.log(`📍 Card ${cardIndex + 1} (VERTICAL): Height=${cardHeight}px | Gap=${gap}px | Transform=-${offset}px`);
  } else {
    // Horizontal layout on desktop
    const cardWidth = timelineState.cardWidth || 340;
    const gap = timelineState.cardGap || 30;
    
    const cardIndex = timelineState.currentCard;
    const cardPositionInFlow = cardIndex * (cardWidth + gap);
    const cardCenter = cardPositionInFlow + (cardWidth / 2);
    
    // Calculate the offset needed to center this card in viewport
    const viewportCenter = viewportWidth / 2;
    const offset = cardCenter - viewportCenter;
    
    // Apply transform for horizontal positioning
    wrapper.style.transform = `translateX(-${offset}px)`;
    
    console.log(`📍 Card ${cardIndex + 1} (HORIZONTAL): Position=${cardCenter}px | Viewport center=${viewportCenter}px | Transform=-${offset}px | Card width=${cardWidth}px | Gap=${gap}px`);
  }
}

/* ========================================
   PROGRESS BAR FUNCTIONALITY
   ======================================== */

/**
 * Update the progress bar based on timeline position
 */
function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const scrollPosition = window.scrollY;
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercentage = Math.min((scrollPosition / windowHeight) * 100, 100);
  
  progressBar.style.width = scrollPercentage + '%';
}

/* ========================================
   FIXED NAVIGATION BAR
   ======================================== */

/**
 * Set up fixed navigation bar updates
 */
function setupFixedNav() {
  // Navigation bar is now title-only
  console.log('✅ Fixed nav initialized');
}

/* ========================================
   AUTO-SCROLL CAROUSEL FUNCTIONALITY
   ======================================== */

/**
 * Move to a specific card in the carousel
 */
function goToCard(cardIndex) {
  // Use modulo for infinite carousel looping
  timelineState.currentCard = ((cardIndex % timelineState.totalCards) + timelineState.totalCards) % timelineState.totalCards;
  
  // Ensure dimensions are calculated (they might not be on first calls)
  if (timelineState.cardWidth === 0) {
    calculateCardDimensions();
  }
  
  updateCarouselPosition();
  updateNavigationButtonStates();
}

/**
 * Move to the next card
 */
function nextCard() {
  goToCard(timelineState.currentCard + 1);
}

/**
 * Move to the previous card
 */
function previousCard() {
  goToCard(timelineState.currentCard - 1);
}

/**
 * Set up auto-scroll for the timeline carousel
 * Automatically advances to the next card
 */
function setupAutoScroll() {
  clearInterval(timelineState.autoScrollInterval);
  
  if (!timelineState.autoScrollEnabled) return;
  
  timelineState.autoScrollInterval = setInterval(function() {
    if (timelineState.autoScrollEnabled) {
      nextCard();
    }
  }, timelineState.autoScrollDelay);
  
  console.log(`⏱ Auto-scroll enabled. Advancing every ${timelineState.autoScrollDelay}ms`);
}

/**
 * Pause auto-scroll when user manually interacts
 */
function pauseAutoScrollOnInteraction() {
  if (!timelineState.autoScrollEnabled) return;
  
  clearInterval(timelineState.autoScrollInterval);
  
  // Resume after user stops interacting (5 seconds delay)
  setTimeout(function() {
    if (timelineState.autoScrollEnabled) {
      setupAutoScroll();
    }
  }, 5000);
  
  console.log('⏸ Auto-scroll paused due to user interaction');
}

/* ========================================
   SCROLL EVENT LISTENERS
   ======================================== */

/**
 * Set up scroll event listener for progress bar and parallax
 */
function setupScrollListener() {
  window.addEventListener('scroll', function() {
    updateProgressBar();
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero-section');
    const scrollPosition = window.scrollY;
    
    if (hero) {
      hero.style.backgroundPosition = `0 ${scrollPosition * 0.3}px`;
    }
  });
}

/* ========================================
   NAVIGATION BUTTONS FUNCTIONALITY
   ======================================== */

/**
 * Set up left and right scroll buttons for timeline navigation
 */
function setupNavigationButtons() {
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');

  console.log('🔍 Looking for scroll buttons...', {
    leftBtn: scrollLeftBtn ? '✓ Found' : '✗ Not found',
    rightBtn: scrollRightBtn ? '✓ Found' : '✗ Not found'
  });

  if (!scrollLeftBtn || !scrollRightBtn) {
    console.error('❌ Navigation buttons not found in DOM');
    return;
  }

  // Left button - previous card
  scrollLeftBtn.addEventListener('click', function(e) {
    console.log('⬅️ Left button clicked');
    e.preventDefault();
    pauseAutoScrollOnInteraction();
    previousCard();
  });

  // Right button - next card
  scrollRightBtn.addEventListener('click', function(e) {
    console.log('➡️ Right button clicked');
    e.preventDefault();
    pauseAutoScrollOnInteraction();
    nextCard();
  });

  console.log('✅ Navigation buttons set up successfully');
  
  // Initial button state
  updateNavigationButtonStates();
}

/**
 * Update navigation button visibility and state
 */
function updateNavigationButtonStates() {
  // For infinite carousel, buttons are always enabled
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');
  
  if (!scrollLeftBtn || !scrollRightBtn) return;

  // Keep buttons always enabled for infinite carousel
  scrollLeftBtn.style.opacity = '1';
  scrollLeftBtn.style.pointerEvents = 'auto';
  
  scrollRightBtn.style.opacity = '1';
  scrollRightBtn.style.pointerEvents = 'auto';
}

/* ========================================
   TOUCH/SWIPE SUPPORT FOR MOBILE
   ======================================== */

/**
 * Set up touch support for swiping on mobile
 */
function setupTouchSupport() {
  const timelineContainer = document.getElementById('timeline-container');
  if (!timelineContainer) return;

  timelineContainer.addEventListener('touchstart', function(e) {
    timelineState.touchStartX = e.changedTouches[0].screenX;
    timelineState.touchStartY = e.changedTouches[0].screenY;
  }, false);

  timelineContainer.addEventListener('touchend', function(e) {
    timelineState.touchEndX = e.changedTouches[0].screenX;
    timelineState.touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, false);
}

/**
 * Handle swipe gestures for mobile
 */
function handleSwipe() {
  const swipeThreshold = 50;
  const isMobileLayout = window.innerWidth <= 768;
  
  if (isMobileLayout) {
    // Vertical swiping on mobile
    const verticalDifference = timelineState.touchStartY - timelineState.touchEndY;
    pauseAutoScrollOnInteraction();
    
    if (Math.abs(verticalDifference) > swipeThreshold) {
      if (verticalDifference > 0) {
        // Swiped up - next card
        nextCard();
      } else {
        // Swiped down - previous card
        previousCard();
      }
    }
  } else {
    // Horizontal swiping on desktop
    const horizontalDifference = timelineState.touchStartX - timelineState.touchEndX;
    pauseAutoScrollOnInteraction();
    
    if (Math.abs(horizontalDifference) > swipeThreshold) {
      if (horizontalDifference > 0) {
        // Swiped left - next card
        nextCard();
      } else {
        // Swiped right - previous card
        previousCard();
      }
    }
  }
}

/* ========================================
   EXPLORE BUTTON FUNCTIONALITY
   ======================================== */

/**
 * Set up explore button to scroll to timeline
 */
function setupExploreButton() {
  const ctaButton = document.querySelector('.cta-button');
  
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      // Navigate to first card of carousel
      goToCard(0);
      console.log('🔍 Explore button clicked - navigated to card 1');
    });
  } else {
    console.warn('⚠️ CTA button not found');
  }
}

/* ========================================
   KEYBOARD NAVIGATION
   ======================================== */

/**
 * Keyboard navigation for carousel
 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    pauseAutoScrollOnInteraction();
    previousCard();
    e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    pauseAutoScrollOnInteraction();
    nextCard();
    e.preventDefault();
  }
});

/* ========================================
   CARD INTERACTION FEEDBACK
   ======================================== */

/**
 * Track card interactions and add visual feedback
 */
document.addEventListener('click', function(e) {
  const card = e.target.closest('.timeline-card');
  if (card) {
    pauseAutoScrollOnInteraction();
    
    // Brief highlight effect
    card.style.filter = 'brightness(0.97)';
    setTimeout(function() {
      card.style.filter = 'brightness(1)';
    }, 150);
  }
});

/* ========================================
   WINDOW RESIZE LISTENER
   ======================================== */

/**
 * Recalculate card dimensions on window resize
 */
window.addEventListener('resize', function() {
  calculateCardDimensions();
  updateCarouselPosition();
});

