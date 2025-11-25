// Load users
function loadUsers() {
    const users = db.getUsers();
    const tbody = document.getElementById("usersTableBody");

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = "";

    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.joinDate}</td>
                <td>${user.totalOrders}</td>
                <td>₱${user.totalSpent}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

loadUsers();

// Search
document.getElementById("searchUsers").addEventListener("input", function() {
    const keyword = this.value.toLowerCase();
    const users = db.getUsers().filter(user =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );

    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = "";

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No matching users.</td></tr>`;
        return;
    }

    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.joinDate}</td>
                <td>${user.totalOrders}</td>
                <td>₱${user.totalSpent}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
});

// Refresh
document.getElementById("refreshUsersBtn").addEventListener("click", loadUsers);

// View user
function viewUser(id) {
    const user = db.getUsers().find(u => u.id === id);
    document.getElementById("userDetailsContent").innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Join Date:</strong> ${user.joinDate}</p>
        <p><strong>Total Orders:</strong> ${user.totalOrders}</p>
        <p><strong>Total Spent:</strong> ₱${user.totalSpent}</p>
    `;

    document.getElementById("userDetailsModal").style.display = "block";
}

// Delete user
let deleteUserId = null;

function deleteUser(id) {
    deleteUserId = id;
    document.getElementById("deleteUserModal").style.display = "block";
}

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
    let users = db.getUsers();
    users = users.filter(u => u.id !== deleteUserId);
    db.saveUsers(users);

    loadUsers();
    closeAllModals();
});

// Close modals
function closeAllModals() {
    document.getElementById("userDetailsModal").style.display = "none";
    document.getElementById("deleteUserModal").style.display = "none";
}

document.querySelectorAll(".close, .close-delete-modal, .close-user-details")
    .forEach(btn => btn.addEventListener("click", closeAllModals));
