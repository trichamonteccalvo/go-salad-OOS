// staff-inventory.js - Inventory management for staff dashboard

let currentInventory = [];
let filteredInventory = [];
let editingItemId = null;

window.addEventListener('DOMContentLoaded', function() {
    console.log('[Staff Inventory] Page loaded');
    
    // Check if staff is logged in
    const currentStaff = localStorage.getItem('freshgreens_current_staff');
    if (!currentStaff) {
        console.log('[Staff Inventory] No staff session, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    const staff = JSON.parse(currentStaff);
    document.getElementById('staffWelcome').textContent = `Welcome, ${staff.name}`;

    // Load and display inventory
    loadInventory();
    setupEventListeners();
});

function loadInventory() {
    currentInventory = freshGreensDB.getInventory();
    filteredInventory = currentInventory;
    renderInventoryTable(filteredInventory);
    updateInventoryStats();
    console.log('[Staff Inventory] Loaded', currentInventory.length, 'items');
    // Update debug panel if present
    if (typeof showDebugInventory === 'function') showDebugInventory();
}

function renderInventoryTable(items) {
    const tbody = document.getElementById('inventoryTableBody');
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                    No inventory items found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = items.map(item => {
        const status = getStockStatus(item);
        return `
            <tr data-item-id="${item.id}">
                <td><strong>${item.name}</strong></td>
                <td>${capitalizeWords(item.category)}</td>
                <td>${item.currentStock}</td>
                <td>${item.minStock}</td>
                <td>${item.unit}</td>
                <td>₱${item.price.toFixed(2)}</td>
                <td>
                    <span class="status-badge status-${status}">
                        ${getStatusText(status)}
                    </span>
                </td>
                <td>${formatDate(item.lastUpdated)}</td>
                <td>
                    <button class="btn btn-sm edit-item-btn" data-item-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm delete-item-btn" data-item-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Attach event listeners
    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            editItem(itemId);
        });
    });

    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            deleteItem(itemId);
        });
    });
}

function updateInventoryStats() {
    const totalItems = currentInventory.length;
    const lowStockItems = currentInventory.filter(item => 
        item.currentStock > 0 && item.currentStock <= item.minStock
    ).length;
    const outOfStockItems = currentInventory.filter(item => 
        item.currentStock === 0
    ).length;
    const totalValue = currentInventory.reduce((sum, item) => 
        sum + (item.currentStock * item.price), 0
    );

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('lowStockItems').textContent = lowStockItems;
    document.getElementById('outOfStockItems').textContent = outOfStockItems;
    document.getElementById('totalValue').textContent = '₱' + totalValue.toFixed(2);
}

function getStockStatus(item) {
    if (item.currentStock === 0) return 'out-of-stock';
    if (item.currentStock <= item.minStock) return 'low-stock';
    return 'in-stock';
}

function getStatusText(status) {
    const statusMap = {
        'in-stock': 'In Stock',
        'low-stock': 'Low Stock',
        'out-of-stock': 'Out of Stock'
    };
    return statusMap[status] || status;
}

function formatDate(dateStr) {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

function capitalizeWords(str) {
    if (!str) return '';
    return str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

function setupEventListeners() {
    // Add Item Button
    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            editingItemId = null;
            const titleEl = document.getElementById('itemModalTitle'); if (titleEl) titleEl.textContent = 'Add New Item';
            const formEl = document.getElementById('itemForm'); if (formEl) formEl.reset();
            const modalEl = document.getElementById('itemModal'); if (modalEl) modalEl.style.display = 'flex';
        });
    }

    // Refresh Button
    const refreshBtn = document.getElementById('refreshInventoryBtn');
    if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
            loadInventory();
            window.showModalNotification('Inventory refreshed');
        });
    }

    // Search Button
    const searchBtn = document.getElementById('searchInventoryBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const queryEl = document.getElementById('inventorySearch');
            const query = queryEl ? queryEl.value.toLowerCase() : '';
            if (query) {
                filteredInventory = currentInventory.filter(item =>
                    (item.name || '').toLowerCase().includes(query) ||
                    (item.category || '').toLowerCase().includes(query) ||
                    (item.supplier || '').toLowerCase().includes(query)
                );
                renderInventoryTable(filteredInventory);
            } else {
                filteredInventory = currentInventory;
                renderInventoryTable(filteredInventory);
            }
        });
    }

    // Category Filter
    const categoryFilterEl = document.getElementById('categoryFilter');
    if (categoryFilterEl) categoryFilterEl.addEventListener('change', applyFilters);
    
    // Stock Status Filter
    const stockFilterEl = document.getElementById('stockStatusFilter');
    if (stockFilterEl) stockFilterEl.addEventListener('change', applyFilters);

    // Item Form Submission
    const itemFormEl = document.getElementById('itemForm');
    if (itemFormEl) {
        itemFormEl.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const name = (document.getElementById('itemName')?.value || '').trim();
            const category = document.getElementById('itemCategory')?.value;
            const unit = document.getElementById('itemUnit')?.value;

            if (!name) {
                window.showModalNotification('Please enter an item name', { stayOpen: true });
                return;
            }
            if (!category) {
                window.showModalNotification('Please select a category', { stayOpen: true });
                return;
            }
            if (!unit) {
                window.showModalNotification('Please select a unit', { stayOpen: true });
                return;
            }

            // Parse numeric fields and coerce NaN to 0
            let currentStock = parseFloat(document.getElementById('currentStock')?.value);
            let minStock = parseFloat(document.getElementById('minStock')?.value);
            let price = parseFloat(document.getElementById('itemPrice')?.value);
            if (Number.isNaN(currentStock)) currentStock = 0;
            if (Number.isNaN(minStock)) minStock = 0;
            if (Number.isNaN(price)) price = 0;

            const itemData = {
                name: name,
                category: category,
                unit: unit,
                currentStock: currentStock,
                minStock: minStock,
                price: price,
                supplier: (document.getElementById('supplier')?.value || '').trim(),
                description: (document.getElementById('itemDescription')?.value || '').trim(),
                lastUpdated: new Date().toISOString()
            };

            try {
                if (editingItemId) {
                    // Update existing item
                    const success = freshGreensDB.updateInventoryItem(editingItemId, itemData);
                    if (success) {
                        window.showModalNotification('Item updated successfully');
                        const modalEl = document.getElementById('itemModal'); if (modalEl) modalEl.style.display = 'none';
                        loadInventory();
                    } else {
                        console.error('[Inventory] updateInventoryItem returned false', editingItemId, itemData);
                        window.showModalNotification('Failed to update item', { stayOpen: true });
                    }
                } else {
                    // Add new item
                    const success = freshGreensDB.addInventoryItem(itemData);
                    if (success) {
                        window.showModalNotification('Item added successfully');
                        const formEl2 = document.getElementById('itemForm'); if (formEl2) formEl2.reset();
                        const modalEl2 = document.getElementById('itemModal'); if (modalEl2) modalEl2.style.display = 'none';
                        loadInventory();
                    } else {
                        console.error('[Inventory] addInventoryItem returned false', itemData);
                        window.showModalNotification('Failed to add item', { stayOpen: true });
                    }
                }
            } catch (err) {
                console.error('[Inventory] Error adding/updating item', err, itemData);
                window.showModalNotification('An error occurred while saving the item. See console for details.', { stayOpen: true });
            }
        });
    }

    // Cancel Button
    const cancelBtn = document.getElementById('cancelItemBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', function() {
        const modalEl = document.getElementById('itemModal'); if (modalEl) modalEl.style.display = 'none';
        editingItemId = null;
    });

    // Modal close button
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) closeBtn.addEventListener('click', function() {
        const modalEl = document.getElementById('itemModal'); if (modalEl) modalEl.style.display = 'none';
        editingItemId = null;
    });

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('freshgreens_current_staff');
        window.location.href = 'login.html';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('itemModal');
        if (event.target === modal) {
            modal.style.display = 'none';
            editingItemId = null;
        }
    });
}

// Debug helpers (development only)
function showDebugInventory() {
    const panel = document.getElementById('inventoryDebug');
    const content = document.getElementById('inventoryDebugContent');
    if (!panel || !content) return;
    try {
        const inv = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
        content.textContent = JSON.stringify(inv, null, 2);
        panel.style.display = 'block';
        document.getElementById('toggleDebugBtn').textContent = 'Hide';
    } catch (e) {
        content.textContent = 'Error reading inventory: ' + e;
    }
}

// Toggle debug panel
document.addEventListener('DOMContentLoaded', () => {
    const t = document.getElementById('toggleDebugBtn');
    if (t) {
        t.addEventListener('click', function() {
            const panel = document.getElementById('inventoryDebug');
            const content = document.getElementById('inventoryDebugContent');
            if (!panel) return;
            if (panel.style.display === 'none' || panel.style.display === '') {
                showDebugInventory();
            } else {
                panel.style.display = 'none';
                t.textContent = 'Show';
            }
        });
    }
});

function editItem(itemId) {
    const item = currentInventory.find(i => i.id === itemId);
    if (!item) return;

    editingItemId = itemId;
    document.getElementById('itemModalTitle').textContent = 'Edit Item';
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemUnit').value = item.unit;
    document.getElementById('currentStock').value = item.currentStock;
    document.getElementById('minStock').value = item.minStock;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('supplier').value = item.supplier || '';
    document.getElementById('itemDescription').value = item.description || '';

    document.getElementById('itemModal').style.display = 'flex';
}

async function deleteItem(itemId) {
    try {
        const confirmed = await window.showConfirmModal('Are you sure you want to delete this item?');
        if (!confirmed) return;

        const success = freshGreensDB.deleteInventoryItem(itemId);
        if (success) {
            window.showModalNotification('Item deleted successfully');
            loadInventory();
        } else {
            window.showModalNotification('Failed to delete item', { stayOpen: true });
        }
    } catch (e) {
        // ignore modal errors
    }
}

function applyFilters() {
    let filtered = currentInventory;

    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }

    const stockStatusFilter = document.getElementById('stockStatusFilter').value;
    if (stockStatusFilter !== 'all') {
        const status = stockStatusFilter.replace('out-of-stock', 'out-of-stock')
                                       .replace('low-stock', 'low-stock')
                                       .replace('in-stock', 'in-stock');
        filtered = filtered.filter(item => getStockStatus(item) === stockStatusFilter);
    }

    filteredInventory = filtered;
    renderInventoryTable(filteredInventory);
}
