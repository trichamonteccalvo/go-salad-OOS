
// database.js - Local database for cart and orders

class FreshGreensDatabase {
    constructor() {
        this.init();
    }

    init() {
        // Initialize database structure if it doesn't exist
        if (!localStorage.getItem('freshgreens_products')) {
            this.initializeProducts();
        }
        if (!localStorage.getItem('freshgreens_orders')) {
            localStorage.setItem('freshgreens_orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('freshgreens_carts')) {
            localStorage.setItem('freshgreens_carts', JSON.stringify({}));
        }
    }

    initializeProducts() {
        const products = {
            premade: [
                {
                    id: 1,
                    name: "Mediterranean Bliss",
                    price: 189,
                    description: "Mixed greens with feta, olives, cucumbers, tomatoes, and lemon herb dressing",
                    category: "premade",
                    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
                    nutrition: {
                        calories: 450,
                        protein: 18,
                        carbs: 35,
                        fat: 12,
                        fiber: 12
                    },
                    tags: ["vegan", "gluten-free"],
                    available: true
                },
                {
                    id: 2,
                    name: "Protein Power Bowl",
                    price: 219,
                    description: "Grilled chicken, quinoa, black beans, corn, avocado, and cilantro lime dressing",
                    category: "premade",
                    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
                    nutrition: {
                        calories: 520,
                        protein: 32,
                        carbs: 45,
                        fat: 18,
                        fiber: 8
                    },
                    tags: ["high-protein", "low-carb"],
                    available: true
                },
                {
                    id: 3,
                    name: "Asian Crunch",
                    price: 199,
                    description: "Napa cabbage, carrots, edamame, mandarin oranges, almonds, and ginger sesame dressing",
                    category: "premade",
                    image: "https://images.unsplash.com/photo-1561336312-9433cda7b78c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                    nutrition: {
                        calories: 380,
                        protein: 14,
                        carbs: 42,
                        fat: 16,
                        fiber: 10
                    },
                    tags: ["vegan", "dairy-free"],
                    available: true
                },
                {
                    id: 4,
                    name: "Classic Caesar",
                    price: 179,
                    description: "Crisp romaine, parmesan, croutons, and our signature Caesar dressing",
                    category: "premade",
                    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
                    nutrition: {
                        calories: 420,
                        protein: 15,
                        carbs: 38,
                        fat: 22,
                        fiber: 6
                    },
                    tags: ["vegetarian", "classic"],
                    available: true
                }
            ],
            ingredients: {
                bases: [
                    { id: 1, name: "Mixed Greens", price: 0, category: "base", available: true },
                    { id: 2, name: "Spinach", price: 0, category: "base", available: true },
                    { id: 3, name: "Kale", price: 0, category: "base", available: true },
                    { id: 4, name: "Romaine", price: 0, category: "base", available: true },
                    { id: 5, name: "Arugula", price: 15, category: "base", available: true }
                ],
                proteins: [
                    { id: 6, name: "Grilled Chicken", price: 65, category: "protein", available: true },
                    { id: 7, name: "Salmon", price: 85, category: "protein", available: true },
                    { id: 8, name: "Tofu", price: 45, category: "protein", available: true },
                    { id: 9, name: "Chickpeas", price: 35, category: "protein", available: true },
                    { id: 10, name: "Hard-Boiled Eggs", price: 30, category: "protein", available: true }
                ],
                vegetables: [
                    { id: 11, name: "Cucumber", price: 15, category: "vegetable", available: true },
                    { id: 12, name: "Tomatoes", price: 20, category: "vegetable", available: true },
                    { id: 13, name: "Bell Peppers", price: 25, category: "vegetable", available: true },
                    { id: 14, name: "Carrots", price: 15, category: "vegetable", available: true },
                    { id: 15, name: "Broccoli", price: 20, category: "vegetable", available: true },
                    { id: 16, name: "Red Onion", price: 12, category: "vegetable", available: true }
                ],
                fruits: [
                    { id: 17, name: "Apple Slices", price: 25, category: "fruit", available: true },
                    { id: 18, name: "Berries Mix", price: 40, category: "fruit", available: true },
                    { id: 19, name: "Orange Segments", price: 30, category: "fruit", available: true },
                    { id: 20, name: "Pomegranate", price: 35, category: "fruit", available: true }
                ],
                toppings: [
                    { id: 21, name: "Almonds", price: 25, category: "topping", available: true },
                    { id: 22, name: "Sunflower Seeds", price: 15, category: "topping", available: true },
                    { id: 23, name: "Feta Cheese", price: 30, category: "topping", available: true },
                    { id: 24, name: "Croutons", price: 15, category: "topping", available: true },
                    { id: 25, name: "Avocado", price: 40, category: "topping", available: true }
                ],
                dressings: [
                    { id: 26, name: "Lemon Herb Vinaigrette", price: 0, category: "dressing", available: true },
                    { id: 27, name: "Balsamic Glaze", price: 0, category: "dressing", available: true },
                    { id: 28, name: "Greek Yogurt Ranch", price: 10, category: "dressing", available: true },
                    { id: 29, name: "Tahini Dressing", price: 10, category: "dressing", available: true }
                ]
            }
        };

        localStorage.setItem('freshgreens_products', JSON.stringify(products));
    }

