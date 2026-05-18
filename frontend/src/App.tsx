/// <reference types="vite/client" />
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SuratMasuk from "./pages/SuratMasuk";
import SuratKeluar from "./pages/SuratKeluar";
import Reimbursement from "./pages/Reimbursement";
import AdminControl from "./pages/AdminControl"; // ← ← ← TAMBAHKAN IMPORT INI
import Login from "./pages/Login";
import {
  Surat,
  Reimbursement as ReimbursementType,
  User, // ← ← ← TAMBAHKAN IMPORT TYPE USER
  // Mapping functions for API boundary transformation
  mapSuratMasukBackendToFrontend,
  mapSuratMasukFrontendToBackend,
  mapSuratMasukFrontendToBackendForUpdate,
  mapSuratKeluarBackendToFrontend,
  mapSuratKeluarFrontendToBackend,
  mapSuratKeluarFrontendToBackendForUpdate,
  mapReimbursementBackendToFrontend,
  mapReimbursementFrontendToBackend,
  mapReimbursementFrontendToBackendForUpdate,
} from "./types";

const API_URL = (import.meta as any).env?.VITE_API_URL || "https://office.getopurtunity.online/api/office";

// Custom hook untuk fetch & CRUD data office dengan transformation layer
const useOfficeData = () => {
  const { token } = useAuth();
  const [data, setData] = useState<{
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[];
  }>({ masuk: [], keluar: [], reimburse: [], logs: [] });
  const [loading, setLoading] = useState(true);

  // Fetch data from backend (backend → frontend transformation)
  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [masukRes, keluarRes, reimburseRes] = await Promise.all([fetch(`${API_URL}/surat-masuk`, { headers }), fetch(`${API_URL}/surat-keluar`, { headers }), fetch(`${API_URL}/reimbursements`, { headers })]);

      if (masukRes.ok) {
        const masukData = await masukRes.json();
        const frontendData = Array.isArray(masukData) ? masukData.map(mapSuratMasukBackendToFrontend) : [];
        setData((prev) => ({ ...prev, masuk: frontendData }));
      }
      if (keluarRes.ok) {
        const keluarData = await keluarRes.json();
        const frontendData = Array.isArray(keluarData) ? keluarData.map(mapSuratKeluarBackendToFrontend) : [];
        setData((prev) => ({ ...prev, keluar: frontendData }));
      }
      if (reimburseRes.ok) {
        const reimburseData = await reimburseRes.json();
        const frontendData = Array.isArray(reimburseData) ? reimburseData.map(mapReimbursementBackendToFrontend) : [];
        setData((prev) => ({ ...prev, reimburse: frontendData }));
      }
    } catch (error) {
      console.error("Failed to fetch office data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================== SURAT CRUD (with transformation) ====================

  const addSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Omit<Surat, "id">) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      const mapToBackend = type === "masuk" ? mapSuratMasukFrontendToBackend : mapSuratKeluarFrontendToBackend;
      const mapToFrontend = type === "masuk" ? mapSuratMasukBackendToFrontend : mapSuratKeluarBackendToFrontend;

      try {
        const backendPayload = mapToBackend(surat);
        console.log(`[DEBUG] POST /${endpoint} payload:`, backendPayload);

        const res = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] POST /${endpoint} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal menyimpan: ${errorMsg}`);
          return false;
        }

        const frontendData = mapToFrontend(responseData);
        setData((prev) => ({ ...prev, [type]: [...prev[type], frontendData] }));
        return true;
      } catch (error: any) {
        console.error(`Failed to add ${type}:`, error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  const updateSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Surat) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      const mapToBackend = type === "masuk" ? mapSuratMasukFrontendToBackendForUpdate : mapSuratKeluarFrontendToBackendForUpdate;
      const mapToFrontend = type === "masuk" ? mapSuratMasukBackendToFrontend : mapSuratKeluarBackendToFrontend;

      try {
        const backendPayload = mapToBackend(surat);
        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} payload:`, backendPayload);

        const res = await fetch(`${API_URL}/${endpoint}/${surat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          return false;
        }

        const frontendData = mapToFrontend(responseData);
        setData((prev) => ({
          ...prev,
          [type]: prev[type].map((s) => (s.id === frontendData.id ? frontendData : s)),
        }));
        return true;
      } catch (error: any) {
        console.error(`Failed to update ${type}:`, error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  const deleteSurat = useCallback(
    async (type: "masuk" | "keluar", id: string) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      try {
        console.log(`[DEBUG] DELETE /${endpoint}/${id}`);

        const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = await res.json();
        console.log(`[DEBUG] DELETE /${endpoint}/${id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message || `HTTP ${res.status}`;
          alert(`Gagal hapus: ${errorMsg}`);
          return false;
        }

        setData((prev) => ({ ...prev, [type]: prev[type].filter((s) => s.id !== id) }));
        return true;
      } catch (error: any) {
        console.error(`Failed to delete ${type}:`, error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  // ==================== REIMBURSEMENT CRUD ====================

  const addReimbursement = useCallback(
    async (r: Omit<ReimbursementType, "id">) => {
      try {
        const backendPayload = mapReimbursementFrontendToBackend(r);
        console.log(`[DEBUG] POST /reimbursements payload:`, backendPayload);

        const res = await fetch(`${API_URL}/reimbursements`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] POST /reimbursements response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal menyimpan: ${errorMsg}`);
          return false;
        }

        const frontendData = mapReimbursementBackendToFrontend(responseData);
        setData((prev) => ({ ...prev, reimburse: [...prev.reimburse, frontendData] }));
        return true;
      } catch (error: any) {
        console.error("Failed to add reimbursement:", error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  const updateReimbursement = useCallback(
    async (r: ReimbursementType) => {
      try {
        const backendPayload = mapReimbursementFrontendToBackendForUpdate(r);
        console.log(`[DEBUG] PATCH /reimbursements/${r.id} payload:`, backendPayload);

        const res = await fetch(`${API_URL}/reimbursements/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /reimbursements/${r.id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          return false;
        }

        const frontendData = mapReimbursementBackendToFrontend(responseData);
        setData((prev) => ({
          ...prev,
          reimburse: prev.reimburse.map((item) => (item.id === frontendData.id ? frontendData : item)),
        }));
        return true;
      } catch (error: any) {
        console.error("Failed to update reimbursement:", error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  const deleteReimbursement = useCallback(
    async (id: string) => {
      try {
        console.log(`[DEBUG] DELETE /reimbursements/${id}`);

        const res = await fetch(`${API_URL}/reimbursements/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = await res.json();
        console.log(`[DEBUG] DELETE /reimbursements/${id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message || `HTTP ${res.status}`;
          alert(`Gagal hapus: ${errorMsg}`);
          return false;
        }

        setData((prev) => ({ ...prev, reimburse: prev.reimburse.filter((r) => r.id !== id) }));
        return true;
      } catch (error: any) {
        console.error("Failed to delete reimbursement:", error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  // ==================== ADMIN: USER MANAGEMENT ====================

  const fetchUsers = useCallback(async (): Promise<User[]> => {
    if (!token) return [];
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  }, [token]);

  const createUser = useCallback(
    async (payload: { email: string; name?: string; password: string; role?: string }) => {
      if (!token) return false;
      try {
        const res = await fetch(`${API_URL}/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to create user");
        return true;
      } catch (error: any) {
        console.error("Failed to create user:", error);
        alert(`Error: ${error.message}`);
        return false;
      }
    },
    [token]
  );

  const updateUser = useCallback(
    async (id: string, payload: { name?: string; role?: string; isActive?: boolean }) => {
      if (!token) return false;
      try {
        const res = await fetch(`${API_URL}/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update user");
        return true;
      } catch (error: any) {
        console.error("Failed to update user:", error);
        alert(`Error: ${error.message}`);
        return false;
      }
    },
    [token]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      if (!token) return false;
      try {
        const res = await fetch(`${API_URL}/admin/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete user");
        return true;
      } catch (error: any) {
        console.error("Failed to delete user:", error);
        alert(`Error: ${error.message}`);
        return false;
      }
    },
    [token]
  );

  return {
    data,
    loading,
    addSurat,
    updateSurat,
    deleteSurat,
    addReimbursement,
    updateReimbursement,
    deleteReimbursement,
    refresh: fetchData,
    // Admin functions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

// ✅ Router DI LEVEL TERATAS - SATU-SATUNYA Router di app!
function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { isAuthenticated, logout, loading: authLoading, user } = useAuth(); // ← ← ← Ambil user untuk cek role
  const officeData = useOfficeData();

  // Loading state
  if (authLoading || officeData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → show Login
  if (!isAuthenticated) {
    return <Login />;
  }

  // ✅ Authenticated → render LANGSUNG
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Layout />
      <main className="ml-64 p-6 flex-1 min-h-screen">
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Administrasi Kantor</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => officeData.refresh()} className="p-2 text-gray-500 hover:text-blue-600 transition" title="Refresh data">
              <i className="fa-solid fa-rotate-right"></i>
            </button>
            <span className="text-sm text-gray-500">
              Welcome, <span className="font-semibold text-blue-600">{user?.name || user?.email || "Admin"}</span>
            </span>
            <button onClick={logout} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition">
              Logout
            </button>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard data={officeData.data} />} />

          <Route
            path="/masuk"
            element={
              <ProtectedRoute>
                <SuratMasuk
                  data={officeData.data.masuk}
                  onAdd={(surat: Omit<Surat, "id">) => officeData.addSurat("masuk", surat)}
                  onUpdate={(surat: Surat) => officeData.updateSurat("masuk", surat)}
                  onDelete={(id: string) => officeData.deleteSurat("masuk", id)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/keluar"
            element={
              <ProtectedRoute>
                <SuratKeluar
                  data={officeData.data.keluar}
                  onAdd={(surat: Omit<Surat, "id" | "status">) => officeData.addSurat("keluar", surat as Omit<Surat, "id">)}
                  onUpdate={(surat: Surat) => officeData.updateSurat("keluar", surat)}
                  onDelete={(id: string) => officeData.deleteSurat("keluar", id)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reimburse"
            element={
              <ProtectedRoute>
                <Reimbursement
                  data={officeData.data.reimburse}
                  onAdd={(r: Omit<ReimbursementType, "id">) => officeData.addReimbursement(r)}
                  onUpdate={(r: ReimbursementType) => officeData.updateReimbursement(r)}
                  onDelete={(id: string) => officeData.deleteReimbursement(id)}
                />
              </ProtectedRoute>
            }
          />

          {/* ✅ NEW: Admin Control Panel Route - Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminControl
                  token={localStorage.getItem("office_token") || ""}
                  API_URL={API_URL}
                  onBack={() => (window.location.href = "/")}
                  // Pass admin functions
                  fetchUsers={officeData.fetchUsers}
                  createUser={officeData.createUser}
                  updateUser={officeData.updateUser}
                  deleteUser={officeData.deleteUser}
                />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
