// admin.js - Admin Dashboard Functionality
// Avoid redeclaring `currentAdmin` across admin scripts — reuse a global if present
var currentAdmin = window.currentAdmin || null;
let allOrders = [];
let allUsers = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Admin] Initializing admin dashboard...');
    
    // Check if admin is logged in
    currentAdmin = JSON.parse(localStorage.getItem('freshgreens_current_admin'));
    // keep global in sync for other scripts
    try { window.currentAdmin = currentAdmin; } catch (e) {}
    
    if (!currentAdmin) {
        console.log('[Admin] No admin session found, redirecting to login...');
        window.showModalNotification('Unauthorized access. Please log in as administrator.', { stayOpen: true });
        window.location.href = 'login.html';
        return;
    }
    
    console.log('[Admin] Admin logged in:', currentAdmin.name);
    
    // Initialize admin dashboard
    initializeAdminDashboard();
    loadDashboardData();
    setupEventListeners();
});

function initializeAdminDashboard() {
    // Update admin info (guard for missing elements on pages that reuse this file)
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl && currentAdmin) adminNameEl.textContent = currentAdmin.name;
    
    // Set active navigation
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.showConfirmModal('Are you sure you want to logout?').then(confirmed => {
                if (confirmed) {
                    console.log('[Admin] Logging out admin user');
                    localStorage.removeItem('freshgreens_current_admin');
                    window.location.href = 'login.html';
                }
            }).catch(() => {});
        });
    }
    
    // Modal close buttons
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('orderStatusModal').style.display = 'none';
        });
    }
    
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('orderStatusModal').style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('orderStatusModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Status form submission
    const statusForm = document.getElementById('statusForm');
    if (statusForm) {
        statusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateOrderStatus();
        });
    }
}

function loadDashboardData() {
    // Load orders and users
    allOrders = getAllOrders();
    allUsers = getAllUsers();
    
    updateDashboardStats();
    loadRecentOrders();
}

function getAllOrders() {
    // Get orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('freshgreens_orders'));
    if (storedOrders && storedOrders.length > 0) {
        return storedOrders;
    }
    
    // Generate sample orders if none exist
    return generateSampleOrders();
}

function getAllUsers() {
    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('freshgreens_users'));
    if (storedUsers && storedUsers.length > 0) {
        return storedUsers;
    }
    
    // Generate sample users if none exist
    return generateSampleUsers();
}

function generateSampleOrders() {
    const statuses = ['pending', 'preparing', 'ready', 'delivery', 'completed'];
    const customers = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Reyes', 'Anna Lopez', 'Michael Chen'];
    
    return Array.from({ length: 15 }, (_, i) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const total = Math.floor(Math.random() * 500) + 100;
        const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        
        return {
            id: 'ORD' + (1000 + i),
            userId: 'user' + (i % 5),
            items: [
                {
                    product: {
                        name: ['Mediterranean Bliss', 'Protein Power Bowl', 'Asian Crunch', 'Classic Caesar'][i % 4],
                        price: [189, 219, 199, 179][i % 4]
                    },
                    quantity: Math.floor(Math.random() * 2) + 1
                }
            ],
            status: status,
            createdAt: createdAt.toISOString(),
            updatedAt: new Date().toISOString(),
            total: total,
            customerName: customers[i % 5],
            phone: '+63 912 345 6789',
            deliveryAddress: `${i + 1} Sample Street, Manila`
        };
    });
}

function generateSampleUsers() {
    return [
        { id: 'user1', name: 'Juan Dela Cruz', email: 'juan@example.com', phone: '+63 912 345 6789', createdAt: new Date().toISOString() },
        { id: 'user2', name: 'Maria Santos', email: 'maria@example.com', phone: '+63 917 654 3210', createdAt: new Date().toISOString() },
        { id: 'user3', name: 'Pedro Reyes', email: 'pedro@example.com', phone: '+63 918 123 4567', createdAt: new Date().toISOString() },
        { id: 'user4', name: 'Anna Lopez', email: 'anna@example.com', phone: '+63 919 876 5432', createdAt: new Date().toISOString() },
        { id: 'user5', name: 'Michael Chen', email: 'michael@example.com', phone: '+63 920 111 2222', createdAt: new Date().toISOString() }
    ];
}

function updateDashboardStats() {
    // Count orders by status
    const pendingCount = allOrders.filter(order => order.status === 'pending').length;
    const preparingCount = allOrders.filter(order => order.status === 'preparing').length;
    const readyCount = allOrders.filter(order => order.status === 'ready').length;
    
    // Calculate total revenue (all orders except cancelled)
    const totalRevenue = allOrders
        .filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Update DOM elements
    const pendingEl = document.getElementById('pendingCount'); if (pendingEl) pendingEl.textContent = pendingCount;
    const preparingEl = document.getElementById('preparingCount'); if (preparingEl) preparingEl.textContent = preparingCount;
    const readyEl = document.getElementById('readyCount'); if (readyEl) readyEl.textContent = readyCount;
    const revenueEl = document.getElementById('totalRevenue'); if (revenueEl) revenueEl.textContent = '₱' + totalRevenue.toFixed(2);
    const totalUsersEl = document.getElementById('totalUsers'); if (totalUsersEl) totalUsersEl.textContent = allUsers.length;
    const totalOrdersEl = document.getElementById('totalOrders'); if (totalOrdersEl) totalOrdersEl.textContent = allOrders.length;
}

