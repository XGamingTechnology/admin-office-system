import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/admin/", // ⚠️ WAJIB: match dengan basename di React Router
  server: {
    port: 3000,
    host: true, // Agar bisa diakses dari luar container saat dev
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Matikan di production untuk ukuran lebih kecil
  },
});
