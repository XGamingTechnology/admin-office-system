import React from "react";
import { Surat, Reimbursement as ReimbursementType } from "../types";

interface DashboardProps {
  data: {
    masuk: Surat[];
    keluar: Surat[];
    reimburse: ReimbursementType[];
    logs: string[]; // ← ← ← WAJIB ADA!
  };
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Surat Masuk</h3>
          <p className="text-2xl font-bold text-blue-600">{data.masuk.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Surat Keluar</h3>
          <p className="text-2xl font-bold text-green-600">{data.keluar.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Reimbursement</h3>
          <p className="text-2xl font-bold text-purple-600">{data.reimburse.length}</p>
        </div>
      </div>
      {/* Optional: Activity Logs */}
      {data.logs.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700 mb-2">Aktivitas Terbaru</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {data.logs.slice(0, 5).map((log, i) => (
              <li key={i}>• {log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
