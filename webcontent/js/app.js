// app.js - SUPABASE EDGE FUNCTIONS BACKEND

const SUPABASE_URL = 'https://nzswrqgmlfkzfonoxqdl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56c3dycWdtbGZremZvbm94cWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NDUxNDIsImV4cCI6MjA4MDUyMTE0Mn0.NLzeL8Y597zo958LgsIZ5u8kmgJJ9BrkfetlBZOYV1Y';

const BASE_URL = `${SUPABASE_URL}/functions/v1`;
const API_LOGIN = `${BASE_URL}/auth`;
const API_PASS = `${BASE_URL}/pass`;
const API_WARDEN = `${BASE_URL}/warden`;
const API_GUARD = `${BASE_URL}/guard`;

// --- AUTHENTICATION & SESSION MANAGEMENT ---

/**
 * Handles multi-role login via Supabase Edge Function.
 */
async function login(role, username, password) {
    const errorMsgElement = document.getElementById('error-message');
    if (errorMsgElement) errorMsgElement.style.display = 'none';

    const body = {
        role: role.toUpperCase(),
        username: username,
        password: password
    };

    try {
        const response = await fetch(API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data));
            return data.role;
        } else {
            if (errorMsgElement) {
                errorMsgElement.textContent = data.message || 'Invalid credentials!';
                errorMsgElement.style.display = 'block';
            }
            return false;
        }

    } catch (error) {
        console.error('Login API Error:', error);
        if (errorMsgElement) {
            errorMsgElement.textContent = 'Server connection failed. Please try again.';
            errorMsgElement.style.display = 'block';
        }
        return false;
    }
}

/**
 * Checks for a user in localStorage and redirects if not authenticated or unauthorized.
 */
function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        window.location.href = 'index.html';
        return null;
    }

    // Authorization check
    if (requiredRole && user.role !== requiredRole) {
        alert('Unauthorized access');
        window.location.href = 'index.html';
        return null;
    }

    // Update UI with user name
    const userNameElements = document.querySelectorAll('.user-name-display');
    userNameElements.forEach(el => el.textContent = user.name || user.identifier);

    return user;
}

/**
 * Clears the session and redirects to login page.
 */
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// --- STUDENT FUNCTIONALITY ---

/**
 * Fetches all passes for the current student.
 */
async function fetchPassesByUsn(usn) {
    try {
        const response = await fetch(`${API_PASS}?usn=${usn}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            }
        });
        if (!response.ok) throw new Error('Failed to fetch passes.');

        return await response.json();
    } catch (error) {
        console.error('Fetch Passes Error:', error);
        return [];
    }
}

/**
 * Submits a new pass request.
 */
async function applyPass(reason, date, time, isEmergency = false) {
    const user = checkAuth('STUDENT');
    if (!user) return { success: false, message: 'Not logged in.' };

    const requestBody = {
        usn: user.identifier || user.usn,
        studentName: user.name,
        reason: reason,
        date: date,
        timeOut: time,
        isEmergency: isEmergency
    };

    try {
        const response = await fetch(API_PASS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify(requestBody)
        });

        return await response.json();
    } catch (error) {
        console.error('Apply Pass Error:', error);
        return { success: false, message: 'Network error submitting request.' };
    }
}

// --- WARDEN FUNCTIONALITY ---

/**
 * Fetches all PENDING passes for the warden.
 */
async function fetchPendingPasses() {
    try {
        const response = await fetch(API_WARDEN, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            }
        });
        if (!response.ok) throw new Error('Failed to fetch pending passes.');

        return await response.json();
    } catch (error) {
        console.error('Fetch Pending Passes Error:', error);
        return [];
    }
}

/**
 * Updates the status of a pass (APPROVE/REJECT).
 */
async function updatePassStatus(id, status, rejectionReason = null) {
    const requestBody = {
        action: status,
        passId: id,
        rejectionReason: rejectionReason
    };

    try {
        const response = await fetch(API_WARDEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify(requestBody)
        });

        return await response.json();

    } catch (error) {
        console.error('Warden Action Error:', error);
        return { success: false, message: 'Network error performing action.' };
    }
}

// --- SECURITY GUARD FUNCTIONALITY ---

/**
 * Records an EXIT or RETURN event for a pass.
 */
async function recordScan(passId, eventType) {
    const requestBody = {
        passId: passId,
        type: eventType
    };

    try {
        const response = await fetch(API_GUARD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify(requestBody)
        });

        return await response.json();

    } catch (error) {
        console.error('Guard Scan Error:', error);
        return { success: false, message: 'Network error recording event.' };
    }
}
