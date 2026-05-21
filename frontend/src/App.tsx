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
import AdminControl from "./pages/AdminControl";
import Login from "./pages/Login";
import {
  Surat,
  Reimbursement as ReimbursementType,
  User,
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

// ==================== FILE UPLOAD UTILS ====================

// Upload file ke Cloudinary (recommended for production)
const uploadFileToCloudinary = async (file: File, cloudName: string, uploadPreset: string): Promise<string | null> => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "office_admin"); // Optional: organize files in folder

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url; // Return the HTTPS URL of uploaded file
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Alternative: Upload ke backend endpoint (jika tidak pakai Cloudinary)
const uploadFileToBackend = async (file: File, token: string, endpoint: string): Promise<string | null> => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.fileUrl || data.url || data.path;
  } catch (error) {
    console.error("Backend upload error:", error);
    return null;
  }
};

// ==================== CUSTOM HOOK: useOfficeData ====================

const useOfficeData = () => {
  const { token, user } = useAuth();
  const [data, setData] = useState<{
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[];
  }>({ masuk: [], keluar: [], reimburse: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch data from backend with RBAC filtering
  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [masukRes, keluarRes, reimburseRes] = await Promise.all([fetch(`${API_URL}/surat-masuk`, { headers }), fetch(`${API_URL}/surat-keluar`, { headers }), fetch(`${API_URL}/reimbursements`, { headers })]);

      // Helper to process response with RBAC filter
      const processResponse = async (res: Response, mapFn: (backend: any) => any) => {
        if (!res.ok) return [];
        let backendData = await res.json();
        if (!Array.isArray(backendData)) return [];

        // ✅ RBAC FILTER: Jika user biasa, filter hanya data milik sendiri
        const userId = user?.id;
        const userRole = user?.role;

        if (userRole !== "admin" && userId) {
          backendData = backendData.filter((item: any) => item.createdBy === userId || item.created_by === userId);
        }

        return backendData.map(mapFn);
      };

      const [masukData, keluarData, reimburseData] = await Promise.all([
        processResponse(masukRes, mapSuratMasukBackendToFrontend),
        processResponse(keluarRes, mapSuratKeluarBackendToFrontend),
        processResponse(reimburseRes, mapReimbursementBackendToFrontend),
      ]);

      setData((prev) => ({
        ...prev,
        masuk: masukData,
        keluar: keluarData,
        reimburse: reimburseData,
      }));
    } catch (error) {
      console.error("Failed to fetch office data:", error);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ==================== FILE UPLOAD HANDLER ====================

  const handleFileUpload = useCallback(
    async (file: File | undefined): Promise<string | null> => {
      if (!file) return null;

      setUploading(true);
      try {
        // Option 1: Cloudinary (uncomment & configure if using)
        // const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        // const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        // if (cloudName && uploadPreset) {
        //   return await uploadFileToCloudinary(file, cloudName, uploadPreset);
        // }

        // Option 2: Backend upload endpoint (default fallback)
        return await uploadFileToBackend(file, token || "", "/upload");
      } catch (error) {
        console.error("File upload failed:", error);
        alert("Gagal upload file. Silakan coba lagi atau kontak admin.");
        return null;
      } finally {
        setUploading(false);
      }
    },
    [token]
  );

  // ==================== SURAT CRUD (with file upload & transformation) ====================

  const addSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Omit<Surat, "id"> & { file?: File }) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      const mapToBackend = type === "masuk" ? mapSuratMasukFrontendToBackend : mapSuratKeluarFrontendToBackend;
      const mapToFrontend = type === "masuk" ? mapSuratMasukBackendToFrontend : mapSuratKeluarBackendToFrontend;

      try {
        // 1. Upload file if provided
        let fileUrl: string | null = null;
        if (surat.file) {
          fileUrl = await handleFileUpload(surat.file);
          if (!fileUrl) {
            // Continue without file if upload fails (optional: can return false to block)
            console.warn("File upload failed, continuing without attachment");
          }
        }

        // 2. Prepare backend payload with fileUrl
        const backendPayload = {
          ...mapToBackend(surat),
          fileUrl: fileUrl || null,
        };

        console.log(`[DEBUG] POST /${endpoint} payload:`, backendPayload);

        // 3. Send to backend
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

        // 4. Update local state with transformed data
        const frontendData = mapToFrontend(responseData);
        setData((prev) => ({ ...prev, [type]: [...prev[type], frontendData] }));
        return true;
      } catch (error: any) {
        console.error(`Failed to add ${type}:`, error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token, handleFileUpload]
  );

  const updateSurat = useCallback(
    async (type: "masuk" | "keluar", surat: Surat & { file?: File }) => {
      const endpoint = type === "masuk" ? "surat-masuk" : "surat-keluar";
      const mapToBackend = type === "masuk" ? mapSuratMasukFrontendToBackendForUpdate : mapSuratKeluarFrontendToBackendForUpdate;
      const mapToFrontend = type === "masuk" ? mapSuratMasukBackendToFrontend : mapSuratKeluarBackendToFrontend;

      try {
        // 1. Upload new file if provided (replace old one)
        let fileUrl: string | null = surat.fileUrl || null;
        if (surat.file) {
          const uploadedUrl = await handleFileUpload(surat.file);
          if (uploadedUrl) {
            fileUrl = uploadedUrl; // Replace with new file URL
          }
        }

        // 2. Prepare backend payload
        const backendPayload = {
          ...mapToBackend(surat),
          fileUrl: fileUrl,
        };

        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} payload:`, backendPayload);

        // 3. Send to backend
        const res = await fetch(`${API_URL}/${endpoint}/${surat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(backendPayload),
        });

        const responseData = await res.json();
        console.log(`[DEBUG] PATCH /${endpoint}/${surat.id} response:`, res.status, responseData);

        if (!res.ok) {
          // Handle 404 - Data not found, remove from local state
          if (res.status === 404) {
            alert(`Data surat tidak ditemukan di server. Kemungkinan sudah dihapus.`);
            setData((prev) => ({
              ...prev,
              [type]: prev[type].filter((s) => s.id !== surat.id),
            }));
            return false;
          }

          const errorMsg = responseData?.message ? (Array.isArray(responseData.message) ? responseData.message.join(", ") : responseData.message) : `HTTP ${res.status}`;
          alert(`Gagal update: ${errorMsg}`);
          return false;
        }

        // 4. Update local state
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
    [token, handleFileUpload]
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

        // Handle empty response (204 No Content)
        let responseData: any = {};
        const text = await res.text();
        if (text) {
          try {
            responseData = JSON.parse(text);
          } catch (e) {
            console.warn(`[WARN] DELETE response not JSON: ${text.substring(0, 100)}`);
          }
        }

        console.log(`[DEBUG] DELETE /${endpoint}/${id} response:`, res.status, responseData);

        if (!res.ok) {
          const errorMsg = responseData?.message || `HTTP ${res.status}`;
          alert(`Gagal hapus: ${errorMsg}`);
          return false;
        }

        // Update local state
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
    async (r: Omit<ReimbursementType, "id"> & { file?: File }) => {
      try {
        // 1. Upload receipt file if provided
        let receiptUrl: string | null = null;
        if ((r as any).file) {
          receiptUrl = await handleFileUpload((r as any).file);
          if (!receiptUrl) {
            console.warn("Receipt upload failed, continuing without attachment");
          }
        }

        // 2. Prepare backend payload
        const backendPayload = {
          ...mapReimbursementFrontendToBackend(r),
          receiptUrl: receiptUrl || null,
        };

        console.log(`[DEBUG] POST /reimbursements payload:`, backendPayload);

        // 3. Send to backend
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

        // 4. Update local state
        const frontendData = mapReimbursementBackendToFrontend(responseData);
        setData((prev) => ({ ...prev, reimburse: [...prev.reimburse, frontendData] }));
        return true;
      } catch (error: any) {
        console.error("Failed to add reimbursement:", error);
        alert(`Network error: ${error.message || "Cek console untuk detail"}`);
        return false;
      }
    },
    [token, handleFileUpload]
  );

  const updateReimbursement = useCallback(
    async (r: ReimbursementType & { file?: File }) => {
      try {
        // 1. Upload new receipt if provided
        let receiptUrl: string | null = r.receiptUrl || null;
        if (r.file) {
          const uploadedUrl = await handleFileUpload(r.file);
          if (uploadedUrl) {
            receiptUrl = uploadedUrl;
          }
        }

        // 2. Prepare backend payload
        const backendPayload = {
          ...mapReimbursementFrontendToBackendForUpdate(r),
          receiptUrl: receiptUrl,
        };

        console.log(`[DEBUG] PATCH /reimbursements/${r.id} payload:`, backendPayload);

        // 3. Send to backend
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

        // 4. Update local state
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
    [token, handleFileUpload]
  );

  const deleteReimbursement = useCallback(
    async (id: string) => {
      try {
        console.log(`[DEBUG] DELETE /reimbursements/${id}`);

        const res = await fetch(`${API_URL}/reimbursements/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle empty response
        let responseData: any = {};
        const text = await res.text();
        if (text) {
          try {
            responseData = JSON.parse(text);
          } catch (e) {
            console.warn(`[WARN] DELETE response not JSON: ${text.substring(0, 100)}`);
          }
        }

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
        // Handle empty response for DELETE
        const text = await res.text();
        if (!res.ok) {
          if (text) {
            try {
              const data = JSON.parse(text);
              throw new Error(data.message || "Failed to delete user");
            } catch {
              throw new Error(`HTTP ${res.status}`);
            }
          }
          throw new Error(`HTTP ${res.status}`);
        }
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
    uploading,
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

// ==================== MAIN APP COMPONENT ====================

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
  const { isAuthenticated, logout, loading: authLoading, user } = useAuth();
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

  // ✅ Authenticated → render directly
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Layout />
      <main className="ml-64 p-6 flex-1 min-h-screen">
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Administrasi Kantor</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => officeData.refresh()} className="p-2 text-gray-500 hover:text-blue-600 transition" title="Refresh data" disabled={officeData.loading}>
              <i className={`fa-solid ${officeData.loading ? "fa-spinner fa-spin" : "fa-rotate-right"}`}></i>
            </button>
            <span className="text-sm text-gray-500">
              Welcome, <span className="font-semibold text-blue-600">{user?.name || user?.email || "Admin"}</span>
              {user?.role && <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{user.role}</span>}
            </span>
            <button onClick={logout} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition">
              Logout
            </button>
          </div>
        </header>

        {/* Upload indicator */}
        {officeData.uploading && (
          <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Uploading file...</span>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Dashboard data={officeData.data} userName={user?.name} />} />

          <Route
            path="/masuk"
            element={
              <ProtectedRoute>
                <SuratMasuk
                  data={officeData.data.masuk}
                  onAdd={(surat: Omit<Surat, "id"> & { file?: File }) => officeData.addSurat("masuk", surat)}
                  onUpdate={(surat: Surat & { file?: File }) => officeData.updateSurat("masuk", surat)}
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
                  onAdd={(surat: Omit<Surat, "id" | "status"> & { file?: File }) => officeData.addSurat("keluar", surat as Omit<Surat, "id"> & { file?: File })}
                  onUpdate={(surat: Surat & { file?: File }) => officeData.updateSurat("keluar", surat)}
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
                  onAdd={(r: Omit<ReimbursementType, "id"> & { file?: File }) => officeData.addReimbursement(r)}
                  onUpdate={(r: ReimbursementType & { file?: File }) => officeData.updateReimbursement(r)}
                  onDelete={(id: string) => officeData.deleteReimbursement(id)}
                />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin Control Panel - Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminControl
                  token={localStorage.getItem("office_token") || ""}
                  API_URL={API_URL}
                  onBack={() => (window.location.href = "/")}
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
