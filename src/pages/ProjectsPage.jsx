import React, { useState, useMemo } from 'react';
import { FolderGit2, Search, ExternalLink, Edit3, ArrowRight } from 'lucide-react';
import { Github } from '../components/Icons';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function ProjectsPage({ projects, isAdmin, onSelectProject, onEditProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = useMemo(() => {
    const set = new Set(['Semua']);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [projects, searchQuery, activeCategory]);

  return (
    <div className="section" style={{ minHeight: '85vh', paddingTop: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <div className="section-tag">
            <FolderGit2 size={13} />
            <span>Koleksi Portofolio Lengkap</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
            Proyek & <span className="text-gradient-cyan">Karya Rekayasa</span>
          </h1>
          <p className="section-subtitle">
            Kumpulan aplikasi web, sistem terdistribusi, dan implementasi cloud yang telah saya bangun dengan standar industri tinggi.
          </p>
        </div>

        {/* Toolbar: Category + Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '3rem',
          padding: '1.25rem',
          background: 'rgba(16, 23, 38, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Cari nama proyek atau tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingBottom: '0.55rem', paddingTop: '0.55rem', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', margin: '2rem 0' }}>
            <FolderGit2 size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
            <h3>Tidak ada proyek yang sesuai</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Coba gunakan kata kunci pencarian yang berbeda atau pilih kategori "Semua".
            </p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project.id} className="glass-card glass-card-interactive project-card">
                <div className="project-thumb-box" onClick={() => onSelectProject(project)} style={{ cursor: 'pointer' }}>
                  <img
                    src={getOptimizedImageUrl(project.image, 800, 500) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                    alt={project.title}
                    className="project-thumb-img"
                    loading="lazy"
                  />
                  <span className="project-category-badge">{project.category || 'Web App'}</span>
                </div>

                <div className="project-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3
                      className="project-title"
                      onClick={() => onSelectProject(project)}
                      style={{ cursor: 'pointer' }}
                    >
                      {project.title}
                    </h3>
                    {isAdmin && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onEditProject(project)}
                        title="Edit Proyek"
                        style={{ padding: '0.35rem 0.65rem' }}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </div>

                  <p className="project-desc">{project.description}</p>

                  <div className="project-tags-row">
                    {project.tags?.map((tag, tIdx) => (
                      <span key={tIdx} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-footer-links">
                    <button
                      className="project-link-btn"
                      onClick={() => onSelectProject(project)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <span>Detail Lengkap</span>
                      <ArrowRight size={15} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="GitHub Repository">
                          <Github size={17} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link-btn" title="Live Demo" style={{ color: 'var(--accent-cyan)' }}>
                          <ExternalLink size={17} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
