// Common chart options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
            }
        }
    },
    interaction: {
        intersect: false,
        mode: 'index'
    }
};

// Initialize Strength Progress Chart
function initStrengthChart() {
    const strengthCtx = document.getElementById('strengthChart').getContext('2d');
    return new Chart(strengthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Bench Press',
                data: [135, 145, 155, 165, 175, 185],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Squat',
                data: [185, 195, 205, 215, 220, 225],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Deadlift',
                data: [225, 235, 245, 255, 265, 275],
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Weight (lbs)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize Workout Frequency Chart
function initFrequencyChart() {
    const frequencyCtx = document.getElementById('frequencyChart').getContext('2d');
    return new Chart(frequencyCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Workouts',
                data: [1, 0, 1, 1, 0, 1, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            ...commonOptions,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Number of Workouts',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize Body Composition Chart
function initBodyCompChart() {
    const bodyCompCtx = document.getElementById('bodyCompChart').getContext('2d');
    return new Chart(bodyCompCtx, {
        type: 'doughnut',
        data: {
            labels: ['Muscle', 'Fat', 'Other'],
            datasets: [{
                data: [45, 25, 30],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(156, 163, 175, 0.8)'
                ],
                borderWidth: 1,
                borderRadius: 10,
            }]
        },
        options: {
            ...commonOptions,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize Workout Duration Chart
function initDurationChart() {
    const durationCtx = document.getElementById('durationChart').getContext('2d');
    return new Chart(durationCtx, {
        type: 'radar',
        data: {
            labels: ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Flexibility'],
            datasets: [{
                label: 'This Week',
                data: [65, 45, 75, 30, 50],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6',
                borderWidth: 2,
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
                pointHoverRadius: 6
            }, {
                label: 'Last Week',
                data: [55, 40, 65, 35, 45],
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10B981',
                borderWidth: 2,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointHoverRadius: 6
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Initialize Calories Burned Chart
function initCaloriesChart() {
    const caloriesCtx = document.getElementById('caloriesChart').getContext('2d');
    return new Chart(caloriesCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Calories Burned',
                data: [2500, 2800, 3200, 3000],
                borderColor: '#EF4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Calories',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

initStrengthChart();
initFrequencyChart();
initBodyCompChart();
initDurationChart();
initCaloriesChart();
