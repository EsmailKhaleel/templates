// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// Auth modal toggle
function toggleAuthModal(tab = 'signin') {
    const authModal = document.getElementById('auth-modal');
    authModal.classList.toggle('hidden');

    if (tab) {
        switchAuthTab(tab);
    }
}

// Auth tab switching
function switchAuthTab(tab) {
    const signinTab = document.getElementById('signin-tab');
    const registerTab = document.getElementById('register-tab');
    const signinContent = document.getElementById('signin-content');
    const registerContent = document.getElementById('register-content');
    const modalTitle = document.getElementById('auth-modal-title');

    if (tab === 'register') {
        signinTab.classList.remove('active');
        registerTab.classList.add('active');
        signinContent.classList.remove('active');
        registerContent.classList.add('active');
        modalTitle.textContent = 'Create Account';
    } else {
        signinTab.classList.add('active');
        registerTab.classList.remove('active');
        signinContent.classList.add('active');
        registerContent.classList.remove('active');
        modalTitle.textContent = 'Sign In';
    }
}

// Dashboard tab switching
function switchDashboardTab(tabId) {
    // Hide all content sections
    document.querySelectorAll('.dashboard-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active state from all tabs
    document.querySelectorAll('[id$="-tab"]').forEach(tab => {
        tab.classList.remove('text-blue-600', 'border-blue-600');
        tab.classList.add('text-gray-500', 'border-transparent');
    });
    
    // Show selected content
    document.getElementById(`${tabId}-content`).classList.remove('hidden');
    
    // Set active state on selected tab
    const activeTab = document.getElementById(`${tabId}-tab`);
    activeTab.classList.remove('text-gray-500', 'border-transparent');
    activeTab.classList.add('text-blue-600', 'border-blue-600');
}

// Workout modal toggle
function toggleWorkoutModal() {
    const workoutModal = document.getElementById('workout-modal');
    workoutModal.classList.toggle('hidden');
}

// Add exercise to workout
function addExercise() {
    const container = document.getElementById('exercises-container');
    const exerciseCount = container.children.length + 1;

    const exerciseHTML = `
        <div class="exercise-entry bg-gray-50 p-4 rounded-lg mb-4">
            <div class="flex justify-between items-center mb-3">
                <h5 class="font-medium text-dark">Exercise #${exerciseCount}</h5>
                <button type="button" onclick="removeExercise(this)" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                    <select class="exercise-select w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="">Select exercise</option>
                        <option value="bench-press">Bench Press</option>
                        <option value="squat">Squat</option>
                        <option value="deadlift">Deadlift</option>
                        <option value="shoulder-press">Shoulder Press</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sets</label>
                    <input type="number" class="exercise-sets w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                    <input type="number" class="exercise-reps w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                    <input type="number" class="exercise-weight w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" class="exercise-notes w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', exerciseHTML);
}

// Remove exercise from workout
function removeExercise(button) {
    button.closest('.exercise-entry').remove();
}

// Save workout
function saveWorkout() {
    try {
        // Get form elements
        const dateInput = document.getElementById('workout-date');
        const typeInput = document.getElementById('workout-type');
        const nameInput = document.getElementById('workout-name');
        const durationInput = document.getElementById('workout-duration');
        const notesInput = document.getElementById('workout-notes');
        const exercisesContainer = document.getElementById('exercises-container');

        // Check if all required elements exist
        if (!dateInput || !typeInput || !nameInput || !durationInput || !notesInput || !exercisesContainer) {
            console.error('Required form elements not found');
            return;
        }

        // Format date to YYYY-MM-DD
        const date = new Date(dateInput.value);
        const formattedDate = date.toISOString().split('T')[0];

        // Get form data
        const workoutData = {
            date: formattedDate,
            type: typeInput.value,
            name: nameInput.value,
            duration: durationInput.value,
            notes: notesInput.value,
            exercises: []
        };

        // Get all exercises
        const exerciseEntries = exercisesContainer.querySelectorAll('.exercise-entry');
        exerciseEntries.forEach(entry => {
            const select = entry.querySelector('.exercise-select');
            const sets = entry.querySelector('.exercise-sets');
            const reps = entry.querySelector('.exercise-reps');
            const weight = entry.querySelector('.exercise-weight');
            const notes = entry.querySelector('.exercise-notes');

            // Check if all exercise elements exist
            if (!select || !sets || !reps || !weight || !notes) {
                console.error('Exercise form elements not found');
                return;
            }

            const exercise = {
                name: select.value,
                sets: sets.value,
                reps: reps.value,
                weight: weight.value,
                notes: notes.value
            };
            workoutData.exercises.push(exercise);
        });

        // Validate form
        if (!workoutData.date || !workoutData.type || !workoutData.name || !workoutData.duration) {
            alert('Please fill in all required fields');
            return;
        }

        if (workoutData.exercises.length === 0) {
            alert('Please add at least one exercise');
            return;
        }

        // Get existing workouts from localStorage or initialize empty array
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        
        // Add new workout
        workouts.push(workoutData);
        
        // Save to localStorage
        localStorage.setItem('workouts', JSON.stringify(workouts));

        // Close modal and reset form
        toggleWorkoutModal();
        resetWorkoutForm();

        // Update workouts table
        updateWorkoutsTable();

        // Show success message
        alert('Workout saved successfully!');
    } catch (error) {
        console.error('Error saving workout:', error);
        alert('An error occurred while saving the workout. Please try again.');
    }
}

// Reset workout form
function resetWorkoutForm() {
    try {
        const dateInput = document.getElementById('workout-date');
        const typeInput = document.getElementById('workout-type');
        const nameInput = document.getElementById('workout-name');
        const durationInput = document.getElementById('workout-duration');
        const notesInput = document.getElementById('workout-notes');
        const exercisesContainer = document.getElementById('exercises-container');

        if (dateInput) dateInput.value = '';
        if (typeInput) typeInput.value = '';
        if (nameInput) nameInput.value = '';
        if (durationInput) durationInput.value = '';
        if (notesInput) notesInput.value = '';
        if (exercisesContainer) {
            exercisesContainer.innerHTML = '';
            addExercise(); // Add one empty exercise
        }
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

// Update workouts table
function updateWorkoutsTable() {
    try {
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const tbody = document.querySelector('#workouts-content table tbody');
        
        if (!tbody) return;

        tbody.innerHTML = '';
        
        workouts.slice(-5).reverse().forEach(workout => {
            const row = document.createElement('tr');
            const workoutDate = new Date(workout.date);
            const formattedDate = workoutDate.toLocaleDateString();
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formattedDate}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">${workout.name || ''}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${workout.exercises ? workout.exercises.length : 0} exercises</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${workout.duration || ''} min</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onclick="viewWorkout('${workout.date}')" class="text-primary hover:text-blue-700 mr-3"><i class="fas fa-eye"></i></button>
                    <button onclick="editWorkout('${workout.date}')" class="text-secondary hover:text-green-700"><i class="fas fa-edit"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error updating workouts table:', error);
    }
}

// View workout details
function viewWorkout(date) {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const workout = workouts.find(w => w.date === date);
    
    if (!workout) return;

    alert(`
        Workout Details:
        Date: ${new Date(workout.date).toLocaleDateString()}
        Type: ${workout.type}
        Name: ${workout.name}
        Duration: ${workout.duration} minutes
        Notes: ${workout.notes}
        
        Exercises:
        ${workout.exercises.map(ex => `
            ${ex.name}
            Sets: ${ex.sets}
            Reps: ${ex.reps}
            Weight: ${ex.weight} lbs
            Notes: ${ex.notes}
        `).join('\n')}
    `);
}

// Edit workout
function editWorkout(date) {
    try {
        const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const workout = workouts.find(w => w.date === date);
        
        if (!workout) {
            console.error('Workout not found');
            return;
        }

        // Get form elements
        const dateInput = document.getElementById('workout-date');
        const typeInput = document.getElementById('workout-type');
        const nameInput = document.getElementById('workout-name');
        const durationInput = document.getElementById('workout-duration');
        const notesInput = document.getElementById('workout-notes');
        const exercisesContainer = document.getElementById('exercises-container');

        if (!dateInput || !typeInput || !nameInput || !durationInput || !notesInput || !exercisesContainer) {
            console.error('Required form elements not found');
            return;
        }

        // Fill form with workout data
        dateInput.value = workout.date; // Date is already in YYYY-MM-DD format
        typeInput.value = workout.type || '';
        nameInput.value = workout.name || '';
        durationInput.value = workout.duration || '';
        notesInput.value = workout.notes || '';

        // Clear and add exercises
        exercisesContainer.innerHTML = '';
        
        if (workout.exercises && workout.exercises.length > 0) {
            workout.exercises.forEach(exercise => {
                addExercise();
                const lastEntry = exercisesContainer.lastElementChild;
                if (lastEntry) {
                    const select = lastEntry.querySelector('.exercise-select');
                    const sets = lastEntry.querySelector('.exercise-sets');
                    const reps = lastEntry.querySelector('.exercise-reps');
                    const weight = lastEntry.querySelector('.exercise-weight');
                    const notes = lastEntry.querySelector('.exercise-notes');

                    if (select) select.value = exercise.name || '';
                    if (sets) sets.value = exercise.sets || '';
                    if (reps) reps.value = exercise.reps || '';
                    if (weight) weight.value = exercise.weight || '';
                    if (notes) notes.value = exercise.notes || '';
                }
            });
        } else {
            addExercise(); // Add one empty exercise if no exercises exist
        }

        // Show modal
        toggleWorkoutModal();
    } catch (error) {
        console.error('Error editing workout:', error);
        alert('An error occurred while loading the workout. Please try again.');
    }
}

// Initialize workout form
document.addEventListener('DOMContentLoaded', function() {
    // Add initial exercise
    addExercise();
    
    // Update workouts table
    updateWorkoutsTable();
    
    // Add event listener to save button
    const saveButton = document.querySelector('#workout-modal button[type="button"]:last-child');
    if (saveButton) {
        saveButton.onclick = saveWorkout;
    }
});

// Calendar functionality
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function initCalendar() {
    updateCalendarHeader();
    generateCalendarGrid();
    loadWorkoutEvents();
}

function updateCalendarHeader() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const headerElement = document.querySelector('#calendar-content .font-medium');
    if (headerElement) {
        headerElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}

function generateCalendarGrid() {
    const calendarGrid = document.querySelector('#calendar-content .grid-cols-7:last-child');
    if (!calendarGrid) return;

    // Clear existing calendar days
    calendarGrid.innerHTML = '';

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'h-12';
        calendarGrid.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'h-12 border rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50';
        dayElement.innerHTML = `<span class="text-sm">${day}</span>`;
        
        // Add click event to select date
        dayElement.addEventListener('click', () => {
            const selectedDate = new Date(currentYear, currentMonth, day);
            handleDateSelection(selectedDate);
        });

        calendarGrid.appendChild(dayElement);
    }
}

function loadWorkoutEvents() {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const calendarGrid = document.querySelector('#calendar-content .grid-cols-7:last-child');
    if (!calendarGrid) return;

    const dayElements = calendarGrid.querySelectorAll('.h-12.border');
    dayElements.forEach((dayElement, index) => {
        const day = index + 1;
        const workoutDate = new Date(currentYear, currentMonth, day);
        const formattedDate = workoutDate.toISOString().split('T')[0];

        // Find workouts for this date
        const dayWorkouts = workouts.filter(workout => workout.date === formattedDate);
        
        if (dayWorkouts.length > 0) {
            // Add workout indicator
            const workoutType = dayWorkouts[0].type;
            let bgColor, textColor;
            
            switch(workoutType) {
                case 'strength':
                    bgColor = ['bg-primary', 'bg-opacity-10'];
                    textColor = 'text-primary';
                    break;
                case 'cardio':
                    bgColor = ['bg-secondary', 'bg-opacity-10'];
                    textColor = 'text-secondary';
                    break;
                default:
                    bgColor = ['bg-accent', 'bg-opacity-10'];
                    textColor = 'text-accent';
            }

            // Add each background class separately
            bgColor.forEach(className => {
                dayElement.classList.add(className);
            });

            const workoutName = document.createElement('span');
            workoutName.className = `text-xs ${textColor}`;
            workoutName.textContent = dayWorkouts[0].name;
            dayElement.appendChild(workoutName);
        }
    });
}

function handleDateSelection(date) {
    // Switch to workouts tab
    switchDashboardTab('workouts');
    
    // Open workout modal with selected date
    const dateInput = document.getElementById('workout-date');
    if (dateInput) {
        dateInput.value = date.toISOString().split('T')[0];
    }
    toggleWorkoutModal();
}

// Add event listeners for calendar navigation
document.addEventListener('DOMContentLoaded', function() {
    const prevButton = document.querySelector('#calendar-content .fa-chevron-left').parentElement;
    const nextButton = document.querySelector('#calendar-content .fa-chevron-right').parentElement;

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            initCalendar();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            initCalendar();
        });
    }

    // Initialize calendar
    initCalendar();
});
