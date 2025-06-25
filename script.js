
// Enhanced Carousel functionality
 document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.square-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const cardWidth = cards[0].offsetWidth + 32; // Ancho + gap (2rem = 32px)
  
  let currentIndex = 0;
  const totalCards = cards.length;

  // Actualiza la posición del carrusel
  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    
    // Actualiza clases activas
    cards.forEach((card, index) => {
      card.classList.toggle('active', index === currentIndex);
    });
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Navegación con botones
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
  });

  // Navegación con puntos
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Inicializar
  updateCarousel();
});

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
