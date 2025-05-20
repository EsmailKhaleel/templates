// Theme Manager Module
export class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupEventListeners();
    }

    loadSavedTheme() {
        const isDark = localStorage.getItem('theme') === 'dark' || 
                      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        this.setTheme(isDark);
    }

    setupEventListeners() {
        this.themeToggle.addEventListener('change', () => this.setTheme(this.themeToggle.checked));
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches);
            }
        });
    }

    setTheme(isDark) {
        this.html.classList.toggle('dark', isDark);
        this.themeToggle.checked = isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
}
