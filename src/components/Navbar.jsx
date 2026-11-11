import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, BookOpen, PenTool, User, ShieldCheck, Code2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAdmin } = useAuth();

  const navLinks = [
    { label: 'Beranda', shortLabel: 'Beranda', to: '/', icon: Home },
    { label: 'Artikel', shortLabel: 'Artikel', to: '/artikel', icon: PenTool },
    { label: 'Proyek', shortLabel: 'Proyek', to: '/proyek', icon: Code2 },
    { label: 'Daftar Buku', shortLabel: 'Buku', to: '/list-book', icon: BookOpen },
    { label: 'Tentang & Kontak', shortLabel: 'Profil', to: '/me', icon: User },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP / TABLET: FLOATING PILL NAVBAR (md:flex)      */}
      {/* ========================================================= */}
      <header className="hidden md:block sticky top-4 z-40 w-full px-4 sm:px-6 pointer-events-none transition-all duration-300">
        <div className="max-w-4xl mx-auto pointer-events-auto flex items-center justify-between px-3.5 py-2 rounded-full backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-900/5 dark:shadow-black/25 transition-colors">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight hover:opacity-90 transition-opacity pl-1.5 pr-3 py-1 group"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-0.5 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src="/icon-h-transparent.png"
                alt="Hiras Logo"
                className="w-full h-full object-contain dark:invert"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-slate-900 dark:text-slate-100">
                Hiras
              </span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                engineer
              </span>
            </div>
          </Link>

          {/* Desktop Center Menu Links (Inner Pill) */}
          <nav className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  {Icon && <Icon size={14} />}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle & Admin Badge */}
          <div className="flex items-center gap-2 pr-1">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs"
                title="Panel Admin"
              >
                <ShieldCheck size={13} />
                <span>Admin</span>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE TOP HEADER (md:hidden)                          */}
      {/* ========================================================= */}
      <div className="md:hidden sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-2.5 flex items-center justify-between transition-colors">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-0.5 shadow-xs">
            <img
              src="/icon-h-transparent.png"
              alt="Hiras Logo"
              className="w-full h-full object-contain dark:invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Hiras Parasian
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-tight">
              software engineer
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-xs"
              title="Panel Admin"
            >
              <ShieldCheck size={13} />
              <span>Admin</span>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MOBILE BOTTOM TAB BAR (md:hidden)                      */}
      {/* ========================================================= */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-50 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/10 dark:shadow-black/40 px-2 py-1.5 flex items-center justify-around transition-all">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 scale-105 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
                    {item.shortLabel || item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
