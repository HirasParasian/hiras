import React from 'react';
import { User, Layers, Briefcase, GraduationCap, CheckCircle2, Cpu } from 'lucide-react';

export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <User size={13} />
            <span>Profil & Pengalaman</span>
          </div>
          <h2>
            Mengenal <span className="text-gradient-cyan">Hiras Parasian</span> Lebih Dekat
          </h2>
          <p className="section-subtitle">
            Kombinasi antara keahlian teknis logika backend dengan ketelitian estetika antarmuka modern.
          </p>
        </div>

        {/* Top Grid: Bio & Skills */}
        <div className="about-grid">
          {/* Left: Bio & Philosophy */}
          <div className="glass-card about-bio-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <Cpu size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>Visi & Pendekatan Teknis</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Architecture & Code Quality</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-bright)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              {profile.longBio || profile.bio}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <span>Pengembangan Full-Stack berstandar industri dengan Clean Code</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <span>Integrasi database real-time & media CDN berkecepatan tinggi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <span>Hosting hemat biaya & bebas server cost di GitHub Pages</span>
              </div>
            </div>

            {/* Education Highlight */}
            {profile.education && profile.education.length > 0 && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <GraduationCap size={22} color="var(--accent-purple)" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                    {profile.education[0].year}
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: '1rem' }}>
                    {profile.education[0].degree}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    {profile.education[0].desc}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Categorized Skills */}
          <div className="skills-wrapper">
            {profile.skillsCategories?.map((cat, idx) => (
              <div key={idx} className="skill-category-card">
                <div className="skill-category-title">
                  <Layers size={17} color="var(--accent-cyan)" />
                  <span>{cat.category}</span>
                </div>
                <div className="skill-badges-flex">
                  {cat.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section: Experience Timeline */}
        <div className="timeline-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Briefcase size={22} color="var(--accent-cyan)" />
            <h3 style={{ margin: 0 }}>Perjalanan Karir & Pengalaman</h3>
          </div>

          <div className="timeline-list">
            {profile.experiences?.map((exp, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-bullet"></div>
                <div className="timeline-card">
                  <span className="timeline-year">{exp.year}</span>
                  <h4 className="timeline-role">{exp.role}</h4>
                  <div className="timeline-company">{exp.company}</div>
                  <p style={{ margin: 0, fontSize: '0.92rem' }}>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
