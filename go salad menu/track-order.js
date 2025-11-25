// track-order.js - Order Tracking Functionality

let map;
let driverMarker;
let deliveryMarker;
let currentTrackingOrder = null;
let trackingInterval;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Track Order] Page loaded');
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
    if (!currentUser) {
        showNotLoggedIn();
        return;
    }

    // Setup event listeners
    setupEventListeners();

    // Load user's orders on page load
    loadUserOrders();
});

function setupEventListeners() {
    // Search button
    const searchBtn = document.getElementById('searchOrderBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchOrder);
    }

    // Search input enter key
    const searchInput = document.getElementById('orderIdInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchOrder();
            }
        });
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            currentTrackingOrder = null;
            document.getElementById('trackingSection').style.display = 'none';
            document.getElementById('ordersListSection').style.display = 'block';
            document.getElementById('noOrderSection').style.display = 'none';
            clearInterval(trackingInterval);
        });
    }

    // Try again button
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            document.getElementById('orderIdInput').value = '';
            document.getElementById('noOrderSection').style.display = 'none';
            document.getElementById('ordersListSection').style.display = 'block';
            document.getElementById('searchError').style.display = 'none';
            loadUserOrders();
        });
    }

    // Contact support button
    const contactSupportBtn = document.getElementById('contactSupportBtn');
    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', function() {
            document.getElementById('supportModal').style.display = 'block';
        });
    }

    // Contact driver button
    const contactDriverBtn = document.getElementById('contactDriverBtn');
    if (contactDriverBtn) {
        contactDriverBtn.addEventListener('click', function() {
            if (currentTrackingOrder && currentTrackingOrder.status === 'delivery') {
                window.showModalNotification('Calling driver...\n\nDriver: Juan Dela Cruz\nPhone: +63 917-123-4567', { autoClose: 4000 });
            } else {
                window.showModalNotification('Driver contact will be available once your order is out for delivery.', { stayOpen: true });
            }
        });
    }

    // Modal close button
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('supportModal').style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('supportModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initializeMap() {
    // Initialize Leaflet map
    if (!map) {
        map = L.map('map').setView([14.5995, 120.9842], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);
    }
}

function loadUserOrders() {
    const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
    const allOrders = getAllOrders();

    // Filter orders for current user
    const userOrders = allOrders.filter(order => order.userId === currentUser.id);

    if (userOrders.length === 0) {
        document.getElementById('ordersListSection').style.display = 'none';
        document.getElementById('noOrderSection').style.display = 'flex';
        document.querySelector('.no-order-card h2').textContent = 'No Orders Yet';
        document.querySelector('.no-order-card p').textContent = 'You haven\'t placed any orders yet. Start ordering fresh salads now!';
        return;
    }

    renderOrdersList(userOrders);
}

function getAllOrders() {
    // Try to get orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('freshgreens_orders'));
    if (storedOrders && storedOrders.length > 0) {
        return storedOrders;
    }
    
    // Fallback: create sample orders for demo
    return generateSampleOrders();
}

function generateSampleOrders() {
    const statuses = ['pending', 'preparing', 'ready', 'delivery', 'completed'];
    const customers = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Reyes', 'Anna Lopez'];
    const addresses = [
        '123 Main Street, Manila',
        '456 Oak Avenue, Quezon City',
        '789 Pine Road, Makati',
        '321 Elm Boulevard, Taguig'
    ];
    
    const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
    
    return Array.from({ length: 6 }, (_, i) => ({
        id: 'ORD' + (1000 + i),
        userId: currentUser.id,
        items: [
            { 
                product: { 
                    name: ['Mediterranean Bliss', 'Protein Power Bowl', 'Asian Crunch', 'Classic Caesar'][i % 4], 
                    price: [189, 219, 199, 179][i % 4]
                },
                quantity: Math.floor(Math.random() * 2) + 1
            },
            ...(i % 2 === 0 ? [{
                product: {
                    name: 'Fresh Juice',
                    price: 89
                },
                quantity: 1
            }] : [])
        ],
        status: statuses[i % 5],
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date(Date.now() - (i * 2 * 60 * 60 * 1000)).toISOString(),
        total: [189, 219, 199, 179][i % 4] * (Math.floor(Math.random() * 2) + 1) + (i % 2 === 0 ? 89 : 0),
        customerName: customers[i % 4],
        deliveryAddress: addresses[i % 4],
        phone: '+63 912 345 6789',
        notes: i % 3 === 0 ? 'Please deliver to the security guard' : null
    }));
}

