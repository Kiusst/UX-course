
// Carousel functionality
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 7;
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.dot');
        
        this.init();
    }
    
    init() {
        // Event listeners for navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Event listeners for dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play (optional)
        // this.startAutoPlay();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
    
    updateCarousel() {
        // Move the track
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    startAutoPlay() {
        setInterval(() => this.nextSlide(), 5000);
    }
}

// Flip card functionality
function flipCard(cardId) {
    const card = document.getElementById(cardId);
    card.classList.toggle('flipped');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Smooth scroll for internal links
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    new Carousel();
    
    // Set up scroll animations
    const animatedElements = document.querySelectorAll('.section-title, .achievement-card, .flip-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add stagger delay to cards
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
    });
});

// Add touch/swipe support for mobile carousel
let startX = 0;
let isDragging = false;

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
});

document.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
            // Swipe left - next slide
            if (window.carousel) window.carousel.nextSlide();
        } else {
            // Swipe right - previous slide
            if (window.carousel) window.carousel.prevSlide();
        }
    }
    
    isDragging = false;
});

// Expose carousel instance globally for touch events
window.carousel = null;
document.addEventListener('DOMContentLoaded', () => {
    window.carousel = new Carousel();
});