function loadRecentOrders() {
    const recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    
    const tbody = document.getElementById('recentOrdersBody');
    if (!tbody) {
        console.warn('[Admin] recentOrdersBody element not found on this page');
        return;
    }
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 15px; display: block; opacity: 0.5;"></i>
                    No orders found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>
                <div>${order.customerName}</div>
                <small style="color: var(--gray);">${order.phone}</small>
            </td>
            <td><strong>₱${order.total.toFixed(2)}</strong></td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="openStatusModal('${order.id}')">
                    <i class="fas fa-edit"></i> Update
                </button>
            </td>
        </tr>
    `).join('');
}

function openStatusModal(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
        window.showModalNotification('Order not found!', { stayOpen: true });
        return;
    }
    
    // Populate modal with order data
    document.getElementById('orderIdDisplay').value = order.id;
    document.getElementById('statusSelect').value = order.status;
    document.getElementById('orderNotes').value = order.notes || '';
    
    // Show modal
    document.getElementById('orderStatusModal').style.display = 'block';
}

function updateOrderStatus() {
    const orderId = document.getElementById('orderIdDisplay').value;
    const newStatus = document.getElementById('statusSelect').value;
    const notes = document.getElementById('orderNotes').value;
    
    if (!newStatus) {
        window.showModalNotification('Please select a status!', { stayOpen: true });
        return;
    }
    
    // Find and update order
    const orderIndex = allOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
        window.showModalNotification('Order not found!', { stayOpen: true });
        return;
    }
    
    // Update order
    allOrders[orderIndex].status = newStatus;
    allOrders[orderIndex].updatedAt = new Date().toISOString();
    if (notes) {
        allOrders[orderIndex].notes = notes;
    }
    
    // Save to localStorage
    localStorage.setItem('freshgreens_orders', JSON.stringify(allOrders));
    
    // Show success message
    showNotification(`Order ${orderId} status updated to ${getStatusText(newStatus)}`, 'success');
    
    // Close modal and refresh data
    document.getElementById('orderStatusModal').style.display = 'none';
    loadDashboardData();
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'preparing': 'Preparing',
        'ready': 'Ready',
        'delivery': 'Out for Delivery',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.admin-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#admin-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'admin-notification-styles';
        styles.textContent = `
            .admin-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                color: white;
                font-weight: 500;
                max-width: 400px;
            }
            .notification-success {
                background: #4caf50;
            }
            .notification-error {
                background: #f44336;
            }
            .notification-info {
                background: #2196f3;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Utility function to initialize admin session (for login)
function initializeAdminSession(adminData) {
    localStorage.setItem('freshgreens_current_admin', JSON.stringify(adminData));
    window.location.href = 'admin.html';
}

//add for table ito
document.addEventListener("DOMContentLoaded", () => {
    // Only initialize users table controls if this page actually contains the users table
    if (document.getElementById("usersTableBody")) {
        loadUsersTable();

        const refreshBtn = document.getElementById("refreshUsersBtn");
        if (refreshBtn) refreshBtn.addEventListener("click", loadUsersTable);

        const searchEl = document.getElementById("searchUsers");
        if (searchEl) {
            searchEl.addEventListener("input", function () {
                loadUsersTable(this.value.toLowerCase());
            });
        }
    }
});

/* Load all users into table */
function loadUsersTable(search = "") {
    const users = JSON.parse(localStorage.getItem("freshgreens_users")) || [];
    const orders = JSON.parse(localStorage.getItem("freshgreens_orders")) || [];

    const tableBody = document.getElementById("usersTableBody");
    if (!tableBody) return; // nothing to do on pages without users table
    tableBody.innerHTML = ""; // Clear table

    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">No users found</td>
            </tr>`;
        return;
    }

    users.forEach(user => {
        const userOrders = orders.filter(o => o.userId === user.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const totalOrders = userOrders.length;

        // Search filter
        if (
            !user.name.toLowerCase().includes(search) &&
            !user.email.toLowerCase().includes(search)
        ) return;

        const row = `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || "—"}</td>
            <td>${user.joinDate || "—"}</td>
            <td>${totalOrders}</td>
            <td>₱${totalSpent.toFixed(2)}</td>
            <td>
                <button class="btn btn-primary" onclick="viewUser('${user.id}')">View</button>
                <button class="btn btn-danger" onclick="confirmDelete('${user.id}')">Delete</button>
            </td>
        </tr>
        `;

        tableBody.innerHTML += row;
    });
}

/* ================================
   ORDERS PAGE FUNCTIONALITY
================================ */

/* Load all orders into admin-orders.html table */
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("ordersTableBody")) {
        loadOrdersTable();
        setupOrderFilters();
    }
});

/* Load Orders Into Table */
function loadOrdersTable(search = "", statusFilter = "all", priorityFilter = "all") {
    const orders = JSON.parse(localStorage.getItem("freshgreens_orders")) || [];
    const users = JSON.parse(localStorage.getItem("freshgreens_users")) || [];

    const tbody = document.getElementById("ordersTableBody");
    tbody.innerHTML = "";

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="8" style="text-align:center;padding:20px;">No orders found</td></tr>
        `;
        return;
    }

    orders.forEach(order => {
        const user = users.find(u => u.id === order.userId);

        const customerName = user ? user.name : "Unknown User";

        if (
            (!customerName.toLowerCase().includes(search) &&
                !order.id.toLowerCase().includes(search))
        ) return;

        if (statusFilter !== "all" && order.status !== statusFilter) return;
        if (priorityFilter !== "all" && order.priority !== priorityFilter) return;

        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${customerName}</td>
                <td>${order.items.map(i => i.product.name + " x" + i.quantity).join("<br>")}</td>
                <td>₱${order.total.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>${order.priority || "Normal"}</td>
                <td>${formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-primary" onclick="openUpdateOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;

        tbody.innerHTML += row;
    });

    updateOrderStats();
}

/* Open Update Status Modal */
function openUpdateOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem("freshgreens_orders")) || [];
    const order = orders.find(o => o.id === orderId);

    if (!order) return;

    document.getElementById("updateOrderId").value = order.id;
    document.getElementById("updateStatusSelect").value = order.status;
    document.getElementById("updateOrderNotes").value = order.notes || "";

    document.getElementById("updateStatusModal").style.display = "block";
}

