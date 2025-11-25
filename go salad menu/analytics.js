// Analytics Dashboard JavaScript

// Avoid duplicate `let` declarations for currentAdmin across admin scripts
var currentAdmin = window.currentAdmin || null;
let analyticsCharts = {};
let currentDateRange = '30days';

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Analytics] Initializing analytics dashboard...');
    
    // Check if admin is logged in
    currentAdmin = JSON.parse(localStorage.getItem('freshgreens_current_admin'));
    try { window.currentAdmin = currentAdmin; } catch (e) {}
    
    if (!currentAdmin) {
        console.log('[Analytics] No admin session found, redirecting to login...');
            window.showModalNotification('No admin session found, redirecting to login...', { stayOpen: true });
        window.location.href = 'login.html';
        return;
    }
    
    console.log('[Analytics] Admin logged in:', currentAdmin.name);
    
    // Initialize analytics dashboard
    initializeAnalyticsDashboard();
    loadAnalyticsData();
    setupEventListeners();
});

function initializeAnalyticsDashboard() {
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
            window.showConfirmModal('Are you sure you want to logout?').then(confirmed => {
                if (confirmed) {
                    console.log('[Analytics] Logging out admin user');
                    localStorage.removeItem('freshgreens_current_admin');
                    window.location.href = 'login.html';
                }
            }).catch(() => {});
        });
    }
    
    // Date range filter
    document.getElementById('dateRangeSelect').addEventListener('change', function(e) {
        currentDateRange = e.target.value;
        loadAnalyticsData();
    });
    
    // Refresh button
    document.getElementById('refreshAnalyticsBtn').addEventListener('click', function() {
        loadAnalyticsData();
    });
    
    // Export button
    document.getElementById('exportReportBtn').addEventListener('click', function() {
        exportAnalyticsReport();
    });
}

function loadAnalyticsData() {
    console.log('[Analytics] Loading analytics data for period:', currentDateRange);
    
    // Get all orders
    const allOrders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
    const allUsers = JSON.parse(localStorage.getItem('freshgreens_users')) || [];
    const inventory = JSON.parse(localStorage.getItem('freshgreens_inventory')) || [];
    
    // Filter orders by date range
    const filteredOrders = filterOrdersByDateRange(allOrders, currentDateRange);
    
    // Update key metrics
    updateKeyMetrics(filteredOrders, allUsers, allOrders);
    
    // Update charts
    updateSalesOverTimeChart(filteredOrders);
    updateRevenueBreakdownChart(filteredOrders);
    updateBestSellingProductsChart(filteredOrders);
    updateOrderFrequencyChart(filteredOrders, allUsers);
    updatePeakOrderingTimesChart(filteredOrders);
    updateIngredientsChart(filteredOrders);
    
    // Update tables
    updateTopProductsTable(filteredOrders);
    updateTopCustomersTable(filteredOrders);
    
    // Update insights
    updateInsights(filteredOrders, allUsers, inventory);
    
    // Update low stock alerts
    updateLowStockAlerts(inventory);
    
    console.log('[Analytics] Analytics data loaded successfully');
}

function filterOrdersByDateRange(orders, range) {
    const now = new Date();
    let startDate = new Date();
    
    switch(range) {
        case '7days':
            startDate.setDate(now.getDate() - 7);
            break;
        case '30days':
            startDate.setDate(now.getDate() - 30);
            break;
        case '90days':
            startDate.setDate(now.getDate() - 90);
            break;
        case 'all':
            startDate = new Date(0);
            break;
        default:
            startDate.setDate(now.getDate() - 30);
    }
    
    return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && order.status !== 'cancelled';
    });
}

