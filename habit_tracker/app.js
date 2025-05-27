// DOM Elements and State initialization
let habits = [];
let currentDate = new Date();
let selectedHabitId = null;
let weeklyChart = null;
let pieChart = null;

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    // Wait for Chart.js to load
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            initializeApp();
        };
        document.head.appendChild(script);
    } else {
        initializeApp();
    }
}

function initializeApp() {
    // Load habits from localStorage
    loadHabits();
    
    // Set up event listeners
    setupEventListeners();
    
    // Generate initial calendar
    generateCalendar(currentDate);
    
    // Update stats
    updateStats();
    
    // Check for notifications
    checkForNotifications();
}

// Storage Functions
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('habits_last_updated', new Date().toISOString());
}

function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    }
    
    // Show the "no habits" message in chart containers if there are no habits
    const chartsContainers = document.querySelectorAll('.chart-container');
    
    if (habits.length === 0) {
        chartsContainers.forEach(container => {
            container.classList.add('flex', 'items-center', 'justify-center');
            container.innerHTML = '<p class="text-center text-gray-500 mt-8">No habits to display</p>';
        });

    }

    renderHabits();
    updateStats();
}

function exportData() {
    if (habits.length === 0) {
        showNotification('No habits to export', 'info');
        return;
    }
    const data = {
        habits: habits,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `habits-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Data exported successfully!', 'success');
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.habits || !Array.isArray(data.habits)) {
                throw new Error('Invalid data format');
            }
            
            if (confirm('This will replace your current habits. Are you sure?')) {
                habits = data.habits;
                saveHabits();
                renderHabits();
                updateStats();
                generateCalendar(currentDate);
                
                showNotification('Data imported successfully!', 'success');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Error importing data. Please check the file format.', 'error');
        }
        
        // Reset file input
        e.target.value = '';
    };
    
    reader.readAsText(file);
}

// Event Listeners
function setupEventListeners() {
    // Habit form
    document.getElementById('habit-form').addEventListener('submit', addHabit);
    
    // Frequency selector
    document.getElementById('habit-frequency').addEventListener('change', function() {
        document.getElementById('custom-frequency-container').classList.toggle('hidden', this.value !== 'custom');
    });
    
    document.getElementById('edit-habit-frequency').addEventListener('change', function() {
        document.getElementById('edit-custom-frequency-container').classList.toggle('hidden', this.value !== 'custom');
    });
    
    // Calendar navigation
    document.getElementById('prev-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
    
    // Export/Import
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', function() {
        document.getElementById('import-file').click();
    });
    
    document.getElementById('import-file').addEventListener('change', importData);
    
    // Edit modal
    document.getElementById('close-edit-modal').addEventListener('click', function() {
        document.getElementById('edit-modal').classList.add('hidden');
    });
    
    document.getElementById('edit-habit-form').addEventListener('submit', saveEditedHabit);
    document.getElementById('delete-habit-btn').addEventListener('click', deleteHabit);
    
    // Close modal when clicking outside
    document.getElementById('edit-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
}

// Habit Management
function addHabit(e) {
    e.preventDefault();
    
    const name = document.getElementById('habit-name').value.trim();
    const frequency = document.getElementById('habit-frequency').value;
    const description = document.getElementById('habit-description').value.trim();
    const icon = document.getElementById('habit-icon').value;
    
    if (!name) {
        showNotification('Please enter a habit name', 'error');
        return;
    }
    
    let target = 1;
    if (frequency === 'weekly') {
        target = 3;
    } else if (frequency === 'monthly') {
        target = 15;
    } else if (frequency === 'custom') {
        target = parseInt(document.getElementById('custom-frequency').value) || 1;
    }
    
    const habit = {
        id: Date.now().toString(),
        name,
        frequency,
        target,
        description,
        icon,
        completions: {},
        createdAt: new Date().toISOString()
    };
    
    habits.push(habit);
    saveHabits();
    renderHabits();
    e.target.reset();
    document.getElementById('custom-frequency-container').classList.add('hidden');
    
    showNotification(`Habit "${name}" added successfully!`, 'success');
    
    updateStats();
    generateCalendar(currentDate);
}

function renderHabits() {
    const habitsList = document.getElementById('habits-list');
    const noHabitsMessage = document.getElementById('no-habits-message');
    const habitsCount = document.getElementById('habits-count');
    
    // Return if required elements are not found
    if (!habitsList || !noHabitsMessage || !habitsCount) {
        console.warn('Required DOM elements for habits list not found');
        return;
    }
    
    habitsList.innerHTML = '';
    
    if (habits.length === 0) {
        noHabitsMessage.classList.remove('hidden');
        habitsCount.textContent = '0';
        return;
    }
    
    noHabitsMessage.classList.add('hidden');
    habitsCount.textContent = habits.length;
    
    habits.forEach(habit => {
        const habitEl = createHabitElement(habit);
        habitsList.appendChild(habitEl);
    });
}

function createHabitElement(habit) {
    const habitEl = document.createElement('div');
    habitEl.className = 'bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow';
    habitEl.dataset.id = habit.id;
    
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.completions[today] === habit.target;
    const isPartialToday = habit.completions[today] > 0 && habit.completions[today] < habit.target;
    const streak = calculateStreak(habit);
    
    habitEl.innerHTML = generateHabitHTML(habit, isCompletedToday, isPartialToday, streak);
    
    // Add event listeners
    const completeBtn = habitEl.querySelector('.complete-habit-btn');
    const editBtn = habitEl.querySelector('.edit-habit-btn');
    const viewCalendarBtn = habitEl.querySelector('.view-calendar-btn');
    
    completeBtn.addEventListener('click', () => toggleHabitCompletion(habit.id));
    editBtn.addEventListener('click', () => openEditModal(habit.id));
    viewCalendarBtn.addEventListener('click', () => scrollToCalendar(habit.id));
    
    return habitEl;
}

function generateHabitHTML(habit, isCompletedToday, isPartialToday, streak) {
    const today = new Date().toISOString().split('T')[0];
    return `
        <div class="bg-gray-50 rounded-lg p-4 transition-shadow flex justify-between items-start">
            <div class="flex items-start gap-3">
                ${habit.icon ? `
                    <div class="bg-blue-100 p-2 rounded-full mt-1">
                        <i class="fas fa-${habit.icon} text-blue-500"></i>
                    </div>
                ` : ''}

                <div>
                    <h3 class="font-semibold">${habit.name}</h3>
                    <p class="text-sm text-gray-600">${habit.description || 'No description'}</p>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs bg-gray-200 px-2 py-1 rounded-full">
                            ${getFrequencyText(habit.frequency, habit.target)}
                        </span>
                        ${streak > 0 ? `
                            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                <i class="fas fa-fire mr-1"></i>${streak} day${streak !== 1 ? 's' : ''}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
            <button class="edit-habit-btn p-2 text-gray-500 hover:text-blue-500">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        </div>
        <div class="mt-3 flex items-center gap-3">
            <progress class="habit-progress flex-1" value="${habit.completions[today] || 0}" max="${habit.target}"></progress>
            <span class="text-sm font-medium">${habit.completions[today] || 0}/${habit.target}</span>
        </div>
        <div class="mt-2 flex justify-between">
            <button class="complete-habit-btn ${
                isCompletedToday ? 'bg-green-500 hover:bg-green-600' : 
                isPartialToday ? 'bg-yellow-500 hover:bg-yellow-600' : 
                'bg-gray-500 hover:bg-gray-600'
            } text-white text-sm px-3 py-1 rounded-lg transition-colors">
                ${isCompletedToday ? 'Completed' : isPartialToday ? 'Partial' : 'Mark Complete'}
            </button>
            <button class="view-calendar-btn text-sm text-blue-500 hover:underline">
                View Calendar
            </button>
        </div>
    `;
}

function toggleHabitCompletion(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    if (!habit.completions[today]) {
        habit.completions[today] = 0;
    }
    
    if (habit.completions[today] >= habit.target) {
        habit.completions[today] = 0;
    } else {
        habit.completions[today]++;
    }
    
    saveHabits();
    renderHabits();
    updateStats();
    generateCalendar(currentDate);
    
    const todayCompletions = habit.completions[today];
    if (todayCompletions === habit.target) {
        showNotification(`Great job! You completed "${habit.name}" for today!`, 'success');
    } else if (todayCompletions > 0) {
        showNotification(`You're making progress on "${habit.name}" (${todayCompletions}/${habit.target})`, 'info');
    }
}

// Calendar Functions
function generateCalendar(date) {
    const calendarContainer = document.getElementById('calendar-container');
    const currentMonthElement = document.getElementById('current-month');
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    currentMonthElement.textContent = new Date(year, month).toLocaleDateString('default', {
        month: 'long',
        year: 'numeric'
    });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let calendarHTML = `
        <div class="grid grid-cols-7 gap-2 mb-2">
            ${daysOfWeek.map(day => `
                <div class="text-center font-semibold text-base py-2 text-blue-700 tracking-wide">${day}</div>
            `).join('')}
        </div>
        <div class="grid grid-cols-7 gap-2">
    `;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="h-12"></div>';
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(year, month, day).toISOString().split('T')[0];
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        
        // Calculate completion status for all habits on this day
        const status = calculateDayStatus(dateStr);
        let statusDot = '';
        if (status.class) {
            statusDot = `<span class="absolute bottom-1 right-1 w-3 h-3 rounded-full shadow-md border-2 border-white ${status.class}"></span>`;
        }
        calendarHTML += `
            <div class="calendar-day relative h-12 w-12 flex items-center justify-center rounded-xl font-medium text-base bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 group ${isToday ? 'ring-2 ring-blue-400' : ''} ${status.class}"
                data-date="${dateStr}">
                <span class="z-10 ${isToday ? 'text-blue-700 font-bold' : 'text-gray-700'}">${day}</span>
                ${statusDot}
                ${isToday ? '<span class="absolute top-0 left-2 text-xs text-blue-400">Today</span>' : ''}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarContainer.innerHTML = calendarHTML;
    
    // Add event listeners to calendar days
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
        dayEl.addEventListener('click', () => showDayDetails(dayEl.dataset.date));
    });
}

function calculateDayStatus(dateStr) {
    if (!habits.length) return { class: '' };
    
    let completed = 0;
    let partial = 0;
    
    habits.forEach(habit => {
        const completions = habit.completions[dateStr] || 0;
        if (completions >= habit.target) {
            completed++;
        } else if (completions > 0) {
            partial++;
        }
    });
    
    if (completed === habits.length) {
        return { class: 'bg-green-500' };
    } else if (completed > 0 || partial > 0) {
        return { class: 'bg-yellow-500' };
    } else if (new Date(dateStr) < new Date().setHours(0,0,0,0)) {
        return { class: 'bg-red-500' };
    }
    
    return { class: '' };
}

function showDayDetails(dateStr) {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('default', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    let detailsHTML = `
        <h3 class="font-semibold mb-2">${formattedDate}</h3>
        <div class="space-y-2">
    `;
    
    habits.forEach(habit => {
        const completions = habit.completions[dateStr] || 0;
        const isCompleted = completions >= habit.target;
        const isPartial = completions > 0 && completions < habit.target;
        
        detailsHTML += `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-2">
                    ${habit.icon ? `<i class="fas fa-${habit.icon} text-blue-500"></i>` : ''}
                    <span>${habit.name}</span>
                </div>
                <span class="text-sm font-medium ${isCompleted ? 'text-green-500' : isPartial ? 'text-yellow-500' : 'text-red-500'}">
                    ${completions}/${habit.target}
                </span>
            </div>
        `;
    });
    
    detailsHTML += '</div>';
    showNotification(detailsHTML, 'info', true);
}

// Stats and Analytics
function updateStats() {
    const currentStreakElement = document.getElementById('current-streak');
    const habitsCompletedElement = document.getElementById('habits-completed');
    const successRateElement = document.getElementById('success-rate');
    
    if (habits.length === 0) {
        currentStreakElement.textContent = '0 days';
        habitsCompletedElement.textContent = '0';
        successRateElement.textContent = '0%';
        return;
    }
    
    // Calculate longest current streak
    const maxStreak = Math.max(...habits.map(calculateStreak));
    currentStreakElement.textContent = `${maxStreak} day${maxStreak !== 1 ? 's' : ''}`;
    
    // Calculate habits completed today
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => (h.completions[today] || 0) >= h.target).length;
    
    habitsCompletedElement.textContent = `${completedToday}/${habits.length}`;
    
    // Calculate success rate
    const rate = Math.round((completedToday / habits.length) * 100);
    successRateElement.textContent = `${rate}%`;
    
    // Update charts
    updateCharts();
}

function calculateStreak(habit) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const completions = habit.completions[dateStr] || 0;
        
        if (completions >= habit.target) {
            streak++;
        } else {
            break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
        
        // Prevent infinite loops
        if (streak > 100) break;
    }
    
    return streak;
}

// Charts
function initializeCharts() {
    // Clear any existing charts first
    if (weeklyChart) {
        weeklyChart.destroy();
        weeklyChart = null;
    }
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet');
        return;
    }
    
    // Set default Chart.js options for both light and dark themes
    Chart.defaults.color = '#4B5563';
    Chart.defaults.borderColor = '#E5E7EB';
    
    // Update both charts
    updateCharts();
}

function updateCharts() {
    // Clean up any existing charts
    if (weeklyChart) {
        weeklyChart.destroy();
        weeklyChart = null;
    }
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }
    
    // Then update both charts
    updateWeeklyChart();
    updatePieChart();
}

function updateWeeklyChart() {
    console.log('Updating weekly chart with habits:',);
    const ctx = document.getElementById('weekly-chart');
    if (!ctx || !ctx.getContext) return;
    
    // Double check cleanup
    if (weeklyChart) {
        weeklyChart.destroy();
        weeklyChart = null;
    }

    if (habits.length === 0) {
        // Create a "no data" message
        const container = ctx.parentElement;
        container.innerHTML = '<p class="text-center text-gray-500 mt-8">No habits to display</p>';
        return;
    }
    
    const labels = [];
    const completedData = [];
    const totalData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        labels.push(date.toLocaleDateString('default', { weekday: 'short' }));
        
        const completed = habits.filter(h => (h.completions[dateStr] || 0) >= h.target).length;
        completedData.push(completed);
        totalData.push(habits.length);
    }
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Completed',
                data: completedData,
                backgroundColor: '#3B82F6',
                borderRadius: 4
            }, {
                label: 'Total Habits',
                data: totalData,
                backgroundColor: '#E5E7EB',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(habits.length, 5),
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function updatePieChart() {
    const ctx = document.getElementById('pie-chart');
    if (!ctx) return;
    
    if (pieChart) {
        pieChart.destroy();
    }
    
    if (habits.length === 0) {
        // Create a "no data" message
        const container = ctx.parentElement;
        container.innerHTML = '<p class="text-center text-gray-500 mt-8">No habits to display</p>';
        return;
    }
    
    const frequencies = habits.reduce((acc, habit) => {
        acc[habit.frequency] = (acc[habit.frequency] || 0) + 1;
        return acc;
    }, {});
    
    const data = [];
    const labels = [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
    
    Object.entries(frequencies).forEach(([freq, count], i) => {
        labels.push(getFrequencyText(freq));
        data.push(count);
    });
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#6B7280' }
                }
            }
        }
    });
}

// UI Functions
function showNotification(message, type = 'info', isHTML = false) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification bg-white rounded-lg shadow-lg p-4 w-80 border-l-4 ${
        type === 'error' ? 'border-red-500' :
        type === 'success' ? 'border-green-500' :
        type === 'warning' ? 'border-yellow-500' :
        'border-blue-500'
    }`;
    
    if (isHTML) {
        notification.innerHTML = message;
    } else {
        notification.textContent = message;
    }
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function checkForNotifications() {
    const lastNotification = localStorage.getItem('last_daily_notification');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastNotification !== today) {
        const now = new Date();
        const notificationTime = new Date();
        notificationTime.setHours(9, 0, 0, 0);
        
        if (now >= notificationTime && habits.length > 0) {
            const incompleteHabits = habits.filter(h => {
                const todayStr = new Date().toISOString().split('T')[0];
                return (h.completions[todayStr] || 0) < h.target;
            });
            
            if (incompleteHabits.length > 0) {
                showNotification(
                    `Don't forget to complete your habits today! You have ${incompleteHabits.length} habit${incompleteHabits.length !== 1 ? 's' : ''} remaining.`,
                    'info'
                );
                localStorage.setItem('last_daily_notification', today);
            }
        }
    }
}

// Helper Functions
function getFrequencyText(frequency, target) {
    switch (frequency) {
        case 'daily': return 'Daily';
        case 'weekly': return '3x/week';
        case 'monthly': return '15x/month';
        case 'custom': return `${target}x/week`;
        default: return frequency;
    }
}

// Habit Management Continued
function openEditModal(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    selectedHabitId = habitId;
    
    document.getElementById('edit-habit-id').value = habit.id;
    document.getElementById('edit-habit-name').value = habit.name;
    document.getElementById('edit-habit-frequency').value = habit.frequency;
    document.getElementById('edit-habit-description').value = habit.description || '';
    document.getElementById('edit-habit-icon').value = habit.icon || '';
    
    if (habit.frequency === 'custom') {
        document.getElementById('edit-custom-frequency').value = habit.target;
        document.getElementById('edit-custom-frequency-container').classList.remove('hidden');
    } else {
        document.getElementById('edit-custom-frequency-container').classList.add('hidden');
    }
    
    document.getElementById('edit-modal').classList.remove('hidden');
}

function saveEditedHabit(e) {
    e.preventDefault();
    
    const habit = habits.find(h => h.id === selectedHabitId);
    if (!habit) return;
    
    const name = document.getElementById('edit-habit-name').value.trim();
    const frequency = document.getElementById('edit-habit-frequency').value;
    const description = document.getElementById('edit-habit-description').value.trim();
    const icon = document.getElementById('edit-habit-icon').value;
    
    if (!name) {
        showNotification('Please enter a habit name', 'error');
        return;
    }
    
    let target = 1;
    if (frequency === 'weekly') {
        target = 3;
    } else if (frequency === 'monthly') {
        target = 15;
    } else if (frequency === 'custom') {
        target = parseInt(document.getElementById('edit-custom-frequency').value) || 1;
    }
    
    habit.name = name;
    habit.frequency = frequency;
    habit.target = target;
    habit.description = description;
    habit.icon = icon;
    
    saveHabits();
    renderHabits();
    document.getElementById('edit-modal').classList.add('hidden');
    
    showNotification('Habit updated successfully!', 'success');
    
    updateStats();
    generateCalendar(currentDate);
}

function deleteHabit() {
    if (!selectedHabitId) return;
    
    if (confirm('Are you sure you want to delete this habit? This cannot be undone.')) {
        habits = habits.filter(h => h.id !== selectedHabitId);
        saveHabits();
        renderHabits();
        document.getElementById('edit-modal').classList.add('hidden');
        
        showNotification('Habit deleted successfully', 'success');
        
        updateStats();
        generateCalendar(currentDate);
    }
}

function scrollToCalendar(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(dayEl => {
        dayEl.classList.remove('ring-2', 'ring-blue-500');
        
        if (dayEl.dataset.date === today) {
            dayEl.classList.add('ring-2', 'ring-blue-500');
            
            // Scroll to the calendar day
            dayEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}
