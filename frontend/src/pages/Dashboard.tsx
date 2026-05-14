// src/pages/Dashboard.tsx
import React from "react";
import { Surat, Reimbursement as ReimbursementType } from "../types";

interface DashboardProps {
  data: {
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-gray-600 text-sm">Surat Masuk</h3>
          <p className="text-3xl font-bold text-blue-600 mt-1">{data.masuk.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-gray-600 text-sm">Surat Keluar</h3>
          <p className="text-3xl font-bold text-green-600 mt-1">{data.keluar.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-gray-600 text-sm">Reimbursement</h3>
          <p className="text-3xl font-bold text-purple-600 mt-1">{data.reimburse.length}</p>
        </div>
      </div>

      {/* Activity Logs (optional) */}
      {data.logs.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3">Aktivitas Terbaru</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {data.logs.slice(0, 5).map((log, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{log}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
