// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect ke halaman yang diminta setelah login, atau ke dashboard
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate(from, { replace: true });
    }
    // Error sudah di-handle di AuthContext dan akan muncul di UI

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <i className="fa-solid fa-briefcase text-4xl text-blue-400 mb-2"></i>
          <h1 className="text-2xl font-bold text-gray-800">AdminKantor</h1>
          <p className="text-gray-600">Silakan login untuk melanjutkan</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition"
              placeholder="admin@getopurtunity.online"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2">
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-center text-xs text-gray-500">
            <strong>Demo Credentials:</strong>
            <br />
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">admin@getopurtunity.online / AdminSecure123!</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