    // Product Methods
    getProducts() {
        return JSON.parse(localStorage.getItem('freshgreens_products'));
    }

    getPremadeSalads() {
        const products = this.getProducts();
        return products.premade;
    }

    getIngredients() {
        const products = this.getProducts();
        return products.ingredients;
    }

    getProductById(id) {
        const products = this.getProducts();
        
        // Check premade salads
        const premade = products.premade.find(product => product.id === parseInt(id));
        if (premade) return premade;

        // Check ingredients
        for (const category in products.ingredients) {
            const ingredient = products.ingredients[category].find(item => item.id === parseInt(id));
            if (ingredient) return ingredient;
        }

        return null;
    }

    // Cart Methods
    getCart(userId) {
        const carts = JSON.parse(localStorage.getItem('freshgreens_carts') || '{}');
        const uid = String(userId || 'guest');
        return carts[uid] || { items: [], total: 0 };
    }

    addToCart(userId, product, quantity = 1, customizations = {}) {
        const carts = JSON.parse(localStorage.getItem('freshgreens_carts') || '{}');
        const uid = String(userId || 'guest');
        // Debugging: log addToCart operations
        try {
            console.log('[DB] addToCart called for userId=', uid, 'product=', product, 'customizations=', customizations);
        } catch (e) {}
        let userCart = carts[uid] || { items: [], total: 0 };

        // Check if item already exists in cart
        const existingItemIndex = userCart.items.findIndex(item => 
            item.product.id === product.id && 
            JSON.stringify(item.customizations) === JSON.stringify(customizations)
        );

        if (existingItemIndex > -1) {
            // Update quantity
            userCart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            userCart.items.push({
                id: Date.now().toString(),
                product,
                quantity,
                customizations,
                addedAt: new Date().toISOString()
            });
        }

        // Update total
        userCart.total = this.calculateCartTotal(userCart.items);

        // Save back to localStorage
        carts[uid] = userCart;
        localStorage.setItem('freshgreens_carts', JSON.stringify(carts));

        // Debugging: log result
        try {
            console.log('[DB] cart saved for', uid, carts[uid]);
        } catch (e) {}

        return userCart;
    }

    updateCartItem(userId, itemId, quantity) {
        const carts = JSON.parse(localStorage.getItem('freshgreens_carts'));
        const uid = String(userId || 'guest');
        const userCart = carts[uid];

        if (!userCart) return null;

        const itemIndex = userCart.items.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                userCart.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                userCart.items[itemIndex].quantity = quantity;
            }

            // Update total
            userCart.total = this.calculateCartTotal(userCart.items);

            // Save back to localStorage
            carts[uid] = userCart;
            localStorage.setItem('freshgreens_carts', JSON.stringify(carts));

