import React from 'react';
import { ArrowRight, Download, Send, Sparkles, Cloud, Database, Code2 } from 'lucide-react';

export default function Hero({ profile }) {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Headlines & CTA */}
          <div className="hero-content">
            <div className="hero-status-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="status-pill">
                <span className="status-dot"></span>
                <span>{profile.statusBadge || 'Available for Projects'}</span>
              </div>
              <span className="section-tag" style={{ margin: 0 }}>
                <Sparkles size={13} />
                <span>Full-Stack & Cloud</span>
              </span>
            </div>

            <h1 className="hero-headline">
              Halo, Saya <span className="text-gradient-cyan">{profile.name}</span>.<br />
              Membangun Solusi Digital <span className="text-gradient-pink">Modern & Skalabel</span>.
            </h1>

            <p className="hero-desc">
              {profile.bio}
            </p>

            <div className="hero-cta-group">
              <a href="#projects" className="btn btn-primary" id="hero-btn-projects">
                <span>Jelajahi Portofolio</span>
                <ArrowRight size={17} />
              </a>
              <a href="#contact" className="btn btn-secondary" id="hero-btn-contact">
                <Send size={16} />
                <span>Hubungi Saya</span>
              </a>
              {profile.resumeUrl && profile.resumeUrl !== '#' && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-glow"
                  id="hero-btn-resume"
                >
                  <Download size={16} />
                  <span>Resume / CV</span>
                </a>
              )}
            </div>

            {/* Quick Stats Counter Row */}
            <div className="hero-stats-row">
              {profile.stats?.map((stat, idx) => (
                <div key={idx} className="hero-stat-card">
                  <span className="hero-stat-number">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Creative Dynamic Interactive Code / Stack Card */}
          <div className="hero-visual-container">
            <div className="hero-visual-card">
              <div className="hero-code-header">
                <div className="code-dots">
                  <span className="code-dot red"></span>
                  <span className="code-dot yellow"></span>
                  <span className="code-dot green"></span>
                </div>
                <div className="code-title">hiras_config.ts</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)' }}>
                  <Code2 size={14} />
                </div>
              </div>

              <div className="hero-code-body">
                <div><span className="code-keyword">const</span> <span className="code-var">developer</span> = &#123;</div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span className="code-var">name</span>: <span className="code-str">"{profile.name}"</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span className="code-var">role</span>: <span className="code-str">"{profile.title}"</span>,
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span className="code-var">coreStack</span>: [
                  <span className="code-str">"React"</span>, <span className="code-str">"Vite"</span>, <span className="code-str">"Node.js"</span>],
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span className="code-var">cloudBackend</span>: &#123;
                </div>
                <div style={{ paddingLeft: '2.5rem' }}>
                  <span className="code-var">database</span>: <span className="code-str">"Firebase Firestore"</span>,
                </div>
                <div style={{ paddingLeft: '2.5rem' }}>
                  <span className="code-var">mediaPipeline</span>: <span className="code-str">"Cloudinary CDN"</span>,
                </div>
                <div style={{ paddingLeft: '2.5rem' }}>
                  <span className="code-var">deployment</span>: <span className="code-str">"GitHub Pages (Free & Fast)"</span>
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>&#125;,</div>
                <div style={{ paddingLeft: '1.25rem' }}>
                  <span className="code-func">status</span>(): <span className="code-keyword">string</span> &#123;
                </div>
                <div style={{ paddingLeft: '2.5rem' }}>
                  <span className="code-keyword">return</span> <span className="code-str">"Ready to Build High-Performance Web Apps!"</span>;
                </div>
                <div style={{ paddingLeft: '1.25rem' }}>&#125;</div>
                <div>&#125;;</div>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className="code-comment">// Execute build pipeline</span>
                </div>
                <div>
                  <span className="code-func">developer</span>.<span className="code-func">buildGreatThings</span>();
                </div>
              </div>

              {/* Dynamic Floating Badges */}
              <div className="floating-tech-pill pill-1">
                <Database size={15} />
                <span>Firebase Connected</span>
              </div>
              <div className="floating-tech-pill pill-2">
                <Cloud size={15} />
                <span>Cloudinary Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
