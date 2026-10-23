import React, { useState, useMemo } from 'react';
import { FolderGit2, ExternalLink, Edit3, ArrowRight, Sparkles } from 'lucide-react';
import { Github } from './Icons';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function Projects({ projects, isAdmin, onSelectProject, onEditProject }) {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = useMemo(() => {
    const set = new Set(['Semua']);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Semua') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="section" style={{ background: 'rgba(10, 14, 23, 0.4)' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <FolderGit2 size={13} />
            <span>Portofolio & Karya</span>
          </div>
          <h2>
            Proyek Pilihan & <span className="text-gradient-cyan">Implementasi Nyata</span>
          </h2>
          <p className="section-subtitle">
            Aplikasi yang dirancang dengan skalabilitas, kecepatan eksekusi tinggi, dan arsitektur modern.
          </p>
        </div>

        {/* Category Filters */}
        <div className="project-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass-card glass-card-interactive project-card">
              {/* Media Thumbnail */}
              <div className="project-thumb-box" onClick={() => onSelectProject(project)} style={{ cursor: 'pointer' }}>
                <img
                  src={getOptimizedImageUrl(project.image, 800, 500) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                  alt={project.title}
                  className="project-thumb-img"
                  loading="lazy"
                />
                <span className="project-category-badge">{project.category || 'Web App'}</span>
              </div>

              {/* Content Body */}
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
                      title="Edit Proyek Ini"
                      style={{ padding: '0.35rem 0.65rem' }}
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>

                <p className="project-desc">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="project-tags-row">
                  {project.tags?.map((tag, tIdx) => (
                    <span key={tIdx} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Links */}
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
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-btn"
                        title="GitHub Repository"
                      >
                        <Github size={17} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link-btn"
                        title="Live Demo"
                        style={{ color: 'var(--accent-cyan)' }}
                      >
                        <ExternalLink size={17} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