/* Save Updated Status */
const _updateStatusForm = document.getElementById("updateStatusForm");
if (_updateStatusForm) {
    _updateStatusForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const orderId = document.getElementById("updateOrderId").value;
    const newStatus = document.getElementById("updateStatusSelect").value;
    const notes = document.getElementById("updateOrderNotes").value;

    let orders = JSON.parse(localStorage.getItem("freshgreens_orders")) || [];
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) return;

    orders[index].status = newStatus;
    orders[index].notes = notes;
    orders[index].updatedAt = new Date().toISOString();

    localStorage.setItem("freshgreens_orders", JSON.stringify(orders));

    document.getElementById("updateStatusModal").style.display = "none";

    loadOrdersTable();
    updateOrderStats();

    window.showModalNotification("Order Updated Successfully!", { stayOpen: true });
    });
}

/* Filters */
function setupOrderFilters() {
    document.getElementById("searchOrders").addEventListener("input", function () {
        loadOrdersTable(this.value.toLowerCase());
    });

    document.getElementById("statusFilter").addEventListener("change", function () {
        loadOrdersTable("", this.value, document.getElementById("priorityFilter").value);
    });

    document.getElementById("priorityFilter").addEventListener("change", function () {
        loadOrdersTable("", document.getElementById("statusFilter").value, this.value);
    });

    document.getElementById("refreshBtn").addEventListener("click", () => {
        loadOrdersTable();
    });
}

/* Update Dashboard Stats */
function updateOrderStats() {
    const orders = JSON.parse(localStorage.getItem("freshgreens_orders")) || [];
    const pendingEl = document.getElementById("pendingCount"); if (pendingEl) pendingEl.textContent = orders.filter(o => o.status === "pending").length;
    const preparingEl = document.getElementById("preparingCount"); if (preparingEl) preparingEl.textContent = orders.filter(o => o.status === "preparing").length;
    const readyEl = document.getElementById("readyCount"); if (readyEl) readyEl.textContent = orders.filter(o => o.status === "ready").length;
    const deliveryEl = document.getElementById("deliveryCount"); if (deliveryEl) deliveryEl.textContent = orders.filter(o => o.status === "delivery").length;
    const completedEl = document.getElementById("completedCount"); if (completedEl) completedEl.textContent = orders.filter(o => o.status === "completed").length;

    const revenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

    const totalRevenueEl = document.getElementById("totalRevenue"); if (totalRevenueEl) totalRevenueEl.textContent = "₱" + revenue.toFixed(2);
}

/* Modal functions */
function viewUser(userId) {
    const users = JSON.parse(localStorage.getItem("freshgreens_users")) || [];
    const user = users.find(u => u.id === userId);

    if (!user) return;

    document.getElementById("userDetailsContent").innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone || "—"}</p>
        <p><strong>Join Date:</strong> ${user.joinDate}</p>
    `;

    document.getElementById("userDetailsModal").style.display = "block";
}

function confirmDelete(userId) {
    const modal = document.getElementById("deleteUserModal");
    modal.style.display = "block";

    document.getElementById("confirmDeleteBtn").onclick = function () {
        deleteUser(userId);
    };
}

function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem("freshgreens_users")) || [];
    users = users.filter(u => u.id !== userId);
    localStorage.setItem("freshgreens_users", JSON.stringify(users));

    document.getElementById("deleteUserModal").style.display = "none";
    loadUsersTable();
}
