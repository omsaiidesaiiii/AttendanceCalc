// DOM elements
const form = document.querySelector('.calculator-form');
const presentInput = document.getElementById('present');
const totalInput = document.getElementById('total');
const percentageSelect = document.getElementById('percentage');
const resultDiv = document.getElementById('result');

// Form submission handler
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const present = parseInt(presentInput.value);
    const total = parseInt(totalInput.value);
    const requiredPercentage = parseInt(percentageSelect.value);
    
    // Validate inputs
    if (!validateInputs(present, total)) {
        return;
    }
    
    // Calculate attendance
    calculateAttendance(present, total, requiredPercentage);
});

// Input validation
function validateInputs(present, total) {
    // Clear previous result
    hideResult();
    
    // Check for empty values
    if (isNaN(present) || isNaN(total)) {
        showResult('Please enter valid numbers for both fields.', 'error');
        return false;
    }
    
    // Check for negative values
    if (present < 0 || total < 0) {
        showResult('Please enter positive numbers only.', 'error');
        return false;
    }
    
    // Check if present is greater than total
    if (present > total) {
        showResult('Present classes cannot be greater than total classes.', 'error');
        return false;
    }
    
    // Check if total is zero
    if (total === 0) {
        showResult('Total classes cannot be zero.', 'error');
        return false;
    }
    
    return true;
}

// Calculate attendance and show result
function calculateAttendance(present, total, requiredPercentage) {
    const currentPercentage = (present / total) * 100;
    const requiredPercentageDecimal = requiredPercentage / 100;
    
    if (currentPercentage >= requiredPercentage) {
        // Student can bunk more classes
        const maxAbsent = Math.floor(total * (1 - requiredPercentageDecimal));
        const currentAbsent = total - present;
        const canBunk = maxAbsent - currentAbsent;
        
        if (canBunk > 0) {
            const newTotal = total + 1;
            const newPercentage = (present / newTotal) * 100;
            
            showResult(`
                <div class="result-line">You can bunk for <span class="bold">${canBunk}</span> more days.</div>
                <div class="result-line">Current Attendance: <span class="bold">${present}/${total} → ${currentPercentage.toFixed(2)}%</span></div>
                <div class="result-line">Attendance Then: <span class="bold">${present}/${newTotal} → ${newPercentage.toFixed(2)}%</span></div>
            `, 'success');
        } else if (canBunk === 0) {
            showResult(`
                <div class="result-line">You are at the minimum attendance requirement (${requiredPercentage}%). You cannot bunk any more classes.</div>
                <div class="result-line">Current Attendance: <span class="bold">${present}/${total} → ${currentPercentage.toFixed(2)}%</span></div>
            `, 'info');
        } else {
            const needToAttend = Math.abs(canBunk);
            showResult(`
                <div class="result-line">You need to attend <span class="bold">${needToAttend}</span> more classes to reach ${requiredPercentage}%.</div>
                <div class="result-line">Current Attendance: <span class="bold">${present}/${total} → ${currentPercentage.toFixed(2)}%</span></div>
            `, 'error');
        }
    } else {
        // Student needs to attend more classes
        const requiredPresent = Math.ceil(total * requiredPercentageDecimal);
        const needToAttend = requiredPresent - present;
        
        if (needToAttend <= total - present) {
            showResult(`
                <div class="result-line">You need to attend <span class="bold">${needToAttend}</span> more classes to reach ${requiredPercentage}%.</div>
                <div class="result-line">Current Attendance: <span class="bold">${present}/${total} → ${currentPercentage.toFixed(2)}%</span></div>
            `, 'error');
        } else {
            showResult(`
                <div class="result-line">It's not possible to reach ${requiredPercentage}% attendance with the current total classes.</div>
                <div class="result-line">Current Attendance: <span class="bold">${present}/${total} → ${currentPercentage.toFixed(2)}%</span></div>
            `, 'error');
        }
    }
}

// Show result with animation
function showResult(message, type) {
    resultDiv.innerHTML = message;
    resultDiv.className = `result ${type}`;
    
    // Trigger animation
    setTimeout(() => {
        resultDiv.classList.add('show');
    }, 10);
}

// Hide result
function hideResult() {
    resultDiv.classList.remove('show', 'success', 'error', 'info');
    resultDiv.innerHTML = '';
}

// Real-time validation feedback
presentInput.addEventListener('input', function() {
    const present = parseInt(this.value);
    const total = parseInt(totalInput.value);
    
    if (!isNaN(present) && !isNaN(total) && present > total) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

totalInput.addEventListener('input', function() {
    const present = parseInt(presentInput.value);
    const total = parseInt(this.value);
    
    if (!isNaN(present) && !isNaN(total) && present > total) {
        presentInput.style.borderColor = '#dc3545';
    } else {
        presentInput.style.borderColor = '#e0e0e0';
    }
});

// Clear validation styles on focus
presentInput.addEventListener('focus', function() {
    this.style.borderColor = '#e0e0e0';
});

totalInput.addEventListener('focus', function() {
    this.style.borderColor = '#e0e0e0';
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Focus on first input for better accessibility
    presentInput.focus();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement === presentInput) {
                totalInput.focus();
            } else if (activeElement === totalInput) {
                percentageSelect.focus();
            } else if (activeElement === percentageSelect) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
});
