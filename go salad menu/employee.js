// employee.js - Staff Dashboard Functionality
const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    OUT_FOR_DELIVERY: 'out-for-delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

let allOrders = [];
let currentStaff = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check if staff is logged in
    currentStaff = JSON.parse(localStorage.getItem('freshgreens_current_staff'));
    
    console.log('[Employee.js] Checking staff session:', currentStaff);
    
    if (!currentStaff) {
        console.log('[Employee.js] No staff session found, redirecting to login...');
        showNotification('Please log in to access the staff dashboard.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    console.log('[Employee.js] Staff logged in:', currentStaff.name);
    
    // Initialize dashboard
    initializeDashboard();
    setupEventListeners();
    updateClock();
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    setInterval(loadDashboardData, 30000);
});

function initializeDashboard() {
    // Update staff info
    document.getElementById('staffName').textContent = `${currentStaff.name}'s Dashboard`;
    document.getElementById('staffRole').textContent = currentStaff.role;
    document.getElementById('staffWelcome').textContent = `Welcome, ${currentStaff.name}`;
    
    // Set up tab functionality
    setupTabs();
}

function setupEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadDashboardData();
        showNotification('Dashboard refreshed', 'success');
    });
    
    // Filter button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        window.showConfirmModal('Are you sure you want to logout?').then(confirmed => {
            if (confirmed) {
                console.log('[Employee.js] Logging out staff user');
                localStorage.removeItem('freshgreens_current_staff');
                window.location.href = 'login.html';
            }
        }).catch(() => {});
    });
    
    // Search input
    const searchInput = document.getElementById('searchOrders');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Priority filter
    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', applyFilters);
    }
}

function setupTabs() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Load data for the selected tab
    loadTabData(tabId);
}

function loadDashboardData() {
    loadOrders();
    updateClock();
}

function loadOrders() {
    // Get orders from database or generate sample data
    const orders = getOrders();
    allOrders = orders.filter(order => order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED);
    
    updateOrderStats();
    loadTabData('pending'); // Load pending tab by default
}

function getOrders() {
    // Try to get orders from localStorage first
    const storedOrders = JSON.parse(localStorage.getItem('freshgreens_orders'));
    if (storedOrders && storedOrders.length > 0) {
        return storedOrders;
    }
    
    // Fallback: create sample orders for demo
    return generateSampleOrders();
}

function generateSampleOrders() {
    const statuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING, ORDER_STATUS.READY, ORDER_STATUS.OUT_FOR_DELIVERY];
    const priorities = ['high', 'medium', 'low'];
    const customers = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Reyes', 'Anna Lopez'];
    const products = [
        { name: 'Mediterranean Bliss', price: 189 },
        { name: 'Protein Power Bowl', price: 219 },
        { name: 'Asian Crunch', price: 199 },
        { name: 'Classic Caesar', price: 179 }
    ];
    
    return Array.from({ length: 12 }, (_, i) => ({
        id: 'ORD' + (1000 + i),
        userId: 'user' + i,
        items: [
            { 
                product: products[i % 4],
                quantity: Math.floor(Math.random() * 2) + 1,
                customizations: i % 2 === 0 ? {
                    base: { name: 'Mixed Greens' },
                    protein: { name: 'Grilled Chicken' },
                    vegetables: [{ name: 'Tomatoes' }, { name: 'Cucumber' }],
                    dressing: { name: 'Lemon Herb Vinaigrette' }
                } : null
            }
        ],
        status: statuses[i % 4],
        createdAt: new Date(Date.now() - (i * 15 * 60 * 1000)).toISOString(),
        total: products[i % 4].price * (Math.floor(Math.random() * 2) + 1),
        priority: priorities[i % 3],
        customerName: customers[i % 4],
        phone: '+63 912 345 6789',
        updatedAt: new Date().toISOString()
    }));
}

function updateOrderStats() {
    const pending = allOrders.filter(order => 
        order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED
    ).length;
    const preparing = allOrders.filter(order => order.status === ORDER_STATUS.PREPARING).length;
    const ready = allOrders.filter(order => order.status === ORDER_STATUS.READY).length;
    const delivery = allOrders.filter(order => order.status === ORDER_STATUS.OUT_FOR_DELIVERY).length;
    
    document.getElementById('pendingOrders').textContent = pending;
    document.getElementById('preparingOrders').textContent = preparing;
    document.getElementById('readyOrders').textContent = ready;
    document.getElementById('deliveryOrders').textContent = delivery;
}

