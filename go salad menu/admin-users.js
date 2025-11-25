// admin-users.js - User management system for admin

let allUsers = [];
let filteredUsers = [];

window.addEventListener('DOMContentLoaded', function() {
    console.log('[Admin Users] Page loaded');
    
    // Check if admin is logged in
    const currentAdmin = localStorage.getItem('freshgreens_current_admin');
    if (!currentAdmin) {
        console.log('[Admin Users] No admin session, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    const admin = JSON.parse(currentAdmin);
    document.getElementById('adminName').textContent = admin.name;

    // Load and display users
    loadUsersData();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchUsers');
    searchInput.addEventListener('input', applyFilters);

    // Refresh button
    const refreshBtn = document.getElementById('refreshUsersBtn');
    refreshBtn.addEventListener('click', loadUsersData);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === this) {
                this.style.display = 'none';
            }
        });
    });

    // Modal form submission for delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            performDeleteUser(userId);
        });
    }

    // Cancel buttons in modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

function loadUsersData() {
    allUsers = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    displayUsers(allUsers);
    console.log('[Admin Users] Loaded', allUsers.length, 'users');
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    No users found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => {
        // Calculate total orders and spent
        const orders = user.orderHistory || [];
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        return `
            <tr data-user-id="${user.id}">
                <td>${user.name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${formatDate(user.joinDate || user.createdAt)}</td>
                <td><span class="badge badge-info">${totalOrders}</span></td>
                <td>₱${totalSpent.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-info view-user-btn" data-user-id="${user.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Attach event listeners to action buttons
    document.querySelectorAll('.view-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            viewUserDetails(userId);
        });
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            const user = allUsers.find(u => u.id === userId);
            openDeleteUserModal(userId, user.name);
        });
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    
    filteredUsers = allUsers.filter(user => {
        const name = (user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const phone = (user.phone || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               email.includes(searchTerm) || 
               phone.includes(searchTerm);
    });

    displayUsers(filteredUsers);
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) {
        window.showModalNotification('User not found', { stayOpen: true });
        return;
    }

    const orders = user.orderHistory || [];
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const userDetailsContent = document.getElementById('userDetailsContent');
    userDetailsContent.innerHTML = `
        <div class="user-details-grid">
            <div class="detail-row">
                <label>User ID:</label>
                <span>${user.id}</span>
            </div>
            <div class="detail-row">
                <label>Full Name:</label>
                <span>${user.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <label>Email:</label>
                <span>${user.email || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <label>Phone:</label>
                <span>${user.phone || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <label>Join Date:</label>
                <span>${formatDate(user.joinDate || user.createdAt)}</span>
            </div>
            <div class="detail-row">
                <label>Account Status:</label>
                <span><span class="badge badge-success">Active</span></span>
            </div>
            <div class="detail-row">
                <label>Total Orders:</label>
                <span><strong>${orders.length}</strong></span>
            </div>
            <div class="detail-row">
                <label>Total Spent:</label>
                <span><strong>₱${totalSpent.toFixed(2)}</strong></span>
            </div>
        </div>

        <div class="order-history-section">
            <h3>Order History</h3>
            ${orders.length > 0 ? `
                <div class="order-history-list">
                    ${orders.map((order, index) => `
                        <div class="order-history-item">
                            <div class="order-header">
                                <span class="order-id"><strong>${order.id}</strong></span>
                                <span class="order-date">${formatDate(order.date)}</span>
                            </div>
                            <div class="order-details">
                                <span class="order-items">${order.items ? order.items.join(', ') : 'N/A'}</span>
                                <span class="order-total">₱${(order.total || 0).toFixed(2)}</span>
                            </div>
                            <span class="status-badge status-${order.status}">
                                ${getStatusText(order.status)}
                            </span>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <p style="text-align: center; color: #999; padding: 20px;">
                    No orders yet
                </p>
            `}
        </div>
    `;

    document.getElementById('userDetailsModal').style.display = 'block';
}

function openDeleteUserModal(userId, userName) {
    const deleteConfirmMessage = document.getElementById('deleteConfirmMessage');
    deleteConfirmMessage.textContent = `Are you sure you want to delete the user "${userName}"? This action cannot be undone.`;
    
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.setAttribute('data-user-id', userId);
    
    document.getElementById('deleteUserModal').style.display = 'block';
}

function performDeleteUser(userId) {
    try {
        // Remove user from localStorage
        allUsers = allUsers.filter(u => u.id !== userId);
        localStorage.setItem('freshgreens_users', JSON.stringify(allUsers));

        // Also remove any associated orders if needed (optional)
        // You might want to keep orders for record-keeping
        
        // Close modal and refresh
        document.getElementById('deleteUserModal').style.display = 'none';
        showNotification(`User deleted successfully`, 'success');
        
        // Reload users display
        loadUsersData();
    } catch (error) {
        console.error('[Admin Users] Error deleting user:', error);
        showNotification('Error deleting user', 'error');
    }
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'preparing': 'Preparing',
        'ready': 'Ready for Pickup',
        'delivery': 'Out for Delivery',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        
        return `${Math.floor(diffDays / 365)} years ago`;
    } catch (e) {
        return 'N/A';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
