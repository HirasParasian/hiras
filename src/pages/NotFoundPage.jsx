import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <span className="text-5xl font-mono font-extrabold text-blue-500">404</span>
      <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-slate-500">
        Halaman yang Anda tuju mungkin sudah dipindahkan atau URL salah diketik.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Home size={15} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
