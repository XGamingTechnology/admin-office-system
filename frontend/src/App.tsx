/// <reference types="vite/client" />
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary"; // ← Import
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import SuratMasuk from "./pages/SuratMasuk";
import SuratKeluar from "./pages/SuratKeluar";
import Reimbursement from "./pages/Reimbursement";
import Login from "./pages/Login";
import { Surat, Reimbursement as ReimbursementType } from "./types";

// API Base URL (gunakan env var dengan fallback)
const API_URL = (import.meta as any).env?.VITE_API_URL || "https://office.getopurtunity.online/api/office";

// Custom hook untuk fetch & CRUD data office
const useOfficeData = () => {
  const { token } = useAuth();
  const [data, setData] = useState<{
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[]; // ← ← ← TAMBAHKAN INI!
  }>({ masuk: [], keluar: [], reimburse: [], logs: [] }); // ← Init dengan empty array
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;

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
      console.error("Failed to fetch office data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // CRUD helpers
  const addSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Omit<Surat, "id">) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      try {
        const res = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(surat),
        });
        if (res.ok) {
          const newSurat = await res.json();
          setData((prev) => ({ ...prev, [type]: [...prev[type], newSurat] }));
          return true;
        }
      } catch (error) {
        console.error(`Failed to add ${type}:`, error);
      }
      return false;
    },
    [token]
  );

  const updateSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Surat) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      try {
        const res = await fetch(`${API_URL}/${endpoint}/${surat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(surat),
        });
        if (res.ok) {
          const updated = await res.json();
          setData((prev) => ({ ...prev, [type]: prev[type].map((s) => (s.id === updated.id ? updated : s)) }));
          return true;
        }
      } catch (error) {
        console.error(`Failed to update ${type}:`, error);
      }
      return false;
    },
    [token]
  );

  const deleteSurat = useCallback(
    async (type: "masuk" | "keluar", id: number) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      try {
        const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setData((prev) => ({ ...prev, [type]: prev[type].filter((s) => s.id !== id) }));
          return true;
        }
      } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
      }
      return false;
    },
    [token]
  );

  const addReimbursement = useCallback(
    async (r: Omit<ReimbursementType, "id">) => {
      try {
        const res = await fetch(`${API_URL}/reimbursements`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(r),
        });
        if (res.ok) {
          const newR = await res.json();
          setData((prev) => ({ ...prev, reimburse: [...prev.reimburse, newR] }));
          return true;
        }
      } catch (error) {
        console.error("Failed to add reimbursement:", error);
      }
      return false;
    },
    [token]
  );

  const updateReimbursement = useCallback(
    async (r: ReimbursementType) => {
      try {
        const res = await fetch(`${API_URL}/reimbursements/${r.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(r),
        });
        if (res.ok) {
          const updated = await res.json();
          setData((prev) => ({ ...prev, reimburse: prev.reimburse.map((item) => (item.id === updated.id ? updated : item)) }));
          return true;
        }
      } catch (error) {
        console.error("Failed to update reimbursement:", error);
      }
      return false;
    },
    [token]
  );

  const deleteReimbursement = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`${API_URL}/reimbursements/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setData((prev) => ({ ...prev, reimburse: prev.reimburse.filter((r) => r.id !== id) }));
          return true;
        }
      } catch (error) {
        console.error("Failed to delete reimbursement:", error);
      }
      return false;
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

// ✅ Router DI LEVEL TERATAS
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

// Main App Content Component
function AppContent() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth();
  const officeData = useOfficeData();

  // Loading state
  if (authLoading || (isAuthenticated && officeData.loading)) {
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
      {" "}
      {/* ← ← ← Langsung div, BUKAN Router! */}
      <Layout />
      <main className="ml-64 p-6 flex-1 min-h-screen">
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Administrasi Kantor</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => officeData.refresh()} className="p-2 text-gray-500 hover:text-blue-600 transition">
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

        {/* Routes tetap di dalam, tapi TANPA Router wrapper */}
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
                  onDelete={(id: number) => officeData.deleteSurat("masuk", id)}
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
                  onDelete={(id: number) => officeData.deleteSurat("keluar", id)}
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
                  onDelete={(id: number) => officeData.deleteReimbursement(id)}
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
