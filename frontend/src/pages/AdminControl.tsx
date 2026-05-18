// frontend/src/pages/AdminControl.tsx
import React, { useState, useEffect } from "react";
import { User, CreateUserPayload, UpdateUserPayload } from "../types";

// ✅ UPDATED: Interface dengan admin management functions
interface AdminControlProps {
  token: string;
  API_URL: string;
  onBack: () => void;
  // Admin management functions
  fetchUsers: () => Promise<User[]>;
  createUser: (payload: CreateUserPayload) => Promise<boolean>;
  updateUser: (id: string, payload: UpdateUserPayload) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

const AdminControl: React.FC<AdminControlProps> = ({ token, API_URL, onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // Ganti line ~18-24 dengan ini:
  const [formData, setFormData] = useState<CreateUserPayload & { id?: string }>({
    email: "",
    name: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, API_URL]);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Open modal for create/edit
  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ id: user.id, email: user.email, name: user.name, role: user.role, password: "" });
    } else {
      setEditingUser(null);
      setFormData({ email: "", name: "", password: "", role: "user" });
    }
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ email: "", name: "", password: "", role: "user" });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const endpoint = editingUser ? `${API_URL}/admin/users/${editingUser.id}` : `${API_URL}/admin/users`;
      const method = editingUser ? "PATCH" : "POST";

      // For update, remove password if empty
      const payload = editingUser && !formData.password ? { name: formData.name, role: formData.role } : formData;

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      setSuccess(editingUser ? "User updated successfully" : "User created successfully");
      closeModal();
      fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle delete (soft delete)
  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Deactivate user ${email}? They won't be able to login.`)) return;

    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to deactivate user");
      setSuccess("User deactivated");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle toggle active status
  const toggleActive = async (user: User) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fade-in p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-gray-500">Manage users, roles, and permissions</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition flex items-center gap-2">
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i> {success}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input type="text" placeholder="Search by email or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold text-gray-700">Name</th>
                <th className="p-3 font-semibold text-gray-700">Email</th>
                <th className="p-3 font-semibold text-gray-700">Role</th>
                <th className="p-3 font-semibold text-gray-700">Status</th>
                <th className="p-3 font-semibold text-gray-700">Created</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-3 text-sm font-medium text-gray-800">{user.name || "-"}</td>
                    <td className="p-3 text-sm text-gray-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{user.role}</span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleActive(user)}
                        className={`px-2 py-1 rounded text-xs font-medium transition ${user.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                        title={user.isActive ? "Click to deactivate" : "Click to activate"}
                      >
                        {user.isActive ? "● Active" : "○ Inactive"}
                      </button>
                    </td>
                    <td className="p-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800 mx-1 p-2 rounded hover:bg-blue-50 transition" title="Edit user">
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => handleDelete(user.id, user.email)} className="text-red-600 hover:text-red-800 mx-1 p-2 rounded hover:bg-red-50 transition" title="Deactivate user">
                        <i className="fa-solid fa-user-slash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">{editingUser ? "Edit User" : "Add New User"}</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-red-500 text-xl">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && <span className="text-gray-400">(leave blank to keep current)</span>}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={editingUser ? "••••••••" : "Min. 6 characters"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "user" })} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  {editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminControl;
