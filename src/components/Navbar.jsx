import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Shield, ShieldCheck, Menu, X, ArrowUpRight, LogOut, BookOpen } from 'lucide-react';

export default function Navbar({ user, isAdmin, onOpenAdmin, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Tentang', path: '/about' },
    { label: 'Portofolio', path: '/projects' },
    { label: 'Buku Bacaan', path: '/books', badge: 'New' },
    { label: 'Blog', path: '/blog' },
    { label: 'Kontak', path: '/contact' },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-wrapper">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-badge">HP</div>
          <div>
            <span style={{ color: 'var(--text-bright)' }}>Hiras</span>
            <span className="text-gradient-cyan">.dev</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(0, 242, 254, 0.15)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-outline-glow btn-sm"
                onClick={onOpenAdmin}
                title="Buka Admin CMS"
                id="btn-open-admin"
              >
                <ShieldCheck size={16} />
                <span>Admin CMS</span>
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onLogout}
                title="Keluar"
                style={{ padding: '0.45rem' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenAdmin}
              title="Admin Login"
              id="btn-admin-login"
            >
              <Shield size={15} />
              <span>{user ? 'Admin' : 'Login'}</span>
            </button>
          )}

          <Link to="/contact" className="btn btn-primary btn-sm" style={{ display: 'none', md: 'flex' }}>
            <span>Hire Me</span>
            <ArrowUpRight size={15} />
          </Link>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
