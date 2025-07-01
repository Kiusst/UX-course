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

// Mejor clase StackingCards para apilar cartas con GSAP, sin bugs ni visuales raros
class StackingCards {
    constructor() {
        this.cards = document.querySelectorAll('.flip-card.large-card');
        this.container = document.querySelector('.stacking-cards-container');
        this.maxStackOffset = -10; // Máximo desplazamiento vertical entre cartas apiladas (px)
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);

        // Establecer z-index base para evitar superposiciones extrañas
        this.cards.forEach((card, index) => {
            card.style.zIndex = this.cards.length - index;
            // Reset transform para evitar problemas iniciales
            gsap.set(card, { clearProps: "all" });
        });

        // Crear animaciones GSAP para cada carta con ScrollTrigger
        this.cards.forEach((card, index) => {
            const totalCards = this.cards.length;
            const stackOffset = this.maxStackOffset * index; // desplazamiento acumulado
            const scaleFactor = 1 - index * 0.04; // escala progresiva

            gsap.to(card, {
                scrollTrigger: {
                    trigger: this.container,
                    start: "top top",
                    end: () => `+=${window.innerHeight * 2}`, // duración del efecto scroll
                    scrub: 0.7, // suaviza el scrubbing (menos jitter)
                    invalidateOnRefresh: true,
                    // markers: true, // activa para debug visual
                },
                y: -stackOffset,
                scale: scaleFactor,
                ease: "power1.out",
                zIndex: totalCards + index,
                overwrite: "auto",
                // Para evitar que quede visible el botón de atrás de la carta anterior:
                onUpdate: () => {
                    // Si la carta está demasiado "apilada", escondemos el botón frontal para evitar overlap visual
                    const progress = ScrollTrigger.getById(card)?.progress || 0;
                    if(progress > 0.95) {
                        card.querySelector('.flip-card-front').style.visibility = 'hidden';
                    } else {
                        card.querySelector('.flip-card-front').style.visibility = 'visible';
                    }
                }
            });
        });
    }
}

// Intersection Observer para fade-in en secciones
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

document.addEventListener('DOMContentLoaded', () => {

    // Inicializa StackingCards (animación GSAP en cartas)
    const stackingCards = new StackingCards();

    // Animaciones fade-in para elementos estáticos
    const animatedElements = document.querySelectorAll('.section-title, .achievement-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // Animaciones hero al cargar
    gsap.from(".hero-title", {
        duration: 1,
        opacity: 0,
        y: -50,
        ease: "power3.out",
        delay: 0.2,
    });

    gsap.from(".hero-subtitle", {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: "power3.out",
        delay: 0.5,
    });

    gsap.from(".hero-description", {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: "power3.out",
        delay: 0.8,
    });

     gsap.registerPlugin(ScrollTrigger);

    // Scroll automático desde Hero a la siguiente sección
    ScrollTrigger.create({
        trigger: ".hero", // La sección inicial
        start: "top top", // Comienza al inicio del viewport
        end: "bottom top", // Cuando el final de Hero toca el inicio del viewport
        onEnter: () => {
            gsap.to(window, {
                scrollTo: ".flip-cards-section", // Sección destino
                duration: 1.2, // Duración del desplazamiento
                ease: "power2.inOut",
            });
        },
    });


    transitionTimeline
        .to(".hero", {
            opacity: 0,
             y: ".flip-cards-section",
            offsetY: 1,
            ease: "power1.out",
            duration: 1,
        }, 0)
        .fromTo(".flip-cards-section",
            {opacity: 0, y: 50},
            {opacity: 1, y: 0, ease: "power1.out", duration: 1},
            0
        );

});
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Scroll automático desde Hero a la siguiente sección
    ScrollTrigger.create({
        trigger: ".hero", // La sección inicial
        start: "top", // Comienza al inicio del viewport
        end: "bottom top", // Cuando el final de Hero toca el inicio del viewport
        onEnter: () => {
            gsap.to(window, {
                scrollTo: {
                    y: ".flip-cards-section", // Sección destino
                    offsetY: 0, // Ajusta el desplazamiento (px) para posicionar mejor
                },
                duration: 1.2, // Duración del desplazamiento
                ease: "power2.inOut",
            });
        },
    });
});