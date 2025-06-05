// Main App Logic
import { ThemeManager } from './modules/theme.js';
import { ChartManager } from './modules/charts.js';

class App {
    constructor() {
        this.themeManager = new ThemeManager();
        this.chartManager = new ChartManager();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.chartManager.initializeCharts();
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        // Update charts when theme changes
        document.getElementById('theme-toggle').addEventListener('change', (e) => {
            this.chartManager.updateChartTheme(e.target.checked);
        });

        // Handle button clicks for chart period changes
        document.querySelectorAll('[data-chart-period]').forEach(button => {
            button.addEventListener('click', (e) => this.handleChartPeriodChange(e));
        });
        // Handle menu toggle for mobile view
        document.querySelector('.menu-toggle').addEventListener('click', () => {
            const menu = document.querySelector('.sidebar');
            menu.classList.toggle('open');
        });
        // Handle close button for mobile menu
        document.querySelector('.menu-close').addEventListener('click', () => {
            const menu = document.querySelector('.sidebar');
            menu.classList.remove('open');
        });
    }    
    handleChartPeriodChange(e) {
        const period = e.target.dataset.chartPeriod;
        const chartId = e.target.closest('[data-chart-container]').dataset.chartContainer;
        
        // Update active state of buttons
        e.target.closest('.flex').querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('bg-indigo-100', btn === e.target);
            btn.classList.toggle('dark:bg-indigo-900', btn === e.target);
            btn.classList.toggle('bg-gray-100', btn !== e.target);
            btn.classList.toggle('dark:bg-gray-700', btn !== e.target);
        });

        // Update chart data based on selected period
        this.chartManager.updateChartPeriod(chartId, period);
    }
}

new App();
