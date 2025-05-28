// Intersection Observer setup for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '50px', // Start animation before elements enter viewport
    threshold: 0.01 // Trigger with minimal visibility
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // entry.target.style.opacity = '1';
            // entry.target.style.transform = 'translateY(0)';
        } else {
            entry.target.classList.remove('animate-in');
            // entry.target.style.opacity = '0';
            // entry.target.style.transform = 'translateY(30px)';
        }
    });
}, observerOptions);

// Function to initialize animations
function initStoryVerseAnimations() {
    // Animate all cards with enhanced effects
    const cards = document.querySelectorAll(`
        .bg-white.rounded-lg.shadow-md,
        .review-card,
        .trending-card,
        .editor-pick-card,
        .hidden-gem-card,
        .mood-card,
        .news-card,
        .blog-card,
        .upcoming-release-card,
        .grid > div
    `);    cards.forEach((card, index) => {
        // Add base animation classes
        card.classList.add(
            'opacity-0',
            'transition-all',
            'duration-300', // Faster duration
            'ease-out', // Smoother easing
        );
        
        // Add transform with minimal delay
        card.style.transform = 'translateY(20px)'; // Reduced distance
        card.style.transitionDelay = `${index * 50}ms`; // Reduced delay between cards
        
        // Add hover effects
        card.classList.add(
            'hover:shadow-xl',
            'hover:-translate-y-1',
            'hover:scale-[1.02]',
            'transition-transform'
        );
        
        observer.observe(card);
    });

    // Animate search suggestions with smoother transitions
    const searchSuggestions = document.getElementById('search-suggestions');
    if (searchSuggestions) {
        searchSuggestions.classList.add(
            'transition-all',
            'duration-500',
            'ease-in-out'
        );
    }

    // Enhance section headings animation
    document.querySelectorAll('section h2').forEach(heading => {
        heading.classList.add(
            'opacity-0',
            'translate-y-4',
            'transition-all',
            'duration-700',
            'ease-out'
        );
        observer.observe(heading);
    });

    // Enhance hero carousel text animations
    document.querySelectorAll('.hero-carousel-item .text-white').forEach(text => {
        text.classList.add(
            'transition-all',
            'duration-1000',
            'ease-in-out'
        );
    });

    // Enhance button animations
    document.querySelectorAll('button').forEach(button => {
        if (button.classList.contains('bg-yellow-400')) {
            button.classList.add(
                'transition-all',
                'duration-300',
                'ease-in-out',
                'hover:scale-105',
                'hover:shadow-md',
                'active:scale-95'
            );
        }
    });

    // Initialize mobile menu animations
    initMobileMenuAnimations();
}

// Function to handle mobile menu animations with improved transitions
function initMobileMenuAnimations() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');

    if (mobileMenu && menuButton) {
        mobileMenu.classList.add(
            'transition-all',
            'duration-500',
            'ease-in-out',
            'transform'
        );
        
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('-translate-y-4');
        });
    }
}

// Function to animate search suggestions with smoother transitions
function toggleSearchSuggestions(show) {
    const suggestions = document.getElementById('search-suggestions');
    if (suggestions) {
        if (show) {
            suggestions.classList.remove('hidden');
            // Use setTimeout to ensure the transition happens after display change
            setTimeout(() => {
                suggestions.classList.remove('opacity-0', '-translate-y-4');
                suggestions.classList.add('opacity-100', 'translate-y-0');
            }, 10);
        } else {
            suggestions.classList.add('opacity-0', '-translate-y-4');
            setTimeout(() => {
                suggestions.classList.add('hidden');
            }, 500); // Match the duration of the transition
        }
    }
}

// Function to animate hero carousel transitions with smoother effects
function animateCarouselSlide(direction) {
    const slides = document.querySelectorAll('.hero-carousel-item');
    
    slides.forEach(slide => {
        const text = slide.querySelector('.text-white');
        if (text) {
            // Fade out with transform
            text.style.opacity = '0';
            text.style.transform = 'translateY(20px)';
            
            // Fade in with delay
            setTimeout(() => {
                text.style.opacity = '1';
                text.style.transform = 'translateY(0)';
            }, 600);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add base transition classes
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        /* Smooth transition base classes */
        .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced hover effects */
        .hover\\:shadow-xl:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
    `;
    document.head.appendChild(style);

    // Initialize animations
    initStoryVerseAnimations();

    // Set up enhanced search input animations
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', () => toggleSearchSuggestions(true));
        searchInput.addEventListener('blur', () => {
            setTimeout(() => toggleSearchSuggestions(false), 200);
        });
    }

    // Set up enhanced carousel animation hooks
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => animateCarouselSlide('prev'));
        nextButton.addEventListener('click', () => animateCarouselSlide('next'));
    }
});