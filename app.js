// ============================================
// TIC Club Membership Application System
// ============================================
// NOTE: This is a client-side demonstration.
// In production, replace in-memory storage with:
// - Backend API (Node.js + Express)
// - MongoDB database for persistent storage
// - Proper authentication for admin panel
// ============================================

// In-memory storage for registrations
let registrations = [];

// Session management (using in-memory storage since localStorage is blocked)
let adminSession = {
    authenticated: false,
    email: null,
    loginTime: null
};

// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const registrationSection = document.getElementById('registrationSection');
const successMessage = document.getElementById('successMessage');
const adminLogin = document.getElementById('adminLogin');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const backToFormBtn = document.getElementById('backToFormBtn');
const logoutBtn = document.getElementById('logoutBtn');
const backBtn = document.getElementById('backBtn');
const downloadCSVBtn = document.getElementById('downloadCSV');
const refreshDataBtn = document.getElementById('refreshData');
const tableBody = document.getElementById('tableBody');
const totalRegistrationsEl = document.getElementById('totalRegistrations');
const adminEmailDisplay = document.getElementById('adminEmailDisplay');
const loginError = document.getElementById('loginError');

// Initialize app
function init() {
    setupEventListeners();
    setupPositionValidation();
    loadSampleData();
    checkURLForAdminAccess();
}

// Load sample data for demonstration
function loadSampleData() {
    const sampleData = [
        {
            name: 'Rahul Kumar',
            email: 'rahul.k@example.com',
            phone: '+91 9876543210',
            department: 'Computer Science',
            motivation: 'I am passionate about technology and innovation. I want to contribute to TIC Club activities.',
            positions: ['Technical Coordinator', 'Research Coordinator'],
            timestamp: new Date('2025-10-25T10:30:00').toISOString()
        },
        {
            name: 'Priya Sharma',
            email: 'priya.s@example.com',
            phone: '+91 9123456789',
            department: 'Information Technology',
            motivation: 'I have experience in social media management and want to help grow TIC Club online presence.',
            positions: ['Social Media Coordinator', 'Public Relations & Outreach Coordinator'],
            timestamp: new Date('2025-10-26T14:20:00').toISOString()
        }
    ];
    registrations = [...sampleData];
}

// Check URL for admin access
function checkURLForAdminAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    if (urlParams.get('admin') === 'true' || hash === '#admin') {
        showAdminLogin();
    }
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#admin') {
            showAdminLogin();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    registrationForm.addEventListener('submit', handleFormSubmit);
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    backToFormBtn.addEventListener('click', showRegistrationForm);
    logoutBtn.addEventListener('click', handleLogout);
    backBtn.addEventListener('click', showRegistrationForm);
    downloadCSVBtn.addEventListener('click', downloadCSV);
    refreshDataBtn.addEventListener('click', refreshAdminData);
}

// Setup position validation (max 2 selections)
function setupPositionValidation() {
    const MAX_SELECTIONS = 2;
    const positionCheckboxes = document.querySelectorAll('input[name="positions"]');
    const positionError = document.getElementById('positionError');
    positionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const checkedBoxes = document.querySelectorAll('input[name="positions"]:checked');
            const checkedCount = checkedBoxes.length;
            if (positionError) positionError.style.display = 'none';
            if (checkedCount >= MAX_SELECTIONS) {
                positionCheckboxes.forEach(cb => {
                    if (!cb.checked) {
                        cb.disabled = true;
                        cb.parentElement.classList.add('disabled');
                    }
                });
            } else {
                positionCheckboxes.forEach(cb => {
                    cb.disabled = false;
                    cb.parentElement.classList.remove('disabled');
                });
            }
            if (checkedCount > MAX_SELECTIONS) {
                if (positionError) {
                    positionError.textContent = `You can only select up to ${MAX_SELECTIONS} positions`;
                    positionError.style.display = 'block';
                }
                this.checked = false;
            }
        });
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(registrationForm);
    const positions = Array.from(document.querySelectorAll('input[name="positions"]:checked'))
        .map(cb => cb.value);
    const positionError = document.getElementById('positionError');
    if (positions.length === 0) {
        if (positionError) {
            positionError.textContent = 'Please select at least one position you are interested in.';
            positionError.style.display = 'block';
        } else {
            alert('Please select at least one position you are interested in.');
        }
        positionError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (positions.length > 2) {
        if (positionError) {
            positionError.textContent = 'Please select at most 2 positions.';
            positionError.style.display = 'block';
        } else {
            alert('Please select at most 2 positions.');
        }
        positionError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (positionError) {
        positionError.style.display = 'none';
    }

    const registrationData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        motivation: formData.get('motivation'),
        positions: positions,
        timestamp: new Date().toISOString()
    };

    // Post to Google Apps Script endpoint instead of in-memory
    // Instantly update UI for snappy feedback
    showSuccessMessage();
    registrationForm.reset();

    // Then fire-and-forget the fetch!
    fetch('https://script.google.com/macros/s/AKfycbx5kpfbyyREtDPGKy3UkpAFLrBJoeAv6bCGCblSpcTIqA_k3TqGjfMlGSUfSJKnwsI/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
    });

    // (If you want error checking, you’ll need a custom backend instead of Apps Script)    
}