function loadTabData(tabId) {
    let orders = allOrders;
    
    switch(tabId) {
        case 'pending':
            orders = orders.filter(order => 
                order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED
            );
            break;
        case 'preparing':
            orders = orders.filter(order => order.status === ORDER_STATUS.PREPARING);
            break;
        case 'ready':
            orders = orders.filter(order => 
                order.status === ORDER_STATUS.READY || order.status === ORDER_STATUS.OUT_FOR_DELIVERY
            );
            break;
        case 'all':
            // Show all orders
            break;
    }
    
    displayOrders(orders, `${tabId}OrdersList`);
}

function applyFilters() {
    const searchTerm = document.getElementById('searchOrders').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
    const currentTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    
    let orders = allOrders;
    
    // Filter by current tab
    if (currentTab !== 'all') {
        if (currentTab === 'pending') {
            orders = orders.filter(order => 
                order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED
            );
        } else if (currentTab === 'preparing') {
            orders = orders.filter(order => order.status === ORDER_STATUS.PREPARING);
        } else if (currentTab === 'ready') {
            orders = orders.filter(order => 
                order.status === ORDER_STATUS.READY || order.status === ORDER_STATUS.OUT_FOR_DELIVERY
            );
        }
    }
    
    // Apply search filter
    if (searchTerm) {
        orders = orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.items.some(item => item.product.name.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
        orders = orders.filter(order => order.priority === priorityFilter);
    }
    
    displayOrders(orders, `${currentTab}OrdersList`);
}

function displayOrders(orders, containerId) {
    const container = document.getElementById(containerId);
    
    if (orders.length === 0) {
        container.innerHTML = createEmptyState('No Orders', 'There are no orders matching your criteria.');
        return;
    }
    
    container.innerHTML = orders.map(order => createOrderCard(order)).join('');
    
    // Add event listeners to action buttons
    addOrderActionListeners();
}

function createOrderCard(order) {
    const showDetails = document.querySelector('.tab-btn.active').getAttribute('data-tab') === 'all';
    
    return `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <h3>Order #${order.id}</h3>
                    <span class="customer-name">${order.customerName}</span>
                    <span class="order-time">${formatTime(order.createdAt)}</span>
                </div>
                <div class="order-meta">
                    <span class="priority-badge ${order.priority}">${order.priority.toUpperCase()}</span>
                    <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span class="item-quantity">${item.quantity}x</span>
                        <span class="item-name">${item.product.name}</span>
                        <span class="item-price">₱${(item.product.price * item.quantity).toFixed(2)}</span>
                        ${item.customizations ? `
                            <div class="special-instructions">
                                <i class="fas fa-info-circle"></i>
                                ${getCustomizationsText(item.customizations)}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: ₱${order.total.toFixed(2)}
            </div>
            <div class="order-actions">
                ${getActionButtons(order)}
                ${showDetails ? `
                    <button class="btn btn-outline view-details-btn" data-order-id="${order.id}">
                        <i class="fas fa-eye"></i> Details
                    </button>
                ` : ''}
            </div>
        </div>
    `;
}

function createEmptyState(title, message) {
    return `
        <div class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function getActionButtons(order) {
    switch(order.status) {
        case ORDER_STATUS.PENDING:
        case ORDER_STATUS.CONFIRMED:
            return `
                <button class="btn btn-primary start-prep-btn" data-order-id="${order.id}">
                    <i class="fas fa-play"></i> Start Preparing
                </button>
                <button class="btn btn-outline cancel-order-btn" data-order-id="${order.id}">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
        case ORDER_STATUS.PREPARING:
            return `
                <button class="btn btn-success mark-ready-btn" data-order-id="${order.id}">
                    <i class="fas fa-check"></i> Mark Ready
                </button>
                <button class="btn btn-outline revert-order-btn" data-order-id="${order.id}">
                    <i class="fas fa-undo"></i> Revert
                </button>
            `;
        case ORDER_STATUS.READY:
            return `
                <button class="btn btn-info start-delivery-btn" data-order-id="${order.id}">
                    <i class="fas fa-motorcycle"></i> Out for Delivery
                </button>
                <button class="btn btn-outline revert-order-btn" data-order-id="${order.id}">
                    <i class="fas fa-undo"></i> Revert
                </button>
            `;
        case ORDER_STATUS.OUT_FOR_DELIVERY:
            return `
                <button class="btn btn-success mark-delivered-btn" data-order-id="${order.id}">
                    <i class="fas fa-check-circle"></i> Mark Delivered
                </button>
            `;
        default:
            return '';
    }
}

function addOrderActionListeners() {
    // Start preparing button
    document.querySelectorAll('.start-prep-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            updateOrderStatus(orderId, ORDER_STATUS.PREPARING);
        });
    });
    
    // Mark ready button
    document.querySelectorAll('.mark-ready-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            updateOrderStatus(orderId, ORDER_STATUS.READY);
        });
    });
    
    // Start delivery button
    document.querySelectorAll('.start-delivery-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            updateOrderStatus(orderId, ORDER_STATUS.OUT_FOR_DELIVERY);
        });
    });
    
    // Mark delivered button
    document.querySelectorAll('.mark-delivered-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            updateOrderStatus(orderId, ORDER_STATUS.DELIVERED);
        });
    });
    
    // Cancel order button
    document.querySelectorAll('.cancel-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
        });
    });
    
    // Revert order button
    document.querySelectorAll('.revert-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            const order = allOrders.find(o => o.id === orderId);
            if (order) {
                let previousStatus;
                switch(order.status) {
                    case ORDER_STATUS.PREPARING:
                        previousStatus = ORDER_STATUS.PENDING;
                        break;
                    case ORDER_STATUS.READY:
                        previousStatus = ORDER_STATUS.PREPARING;
                        break;
                    default:
                        previousStatus = ORDER_STATUS.PENDING;
                }
                updateOrderStatus(orderId, previousStatus);
            }
        });
    });
    
    // View details button
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            viewOrderDetails(orderId);
        });
    });
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const confirmed = await window.showConfirmModal(`Are you sure you want to update order #${orderId} to "${getStatusText(newStatus)}"?`);
        if (!confirmed) return;
        // Update locally
        const orderIndex = allOrders.findIndex(order => order.id === orderId);
        if (orderIndex > -1) {
            allOrders[orderIndex].status = newStatus;
            allOrders[orderIndex].updatedAt = new Date().toISOString();
            
            // Save to localStorage
            const allStoredOrders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
            const storedOrderIndex = allStoredOrders.findIndex(order => order.id === orderId);
            if (storedOrderIndex > -1) {
                allStoredOrders[storedOrderIndex].status = newStatus;
                allStoredOrders[storedOrderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('freshgreens_orders', JSON.stringify(allStoredOrders));
            }
            
            // Remove from current view if delivered or cancelled
            if (newStatus === ORDER_STATUS.DELIVERED || newStatus === ORDER_STATUS.CANCELLED) {
                allOrders.splice(orderIndex, 1);
            }
            
            showNotification(`Order ${orderId} status updated to ${getStatusText(newStatus)}`, 'success');
            
            // Refresh the display
            updateOrderStats();
            const currentTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
            loadTabData(currentTab);
        }
    } catch (e) {
        // ignore modal errors
    }
}

function getStatusText(status) {
    const statusMap = {
        [ORDER_STATUS.PENDING]: 'Pending',
        [ORDER_STATUS.CONFIRMED]: 'Confirmed',
        [ORDER_STATUS.PREPARING]: 'Preparing',
        [ORDER_STATUS.READY]: 'Ready',
        [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
        [ORDER_STATUS.DELIVERED]: 'Delivered',
        [ORDER_STATUS.CANCELLED]: 'Cancelled'
    };
    
    return statusMap[status] || status;
}

function getCustomizationsText(customizations) {
    if (!customizations) return '';
    
    const parts = [];
    if (customizations.base) parts.push(`Base: ${customizations.base.name}`);
    if (customizations.protein) parts.push(`Protein: ${customizations.protein.name}`);
    if (customizations.vegetables && customizations.vegetables.length > 0) {
        parts.push(`Veggies: ${customizations.vegetables.map(v => v.name).join(', ')}`);
    }
    if (customizations.dressing) parts.push(`Dressing: ${customizations.dressing.name}`);
    
    return parts.join(', ');
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const clockElement = document.getElementById('currentTime');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (order) {
        const details = `
Order Details:
-------------
Order ID: ${order.id}
Customer: ${order.customerName}
Phone: ${order.phone}
Status: ${getStatusText(order.status)}
Priority: ${order.priority.toUpperCase()}
Order Time: ${new Date(order.createdAt).toLocaleString()}
Last Updated: ${new Date(order.updatedAt).toLocaleString()}

Items:
${order.items.map(item => `
  • ${item.product.name} × ${item.quantity}
    Price: ₱${item.product.price.toFixed(2)} each
    Subtotal: ₱${(item.product.price * item.quantity).toFixed(2)}
    ${item.customizations ? `Customizations: ${getCustomizationsText(item.customizations)}` : ''}
`).join('')}

Total: ₱${order.total.toFixed(2)}
        `;
        window.showModalNotification(details, { stayOpen: true, autoClose: 8000 });
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.3s ease;
                color: white;
                font-weight: 500;
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
            @keyframes slideIn {
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

// Utility functions for other pages
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('freshgreens_current_staff')) || { name: 'Staff Member', role: 'Kitchen Staff' };
}

function saveOrders(orders) {
    localStorage.setItem('freshgreens_orders', JSON.stringify(orders));
}