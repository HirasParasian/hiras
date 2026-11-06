import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BookOpen, PenTool, User, ShieldCheck, Menu, X, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Artikel', to: '/artikel', icon: PenTool },
    { label: 'Proyek', to: '/proyek', icon: Code2 },
    { label: 'Daftar Buku', to: '/list-book', icon: BookOpen },
    { label: 'Tentang & Kontak', to: '/me', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-0.5 shadow-xs">
            <img
              src="/icon-h-transparent.png"
              alt="Hiras Logo"
              className="w-full h-full object-contain dark:invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight text-slate-900 dark:text-slate-100">
              Hiras Parasian
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              software engineer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                {Icon && <Icon size={15} />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle + Admin Badge (only when logged in) + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Hanya tampil badge Admin kalau sudah login sebagai admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400"
              title="Panel Admin"
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`
                }
              >
                {Icon && <Icon size={16} />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Tombol admin di mobile hanya jika sudah login */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-t border-slate-100 dark:border-slate-800 pt-2 mt-2"
            >
              <ShieldCheck size={16} />
              <span>Kelola Konten (Admin)</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
