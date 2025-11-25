// Menu Management JavaScript

// Avoid duplicate `let` declarations across admin scripts; reuse global when available
var currentAdmin = window.currentAdmin || null;
let products = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Menu Management] Initializing menu management...');
    
    // Check if admin is logged in
    currentAdmin = JSON.parse(localStorage.getItem('freshgreens_current_admin'));
    try { window.currentAdmin = currentAdmin; } catch (e) {}
    
    if (!currentAdmin) {
        console.log('[Menu Management] No admin session found, redirecting to login...');
        window.showModalNotification('Unauthorized access. Please log in as administrator.', { stayOpen: true });
        window.location.href = 'login.html';
        return;
    }
    
    console.log('[Menu Management] Admin logged in:', currentAdmin.name);
    
    // Initialize
    initializeMenuManagement();
    loadMenuData();
    setupEventListeners();
});

function initializeMenuManagement() {
    // Update admin info
    document.getElementById('adminName').textContent = currentAdmin.name;
    
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
            // use the non-blocking site confirm modal helper
            window.showConfirmModal('Are you sure you want to logout?').then(confirmed => {
                if (confirmed) {
                    console.log('[Menu Management] Logging out admin user');
                    localStorage.removeItem('freshgreens_current_admin');
                    window.location.href = 'login.html';
                }
            }).catch(() => {});
        });
    }
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Premade Salad Form
    document.getElementById('addPremadeForm').addEventListener('submit', handleAddPremade);
    
    // Ingredient Form
    document.getElementById('addIngredientForm').addEventListener('submit', handleAddIngredient);
    
    // Edit Modal Close Buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Edit Forms
    document.getElementById('editPremadeForm').addEventListener('submit', handleEditPremade);
    document.getElementById('editIngredientForm').addEventListener('submit', handleEditIngredient);
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function loadMenuData() {
    products = JSON.parse(localStorage.getItem('freshgreens_products')) || {
        premade: [],
        ingredients: {}
    };
    
    console.log('[Menu Management] Products loaded:', products);
    
    // Load premade salads
    loadPremadeSalads();
    
    // Load ingredients
    loadIngredients();
    
    // Load all menu items
    loadAllMenuItems();
}

