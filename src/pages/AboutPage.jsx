import React from 'react';
import About from '../components/About';
import { User, Download, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function AboutPage({ profile }) {
  return (
    <div style={{ paddingTop: '3rem' }}>
      <About profile={profile} />

      {/* CV / Resume Banner */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            background: 'linear-gradient(135deg, rgba(16, 23, 38, 0.9), rgba(0, 242, 254, 0.08))',
            borderColor: 'rgba(0, 242, 254, 0.25)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.88rem' }}>
                <ShieldCheck size={18} />
                <span>Curriculum Vitae</span>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.6rem' }}>Tertarik dengan Pengalaman Saya?</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 540 }}>
                Unduh salinan CV resmi saya untuk melihat rincian riwayat karir, sertifikasi, dan pencapaian proyek rekayasa perangkat lunak.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a href={profile.resumeUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Download size={16} />
                <span>Unduh CV Lengkap</span>
              </a>
              <a href="#/contact" className="btn btn-secondary">
                <span>Hubungi Saya</span>
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
