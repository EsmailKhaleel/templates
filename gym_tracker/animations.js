// Intersection Observer setup for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        } else {
            // Remove animation class when element is out of view
            entry.target.classList.remove('animate-in');
        }
    });
}, observerOptions);

// Function to initialize animations
function initScrollAnimations() {
    // Animate features
    document.querySelectorAll('.feature-card').forEach(card => {
        card.classList.add('animate-fade-up');
        observer.observe(card);
    });

    // Animate exercise cards
    document.querySelectorAll('.exercise-card').forEach(card => {
        card.classList.add('animate-fade-up');
        observer.observe(card);
    });

    // Animate pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.add('animate-fade-up');
        observer.observe(card);
    });

    // Animate testimonials
    document.querySelectorAll('.testimonial-card').forEach(card => {
        card.classList.add('animate-fade-up');
        observer.observe(card);
    });

    // Animate dashboard elements
    initDashboardAnimations();

    // Animate section headings
    document.querySelectorAll('.section-heading').forEach(heading => {
        heading.classList.add('animate-fade-up');
        observer.observe(heading);
    });

    // Initialize dashboard tabs
    initDashboardTabs();
}

// Function to handle dashboard animations
function initDashboardAnimations() {
    // Animate dashboard stats cards
    document.querySelectorAll('.stats-card').forEach(card => {
        card.classList.add('animate-fade-up');
        observer.observe(card);
    });

    // Animate dashboard charts
    document.querySelectorAll('.chart-container').forEach(chart => {
        chart.classList.add('animate-fade-up');
        observer.observe(chart);
    });

    // Animate dashboard table rows
    document.querySelectorAll('.dashboard-table-row').forEach(row => {
        row.classList.add('animate-fade-up');
        observer.observe(row);
    });

    // Animate dashboard progress bars
    document.querySelectorAll('.progress-bar-container').forEach(progress => {
        progress.classList.add('animate-fade-up');
        observer.observe(progress);
    });

    // Animate dashboard calendar days
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.add('animate-fade-up');
        observer.observe(day);
    });
}

// Function to initialize dashboard tabs
function initDashboardTabs() {
    // Set initial active tab
    const summaryTab = document.getElementById('summary-tab');
    const summaryContent = document.getElementById('summary-content');
    
    // Set active tab styles
    summaryTab.classList.remove('text-gray-500', 'border-transparent');
    summaryTab.classList.add('text-blue-600', 'border-blue-600');
    
    // Show summary content
    summaryContent.classList.remove('hidden');
    summaryContent.classList.add('block');
    summaryContent.classList.add('animate-in');
}

// Function to handle tab switching animations
function switchDashboardTab(tabId) {
    const activeContent = document.getElementById(`${tabId}-content`);
    const allContents = document.querySelectorAll('.dashboard-content');
    
    // Remove active class from all contents
    allContents.forEach(content => {
        content.classList.remove('block');
        content.classList.add('hidden');
        content.classList.remove('animate-in');
    });

    // Add active class to selected content
    activeContent.classList.remove('hidden');
    activeContent.classList.add('block');
    
    // Trigger animation for the active content
    setTimeout(() => {
        activeContent.classList.add('animate-in');
    }, 50);

    // Update tab styles
    const allTabs = document.querySelectorAll('[id$="-tab"]');
    allTabs.forEach(tab => {
        tab.classList.remove('text-blue-600', 'border-blue-600');
        tab.classList.add('text-gray-500', 'border-transparent');
    });

    const activeTab = document.getElementById(`${tabId}-tab`);
    activeTab.classList.remove('text-gray-500', 'border-transparent');
    activeTab.classList.add('text-blue-600', 'border-blue-600');
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations); 