function loadPremadeSalads() {
    const container = document.getElementById('premadeList');
    const premade = products.premade || [];
    
    if (premade.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--gray); grid-column: 1 / -1;">No premade salads yet. Create one to get started!</p>';
        return;
    }
    
    container.innerHTML = premade.map(item => `
        <div class="menu-item-card">
            <div class="item-header">
                <div class="item-name">${item.name}</div>
                <span class="item-category">Premade</span>
            </div>
            
            <div class="item-price">₱${item.price.toFixed(2)}</div>
            
            <div class="item-availability ${item.available ? 'available' : 'unavailable'}">
                <i class="fas fa-${item.available ? 'check-circle' : 'times-circle'}"></i>
                ${item.available ? 'Available' : 'Unavailable'}
            </div>
            
            <p style="color: var(--gray); font-size: 0.9rem; margin: 8px 0;">${item.description || ''}</p>
            
            ${item.nutrition ? `
                <div class="item-nutrition">
                    <div class="nutrition-item">
                        <span class="nutrition-label">Calories:</span>
                        <span>${item.nutrition.calories || '-'}</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Protein:</span>
                        <span>${item.nutrition.protein || '-'}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Carbs:</span>
                        <span>${item.nutrition.carbs || '-'}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Fat:</span>
                        <span>${item.nutrition.fat || '-'}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Fiber:</span>
                        <span>${item.nutrition.fiber || '-'}g</span>
                    </div>
                </div>
            ` : ''}
            
            ${item.tags && item.tags.length > 0 ? `
                <div class="item-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="item-actions">
                <button class="btn btn-outline" onclick="editPremade(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deletePremade(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function loadIngredients() {
    const container = document.getElementById('ingredientsList');
    const ingredients = products.ingredients || {};
    
    let allIngredients = [];
    for (const category in ingredients) {
        allIngredients = allIngredients.concat(ingredients[category] || []);
    }
    
    if (allIngredients.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--gray);">No ingredients yet. Create one to get started!</p>';
        return;
    }
    
    container.innerHTML = allIngredients.map(item => `
        <div class="ingredient-row">
            <div class="ingredient-info">
                <span class="ingredient-category-badge">${item.category}</span>
                <div class="ingredient-details">
                    <div class="ingredient-name">${item.name}</div>
                    <div class="ingredient-price">₱${item.price.toFixed(2)}</div>
                </div>
            </div>
            <span class="ingredient-availability ${item.available ? 'available' : 'unavailable'}">
                <i class="fas fa-${item.available ? 'check-circle' : 'times-circle'}"></i>
                ${item.available ? 'Available' : 'Unavailable'}
            </span>
            <div class="ingredient-actions">
                <button class="btn btn-outline btn-sm" onclick="editIngredient(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteIngredient(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function loadAllMenuItems() {
    const tbody = document.getElementById('allMenuTableBody');
    const premade = products.premade || [];
    const ingredients = products.ingredients || {};
    
    let allItems = [];
    
    // Add premade salads
    premade.forEach(item => {
        allItems.push({
            name: item.name,
            category: 'Premade Salad',
            price: item.price,
            availability: item.available,
            id: item.id,
            type: 'premade'
        });
    });
    
    // Add ingredients
    for (const category in ingredients) {
        ingredients[category].forEach(item => {
            allItems.push({
                name: item.name,
                category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
                price: item.price,
                availability: item.available,
                id: item.id,
                type: 'ingredient',
                ingredientCategory: category
            });
        });
    }
    
    if (allItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: var(--gray);">No menu items yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = allItems.map(item => `
        <tr>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>
                <span class="item-availability ${item.availability ? 'available' : 'unavailable'}">
                    ${item.availability ? '✓ Available' : '✗ Unavailable'}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    ${item.type === 'premade' ? `
                        <button class="btn btn-outline" onclick="editPremade(${item.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deletePremade(${item.id})">Delete</button>
                    ` : `
                        <button class="btn btn-outline" onclick="editIngredient(${item.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteIngredient(${item.id})">Delete</button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');
}

function handleAddPremade(e) {
    e.preventDefault();
    
    const tags = document.getElementById('premadeTags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    
    const newSalad = {
        id: Date.now(),
        name: document.getElementById('premadeName').value,
        price: parseFloat(document.getElementById('premadePrice').value),
        description: document.getElementById('premadeDescription').value,
        image: document.getElementById('premadeImage').value || '',
        available: document.getElementById('premadeAvailable').value === 'true',
        nutrition: {
            calories: parseInt(document.getElementById('premadeCalories').value) || 0,
            protein: parseInt(document.getElementById('premadeProtein').value) || 0,
            carbs: parseInt(document.getElementById('premadeCarbs').value) || 0,
            fat: parseInt(document.getElementById('premadeFat').value) || 0,
            fiber: parseInt(document.getElementById('premadeFiber').value) || 0
        },
        tags: tags,
        category: 'premade'
    };
    
    if (!products.premade) {
        products.premade = [];
    }
    products.premade.push(newSalad);
    localStorage.setItem('freshgreens_products', JSON.stringify(products));

    // Add to customer menu (freshgreens_menu) with duplicate check
    let menu = JSON.parse(localStorage.getItem('freshgreens_menu')) || [];
    const exists = menu.find(m => (m.id && m.id === newSalad.id) || (m.name && m.name.trim().toLowerCase() === newSalad.name.trim().toLowerCase()));
    if (exists) {
        console.log('[Menu Management] Item already exists in customer menu:', newSalad.name);
        showNotification('Item already exists in customer menu.', 'info');
    } else {
        menu.push(newSalad);
        localStorage.setItem('freshgreens_menu', JSON.stringify(menu));
        // Notify other scripts (same-page listeners) that customer menu changed
        try { window.dispatchEvent(new CustomEvent('freshgreens_menu_updated', { detail: newSalad })); } catch (e) { /* ignore if not supported */ }
        console.log('[Menu Management] New premade salad added:', newSalad);
        showNotification('Premade salad added successfully! Added to customer menu.', 'success');
    }

    e.target.reset();
    loadPremadeSalads();
    loadAllMenuItems();
}

function handleAddIngredient(e) {
    e.preventDefault();
    
    const category = document.getElementById('ingredientCategory').value;
    const newIngredient = {
        id: Date.now(),
        name: document.getElementById('ingredientName').value,
        price: parseFloat(document.getElementById('ingredientPrice').value),
        category: category,
        available: document.getElementById('ingredientAvailable').value === 'true'
    };
    
    if (!products.ingredients) {
        products.ingredients = {};
    }
    
    if (!products.ingredients[category]) {
        products.ingredients[category] = [];
    }
    
    products.ingredients[category].push(newIngredient);
    localStorage.setItem('freshgreens_products', JSON.stringify(products));
    
    console.log('[Menu Management] New ingredient added:', newIngredient);
    
    showNotification('Ingredient added successfully!', 'success');
    
    e.target.reset();
    loadIngredients();
    loadAllMenuItems();
}

function editPremade(id) {
    const salad = products.premade.find(item => item.id === id);
    if (!salad) return;
    
    document.getElementById('editPremadeId').value = id;
    document.getElementById('editPremadeName').value = salad.name;
    document.getElementById('editPremadePrice').value = salad.price;
    document.getElementById('editPremadeDescription').value = salad.description;
    document.getElementById('editPremadeCalories').value = salad.nutrition?.calories || '';
    document.getElementById('editPremadeProtein').value = salad.nutrition?.protein || '';
    document.getElementById('editPremadeCarbs').value = salad.nutrition?.carbs || '';
    document.getElementById('editPremadeFat').value = salad.nutrition?.fat || '';
    document.getElementById('editPremadeFiber').value = salad.nutrition?.fiber || '';
    
    document.getElementById('editPremadeModal').style.display = 'block';
}

function handleEditPremade(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editPremadeId').value);
    const index = products.premade.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    products.premade[index].name = document.getElementById('editPremadeName').value;
    products.premade[index].price = parseFloat(document.getElementById('editPremadePrice').value);
    products.premade[index].description = document.getElementById('editPremadeDescription').value;
    products.premade[index].nutrition.calories = parseInt(document.getElementById('editPremadeCalories').value) || 0;
    products.premade[index].nutrition.protein = parseInt(document.getElementById('editPremadeProtein').value) || 0;
    products.premade[index].nutrition.carbs = parseInt(document.getElementById('editPremadeCarbs').value) || 0;
    products.premade[index].nutrition.fat = parseInt(document.getElementById('editPremadeFat').value) || 0;
    products.premade[index].nutrition.fiber = parseInt(document.getElementById('editPremadeFiber').value) || 0;
    
    localStorage.setItem('freshgreens_products', JSON.stringify(products));
    // Keep `freshgreens_menu` in sync if this premade is present there (admin-published)
    try {
        let menu = JSON.parse(localStorage.getItem('freshgreens_menu')) || [];
        const updated = products.premade[index];
        let changed = false;
        menu = menu.map(m => {
            if ((m.id && m.id === updated.id) || (m.name && m.name.trim().toLowerCase() === updated.name.trim().toLowerCase())) {
                changed = true;
                return { ...m, ...updated };
            }
            return m;
        });
        if (changed) {
            localStorage.setItem('freshgreens_menu', JSON.stringify(menu));
            // notify other scripts immediately
            try { window.dispatchEvent(new CustomEvent('freshgreens_menu_updated', { detail: updated })); } catch (e) {}
        }
    } catch (err) {
        console.warn('[Menu Management] Failed to sync freshgreens_menu on edit', err);
    }
    
    console.log('[Menu Management] Premade salad updated:', products.premade[index]);
    
    showNotification('Premade salad updated successfully!', 'success');
    
    document.getElementById('editPremadeModal').style.display = 'none';
    loadPremadeSalads();
    loadAllMenuItems();
}

async function deletePremade(id) {
    const confirmed = await window.showConfirmModal('Are you sure you want to delete this premade salad?');
    if (!confirmed) return;
    
    products.premade = products.premade.filter(item => item.id !== id);
    localStorage.setItem('freshgreens_products', JSON.stringify(products));
    // Also remove from published customer menu so it disappears on homepage
    try {
        let menu = JSON.parse(localStorage.getItem('freshgreens_menu')) || [];
        const beforeCount = menu.length;
        menu = menu.filter(item => !(item.id && item.id === id));
        if (menu.length !== beforeCount) {
            localStorage.setItem('freshgreens_menu', JSON.stringify(menu));
            try { window.dispatchEvent(new CustomEvent('freshgreens_menu_updated', { detail: { id } })); } catch (e) {}
        }
    } catch (err) {
        console.warn('[Menu Management] Failed to remove deleted premade from freshgreens_menu', err);
    }
    
    console.log('[Menu Management] Premade salad deleted:', id);
    
    showNotification('Premade salad deleted successfully!', 'success');
    
    loadPremadeSalads();
    loadAllMenuItems();
}

function editIngredient(id) {
    let ingredient = null;
    let category = null;
    
    for (const cat in products.ingredients) {
        const found = products.ingredients[cat].find(item => item.id === id);
        if (found) {
            ingredient = found;
            category = cat;
            break;
        }
    }
    
    if (!ingredient) return;
    
    document.getElementById('editIngredientId').value = id;
    document.getElementById('editIngredientName').value = ingredient.name;
    document.getElementById('editIngredientPrice').value = ingredient.price;
    
    document.getElementById('editIngredientModal').style.display = 'block';
}

function handleEditIngredient(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editIngredientId').value);
    
    for (const category in products.ingredients) {
        const index = products.ingredients[category].findIndex(item => item.id === id);
        if (index !== -1) {
            products.ingredients[category][index].name = document.getElementById('editIngredientName').value;
            products.ingredients[category][index].price = parseFloat(document.getElementById('editIngredientPrice').value);
            
            localStorage.setItem('freshgreens_products', JSON.stringify(products));
            
            console.log('[Menu Management] Ingredient updated:', products.ingredients[category][index]);
            
            showNotification('Ingredient updated successfully!', 'success');
            
            document.getElementById('editIngredientModal').style.display = 'none';
            loadIngredients();
            loadAllMenuItems();
            return;
        }
    }
}

async function deleteIngredient(id) {
    const confirmed = await window.showConfirmModal('Are you sure you want to delete this ingredient?');
    if (!confirmed) return;
    
    for (const category in products.ingredients) {
        const index = products.ingredients[category].findIndex(item => item.id === id);
        if (index !== -1) {
            products.ingredients[category].splice(index, 1);
            break;
        }
    }
    
    localStorage.setItem('freshgreens_products', JSON.stringify(products));
    
    console.log('[Menu Management] Ingredient deleted:', id);
    
    showNotification('Ingredient deleted successfully!', 'success');
    
    loadIngredients();
    loadAllMenuItems();
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
