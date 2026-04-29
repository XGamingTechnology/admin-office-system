import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import SuratMasuk from './pages/SuratMasuk';
import SuratKeluar from './pages/SuratKeluar';
import Reimbursement from './pages/Reimbursement';
import Login from './pages/Login';
import { useAppData } from './hooks/useAppData';
import { Surat, Reimbursement as ReimbursementType } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for demo
  const {
    data,
    resetData,
    addSurat,
    updateSurat,
    deleteSurat,
    addReimbursement,
    updateReimbursement,
    deleteReimbursement,
  } = useAppData();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Layout onReset={resetData} />
        <main className="ml-64 p-6 flex-1 min-h-screen">
          <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">
              Administrasi Kantor
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Mode: <span className="font-semibold text-blue-600">Admin Demo</span>
              </span>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                A
              </div>
            </div>
          </header>

          <Routes>
            <Route
              path="/"
              element={<Dashboard data={data} />}
            />
            <Route
              path="/masuk"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SuratMasuk
                    data={data.masuk}
                    onAdd={(surat: Surat) => addSurat('masuk', surat)}
                    onUpdate={(surat: Surat) => updateSurat('masuk', surat)}
                    onDelete={(id: number) => deleteSurat('masuk', id)}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/keluar"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SuratKeluar
                    data={data.keluar}
                    onAdd={(surat: Surat) => addSurat('keluar', surat)}
                    onUpdate={(surat: Surat) => updateSurat('keluar', surat)}
                    onDelete={(id: number) => deleteSurat('keluar', id)}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reimburse"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Reimbursement
                    data={data.reimburse}
                    onAdd={(r: ReimbursementType) => addReimbursement(r)}
                    onUpdate={(r: ReimbursementType) => updateReimbursement(r)}
                    onDelete={(id: number) => deleteReimbursement(id)}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