function updateKeyMetrics(filteredOrders, allUsers, allOrders) {
    // Total Revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    document.getElementById('totalRevenueMetric').textContent = '₱' + totalRevenue.toFixed(2);
    
    // Calculate previous period revenue for comparison
    const previousOrders = filterOrdersByDateRange(allOrders, getPreviousPeriod(currentDateRange));
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    updateMetricChange('revenueChange', totalRevenue, previousRevenue);
    
    // Total Orders
    const totalOrders = filteredOrders.length;
    document.getElementById('totalOrdersMetric').textContent = totalOrders;
    const previousOrderCount = previousOrders.length;
    updateMetricChange('ordersChange', totalOrders, previousOrderCount);
    
    // Total Customers
    const uniqueCustomers = new Set(filteredOrders.map(order => order.userId || order.customerName)).size;
    document.getElementById('totalCustomersMetric').textContent = uniqueCustomers;
    updateMetricChange('customersChange', uniqueCustomers, allUsers.length);
    
    // Average Order Value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    document.getElementById('avgOrderValue').textContent = '₱' + avgOrderValue.toFixed(2);
    const previousAvgValue = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;
    updateMetricChange('avgChange', avgOrderValue, previousAvgValue);
}

function getPreviousPeriod(range) {
    switch(range) {
        case '7days':
            return 'previous7days';
        case '30days':
            return 'previous30days';
        case '90days':
            return 'previous90days';
        default:
            return 'all';
    }
}

function updateMetricChange(elementId, current, previous) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let changePercent = 0;
    if (previous > 0) {
        changePercent = ((current - previous) / previous) * 100;
    } else if (current > 0) {
        changePercent = 100;
    }
    
    const isPositive = changePercent >= 0;
    element.className = 'stat-change ' + (isPositive ? 'positive' : 'negative');
    element.textContent = (isPositive ? '↑' : '↓') + ' ' + Math.abs(changePercent).toFixed(1) + '% vs previous period';
}

function updateSalesOverTimeChart(orders) {
    const ctx = document.getElementById('salesOverTimeChart');
    if (!ctx) return;
    
    // Group orders by day
    const salesByDay = {};
    const now = new Date();
    const daysToShow = currentDateRange === '7days' ? 7 : currentDateRange === '30days' ? 30 : 90;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = formatDateKey(date);
        salesByDay[dateKey] = { count: 0, revenue: 0 };
    }
    
    orders.forEach(order => {
        const dateKey = formatDateKey(new Date(order.createdAt));
        if (dateKey in salesByDay) {
            salesByDay[dateKey].count++;
            salesByDay[dateKey].revenue += order.total || 0;
        }
    });
    
    const dates = Object.keys(salesByDay).sort();
    const salesCounts = dates.map(d => salesByDay[d].count);
    const revenues = dates.map(d => salesByDay[d].revenue);
    
    // Destroy previous chart if exists
    if (analyticsCharts.salesOverTime) {
        analyticsCharts.salesOverTime.destroy();
    }
    
    analyticsCharts.salesOverTime = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Order Count',
                    data: salesCounts,
                    borderColor: '#2d5016',
                    backgroundColor: 'rgba(45, 80, 22, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Revenue (₱)',
                    data: revenues,
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Order Count'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Revenue (₱)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

