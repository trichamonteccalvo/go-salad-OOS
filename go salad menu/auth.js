// auth.js - Authentication utility functions

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('freshgreens_current_user') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('freshgreens_current_user');
    return user ? JSON.parse(user) : null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('freshgreens_current_user');
    window.location.href = 'login.html';
}

// Register new user
function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        ...userData,
        joinDate: new Date().toISOString(),
        preferences: {
            dietary: [],
            allergies: [],
            favorites: []
        },
        orderHistory: [],
        addresses: [],
        paymentMethods: []
    };
    
    users.push(newUser);
    localStorage.setItem('freshgreens_users', JSON.stringify(users));
    
    // Auto-login after registration
    localStorage.setItem('freshgreens_current_user', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

// Login user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('freshgreens_current_user', JSON.stringify(user));
        return { success: true, user };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
}

// Update user profile
function updateUserProfile(userId, updates) {
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('freshgreens_users', JSON.stringify(users));
    
    // Update current session if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        localStorage.setItem('freshgreens_current_user', JSON.stringify(users[userIndex]));
    }
    
    return { success: true, user: users[userIndex] };
}

// Add order to user history
function addOrderToHistory(userId, order) {
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    if (!users[userIndex].orderHistory) {
        users[userIndex].orderHistory = [];
    }
    
    const newOrder = {
        id: 'ORD' + Date.now(),
        date: new Date().toISOString(),
        ...order
    };
    
    users[userIndex].orderHistory.unshift(newOrder);
    localStorage.setItem('freshgreens_users', JSON.stringify(users));
    
    // Update current session if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        localStorage.setItem('freshgreens_current_user', JSON.stringify(users[userIndex]));
    }
    
    return { success: true, order: newOrder };
}

// Password validation
function validatePassword(password) {
    const minLength = 6;
    return password.length >= minLength;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isUserLoggedIn,
        getCurrentUser,
        logoutUser,
        registerUser,
        loginUser,
        updateUserProfile,
        addOrderToHistory,
        validatePassword,
        validateEmail
    };
}