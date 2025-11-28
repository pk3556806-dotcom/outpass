// Mock Data Management
const MOCK_USERS = {
    STUDENT: { usn: '4CE23CS045', password: 'password', name: 'Rahul Sharma' },
    WARDEN: { username: 'warden', password: 'password', name: 'Dr. Patil' },
    SECURITY: { username: 'security', password: 'password', name: 'Guard Officer' }
};

// Initialize Passes in LocalStorage if empty
if (!localStorage.getItem('passes')) {
    const initialPasses = [
        {
            id: "PASS0001",
            usn: "4CE23CS045",
            studentName: "Rahul Sharma",
            reason: "Medical Emergency",
            date: "2025-11-29",
            timeOut: "10:30",
            status: "APPROVED"
        },
        {
            id: "PASS0002",
            usn: "4CE23CS045",
            studentName: "Rahul Sharma",
            reason: "Weekend Outing",
            date: "2025-12-01",
            timeOut: "09:00",
            status: "PENDING"
        }
    ];
    localStorage.setItem('passes', JSON.stringify(initialPasses));
}

// Auth Logic
function login(role, username, password) {
    if (role === 'STUDENT') {
        if (username === MOCK_USERS.STUDENT.usn && password === MOCK_USERS.STUDENT.password) {
            localStorage.setItem('user', JSON.stringify({ role: 'STUDENT', ...MOCK_USERS.STUDENT }));
            return true;
        }
    } else if (role === 'WARDEN') {
        if (username === MOCK_USERS.WARDEN.username && password === MOCK_USERS.WARDEN.password) {
            localStorage.setItem('user', JSON.stringify({ role: 'WARDEN', ...MOCK_USERS.WARDEN }));
            return true;
        }
    } else if (role === 'SECURITY') {
        if (username === MOCK_USERS.SECURITY.username && password === MOCK_USERS.SECURITY.password) {
            localStorage.setItem('user', JSON.stringify({ role: 'SECURITY', ...MOCK_USERS.SECURITY }));
            return true;
        }
    }
    return false;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    if (requiredRole && user.role !== requiredRole) {
        alert('Unauthorized access');
        window.location.href = 'index.html';
        return null;
    }
    
    // Update UI with user name
    const userNameElements = document.querySelectorAll('.user-name-display');
    userNameElements.forEach(el => el.textContent = user.name);
    
    return user;
}

// Pass Management
function getPasses() {
    return JSON.parse(localStorage.getItem('passes') || '[]');
}

function savePasses(passes) {
    localStorage.setItem('passes', JSON.stringify(passes));
}

function applyPass(reason, date, time) {
    const user = JSON.parse(localStorage.getItem('user'));
    const passes = getPasses();
    
    const newPass = {
        id: `PASS${String(passes.length + 1).padStart(4, '0')}`,
        usn: user.usn,
        studentName: user.name,
        reason,
        date,
        timeOut: time,
        status: "PENDING"
    };
    
    passes.unshift(newPass);
    savePasses(passes);
    return newPass;
}

function updatePassStatus(id, status, rejectionReason = null) {
    const passes = getPasses();
    const passIndex = passes.findIndex(p => p.id === id);
    
    if (passIndex !== -1) {
        passes[passIndex].status = status;
        if (rejectionReason) passes[passIndex].rejectionReason = rejectionReason;
        savePasses(passes);
        return true;
    }
    return false;
}
