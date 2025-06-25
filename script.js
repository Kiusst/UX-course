
// Enhanced Carousel functionality
class EnhancedCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 7;
        this.visibleSlides = 3;
        this.slideWidth = 300 + 32; // card width + gap
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.dot');
        this.cards = document.querySelectorAll('.square-card');
        
        this.init();
    }
    
    init() {
        // Event listeners for navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Event listeners for dots - properly sync with slides
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Auto-play with pause on hover
        this.startAutoPlay();
        this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.track.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Initialize first state
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Calculate proper translation - show all slides properly
        const maxSlideIndex = Math.max(0, this.totalSlides - this.visibleSlides);
        const actualSlide = Math.min(this.currentSlide, maxSlideIndex);
        const translateX = -actualSlide * this.slideWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update active states for cards
        this.cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index >= actualSlide && index < actualSlide + this.visibleSlides) {
                card.classList.add('active');
            }
        });
        
        // Update dots to properly reflect current position
        this.dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentSlide) {
                dot.classList.add('active');
            }
        });
        
        // Update button states - allow navigation to all slides
        this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentSlide >= this.totalSlides - 1 ? '0.5' : '1';
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }
    
    prevSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide >= this.totalSlides - 1) {
                this.currentSlide = 0;
            } else {
                this.currentSlide++;
            }
            this.updateCarousel();
        }, 4000);
    }
    
    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// Flip card functionality
function flipCard(cardId) {
    const card = document.getElementById(cardId);
    card.classList.toggle('flipped');
    
    // Add a subtle animation effect
    card.style.transform = 'scale(1.02)';
    setTimeout(() => {
        card.style.transform = '';
    }, 300);
}

// Fixed Stacking Cards scroll animation
class StackingCards {
    constructor() {
        this.cards = document.querySelectorAll('.flip-card.large-card');
        this.container = document.querySelector('.stacking-cards-container');
        this.init();
    }
    
    init() {
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Set initial z-index values
        this.cards.forEach((card, index) => {
            card.style.zIndex = this.cards.length - index;
        });
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardTop = cardRect.top + scrollTop;
            
            // Calculate when card should start stacking
            const triggerPoint = scrollTop + windowHeight * 0.7;
            
            if (triggerPoint > cardTop) {
                // Card should stack - move it up and scale down slightly
                const stackProgress = Math.min(1, (triggerPoint - cardTop) / (windowHeight * 0.2));
                const stackOffset = index * 20; // Stack each card 20px higher
                const scaleReduction = index * 0.05; // Scale down slightly
                
                card.style.transform = `translateY(-${stackOffset * stackProgress}px) scale(${1 - scaleReduction * stackProgress})`;
                card.style.zIndex = this.cards.length + index; // Reverse z-index for proper stacking
                card.classList.add('stacked');
            } else {
                // Card is in normal position
                card.style.transform = 'translateY(0) scale(1)';
                card.style.zIndex = this.cards.length - index;
                card.classList.remove('stacked');
            }
        });
    }
}

// Enhanced intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add stagger delay for multiple elements
            if (entry.target.classList.contains('achievement-card')) {
                const cards = document.querySelectorAll('.achievement-card');
                cards.forEach((card, index) => {
                    if (card === entry.target) {
                        card.style.transitionDelay = `${index * 0.2}s`;
                    }
                });
            }
        }
    });
}, observerOptions);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize enhanced carousel
    const carousel = new EnhancedCarousel();
    
    // Initialize stacking cards
    const stackingCards = new StackingCards();
    
    // Set up scroll animations
    const animatedElements = document.querySelectorAll('.section-title, .achievement-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Enhanced touch/swipe support for mobile carousel
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    
    const carouselTrack = document.getElementById('carouselTrack');
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        
        // Prevent vertical scrolling when swiping horizontally
        const diffX = Math.abs(currentX - startX);
        const diffY = Math.abs(currentY - startY);
        
        if (diffX > diffY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
            if (diffX > 0) {
                carousel.nextSlide();
            } else {
                carousel.prevSlide();
            }
        }
        
        isDragging = false;
    }, { passive: true });
});