function updateRevenueBreakdownChart(orders) {
    const ctx = document.getElementById('revenueBreakdownChart');
    if (!ctx) return;
    
    // Group revenue by product
    const revenueByProduct = {};
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const productName = item.product?.name || item.name || 'Unknown';
                if (!revenueByProduct[productName]) {
                    revenueByProduct[productName] = 0;
                }
                revenueByProduct[productName] += (item.product?.price || 0) * item.quantity;
            });
        }
    });
    
    const products = Object.keys(revenueByProduct);
    const revenues = Object.values(revenueByProduct);
    
    // Destroy previous chart if exists
    if (analyticsCharts.revenueBreakdown) {
        analyticsCharts.revenueBreakdown.destroy();
    }
    
    analyticsCharts.revenueBreakdown = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: products,
            datasets: [{
                data: revenues,
                backgroundColor: [
                    '#2d5016',
                    '#4caf50',
                    '#7cb342',
                    '#9ccc65',
                    '#c0ca33',
                    '#ff9800',
                    '#ff7043',
                    '#e53935'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateBestSellingProductsChart(orders) {
    const ctx = document.getElementById('bestSellingChart');
    if (!ctx) return;
    
    // Count product quantities
    const productCount = {};
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const productName = item.product?.name || item.name || 'Unknown';
                if (!productCount[productName]) {
                    productCount[productName] = 0;
                }
                productCount[productName] += item.quantity || 1;
            });
        }
    });
    
    // Sort and get top 8
    const sorted = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    const products = sorted.map(item => item[0]);
    const counts = sorted.map(item => item[1]);
    
    // Destroy previous chart if exists
    if (analyticsCharts.bestSelling) {
        analyticsCharts.bestSelling.destroy();
    }
    
    analyticsCharts.bestSelling = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products,
            datasets: [{
                label: 'Units Sold',
                data: counts,
                backgroundColor: '#4caf50',
                borderColor: '#2d5016',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateOrderFrequencyChart(orders, users) {
    const ctx = document.getElementById('orderFrequencyChart');
    if (!ctx) return;
    
    // Count orders per customer
    const customerOrderCount = {};
    orders.forEach(order => {
        const customerId = order.userId || order.customerName;
        customerOrderCount[customerId] = (customerOrderCount[customerId] || 0) + 1;
    });
    
    // Create frequency buckets
    const frequencyBuckets = {
        '1 order': 0,
        '2-3 orders': 0,
        '4-5 orders': 0,
        '6-10 orders': 0,
        '10+ orders': 0
    };
    
    Object.values(customerOrderCount).forEach(count => {
        if (count === 1) frequencyBuckets['1 order']++;
        else if (count <= 3) frequencyBuckets['2-3 orders']++;
        else if (count <= 5) frequencyBuckets['4-5 orders']++;
        else if (count <= 10) frequencyBuckets['6-10 orders']++;
        else frequencyBuckets['10+ orders']++;
    });
    
    // Destroy previous chart if exists
    if (analyticsCharts.orderFrequency) {
        analyticsCharts.orderFrequency.destroy();
    }
    
    analyticsCharts.orderFrequency = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(frequencyBuckets),
            datasets: [{
                data: Object.values(frequencyBuckets),
                backgroundColor: [
                    '#ffeb3b',
                    '#ffc107',
                    '#ff9800',
                    '#ff5722',
                    '#f44336'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updatePeakOrderingTimesChart(orders) {
    const ctx = document.getElementById('peakTimesChart');
    if (!ctx) return;
    
    // Group orders by hour
    const ordersByHour = {};
    for (let i = 0; i < 24; i++) {
        ordersByHour[i] = 0;
    }
    
    orders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        ordersByHour[hour]++;
    });
    
    const hours = Object.keys(ordersByHour).map(h => h + ':00');
    const counts = Object.values(ordersByHour);
    
    // Destroy previous chart if exists
    if (analyticsCharts.peakTimes) {
        analyticsCharts.peakTimes.destroy();
    }
    
    analyticsCharts.peakTimes = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Orders',
                data: counts,
                backgroundColor: '#2196f3',
                borderColor: '#1976d2',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateIngredientsChart(orders) {
    const ctx = document.getElementById('ingredientsChart');
    if (!ctx) return;
    
    // Count ingredients used (from custom orders)
    const ingredientCount = {};
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                // Count the product itself as a salad base
                const productName = item.product?.name || item.name || 'Unknown';
                ingredientCount[productName] = (ingredientCount[productName] || 0) + (item.quantity || 1);
                
                // Count customizations if any
                if (item.customizations) {
                    // Count ingredients from custom salad
                    if (item.customizations.base) {
                        ingredientCount[item.customizations.base] = (ingredientCount[item.customizations.base] || 0) + 1;
                    }
                    if (item.customizations.proteins && Array.isArray(item.customizations.proteins)) {
                        item.customizations.proteins.forEach(protein => {
                            ingredientCount[protein] = (ingredientCount[protein] || 0) + 1;
                        });
                    }
                    if (item.customizations.vegetables && Array.isArray(item.customizations.vegetables)) {
                        item.customizations.vegetables.forEach(veg => {
                            ingredientCount[veg] = (ingredientCount[veg] || 0) + 1;
                        });
                    }
                }
            });
        }
    });
    
    // Sort and get top 8
    const sorted = Object.entries(ingredientCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    const ingredients = sorted.map(item => item[0]);
    const counts = sorted.map(item => item[1]);
    
    // Destroy previous chart if exists
    if (analyticsCharts.ingredients) {
        analyticsCharts.ingredients.destroy();
    }
    
    analyticsCharts.ingredients = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ingredients,
            datasets: [{
                label: 'Times Used',
                data: counts,
                backgroundColor: '#9c27b0',
                borderColor: '#7b1fa2',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateTopProductsTable(orders) {
    const tbody = document.getElementById('topProductsTableBody');
    if (!tbody) return;
    
    // Count products
    const productStats = {};
    let totalRevenue = 0;
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const productName = item.product?.name || item.name || 'Unknown';
                const price = item.product?.price || 0;
                const quantity = item.quantity || 1;
                
                if (!productStats[productName]) {
                    productStats[productName] = {
                        name: productName,
                        quantity: 0,
                        revenue: 0
                    };
                }
                
                productStats[productName].quantity += quantity;
                productStats[productName].revenue += price * quantity;
                totalRevenue += price * quantity;
            });
        }
    });
    
    // Sort and get top 5
    const sorted = Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    
    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No data available</td></tr>';
        return;
    }
    
    tbody.innerHTML = sorted.map((product, index) => `
        <tr>
            <td>
                <span class="rank-badge">${index + 1}</span>
                ${product.name}
            </td>
            <td>${product.quantity}</td>
            <td>₱${product.revenue.toFixed(2)}</td>
            <td>${((product.revenue / totalRevenue) * 100).toFixed(1)}%</td>
        </tr>
    `).join('');
}

