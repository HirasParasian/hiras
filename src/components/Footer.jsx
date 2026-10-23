import React from 'react';
import { ArrowUp, Mail, PhoneCall, Heart } from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="nav-logo" style={{ marginBottom: '0.65rem' }}>
              <div className="logo-badge">HP</div>
              <div>
                <span style={{ color: 'var(--text-bright)' }}>Hiras</span>
                <span className="text-gradient-cyan">.dev</span>
              </div>
            </div>
            <p style={{ maxWidth: 420, fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Personal website & digital portfolio of Hiras Parasian. Built with passion for high performance, serverless cloud systems, and modern web experiences.
            </p>
          </div>

          <div className="social-links-row">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="social-icon-btn"
                title="Email"
              >
                <Mail size={18} />
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title="WhatsApp"
              >
                <PhoneCall size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Hiras Parasian. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <span>Powered by</span>
            <span style={{ color: 'var(--accent-cyan)' }}>Vite</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-purple)' }}>Firebase</span>
            <span>•</span>
            <span style={{ color: 'var(--accent-pink)' }}>Cloudinary</span>
          </div>

          <button
            onClick={scrollToTop}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.8rem' }}
            title="Kembali ke atas"
          >
            <span>Atas</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
