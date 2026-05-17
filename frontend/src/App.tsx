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
import {
  Surat,
  Reimbursement as ReimbursementType,
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
      console.error("Failed to fetch office ", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================== SURAT CRUD (with transformation) ====================

  // ✅ CREATE Surat
  const addSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Omit<Surat, "id">, file?: File) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      const mapToBackend = type === "masuk" ? mapSuratMasukFrontendToBackend : mapSuratKeluarFrontendToBackend;
      const mapToFrontend = type === "masuk" ? mapSuratMasukBackendToFrontend : mapSuratKeluarBackendToFrontend;

      try {
        // Transform frontend → backend
        const backendPayload = mapToBackend(surat);

        let formDataToSend: FormData | null = null;

        if (file) {
          // Use FormData for file upload
          formDataToSend = new FormData();
          formDataToSend.append("file", file);
          // Add all backend fields to FormData as strings
          Object.entries(backendPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formDataToSend.append(key, String(value));
            }
          });
        }

        console.log(`[DEBUG] POST /${endpoint} payload:`, file ? "FormData with file" : backendPayload);
        if (formDataToSend) {
          console.log("[DEBUG] FormData entries:", Array.from(formDataToSend.entries()));
        }

        const res = await fetch(`${API_URL}/${endpoint}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: file ? formDataToSend : JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] POST /${endpoint} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal menyimpan: ${errorMsg}`);
          return false;
        }

        // Transform backend → frontend before updating state
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

  // ✅ UPDATE Surat
  const updateSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Surat, file?: File) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      const mapToBackend = type === "masuk" ? mapSuratMasukFrontendToBackendForUpdate : mapSuratKeluarFrontendToBackendForUpdate;
      const mapToFrontend = type === "masuk" ? mapSuratMasukBackendToFrontend : mapSuratKeluarBackendToFrontend;

      try {
        // Transform frontend → backend
        const backendPayload = mapToBackend(surat);

        let formDataToSend: FormData | null = null;

        if (file) {
          // Use FormData for file upload
          formDataToSend = new FormData();
          formDataToSend.append("file", file);
          // Add all backend fields to FormData as strings
          Object.entries(backendPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formDataToSend.append(key, String(value));
            }
          });
        }

        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} payload:`, file ? "FormData with file" : backendPayload);
        if (formDataToSend) {
          console.log("[DEBUG] FormData entries:", Array.from(formDataToSend.entries()));
        }

        const res = await fetch(`${API_URL}/${endpoint}/${surat.id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: file ? formDataToSend : JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          return false;
        }

        // Transform backend → frontend
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

  // ✅ DELETE Surat (no transformation needed)
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

  // ==================== REIMBURSEMENT CRUD (with transformation) ====================

  // ✅ CREATE Reimbursement
  const addReimbursement = useCallback(
    async (r: Omit<ReimbursementType, "id">, file?: File) => {
      try {
        // Transform frontend → backend
        const backendPayload = mapReimbursementFrontendToBackend(r);

        let formDataToSend: FormData | null = null;
        if (file) {
          formDataToSend = new FormData();
          formDataToSend.append("file", file);
          Object.entries(backendPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formDataToSend.append(key, String(value));
            }
          });
        }

        console.log(`[DEBUG] POST /reimbursements payload:`, file ? "FormData with file" : backendPayload);
        if (formDataToSend) {
          console.log("[DEBUG] FormData entries:", Array.from(formDataToSend.entries()));
        }

        const res = await fetch(`${API_URL}/reimbursements`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: file ? formDataToSend : JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] POST /reimbursements response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal menyimpan: ${errorMsg}`);
          return false;
        }

        // Transform backend → frontend
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

  // ✅ UPDATE Reimbursement
  const updateReimbursement = useCallback(
    async (r: ReimbursementType, file?: File) => {
      try {
        // Transform frontend → backend
        const backendPayload = mapReimbursementFrontendToBackendForUpdate(r);

        let formDataToSend: FormData | null = null;
        if (file) {
          formDataToSend = new FormData();
          formDataToSend.append("file", file);
          Object.entries(backendPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formDataToSend.append(key, String(value));
            }
          });
        }

        console.log(`[DEBUG] PATCH /reimbursements/${r.id} payload:`, file ? "FormData with file" : backendPayload);
        if (formDataToSend) {
          console.log("[DEBUG] FormData entries:", Array.from(formDataToSend.entries()));
        }

        const res = await fetch(`${API_URL}/reimbursements/${r.id}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: file ? formDataToSend : JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /reimbursements/${r.id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          return false;
        }

        // Transform backend → frontend
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

  // ✅ APPROVE/REJECT Reimbursement (Admin Only)
  const handleApprove = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      try {
        console.log(`[DEBUG] PATCH /reimbursements/${id} (approve):`, { status });

        const res = await fetch(`${API_URL}/reimbursements/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // 👈 PENTING: Token auth
          body: JSON.stringify({ status }),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /reimbursements/${id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message || `HTTP ${res.status}`;
          alert(`Gagal mengubah status: ${errorMsg}`);
          return false;
        }

        // Transform backend → frontend & update state
        const frontendData = mapReimbursementBackendToFrontend(responseData);
        setData((prev) => ({
          ...prev,
          reimburse: prev.reimburse.map((item) => (item.id === frontendData.id ? frontendData : item)),
        }));

        alert(`Berhasil mengubah status menjadi ${frontendData.status}`);
        return true;
      } catch (error: any) {
        console.error("Error saat approve:", error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token]
  );

  // ✅ DELETE Reimbursement (no transformation needed)
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

  return {
    data,
    loading,
    addSurat,
    updateSurat,
    deleteSurat,
    addReimbursement,
    updateReimbursement,
    deleteReimbursement,
    handleApprove, // 👈 Export fungsi approve ke component
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
  const { isAuthenticated, logout, loading: authLoading, user } = useAuth(); // 👈 Ambil 'user' dari auth context
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
              Welcome, <span className="font-semibold text-blue-600">{user?.name || "Admin"}</span>
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
                  onAdd={(surat: Omit<Surat, "id">, file?: File) => officeData.addSurat("masuk", surat, file)}
                  onUpdate={(surat: Surat, file?: File) => officeData.updateSurat("masuk", surat, file)}
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
                  onAdd={(surat: Omit<Surat, "id" | "status">, file?: File) => officeData.addSurat("keluar", surat as Omit<Surat, "id">, file)}
                  onUpdate={(surat: Surat, file?: File) => officeData.updateSurat("keluar", surat, file)}
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
                  // 👇 PERBAIKAN 1: Gunakan officeData.data.reimburse (bukan data.reimburse)
                  data={officeData.data.reimburse}
                  // 👇 PERBAIKAN 2: Gunakan nama fungsi yang benar dari hook (addReimbursement, bukan handleAdd...)
                  onAdd={officeData.addReimbursement}
                  onUpdate={officeData.updateReimbursement}
                  onDelete={officeData.deleteReimbursement}
                  // 👇 PERBAIKAN 3: Tambahkan props baru yang dibutuhkan komponen Reimbursement
                  currentUser={{
                    name: user?.name || "Admin",
                    role: (user?.role as "Admin" | "Client") || "Client",
                  }}
                  onApprove={officeData.handleApprove}
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
