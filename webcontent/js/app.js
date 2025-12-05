// app.js - UPDATED FOR JAVA SERVLET BACKEND INTEGRATION

const BASE_URL = '/campuspass/api'; 
const API_LOGIN = `${BASE_URL}/login`;
const API_PASS = `${BASE_URL}/pass`;
const API_WARDEN = `${BASE_URL}/warden`;
const API_GUARD = `${BASE_URL}/guard`;

// --- AUTHENTICATION & SESSION MANAGEMENT ---

/**
 * Handles multi-role login via API call to LoginServlet.
 * Uses x-www-form-urlencoded format for the POST body as required by the servlet.
 */
async function login(role, username, password) {
    const errorMsgElement = document.getElementById('error-message');
    if (errorMsgElement) errorMsgElement.style.display = 'none';

    // 1. Prepare body in x-www-form-urlencoded format
    const body = new URLSearchParams({
        role: role.toUpperCase(),
        username: username,
        password: password
    });

    try {
        const response = await fetch(API_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString()
        });

        const data = await response.json();

        if (data.success) {
            // 2. Store user data from the server in localStorage for session
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
            errorMsgElement.textContent = 'Server connection failed. Check Tomcat status.';
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
    userNameElements.forEach(el => el.textContent = user.name || user.username || user.usn);
    
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
 * Fetches all passes for the current student. Replaces getPasses().filter(usn).
 */
async function fetchPassesByUsn(usn) {
    try {
        // GET request with USN query parameter
        const response = await fetch(`${API_PASS}?usn=${usn}`);
        if (!response.ok) throw new Error('Failed to fetch passes.');
        
        return await response.json(); // Returns List<Pass>
    } catch (error) {
        console.error('Fetch Passes Error:', error);
        return [];
    }
}

/**
 * Submits a new pass request to PassServlet.
 */
async function applyPass(reason, date, time) {
    const user = checkAuth('STUDENT');
    if (!user) return { success: false, message: 'Not logged in.' };
    
    const requestBody = {
        usn: user.usn,
        studentName: user.name,
        reason: reason,
        date: date,
        timeOut: time,
        isEmergency: false // Assuming non-emergency for simplicity from the provided HTML
    };

    try {
        const response = await fetch(API_PASS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        
        return await response.json(); // { success: true/false, message: "..." }
    } catch (error) {
        console.error('Apply Pass Error:', error);
        return { success: false, message: 'Network error submitting request.' };
    }
}

// --- WARDEN FUNCTIONALITY ---

/**
 * Fetches all PENDING passes for the warden. Replaces getPasses().filter(PENDING).
 */
async function fetchPendingPasses() {
    try {
        const response = await fetch(API_WARDEN); // GET request
        if (!response.ok) throw new Error('Failed to fetch pending passes.');
        
        return await response.json(); // Returns List<Pass> where status = PENDING
    } catch (error) {
        console.error('Fetch Pending Passes Error:', error);
        return [];
    }
}

/**
 * Updates the status of a pass (APPROVE/REJECT). Replaces mock updatePassStatus.
 */
async function updatePassStatus(id, status, rejectionReason = null) {
    const requestBody = {
        action: status, // APPROVED or REJECTED
        passId: id,
        rejectionReason: rejectionReason
    };

    try {
        const response = await fetch(API_WARDEN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        return await response.json(); // { success: true/false, message: "..." }

    } catch (error) {
        console.error('Warden Action Error:', error);
        return { success: false, message: 'Network error performing action.' };
    }
}

// --- SECURITY GUARD FUNCTIONALITY ---

/**
 * Records an EXIT or RETURN event for a pass. Replaces mock recordScan.
 */
async function recordScan(passId, eventType) {
    const requestBody = {
        passId: passId,
        type: eventType // EXIT or RETURN
    };

    try {
        const response = await fetch(API_GUARD, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        return await response.json(); // { success: true/false, message: "..." }

    } catch (error) {
        console.error('Guard Scan Error:', error);
        return { success: false, message: 'Network error recording event.' };
    }
}