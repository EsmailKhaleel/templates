// Chart Configuration Module
export class ChartManager {
    constructor() {
        this.charts = new Map();
        this.colors = {
            primary: '#4f46e5',
            success: '#10b981',
            warning: '#f59e0b',
            purple: '#8b5cf6',
            danger: '#ef4444',
            gray: '#64748b',
            info: '#0ea5e9',
            pink: '#ec4899'
        };
        this.mockData = {
            week: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                spending: [400, 350, 500, 450, 600, 800, 700],
            },
            month: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                spending: [2800, 2950, 3100, 2900, 3200, 3400, 3600, 3800, 3500, 3300, 3100, 3000],
            },
            year: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                spending: [32000, 35000, 38000, 42000, 45000, 48000],
            },
            categories: {
                income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Other'],
                incomeData: [5000, 1200, 800, 1500, 300],
                savings: ['Emergency', 'Retirement', 'Vacation', 'Car', 'House'],
                savingsData: [2000, 1500, 500, 800, 1200],
                trends: {
                    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    income: [6500, 7000, 6800, 7200, 7500, 7800],
                    expenses: [5500, 5800, 5600, 6000, 5900, 6200],
                    savings: [1000, 1200, 1200, 1200, 1600, 1600]
                }
            }
        };
    }

    createMonthlySpendingChart(ctx) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.mockData.month.labels,
                datasets: [{
                    label: 'Spending',
                    data: this.mockData.month.spending,
                    borderColor: this.colors.primary,
                    backgroundColor: `${this.colors.primary}33`, // 20% opacity
                    tension: 0.4, // Smooth curve
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => `$${value.toLocaleString()}`
                        }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    createCategoryBreakdownChart(ctx) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Others'],
                datasets: [{
                    data: [35, 20, 15, 10, 10, 10],
                    backgroundColor: Object.values(this.colors),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}%`
                        }
                    }
                }
            }
        });
    }

    createSpendingVsBudgetChart(ctx) {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Others'],
                datasets: [
                    {
                        label: 'Actual',
                        data: [1200, 600, 350, 200, 150, 300],
                        backgroundColor: this.colors.primary
                    },
                    {
                        label: 'Budget',
                        data: [1500, 800, 400, 300, 200, 400],
                        backgroundColor: `${this.colors.gray}4d`
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: $${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `$${value.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    createIncomeSourcesChart(ctx) {
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.mockData.categories.income,
                datasets: [{
                    data: this.mockData.categories.incomeData,
                    backgroundColor: Object.values(this.colors),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.raw.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    createSavingsGoalsChart(ctx) {
        return new Chart(ctx, {
            type: 'radar',
            data: {
                labels: this.mockData.categories.savings,
                datasets: [{
                    label: 'Current Savings',
                    data: this.mockData.categories.savingsData,
                    backgroundColor: `${this.colors.success}33`,
                    borderColor: this.colors.success,
                    pointBackgroundColor: this.colors.success,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: this.colors.success
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: `${this.colors.gray}33`
                        },
                        grid: {
                            color: `${this.colors.gray}33`
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.raw.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    createFinancialTrendsChart(ctx) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.mockData.categories.trends.months,
                datasets: [
                    {
                        label: 'Income',
                        data: this.mockData.categories.trends.income,
                        borderColor: this.colors.success,
                        backgroundColor: `${this.colors.success}33`,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: this.mockData.categories.trends.expenses,
                        borderColor: this.colors.danger,
                        backgroundColor: `${this.colors.danger}33`,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Savings',
                        data: this.mockData.categories.trends.savings,
                        borderColor: this.colors.info,
                        backgroundColor: `${this.colors.info}33`,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: $${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `$${value.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    createCategoryAnalysisChart(ctx) {
        return new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: ['Housing', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping'],
                datasets: [{
                    data: [280, 180, 120, 110, 150, 200],
                    backgroundColor: [
                        `${this.colors.primary}cc`,
                        `${this.colors.success}cc`,
                        `${this.colors.warning}cc`,
                        `${this.colors.purple}cc`,
                        `${this.colors.info}cc`,
                        `${this.colors.pink}cc`
                    ],
                    borderWidth: 1,
                    borderColor: '#fff',
                    hoverBorderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${context.raw.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    initializeCharts() {
        const contexts = {
            monthlySpending: document.getElementById('monthlySpendingChart')?.getContext('2d'),
            categoryBreakdown: document.getElementById('categoryBreakdownChart')?.getContext('2d'),
            spendingVsBudget: document.getElementById('spendingVsBudgetChart')?.getContext('2d'),
            incomeSources: document.getElementById('incomeSourcesChart')?.getContext('2d'),
            savingsGoals: document.getElementById('savingsGoalsChart')?.getContext('2d'),
            financialTrends: document.getElementById('financialTrendsChart')?.getContext('2d'),
            categoryAnalysis: document.getElementById('categoryAnalysisChart')?.getContext('2d')
        };

        if (contexts.monthlySpending) {
            this.charts.set('monthlySpending', this.createMonthlySpendingChart(contexts.monthlySpending));
        }
        if (contexts.categoryBreakdown) {
            this.charts.set('categoryBreakdown', this.createCategoryBreakdownChart(contexts.categoryBreakdown));
        }
        if (contexts.spendingVsBudget) {
            this.charts.set('spendingVsBudget', this.createSpendingVsBudgetChart(contexts.spendingVsBudget));
        }
        if (contexts.incomeSources) {
            this.charts.set('incomeSources', this.createIncomeSourcesChart(contexts.incomeSources));
        }
        if (contexts.savingsGoals) {
            this.charts.set('savingsGoals', this.createSavingsGoalsChart(contexts.savingsGoals));
        }
        if (contexts.financialTrends) {
            this.charts.set('financialTrends', this.createFinancialTrendsChart(contexts.financialTrends));
        }
        if (contexts.categoryAnalysis) {
            this.charts.set('categoryAnalysis', this.createCategoryAnalysisChart(contexts.categoryAnalysis));
        }
    }

    updateChartTheme(isDark) {
        const textColor = isDark ? '#F3F4F6' : '#111827';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

        this.charts.forEach(chart => {
            if (chart.config.type === 'line' || chart.config.type === 'bar') {
                chart.options.scales.y.grid.color = gridColor;
                chart.options.scales.y.ticks.color = textColor;
                chart.options.scales.x.ticks.color = textColor;
            }
            if (chart.config.type === 'doughnut' || chart.config.type === 'pie') {
                chart.options.plugins.legend.labels.color = textColor;
            }
            if (chart.config.type === 'radar') {
                chart.options.scales.r.angleLines.color = gridColor;
                chart.options.scales.r.grid.color = gridColor;
                chart.options.scales.r.pointLabels.color = textColor;
            }
            chart.update('none');
        });
    }

    updateChartPeriod(chartId, period) {
        const chart = this.charts.get(chartId);
        if (!chart) return;

        const data = this.mockData[period];
        if (!data) return;

        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.spending;
        chart.update('none');
    }
}