            return userCart;
        }

        return null;
    }

    removeFromCart(userId, itemId) {
        const carts = JSON.parse(localStorage.getItem('freshgreens_carts'));
        const uid = String(userId || 'guest');
        const userCart = carts[uid];

        if (!userCart) return null;

        userCart.items = userCart.items.filter(item => item.id !== itemId);
        userCart.total = this.calculateCartTotal(userCart.items);

        // Save back to localStorage
    carts[uid] = userCart;
    localStorage.setItem('freshgreens_carts', JSON.stringify(carts));

        return userCart;
    }

    clearCart(userId) {
        const carts = JSON.parse(localStorage.getItem('freshgreens_carts'));
        const uid = String(userId || 'guest');
        carts[uid] = { items: [], total: 0 };
        localStorage.setItem('freshgreens_carts', JSON.stringify(carts));
        
        return { items: [], total: 0 };
    }

    calculateCartTotal(items) {
        return items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    getCartItemCount(userId) {
        const cart = this.getCart(userId);
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Order Methods
    createOrder(userId, orderData) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders'));
        
        const order = {
            id: 'ORD' + Date.now(),
            userId: userId,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        orders.push(order);
        localStorage.setItem('freshgreens_orders', JSON.stringify(orders));

        // Add to user's order history
        this.addOrderToUserHistory(userId, order);

        // Clear user's cart after successful order
        this.clearCart(userId);

        // Dispatch an event so UIs (staff dashboard, analytics, etc.) can react to the new order
        try {
            if (typeof window !== 'undefined') {
                try { window.dispatchEvent(new CustomEvent('freshgreens_order_placed', { detail: order })); } catch (e) { /* ignore */ }
            }
        } catch (e) { /* ignore */ }

        return order;
    }

    getOrders(userId) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders'));
        return orders.filter(order => order.userId === userId);
    }

    getOrderById(orderId) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders'));
        return orders.find(order => order.id === orderId);
    }

    updateOrderStatus(orderId, status) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders'));
        const orderIndex = orders.findIndex(order => order.id === orderId);

        if (orderIndex > -1) {
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('freshgreens_orders', JSON.stringify(orders));
            return orders[orderIndex];
        }

        return null;
    }

    addOrderToUserHistory(userId, order) {
        const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex > -1) {
            if (!users[userIndex].orderHistory) {
                users[userIndex].orderHistory = [];
            }

            users[userIndex].orderHistory.unshift({
                id: order.id,
                date: order.createdAt,
                items: order.items.map(item => item.product.name),
                total: order.total,
                status: order.status
            });

            localStorage.setItem('freshgreens_users', JSON.stringify(users));

            // Update current session if it's the same user
            const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
            if (currentUser && currentUser.id === userId) {
                localStorage.setItem('freshgreens_current_user', JSON.stringify(users[userIndex]));
            }
        }
    }

    // User Methods
    getUserOrders(userId) {
        const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
        const user = users.find(user => user.id === userId);
        return user ? user.orderHistory || [] : [];
    }

    // Order Methods (Staff View & Checkout)
    createOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
        const order = {
            id: 'ORD' + Date.now(),
            customerName: orderData.customerName || 'Guest',
            email: orderData.email || '',
            phone: orderData.phone || '',
            items: orderData.items || [],
            total: orderData.total || 0,
            status: 'pending', // pending, preparing, ready, delivered, cancelled
            priority: orderData.priority || 'normal', // low, normal, high
            paymentMethod: orderData.paymentMethod || 'cash',
            paymentDetails: orderData.paymentDetails || {},
            deliveryAddress: orderData.deliveryAddress || '',
            notes: orderData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: orderData.userId || null
        };
        orders.push(order);
        localStorage.setItem('freshgreens_orders', JSON.stringify(orders));
        
        // Add to user's order history if userId exists
        if (orderData.userId) {
            const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
            const userIndex = users.findIndex(u => u.id === orderData.userId);
            if (userIndex !== -1) {
                if (!users[userIndex].orderHistory) users[userIndex].orderHistory = [];
                // Add to beginning of history (most recent first)
                users[userIndex].orderHistory.unshift({
                    id: order.id,
                    date: order.createdAt,
                    items: order.items.map(item => item.product?.name || item.name),
                    total: order.total,
                    status: order.status
                });
                localStorage.setItem('freshgreens_users', JSON.stringify(users));
                
                // Update current session user if same user
                const currentUser = JSON.parse(localStorage.getItem('freshgreens_current_user'));
                if (currentUser && currentUser.id === orderData.userId) {
                    currentUser.orderHistory = users[userIndex].orderHistory;
                    localStorage.setItem('freshgreens_current_user', JSON.stringify(currentUser));
                }
            }
        }
        
        return order;
    }

    getAllOrders() {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
        return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getOrderById(orderId) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
        return orders.find(o => o.id === orderId);
    }

    updateOrderStatus(orderId, newStatus) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            order.updatedAt = new Date().toISOString();
            localStorage.setItem('freshgreens_orders', JSON.stringify(orders));
            return order;
        }
        return null;
    }

    getOrdersByStatus(status) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
        return orders.filter(o => o.status === status).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    deleteOrder(orderId) {
        const orders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders.splice(index, 1);
            localStorage.setItem('freshgreens_orders', JSON.stringify(orders));
            return true;
        }
        return false;
    }

    // Inventory Management Methods
    getInventory() {
        const inventory = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
        return inventory;
    }

    addInventoryItem(itemData) {
        const inventory = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
        
        const newItem = {
            id: 'INV-' + Date.now(),
            name: itemData.name,
            category: itemData.category,
            unit: itemData.unit,
            currentStock: itemData.currentStock,
            minStock: itemData.minStock,
            price: itemData.price,
            supplier: itemData.supplier || '',
            description: itemData.description || '',
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        inventory.push(newItem);
        localStorage.setItem('freshgreens_inventory', JSON.stringify(inventory));
        console.log('[DB] addInventoryItem saved. total:', inventory.length);
        return true;
    }

    updateInventoryItem(itemId, itemData) {
        const inventory = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
        const itemIndex = inventory.findIndex(i => i.id === itemId);
        
        if (itemIndex !== -1) {
            inventory[itemIndex] = {
                ...inventory[itemIndex],
                ...itemData
            };
            localStorage.setItem('freshgreens_inventory', JSON.stringify(inventory));
            return true;
        }
        return false;
    }

    deleteInventoryItem(itemId) {
        const inventory = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
        const index = inventory.findIndex(i => i.id === itemId);
        
        if (index !== -1) {
            inventory.splice(index, 1);
            localStorage.setItem('freshgreens_inventory', JSON.stringify(inventory));
            return true;
        }
        return false;
    }

    getInventoryItemById(itemId) {
        const inventory = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
        return inventory.find(i => i.id === itemId);
    }
}

