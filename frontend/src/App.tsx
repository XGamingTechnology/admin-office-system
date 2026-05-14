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
import Login from "./pages/Login";
import { Surat, Reimbursement as ReimbursementType } from "./types";

const API_URL = (import.meta as any).env?.VITE_API_URL || "https://office.getopurtunity.online/api/office";

// Custom hook untuk fetch & CRUD data office
const useOfficeData = () => {
  const { token } = useAuth();
  const [data, setData] = useState<{
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[];
  }>({ masuk: [], keluar: [], reimburse: [], logs: [] });
  const [loading, setLoading] = useState(true);

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
        setData((prev) => ({ ...prev, masuk: Array.isArray(masukData) ? masukData : [] }));
      }
      if (keluarRes.ok) {
        const keluarData = await keluarRes.json();
        setData((prev) => ({ ...prev, keluar: Array.isArray(keluarData) ? keluarData : [] }));
      }
      if (reimburseRes.ok) {
        const reimburseData = await reimburseRes.json();
        setData((prev) => ({ ...prev, reimburse: Array.isArray(reimburseData) ? reimburseData : [] }));
      }
    } catch (error) {
      console.error("Failed to fetch office ", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ CREATE: Tambahkan error handling + logging
  const addSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Omit<Surat, "id">) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      try {
        console.log(`[DEBUG] POST /${endpoint} payload:`, surat); // ← ← ← Debug log

        const res = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(surat),
        });

        const responseData = await res.json(); // ← ← ← Baca response body even if error
        console.log(`[DEBUG] POST /${endpoint} response:`, res.status, responseData); // ← ← ← Debug log

        if (!res.ok) {
          // ← ← ← Tampilkan error dari backend
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal menyimpan: ${errorMsg}`);
          console.error(`Failed to add ${type}:`, responseData);
          return false;
        }

        // Success: backend returns full object with UUID
        setData((prev) => ({ ...prev, [type]: [...prev[type], responseData] }));
        return true;
      } catch (error: any) {
        console.error(`Failed to add ${type}:`, error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  // ✅ UPDATE: Tambahkan error handling + logging
  const updateSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Surat) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      try {
        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} payload:`, surat);

        const res = await fetch(`${API_URL}/${endpoint}/${surat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(surat),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          console.error(`Failed to update ${type}:`, responseData);
          return false;
        }

        setData((prev) => ({
          ...prev,
          [type]: prev[type].map((s) => (s.id === responseData.id ? responseData : s)),
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

  // ✅ DELETE: Tambahkan error handling + logging
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
          console.error(`Failed to delete ${type}:`, responseData);
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

  // ✅ CREATE Reimbursement: Tambahkan error handling + logging
  const addReimbursement = useCallback(
    async (r: Omit<ReimbursementType, "id">) => {
      try {
        console.log(`[DEBUG] POST /reimbursements payload:`, r);

        const res = await fetch(`${API_URL}/reimbursements`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(r),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] POST /reimbursements response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal menyimpan: ${errorMsg}`);
          console.error("Failed to add reimbursement:", responseData);
          return false;
        }

        setData((prev) => ({ ...prev, reimburse: [...prev.reimburse, responseData] }));
        return true;
      } catch (error: any) {
        console.error("Failed to add reimbursement:", error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  // ✅ UPDATE Reimbursement: Tambahkan error handling + logging
  const updateReimbursement = useCallback(
    async (r: ReimbursementType) => {
      try {
        console.log(`[DEBUG] PATCH /reimbursements/${r.id} payload:`, r);

        const res = await fetch(`${API_URL}/reimbursements/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(r),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /reimbursements/${r.id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          console.error("Failed to update reimbursement:", responseData);
          return false;
        }

        setData((prev) => ({
          ...prev,
          reimburse: prev.reimburse.map((item) => (item.id === responseData.id ? responseData : item)),
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

  // ✅ DELETE Reimbursement: Tambahkan error handling + logging
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
          console.error("Failed to delete reimbursement:", responseData);
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
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
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

  // ✅ Authenticated → render LANGSUNG tanpa <Router> wrapper
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
              Welcome, <span className="font-semibold text-blue-600">Admin</span>
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
                  onAdd={(surat: Omit<Surat, "id">) => officeData.addSurat("keluar", surat)}
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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