function updateTopCustomersTable(orders) {
    const tbody = document.getElementById('topCustomersTableBody');
    if (!tbody) return;
    
    // Calculate customer stats
    const customerStats = {};
    
    orders.forEach(order => {
        const customerId = order.userId || order.customerName;
        const customerName = order.customerName || 'Unknown Customer';
        
        if (!customerStats[customerId]) {
            customerStats[customerId] = {
                name: customerName,
                orders: 0,
                totalSpent: 0
            };
        }
        
        customerStats[customerId].orders++;
        customerStats[customerId].totalSpent += order.total || 0;
    });
    
    // Sort and get top 5
    const sorted = Object.values(customerStats)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);
    
    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">No data available</td></tr>';
        return;
    }
    
    tbody.innerHTML = sorted.map((customer, index) => {
        const avgOrder = customer.orders > 0 ? customer.totalSpent / customer.orders : 0;
        return `
            <tr>
                <td>
                    <span class="rank-badge">${index + 1}</span>
                    ${customer.name}
                </td>
                <td>${customer.orders}</td>
                <td>₱${customer.totalSpent.toFixed(2)}</td>
                <td>₱${avgOrder.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

function updateInsights(filteredOrders, allUsers, inventory) {
    // Most Popular Ingredient
    const ingredientCount = {};
    filteredOrders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const productName = item.product?.name || item.name || 'Unknown';
                ingredientCount[productName] = (ingredientCount[productName] || 0) + (item.quantity || 1);
            });
        }
    });
    
    const topIngredient = Object.entries(ingredientCount).sort((a, b) => b[1] - a[1])[0];
    if (topIngredient) {
        document.getElementById('popularIngredient').textContent = topIngredient[0];
        document.getElementById('popularIngredientCount').textContent = topIngredient[1];
    }
    
    // Peak Order Hour
    const ordersByHour = {};
    for (let i = 0; i < 24; i++) {
        ordersByHour[i] = 0;
    }
    
    filteredOrders.forEach(order => {
        const hour = new Date(order.createdAt).getHours();
        ordersByHour[hour]++;
    });
    
    const peakHour = Object.entries(ordersByHour).reduce((a, b) => b[1] > a[1] ? b : a);
    document.getElementById('peakHour').textContent = peakHour[0] + ':00';
    document.getElementById('peakHourLabel').textContent = 'Peak order time with ' + peakHour[1] + ' orders';
    
    // Customer Retention (Repeat Customers)
    const customerOrders = {};
    filteredOrders.forEach(order => {
        const customerId = order.userId || order.customerName;
        customerOrders[customerId] = (customerOrders[customerId] || 0) + 1;
    });
    
    const repeatCustomers = Object.values(customerOrders).filter(count => count > 1).length;
    const totalCustomers = Object.keys(customerOrders).length;
    const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
    document.getElementById('retentionRate').textContent = retentionRate.toFixed(1) + '%';
    
    // Conversion Rate (Simple: completed orders vs total orders)
    const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;
    const totalOrders = filteredOrders.length;
    const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    document.getElementById('conversionRate').textContent = conversionRate.toFixed(1) + '%';
}

function updateLowStockAlerts(inventory) {
    const alertsContainer = document.getElementById('lowStockAlerts');
    if (!alertsContainer) return;
    
    // Filter low stock items
    const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
    
    if (lowStockItems.length === 0) {
        alertsContainer.innerHTML = '<p class="no-alerts"><i class="fas fa-check-circle"></i> All inventory items are well-stocked</p>';
        return;
    }
    
    alertsContainer.innerHTML = lowStockItems.map(item => {
        const isCritical = item.currentStock <= (item.minStock * 0.5);
        const status = isCritical ? 'critical' : 'low';
        
        return `
            <div class="alert-item ${status}">
                <div class="alert-info">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alert-details">
                        <h4>${item.name}</h4>
                        <p>Category: ${item.category} | Unit: ${item.unit}</p>
                    </div>
                </div>
                <div class="alert-quantity">
                    ${item.currentStock} / ${item.minStock}
                </div>
            </div>
        `;
    }).join('');
}

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function exportAnalyticsReport() {
    const allOrders = JSON.parse(localStorage.getItem('freshgreens_orders')) || [];
    const filteredOrders = filterOrdersByDateRange(allOrders, currentDateRange);
    
    // Create CSV content
    let csv = 'Go Salad Analytics Report\n';
    csv += 'Generated: ' + new Date().toLocaleString() + '\n';
    csv += 'Period: ' + currentDateRange + '\n\n';
    
    // Add summary
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    csv += 'Summary\n';
    csv += 'Total Revenue,' + totalRevenue.toFixed(2) + '\n';
    csv += 'Total Orders,' + totalOrders + '\n';
    csv += 'Average Order Value,' + avgOrder.toFixed(2) + '\n\n';
    
    // Add detailed orders
    csv += 'Order Details\n';
    csv += 'Order ID,Date,Customer,Items,Total,Status\n';
    
    filteredOrders.forEach(order => {
        const itemsText = order.items ? order.items.map(i => i.product?.name || i.name).join('; ') : 'N/A';
        csv += `"${order.id}","${new Date(order.createdAt).toLocaleString()}","${order.customerName}","${itemsText}","${order.total.toFixed(2)}","${order.status}"\n`;
    });
    
    // Download as file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `analytics_report_${new Date().getTime()}.csv`);
    element.style.display = 'none';
    
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showNotification('Report exported successfully', 'success');
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
