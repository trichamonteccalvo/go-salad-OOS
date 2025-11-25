// staff-orders.js - Order management for staff dashboard

let currentOrders = [];
let filteredOrders = [];

window.addEventListener('DOMContentLoaded', function() {
    console.log('[Staff Orders] Page loaded');
    
    // Check if staff is logged in
    const currentStaff = localStorage.getItem('freshgreens_current_staff');
    if (!currentStaff) {
        console.log('[Staff Orders] No staff session, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    const staff = JSON.parse(currentStaff);
    document.getElementById('staffWelcome').textContent = `Welcome, ${staff.name}`;

    // Load and display orders
    loadOrders();
    // Listen for new orders placed elsewhere (customer checkout) and reload
    window.addEventListener('freshgreens_order_placed', function(e) {
        console.log('[Staff Orders] freshgreens_order_placed event received', e && e.detail ? e.detail.id : 'no-detail');
        loadOrders();
        try { if (typeof window.showModalNotification === 'function') window.showModalNotification('New order received', { stayOpen: true }); } catch (ex) { /* ignore */ }
    });
    setupEventListeners();
});

function loadOrders() {
    currentOrders = freshGreensDB.getAllOrders();
    filteredOrders = currentOrders;
    renderOrdersTable(filteredOrders);
    console.log('[Staff Orders] Loaded', currentOrders.length, 'orders');
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    No orders found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr data-order-id="${order.id}">
            <td><strong>${order.id}</strong></td>
            <td>
                <div>${order.customerName}</div>
                <div style="font-size: 0.85rem; color: #666;">${order.email}</div>
            </td>
            <td>
                <div style="max-width: 200px; white-space: pre-wrap; word-break: break-word;">
                    ${order.items.map(item => `${item.product?.name || item.name} (x${item.quantity})`).join(', ')}
                </div>
            </td>
            <td>
                <span class="status-badge status-${order.status}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>
                <span class="priority-badge ${order.priority}">
                    ${order.priority.toUpperCase()}
                </span>
            </td>
            <td>${formatTime(order.createdAt)}</td>
            <td>
                <button class="btn btn-sm view-order-btn" data-order-id="${order.id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm update-status-btn" data-order-id="${order.id}">
                    <i class="fas fa-edit"></i> Update
                </button>
            </td>
        </tr>
    `).join('');

    // Attach event listeners
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });

    document.querySelectorAll('.update-status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showStatusUpdateModal(orderId);
        });
    });
}

function showOrderDetails(orderId) {
    const order = freshGreensDB.getOrderById(orderId);
    if (!order) {
        window.showModalNotification('Order not found', { stayOpen: true });
        return;
    }

    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    
    const itemsHtml = order.items.map(item => `
        <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <div><strong>${item.product?.name || item.name}</strong> × ${item.quantity}</div>
            <div style="color: #666;">Price: ₱${(item.product?.price || 0).toFixed(2)}</div>
            ${item.customizations ? `
                <div style="font-size: 0.9rem; color: #999; margin-top: 5px;">
                    Customizations: ${getCustomizationsText(item.customizations)}
                </div>
            ` : ''}
        </div>
    `).join('');

    content.innerHTML = `
        <div style="max-height: 500px; overflow-y: auto;">
            <div style="margin-bottom: 20px;">
                <h3>${order.id}</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <strong>Customer:</strong>
                        <div>${order.customerName}</div>
                        <div style="font-size: 0.9rem; color: #666;">${order.email}</div>
                        <div style="font-size: 0.9rem; color: #666;">${order.phone}</div>
                    </div>
                    <div>
                        <strong>Status:</strong>
                        <div><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></div>
                        <strong style="margin-top: 10px; display: block;">Priority:</strong>
                        <div><span class="priority-badge ${order.priority}">${order.priority.toUpperCase()}</span></div>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Items (₱):</strong>
                ${itemsHtml}
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Delivery Address:</strong>
                <div>${order.deliveryAddress}</div>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Payment Method:</strong>
                <div>${order.paymentMethod}</div>
            </div>

            <div style="margin-bottom: 20px; font-size: 1.1rem; font-weight: 600;">
                <strong>Total: ₱${order.total.toFixed(2)}</strong>
            </div>

            <div style="margin-bottom: 20px;">
                <strong>Order Time:</strong>
                <div>${new Date(order.createdAt).toLocaleString()}</div>
                <strong style="margin-top: 10px; display: block;">Last Updated:</strong>
                <div>${new Date(order.updatedAt).toLocaleString()}</div>
            </div>

            ${order.notes ? `
                <div style="margin-bottom: 20px;">
                    <strong>Notes:</strong>
                    <div>${order.notes}</div>
                </div>
            ` : ''}
        </div>

        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
            <button class="btn btn-primary" id="updateStatusFromModal" data-order-id="${order.id}">
                Update Status
            </button>
            <button class="btn btn-outline close-modal">Close</button>
        </div>
    `;

    document.getElementById('updateStatusFromModal').addEventListener('click', function() {
        showStatusUpdateModal(order.id);
    });

    modal.style.display = 'flex';
}

function showStatusUpdateModal(orderId) {
    const order = freshGreensDB.getOrderById(orderId);
    if (!order) return;

    document.getElementById('updateOrderId').value = order.id;
    document.getElementById('updateStatusSelect').value = order.status;
    document.getElementById('updateOrderNotes').value = order.notes || '';

    const modal = document.getElementById('updateStatusModal');
    modal.style.display = 'flex';
}

function setupEventListeners() {
    document.getElementById('refreshOrdersBtn').addEventListener('click', function() {
        loadOrders();
        window.showModalNotification('Orders refreshed');
    });

    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('orderPriorityFilter').addEventListener('change', applyFilters);
    
    document.getElementById('applyOrderFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', function() {
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('orderPriorityFilter').value = 'all';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        filteredOrders = currentOrders;
        renderOrdersTable(filteredOrders);
    });

    document.getElementById('searchOrdersBtn').addEventListener('click', function() {
        const query = document.getElementById('orderSearch').value.toLowerCase();
        if (query) {
            filteredOrders = currentOrders.filter(order =>
                order.id.toLowerCase().includes(query) ||
                order.customerName.toLowerCase().includes(query) ||
                order.email.toLowerCase().includes(query) ||
                order.items.some(item => (item.product?.name || item.name).toLowerCase().includes(query))
            );
            renderOrdersTable(filteredOrders);
        }
    });

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('orderDetailsModal').style.display = 'none';
            document.getElementById('updateStatusModal').style.display = 'none';
        });
    });

    // Update Status Form Submission
    const updateStatusForm = document.getElementById('updateStatusForm');
    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const orderId = document.getElementById('updateOrderId').value;
            const newStatus = document.getElementById('updateStatusSelect').value;
            const notes = document.getElementById('updateOrderNotes').value;
            
            if (!newStatus) {
                window.showModalNotification('Please select a status', { stayOpen: true });
                return;
            }

            const updated = freshGreensDB.updateOrderStatus(orderId, newStatus);
            if (updated) {
                // Update notes if provided
                let orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
                const orderIndex = orders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1 && notes) {
                    orders[orderIndex].notes = notes;
                    localStorage.setItem('freshgreens_orders', JSON.stringify(orders));
                }
                
                window.showModalNotification(`Order ${orderId} updated to ${getStatusText(newStatus)}`);
                document.getElementById('updateStatusModal').style.display = 'none';
                document.getElementById('orderDetailsModal').style.display = 'none';
                loadOrders();
            }
        });
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('freshgreens_current_staff');
        window.location.href = 'login.html';
    });
}

function applyFilters() {
    let filtered = currentOrders;

    const statusFilter = document.getElementById('statusFilter').value;
    if (statusFilter !== 'all') {
        filtered = filtered.filter(o => o.status === statusFilter);
    }

    const priorityFilter = document.getElementById('orderPriorityFilter').value;
    if (priorityFilter !== 'all') {
        filtered = filtered.filter(o => o.priority === priorityFilter);
    }

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    if (startDate) {
        const start = new Date(startDate);
        filtered = filtered.filter(o => new Date(o.createdAt) >= start);
    }
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filtered = filtered.filter(o => new Date(o.createdAt) <= end);
    }

    filteredOrders = filtered;
    renderOrdersTable(filteredOrders);
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

function formatTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

function getCustomizationsText(customizations) {
    const parts = [];
    if (customizations.base) parts.push(`Base: ${customizations.base.name}`);
    if (customizations.protein) parts.push(`Protein: ${customizations.protein.name}`);
    if (customizations.vegetables && customizations.vegetables.length) {
        parts.push(`Veggies: ${customizations.vegetables.map(v => v.name).join(', ')}`);
    }
    if (customizations.dressing) parts.push(`Dressing: ${customizations.dressing.name}`);
    return parts.join(' | ');
}
