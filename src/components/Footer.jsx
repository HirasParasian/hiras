import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-8 mt-auto text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Hiras Parasian. Dibuat dengan dedikasi.</span>
          <span className="hidden sm:inline">•</span>
          <div className="flex items-center gap-3">
            <Link to="/" className="hover:text-blue-500 transition-colors">Beranda</Link>
            <Link to="/list-book" className="hover:text-blue-500 transition-colors">Daftar Buku</Link>
            <Link to="/artikel" className="hover:text-blue-500 transition-colors">Artikel</Link>
            <Link to="/me" className="hover:text-blue-500 transition-colors">Kontak</Link>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          title="Kembali ke atas"
        >
          <span>Ke Atas</span>
          <ArrowUp size={12} />
        </button>
      </div>
    </footer>
  );
}