function renderOrdersList(orders) {
    const ordersList = document.getElementById('ordersList');
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card" onclick="selectOrder('${order.id}')">
            <div class="order-card-header">
                <div>
                    <div class="order-card-id">${order.id}</div>
                    <div class="order-card-date">${formatDate(order.createdAt)}</div>
                </div>
                <span class="order-card-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-card-body">
                ${order.items.slice(0, 2).map(item => `
                    <div class="order-card-item">
                        <span>${item.product?.name || item.name || 'Item'}</span>
                        <span class="item-quantity">x${item.quantity || 1}</span>
                    </div>
                `).join('')}
                ${order.items.length > 2 ? `<div class="order-card-item"><em>+${order.items.length - 2} more items</em></div>` : ''}
            </div>
            <div class="order-card-total">
                <span>Total</span>
                <span>₱${order.total.toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    document.getElementById('ordersListSection').style.display = 'block';
    document.getElementById('trackingSection').style.display = 'none';
    document.getElementById('noOrderSection').style.display = 'none';
}

function selectOrder(orderId) {
    const allOrders = getAllOrders();
    const order = allOrders.find(o => o.id === orderId);
    
    if (order) {
        currentTrackingOrder = order;
        displayOrderTracking(order);
    }
}

function searchOrder() {
    const searchInput = document.getElementById('orderIdInput').value.trim();
    const errorElement = document.getElementById('searchError');

    if (!searchInput) {
        errorElement.textContent = 'Please enter an Order ID or Email';
        errorElement.style.display = 'block';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
    const allOrders = getAllOrders();

    // Search by Order ID or Email
    const searchLower = searchInput.toLowerCase();
    let foundOrder = null;

    // Search in current user's orders
    const userOrders = allOrders.filter(o => o.userId === currentUser.id);
    foundOrder = userOrders.find(o => 
        o.id.toLowerCase().includes(searchLower)
    );

    if (foundOrder) {
        errorElement.style.display = 'none';
        currentTrackingOrder = foundOrder;
        displayOrderTracking(foundOrder);
    } else {
        errorElement.textContent = 'Order not found. Please check the Order ID.';
        errorElement.style.display = 'block';
        document.getElementById('trackingSection').style.display = 'none';
        document.getElementById('ordersListSection').style.display = 'none';
        document.getElementById('noOrderSection').style.display = 'flex';
    }
}

function displayOrderTracking(order) {
    // Update order header
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('orderTime').textContent = formatFullTime(order.createdAt);
    document.getElementById('orderTotal').textContent = '₱' + order.total.toFixed(2);

    // Update delivery address
    document.getElementById('addressDisplay').textContent = order.deliveryAddress || 'Not specified';

    // Update items list
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = order.items.map(item => `
        <div class="item-entry">
            <span class="item-name">${item.product?.name || item.name || 'Unknown'}</span>
            <span class="item-quantity">x${item.quantity || 1}</span>
        </div>
    `).join('');

    // Update notes if available
    const notesSection = document.getElementById('notesSection');
    if (order.notes) {
        document.getElementById('notesContent').textContent = order.notes;
        notesSection.style.display = 'block';
    } else {
        notesSection.style.display = 'none';
    }

    // Update timeline
    updateStatusTimeline(order);

    // Show tracking section
    document.getElementById('ordersListSection').style.display = 'none';
    document.getElementById('noOrderSection').style.display = 'none';
    document.getElementById('trackingSection').style.display = 'block';

    // Update map and estimated time after the tracking section is visible so Leaflet can calculate sizes
    setTimeout(() => {
        try {
            // ensure map is initialized and resized
            if (!map) initializeMap();
            if (map && typeof map.invalidateSize === 'function') {
                map.invalidateSize();
            }
        } catch (e) {
            console.warn('[Track Order] map init/resize failed', e);
        }

        updateDeliveryMap(order);
        // Update estimated time
        updateEstimatedTime(order);
    }, 100);

    // Start real-time updates if order is in delivery
    clearInterval(trackingInterval);
    if (order.status === 'delivery') {
        trackingInterval = setInterval(function() {
            updateDeliveryMap(order);
        }, 5000); // Update every 5 seconds
    }
}

function updateStatusTimeline(order) {
    const statuses = [
        { value: 'pending', label: 'Order Placed', icon: 'fa-shopping-cart' },
        { value: 'preparing', label: 'Preparing', icon: 'fa-utensils' },
        { value: 'ready', label: 'Ready for Pickup', icon: 'fa-box' },
        { value: 'delivery', label: 'Out for Delivery', icon: 'fa-truck' },
        { value: 'completed', label: 'Delivered', icon: 'fa-check-circle' }
    ];

    const timeline = document.getElementById('statusTimeline');
    const currentStatusIndex = statuses.findIndex(s => s.value === order.status);

    timeline.innerHTML = statuses.map((status, index) => {
        const isCompleted = index < currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        const isNext = index > currentStatusIndex;

        let description = '';
        let timeText = '';

        if (status.value === 'pending') {
            timeText = formatTime(order.createdAt);
            description = 'Your order has been placed';
        } else if (status.value === 'preparing' && (isCompleted || isCurrent)) {
            timeText = isCompleted ? formatTime(order.updatedAt) : 'In progress';
            description = 'We are preparing your fresh salad';
        } else if (status.value === 'ready' && (isCompleted || isCurrent)) {
            timeText = isCompleted ? formatTime(order.updatedAt) : 'Ready';
            description = 'Your order is ready for pickup';
        } else if (status.value === 'delivery' && (isCompleted || isCurrent)) {
            timeText = isCompleted ? formatTime(order.updatedAt) : 'In transit';
            description = 'Your order is on the way';
        } else if (status.value === 'completed' && isCompleted) {
            timeText = formatTime(order.updatedAt);
            description = 'Your order has been delivered';
        } else {
            timeText = '--';
            description = 'Not yet started';
        }

        let statusClass = 'pending';
        if (isCompleted) statusClass = 'completed';
        else if (isCurrent) statusClass = order.status;

        return `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-status">${status.label}</div>
                <div class="timeline-time">${timeText}</div>
                <div class="timeline-description">${description}</div>
            </div>
        `;
    }).join('');

    // Add cancelled status if applicable
    if (order.status === 'cancelled') {
        timeline.innerHTML = `
            <div class="timeline-item cancelled">
                <div class="timeline-status">Order Cancelled</div>
                <div class="timeline-time">${formatTime(order.updatedAt)}</div>
                <div class="timeline-description">This order has been cancelled</div>
            </div>
        `;
    }
}

function updateDeliveryMap(order) {
    if (!map) {
        initializeMap();
    }

    // Clear existing markers
    if (driverMarker) {
        map.removeLayer(driverMarker);
    }
    if (deliveryMarker) {
        map.removeLayer(deliveryMarker);
    }

    // Simulated delivery coordinates
    const storeLocation = [14.6091, 120.9824]; // Store location
    const deliveryLocation = [14.5886, 120.9713]; // Customer delivery location

    // Add delivery destination marker
    deliveryMarker = L.marker(deliveryLocation, {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).bindPopup('Delivery Destination').addTo(map);

    // Add driver marker based on status
    let driverLocation = storeLocation;
    let driverPopup = 'At store';

    if (order.status === 'delivery') {
        // Simulate driver moving towards delivery location
        const progress = Math.min(0.8, (Date.now() / 60000) % 1); // Cycle every 60 seconds, max 80% progress
        driverLocation = [
            storeLocation[0] + (deliveryLocation[0] - storeLocation[0]) * progress,
            storeLocation[1] + (deliveryLocation[1] - storeLocation[1]) * progress
        ];
        driverPopup = 'On the way - ' + Math.round(progress * 100) + '% to destination';
    } else if (order.status === 'completed') {
        driverLocation = deliveryLocation;
        driverPopup = 'Delivered';
    }

    driverMarker = L.marker(driverLocation, {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).bindPopup(driverPopup).addTo(map);

    // Fit bounds to show both markers (ensure map has correct size)
    try {
        if (map && typeof map.invalidateSize === 'function') map.invalidateSize();
    } catch (e) {}
    const bounds = L.latLngBounds([storeLocation, deliveryLocation]);
    // call fitBounds slightly after invalidateSize to avoid Leaflet rendering issues when container was hidden
    setTimeout(() => {
        try { map.fitBounds(bounds, { padding: [50, 50] }); } catch (e) { console.warn('[Track Order] fitBounds failed', e); }
    }, 80);

    // Update driver name
    if (order.status === 'delivery' || order.status === 'completed') {
        document.getElementById('driverName').textContent = 'Juan Dela Cruz';
    } else {
        document.getElementById('driverName').textContent = 'Not assigned yet';
    }
}

function updateEstimatedTime(order) {
    const estimatedTimeEl = document.getElementById('estimatedTime');
    let estimatedTime = '--:--';

    if (order.status === 'pending') {
        estimatedTime = '30-40 min';
    } else if (order.status === 'preparing') {
        estimatedTime = '15-25 min';
    } else if (order.status === 'ready') {
        estimatedTime = '10-15 min';
    } else if (order.status === 'delivery') {
        estimatedTime = '5-10 min';
    } else if (order.status === 'completed') {
        estimatedTime = 'Delivered';
    }

    estimatedTimeEl.textContent = estimatedTime;
}

function showNotLoggedIn() {
    document.getElementById('notLoggedSection').style.display = 'flex';
    document.getElementById('quick-search-section').style.display = 'none';
    document.getElementById('ordersListSection').style.display = 'none';
    document.getElementById('trackingSection').style.display = 'none';
    document.getElementById('noOrderSection').style.display = 'none';
}

// Helper Functions
function getStatusText(status) {
    const statuses = {
        pending: 'Pending',
        preparing: 'Preparing',
        ready: 'Ready',
        delivery: 'Out for Delivery',
        completed: 'Delivered',
        cancelled: 'Cancelled'
    };
    return statuses[status] || status;
}

function formatTime(dateString) {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatFullTime(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(dateString) {
    if (!dateString) return '--';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today ' + formatTime(dateString);
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday ' + formatTime(dateString);
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}