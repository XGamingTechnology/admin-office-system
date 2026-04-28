# Frontend Administrasi Kantor

Aplikasi frontend untuk sistem administrasi kantor dengan fitur:
- Dashboard statistik
- Manajemen Surat Masuk
- Manajemen Surat Keluar
- Reimbursement

## Tech Stack
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router DOM

## Instalasi

```bash
npm install
```

## Development

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## Build

```bash
npm run build
```

## Struktur Folder

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── Layout.tsx    # Main layout dengan sidebar
│   │   └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── SuratMasuk.tsx
│   │   ├── SuratKeluar.tsx
│   │   ├── Reimbursement.tsx
│   │   └── Login.tsx
│   ├── hooks/            # Custom hooks
│   ├── services/         # API calls
│   ├── types/            # TypeScript types
│   ├── utils/            # Helper functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Fitur

### Dashboard
- Statistik surat masuk/keluar
- Status reimbursement pending
- Total nominal reimbursement
- Log aktivitas terbaru

### Surat Masuk
- Tambah, edit, hapus surat masuk
- Pencarian berdasarkan nomor/perihal
- Status tracking

### Surat Keluar
- Buat draft surat keluar
- Tracking status pengiriman
- Pencarian dan filtering

### Reimbursement
- Ajukan reimbursement
- Kategori: Transport, Makan, Akomodasi, Operasional, Lainnya
- Approval workflow
- Format Rupiah otomatis

## Data Storage

Data disimpan di localStorage browser untuk demo purposes.
Gunakan tombol "Reset Data Demo" untuk mengembalikan ke data awal.
