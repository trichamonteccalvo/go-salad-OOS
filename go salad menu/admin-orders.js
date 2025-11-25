// admin-orders.js - Admin Orders Management

// Avoid duplicate `let` declarations for currentAdmin across admin scripts
var currentAdmin = window.currentAdmin || null;
let allOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Admin Orders] Initializing admin orders page...');
    
    // Check if admin is logged in
    currentAdmin = JSON.parse(localStorage.getItem('freshgreens_current_admin'));
    try { window.currentAdmin = currentAdmin; } catch (e) {}
    
    if (!currentAdmin) {
        console.log('[Admin Orders] No admin session found, redirecting to login...');
        window.showModalNotification('Unauthorized access. Please log in as administrator.', { stayOpen: true });
        window.location.href = 'login.html';
        return;
    }
    
    console.log('[Admin Orders] Admin logged in:', currentAdmin.name);
    
    // Update admin name in header
    const adminNameEl = document.getElementById('adminName');
    if (adminNameEl) {
        adminNameEl.textContent = currentAdmin.name;
    }
    
    // Set active navigation
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Load orders and setup
    loadOrdersData();
    setupEventListeners();
});

function setupEventListeners() {
    console.log('[Admin Orders] Setting up event listeners...');
    
    // Logout button
    const logoutBtn = document.getElementById('adminLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // non-blocking confirm modal
            window.showConfirmModal('Are you sure you want to logout?').then(confirmed => {
                if (confirmed) {
                    console.log('[Admin Orders] Logging out admin user');
                    localStorage.removeItem('freshgreens_current_admin');
                    window.location.href = 'login.html';
                }
            }).catch(() => {});
        });
    }
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Search input
    const searchInput = document.getElementById('searchOrders');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Priority filter
    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadOrdersData();
        });
    }
    
    // Update status form
    const updateStatusForm = document.getElementById('updateStatusForm');
    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateOrderStatus();
        });
    }
}

function loadOrdersData() {
    console.log('[Admin Orders] Loading orders data...');
    
    // Get orders from localStorage
    allOrders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
    
    console.log('[Admin Orders] Loaded', allOrders.length, 'orders from database');
    
    // Display all orders
    displayOrders(allOrders);
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (!tbody) {
        console.warn('[Admin Orders] Orders table body not found');
        return;
    }
    
    // Get users for customer information
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--gray);">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
                    No orders found
                </td>
            </tr>
        `;
        return;
    }
    
    // Map orders to table rows
    tbody.innerHTML = orders.map(order => {
        const user = users.find(u => u.id === order.userId);
        const customerName = user ? user.name : 'Unknown Customer';
        
        // Format items
        const itemsText = order.items && order.items.length > 0
            ? order.items.map(item => `${item.product.name} x${item.quantity}`).join(', ')
            : 'No items';
        
        return `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${customerName}</td>
                <td>${itemsText}</td>
                <td>₱${order.total.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>${order.priority || 'Normal'}</td>
                <td>${formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="openUpdateModal('${order.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function applyFilters() {
    const searchValue = (document.getElementById('searchOrders').value || '').toLowerCase();
    const statusValue = document.getElementById('statusFilter').value || '';
    const priorityValue = document.getElementById('priorityFilter').value || '';
    
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    
    // Filter orders based on all criteria
    const filtered = allOrders.filter(order => {
        const user = users.find(u => u.id === order.userId);
        const customerName = user ? user.name : '';
        
        // Search filter
        if (searchValue && !customerName.toLowerCase().includes(searchValue) && !order.id.toLowerCase().includes(searchValue)) {
            return false;
        }
        
        // Status filter
        if (statusValue && order.status !== statusValue) {
            return false;
        }
        
        // Priority filter
        if (priorityValue && order.priority !== priorityValue) {
            return false;
        }
        
        return true;
    });
    
    displayOrders(filtered);
}

function viewOrderDetails(orderId) {
    console.log('[Admin Orders] Viewing order details:', orderId);
    
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
           window.showModalNotification('Order not found!', { stayOpen: true });
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    const user = users.find(u => u.id === order.userId);
    
    // Build items HTML
    const itemsHtml = order.items && order.items.length > 0
        ? order.items.map(item => `
            <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <strong>${item.product.name}</strong> x ${item.quantity}<br>
                <small>Price: ₱${item.product.price.toFixed(2)}</small>
            </div>
        `).join('')
        : '<p>No items in order</p>';
    
    // Build details content
    const detailsHtml = `
        <div style="padding: 20px; max-height: 600px; overflow-y: auto;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h3>Order Information</h3>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></p>
                    <p><strong>Priority:</strong> ${order.priority || 'Normal'}</p>
                    <p><strong>Total Amount:</strong> <strong>₱${order.total.toFixed(2)}</strong></p>
                </div>
                
                <div>
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${user ? user.name : 'Unknown'}</p>
                    <p><strong>Email:</strong> ${user ? user.email : 'N/A'}</p>
                    <p><strong>Phone:</strong> ${order.phone || user?.phone || 'N/A'}</p>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Delivery Address</h3>
                <p>${order.deliveryAddress || 'N/A'}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3>Items Ordered</h3>
                ${itemsHtml}
            </div>
            
            ${order.notes ? `
                <div style="margin-bottom: 20px;">
                    <h3>Notes</h3>
                    <p>${order.notes}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    if (modal && content) {
        content.innerHTML = detailsHtml;
        modal.style.display = 'block';
    }
}

function openUpdateModal(orderId) {
    console.log('[Admin Orders] Opening update modal for order:', orderId);
    
    const order = allOrders.find(o => o.id === orderId);
    if (!order) {
           window.showModalNotification('Order not found!', { stayOpen: true });
        return;
    }
    
    // Populate form
    const orderIdInput = document.getElementById('updateOrderId');
    const statusSelect = document.getElementById('updateStatusSelect');
    const notesInput = document.getElementById('updateOrderNotes');
    
    if (orderIdInput) orderIdInput.value = order.id;
    if (statusSelect) statusSelect.value = order.status;
    if (notesInput) notesInput.value = order.notes || '';
    
    // Show modal
    const modal = document.getElementById('updateStatusModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function updateOrderStatus() {
    const orderId = document.getElementById('updateOrderId').value;
    const newStatus = document.getElementById('updateStatusSelect').value;
    const notes = document.getElementById('updateOrderNotes').value;
    
    if (!newStatus) {
           window.showModalNotification('Please select a status!', { stayOpen: true });
        return;
    }
    
    // Find order and update
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
           window.showModalNotification('Order not found!', { stayOpen: true });
        return;
    }
    
    // Update order
    allOrders[orderIndex].status = newStatus;
    allOrders[orderIndex].notes = notes;
    allOrders[orderIndex].updatedAt = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem('freshgreens_orders', JSON.stringify(allOrders));
    
    console.log('[Admin Orders] Order updated:', orderId, '- New status:', newStatus);
    
    // Show success notification
    showNotification(`Order ${orderId} updated to ${getStatusText(newStatus)}`, 'success');
    
    // Close modal and refresh
    document.getElementById('updateStatusModal').style.display = 'none';
    loadOrdersData();
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
    if (!dateString) return '--';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.admin-notification');
    existing.forEach(el => el.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if needed
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
            }
            .notification-success {
                background: #4caf50;
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
