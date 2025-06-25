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
        
        // Event listeners for dots - fix pagination to match slides
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
        // Fix: Calculate proper translation for current slide
        const translateX = -this.currentSlide * this.slideWidth;
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Update active states for cards - fix to show current 3 cards
        this.cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index >= this.currentSlide && index < this.currentSlide + this.visibleSlides) {
                card.classList.add('active');
            }
        });
        
        // Fix: Update dots to match current slide position
        this.dots.forEach((dot, index) => {
            dot.classList.remove('active');
            // Show active dot based on current slide group
            if (index === Math.floor(this.currentSlide)) {
                dot.classList.add('active');
            }
        });
        
        // Update button states
        this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentSlide >= this.totalSlides - this.visibleSlides ? '0.5' : '1';
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides - this.visibleSlides) {
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
    
    goToSlide(dotIndex) {
        // Fix: Navigate to correct slide when dot is clicked
        this.currentSlide = dotIndex;
        if (this.currentSlide > this.totalSlides - this.visibleSlides) {
            this.currentSlide = this.totalSlides - this.visibleSlides;
        }
        this.updateCarousel();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentSlide >= this.totalSlides - this.visibleSlides) {
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
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardTop = cardRect.top + scrollTop;
            const cardBottom = cardTop + cardRect.height;
            
            // Calculate if card should be stacked
            const triggerPoint = scrollTop + windowHeight * 0.8;
            
            if (triggerPoint > cardTop) {
                // Card should start stacking
                const stackProgress = Math.min(1, (triggerPoint - cardTop) / (windowHeight * 0.3));
                const stackOffset = index * 10; // Each card stacks 10px higher
                const scaleReduction = index * 0.02; // Each card scales down slightly
                
                card.style.transform = `translateY(-${stackOffset * stackProgress}px) scale(${1 - scaleReduction * stackProgress})`;
                card.style.zIndex = this.cards.length - index; // Higher cards have higher z-index
                card.classList.add('stacked');
            } else {
                // Card is in normal position
                card.style.transform = 'translateY(0) scale(1)';
                card.style.zIndex = index + 1;
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

// Smooth scroll for internal links
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

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
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Space') {
            e.preventDefault();
            // Scroll to next section
            const sections = document.querySelectorAll('section');
            const currentSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top >= 0 && rect.top < window.innerHeight / 2;
            });
            
            if (currentSection) {
                const nextSection = currentSection.nextElementSibling;
                if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedScroll = debounce(() => {
    // Any heavy scroll calculations can go here
}, 10);

window.addEventListener('scroll', debouncedScroll);
