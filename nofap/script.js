document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonthYearElement = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    // Stats elements
    const successCountElement = document.getElementById('successCount');
    const relapseCountElement = document.getElementById('relapseCount');
    const currentStreakElement = document.getElementById('currentStreak');

    // Modal elements
    const modalOverlay = document.getElementById('checkinModal');
    const modalDateTitle = document.getElementById('modalDate');
    const closeModalBtn = document.getElementById('closeModal');
    const saveRecordBtn = document.getElementById('saveRecord');
    const clearRecordBtn = document.getElementById('clearRecord');
    const relapseCountGroup = document.getElementById('relapseCountGroup');
    const relapseCountInput = document.getElementById('relapseCountInput');
    const decreaseCountBtn = document.getElementById('decreaseCount');
    const increaseCountBtn = document.getElementById('increaseCount');
    const statusRadios = document.getElementsByName('status');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedDateString = null; // For modal interaction

    // Data storage: { "YYYY-MM-DD": { status: "success" | "danger", count: number } }
    // Backwards compatibility: if value is string, convert to object
    let records = JSON.parse(localStorage.getItem('nofap_records')) || {};

    // Initial render
    migrateData();
    renderCalendar(currentMonth, currentYear);
    updateStats();

    // --- Calendar Navigation ---
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // --- Modal Logic ---
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Toggle relapse count input visibility based on radio selection
    statusRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'danger') {
                relapseCountGroup.style.display = 'block';
            } else {
                relapseCountGroup.style.display = 'none';
            }
        });
    });

    // Count buttons
    decreaseCountBtn.addEventListener('click', () => {
        let val = parseInt(relapseCountInput.value) || 0;
        if (val > 1) relapseCountInput.value = val - 1;
    });

    increaseCountBtn.addEventListener('click', () => {
        let val = parseInt(relapseCountInput.value) || 0;
        relapseCountInput.value = val + 1;
    });

    // Save Record
    saveRecordBtn.addEventListener('click', () => {
        if (!selectedDateString) return;

        const selectedStatus = Array.from(statusRadios).find(r => r.checked).value;
        const count = selectedStatus === 'danger' ? (parseInt(relapseCountInput.value) || 1) : 0;

        records[selectedDateString] = {
            status: selectedStatus,
            count: count
        };

        saveRecords();
        updateStats();
        renderCalendar(currentMonth, currentYear); // Re-render to show update
        closeModal();
    });

    // Clear Record
    clearRecordBtn.addEventListener('click', () => {
        if (selectedDateString && records[selectedDateString]) {
            delete records[selectedDateString];
            saveRecords();
            updateStats();
            renderCalendar(currentMonth, currentYear);
        }
        closeModal();
    });


    // --- Functions ---

    function migrateData() {
        // Convert old string format to new object format if necessary
        let changed = false;
        for (const key in records) {
            if (typeof records[key] === 'string') {
                const status = records[key];
                records[key] = {
                    status: status,
                    count: status === 'danger' ? 1 : 0
                };
                changed = true;
            }
        }
        if (changed) saveRecords();
    }

    function renderCalendar(month, year) {
        // Clear previous days (keep headers)
        const weekdays = calendarGrid.querySelectorAll('.weekday');
        calendarGrid.innerHTML = '';
        weekdays.forEach(day => calendarGrid.appendChild(day));

        // Format: "May 2024"
        const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' });
        currentMonthYearElement.textContent = `${monthName} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day-cell', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.textContent = day;
            
            const dateString = formatDate(year, month, day);
            const record = records[dateString];
            
            // Add status class
            if (record) {
                dayCell.classList.add(record.status);
                // Optional: Display count if > 1 for danger
                if (record.status === 'danger' && record.count > 1) {
                    const badge = document.createElement('span');
                    badge.textContent = record.count;
                    badge.style.cssText = "position: absolute; bottom: 2px; right: 2px; font-size: 0.7rem; background: rgba(0,0,0,0.3); padding: 0 4px; border-radius: 4px;";
                    dayCell.appendChild(badge);
                }
            }

            // Highlight today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            // Click event -> Open Modal
            dayCell.addEventListener('click', () => {
                openModal(dateString, year, month, day);
            });

            calendarGrid.appendChild(dayCell);
        }
    }

    function openModal(dateString, year, month, day) {
        selectedDateString = dateString;
        
        // Format: "May 20, 2024"
        const dateObj = new Date(year, month, day);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        modalDateTitle.textContent = dateObj.toLocaleDateString('en-US', options);
        
        const record = records[dateString];
        
        // Reset/Pre-fill form
        if (record) {
            // Set radio
            const radio = Array.from(statusRadios).find(r => r.value === record.status);
            if (radio) radio.checked = true;
            
            // Set count
            if (record.status === 'danger') {
                relapseCountInput.value = record.count || 1;
                relapseCountGroup.style.display = 'block';
            } else {
                relapseCountInput.value = 1;
                relapseCountGroup.style.display = 'none';
            }
        } else {
            // Default: Success
            statusRadios[0].checked = true; // Success
            relapseCountGroup.style.display = 'none';
            relapseCountInput.value = 1;
        }

        modalOverlay.style.display = 'flex';
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
        selectedDateString = null;
    }

    function saveRecords() {
        localStorage.setItem('nofap_records', JSON.stringify(records));
    }

    function updateStats() {
        // Calculate stats for current month
        let monthlySuccess = 0;
        let monthlyRelapseCount = 0; // Total count of relapses
        
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = formatDate(currentYear, currentMonth, day);
            const record = records[dateString];
            if (record) {
                if (record.status === 'success') monthlySuccess++;
                if (record.status === 'danger') monthlyRelapseCount += (record.count || 1);
            }
        }

        successCountElement.textContent = monthlySuccess;
        relapseCountElement.textContent = monthlyRelapseCount;

        // Calculate Streak (Global)
        let streak = 0;
        let checkDate = new Date();
        checkDate.setHours(0,0,0,0);
        
        // If today is marked as danger, streak is 0.
        const todayStr = formatDate(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
        const todayRecord = records[todayStr];
        
        if (todayRecord && todayRecord.status === 'danger') {
            streak = 0;
        } else {
            // Check backwards
            let d = new Date();
            d.setHours(0,0,0,0);
            
            while (true) {
                const dStr = formatDate(d.getFullYear(), d.getMonth(), d.getDate());
                const record = records[dStr];
                
                if (record && record.status === 'danger') {
                    break;
                } else if (record && record.status === 'success') {
                    streak++;
                } else {
                    // If no record:
                    // If it's today, it's fine (streak continues from yesterday).
                    // If it's past day, streak breaks.
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    if (d.getTime() < today.getTime()) {
                        break;
                    }
                }
                d.setDate(d.getDate() - 1);
            }
        }
        
        currentStreakElement.textContent = streak;
    }

    function formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
});