// Show success message
function showSuccessMessage() {
    registrationSection.style.display = 'none';
    successMessage.style.display = 'block';
}

// Show admin login
function showAdminLogin() {
    registrationSection.style.display = 'none';
    successMessage.style.display = 'none';
    adminPanel.style.display = 'none';
    adminLogin.style.display = 'block';
    if (!window.location.hash.includes('admin')) {
        window.history.pushState({}, '', '#admin');
    }
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    // Example: Hardcoded admin, replace with your method
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        adminSession = {
            authenticated: true,
            email: email,
            loginTime: new Date()
        };
        showAdminPanel();
    } else {
        showLoginError('Invalid email or password');
    }
}

// Show login error
function showLoginError(message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
    setTimeout(() => {
        loginError.style.display = 'none';
    }, 3000);
}

// Show admin panel (after authentication)
function showAdminPanel() {
    if (!adminSession.authenticated) {
        showAdminLogin();
        return;
    }
    registrationSection.style.display = 'none';
    successMessage.style.display = 'none';
    adminLogin.style.display = 'none';
    adminPanel.style.display = 'block';
    adminEmailDisplay.textContent = `Logged in as: ${adminSession.email}`;
    loadAdminData();
}

// Handle logout
function handleLogout() {
    adminSession = {
        authenticated: false,
        email: null,
        loginTime: null
    };
    adminLoginForm.reset();
    showRegistrationForm();
}

// Show registration form (and clear URL hash)
function showRegistrationForm() {
    successMessage.style.display = 'none';
    adminPanel.style.display = 'none';
    adminLogin.style.display = 'none';
    registrationSection.style.display = 'block';
    if (window.location.hash) {
        window.history.pushState({}, '', window.location.pathname);
    }
}

// Load admin data
function loadAdminData() {
    updateAdminTable();
}

// Update admin table
function updateAdminTable() {
    totalRegistrationsEl.textContent = registrations.length;
    tableBody.innerHTML = '';
    if (registrations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No applications yet</td></tr>';
        return;
    }
    registrations.forEach((reg, index) => {
        const row = document.createElement('tr');
        const timestamp = new Date(reg.timestamp).toLocaleString('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        const positionsText = Array.isArray(reg.positions)
            ? reg.positions.join(', ')
            : reg.positions;
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(reg.name)}</td>
            <td>${escapeHtml(reg.email)}</td>
            <td>${escapeHtml(reg.phone)}</td>
            <td>${escapeHtml(reg.department)}</td>
            <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(positionsText)}">${escapeHtml(positionsText)}</td>
            <td>${timestamp}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Refresh admin data
function refreshAdminData() {
    refreshDataBtn.textContent = 'Refreshing...';
    refreshDataBtn.disabled = true;
    setTimeout(() => {
        loadAdminData();
        refreshDataBtn.textContent = 'Refresh Data';
        refreshDataBtn.disabled = false;
    }, 500);
}

// Download CSV
function downloadCSV() {
    if (registrations.length === 0) {
        alert('No data to download');
        return;
    }
    const headers = ['#', 'Name', 'Email', 'Phone', 'Department', 'Motivation', 'Positions', 'Timestamp'];
    const csvRows = [headers.join(',')];
    registrations.forEach((reg, index) => {
        const positionsText = Array.isArray(reg.positions)
            ? reg.positions.join('; ')
            : reg.positions;
        const row = [
            index + 1,
            `"${reg.name}"`,
            `"${reg.email}"`,
            `"${reg.phone}"`,
            `"${reg.department}"`,
            `"${reg.motivation ? reg.motivation.replace(/"/g, '""') : ''}"`,
            `"${positionsText}"`,
            `"${new Date(reg.timestamp).toLocaleString('en-IN')}"`
        ];
        csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TIC_Club_Applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Initialize the app
init();
