import React from 'react';
import { fmtRupiah } from '../utils/helpers';
import { Surat, Reimbursement } from '../types';

interface DashboardProps {
  data: {
    masuk: Surat[];
    keluar: Surat[];
    reimburse: Reimbursement[];
    logs: string[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const pendingReimburse = data.reimburse.filter(
    (r) => r.status === 'Draft' || r.status === 'Menunggu'
  ).length;

  const totalReimburse = data.reimburse
    .filter((r) => r.status === 'Dibayar' || r.status === 'Disetujui')
    .reduce((sum, r) => sum + r.jumlah, 0);

  const recentSuratLogs = data.logs.slice(-4).reverse();
  const recentReimburseLogs = data.logs.slice(-4, -1).reverse();

  return (
    <div className="fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Surat Masuk</p>
          <p className="text-2xl font-bold">{data.masuk.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Surat Keluar</p>
          <p className="text-2xl font-bold">{data.keluar.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Reimburse Pending</p>
          <p className="text-2xl font-bold">{pendingReimburse}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-emerald-500">
          <p className="text-gray-500 text-sm">Total Nominal Reimburse</p>
          <p className="text-xl font-bold">{fmtRupiah(totalReimburse)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold mb-3">Aktivitas Surat Terbaru</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {recentSuratLogs.map((log, index) => (
              <li key={index} className="border-b pb-1 last:border-0">
                {log}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-bold mb-3">Aktivitas Reimburse Terbaru</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {recentReimburseLogs.length > 0 ? (
              recentReimburseLogs.map((log, index) => (
                <li key={index} className="border-b pb-1 last:border-0">
                  {log}
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">Belum ada aktivitas</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