// Create global database instance
const freshGreensDB = new FreshGreensDatabase();

// Admin-related functions for database.js

// Initialize admin data if not exists
function initializeAdminData() {
    if (!localStorage.getItem('freshgreens_admins')) {
        const defaultAdmins = [
            {
                id: 'admin1',
                name: 'System Administrator',
                email: 'admin@gmail.com',
                password: 'admin123',
                role: 'superadmin',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('freshgreens_admins', JSON.stringify(defaultAdmins));
    }
    
    // Initialize staff data if not exists
    if (!localStorage.getItem('freshgreens_staff')) {
        const defaultStaff = [
            {
                id: 'staff1',
                name: 'Staff Manager',
                email: 'staff@gmail.com',
                password: 'staff123',
                role: 'staff',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('freshgreens_staff', JSON.stringify(defaultStaff));
    }
}

// Normalize stored admin/staff data (emails to lowercase, trim) to avoid case/whitespace mismatches
function normalizeAdminStaffData() {
    try {
        const admins = JSON.parse(localStorage.getItem('freshgreens_admins') || '[]');
        const normalizedAdmins = admins.map(a => ({
            ...a,
            email: (a.email || '').trim().toLowerCase()
        }));
        localStorage.setItem('freshgreens_admins', JSON.stringify(normalizedAdmins));

        const staff = JSON.parse(localStorage.getItem('freshgreens_staff') || '[]');
        const normalizedStaff = staff.map(s => ({
            ...s,
            email: (s.email || '').trim().toLowerCase()
        }));
        localStorage.setItem('freshgreens_staff', JSON.stringify(normalizedStaff));
    } catch (e) {
        console.log('[DB] normalizeAdminStaffData error', e);
    }
}

// Verify admin credentials
function verifyAdminCredentials(email, password) {
    const admins = JSON.parse(localStorage.getItem('freshgreens_admins')) || [];
    const normalizedEmail = (email || '').trim().toLowerCase();
    const admin = admins.find(a => (a.email || '').trim().toLowerCase() === normalizedEmail && a.password === password);
    
    if (admin) {
        return admin;
    }
    
    return null;
}

// Verify staff credentials
function verifyStaffCredentials(email, password) {
    const staff = JSON.parse(localStorage.getItem('freshgreens_staff')) || [];
    const normalizedEmail = (email || '').trim().toLowerCase();
    const staffMember = staff.find(s => (s.email || '').trim().toLowerCase() === normalizedEmail && s.password === password);
    
    if (staffMember) {
        return staffMember;
    }
    
    return null;
}

// Call initialization
initializeAdminData();
// Normalize stored admin/staff emails on load to avoid mismatches
normalizeAdminStaffData();

// Authentication Functions
function checkUserSession() {
    const currentUser = localStorage.getItem('freshgreens_current_user');
    const currentAdmin = localStorage.getItem('freshgreens_current_admin');
    
    // If admin is logged in, don't show regular user session
    if (currentAdmin) {
        return null; // Return null so regular user features don't show
    }
    
    return currentUser ? JSON.parse(currentUser) : null;
}

function checkAdminSession() {
    const currentAdmin = localStorage.getItem('freshgreens_current_admin');
    return currentAdmin ? JSON.parse(currentAdmin) : null;
}

function verifyUserCredentials(email, password) {
    const users = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    return user;
}

// MENU ITEMS STORAGE
if (!localStorage.getItem('freshgreens_menu')) {
    localStorage.setItem('freshgreens_menu', JSON.stringify([]));
}

// Global site modal notification helper so all pages can show consistent messages
window.showModalNotification = function(message, options = {}) {
    try {
        // remove existing modal if present
        const existing = document.getElementById('site-notification-modal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'site-notification-modal';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.35)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 2000;

        const dialog = document.createElement('div');
        dialog.style.width = options.width || '560px';
        dialog.style.maxWidth = '92%';
        dialog.style.background = '#fff';
        dialog.style.borderRadius = '12px';
        dialog.style.padding = '26px 30px';
        dialog.style.boxShadow = '0 30px 70px rgba(0,0,0,0.25)';
        dialog.style.textAlign = 'left';

        // Title + message area
        dialog.innerHTML = `
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:8px;">
                <div style="width:44px;height:44px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#2d5016;">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div style="flex:1">
                    <div style="font-weight:700;color:#222;margin-bottom:6px;">Notice</div>
                    <div style="color:#666;font-size:0.95rem;">${message}</div>
                </div>
            </div>
            <div style="display:flex;justify-content:flex-end;margin-top:14px;gap:12px;">
                <button id="site-notify-ok" style="background:#fff;border:1px solid #ddd;padding:10px 18px;border-radius:8px;cursor:pointer;">OK</button>
                ${options.showViewCart ? '<button id="site-notify-view" style="background:#2d5016;color:#fff;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;">View Cart</button>' : ''}
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const okBtn = document.getElementById('site-notify-ok');
        if (okBtn) okBtn.addEventListener('click', () => overlay.remove());
        const viewBtn = document.getElementById('site-notify-view');
        if (viewBtn) viewBtn.addEventListener('click', () => { overlay.remove(); window.location.href = 'cart.html'; });

        if (!options.stayOpen) {
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, options.autoClose || 3000);
        }
    } catch (e) {
        try { if (typeof window.showModalNotification === 'function') window.showModalNotification(message, { stayOpen: true }); else console.warn('notify (no UI available):', message); } catch (ex) { console.warn('notify fallback', ex); }
    }
};

// Backwards-compat alias used in cart.js
window.showCartNotification = window.showCartNotification || window.showModalNotification;

// Global non-blocking confirm modal that returns a Promise<boolean>
window.showConfirmModal = function(message, options = {}) {
    return new Promise((resolve) => {
        try {
            // remove existing if present
            const old = document.getElementById('site-confirm-modal');
            if (old) old.remove();

            const overlay = document.createElement('div');
            overlay.id = 'site-confirm-modal';
            overlay.style.position = 'fixed';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0,0,0,0.35)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = 2000;

            const dialog = document.createElement('div');
            dialog.style.width = options.width || '520px';
            dialog.style.maxWidth = '92%';
            dialog.style.background = '#fff';
            dialog.style.borderRadius = '12px';
            dialog.style.padding = '24px 30px';
            dialog.style.boxShadow = '0 30px 70px rgba(0,0,0,0.25)';
            dialog.style.textAlign = 'left';

            dialog.innerHTML = `
                <div style="font-weight:700;margin-bottom:8px;color:#222">Confirm</div>
                <div style="color:#666;margin-bottom:18px;white-space:pre-wrap">${message}</div>
                <div style="display:flex;justify-content:flex-end;gap:10px">
                    <button id="confirm-cancel" style="background:#fff;border:1px solid #ddd;padding:8px 14px;border-radius:8px;cursor:pointer">Cancel</button>
                    <button id="confirm-ok" style="background:#2d5016;color:#fff;border:none;padding:8px 14px;border-radius:8px;cursor:pointer">Confirm</button>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            const cleanup = (value) => {
                try { overlay.remove(); } catch (e) {}
                resolve(Boolean(value));
            };

            document.getElementById('confirm-cancel').addEventListener('click', () => cleanup(false));
            document.getElementById('confirm-ok').addEventListener('click', () => cleanup(true));

            // Optional auto reject on background click
            if (options.closeOnOutside !== false) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) cleanup(false);
                });
            }
        } catch (err) {
            console.warn('[showConfirmModal] error', err);
            // fallback to window.confirm if something fails
            try { resolve(confirm(message)); } catch (e) { resolve(false); }
        }
    });
};

