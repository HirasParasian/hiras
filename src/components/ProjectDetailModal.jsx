import React from 'react';
import { X, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { Github } from './Icons';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-tag" style={{ margin: 0, fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
              {project.category || 'Project'}
            </span>
            <h3 style={{ margin: '0.35rem 0 0 0', fontSize: '1.35rem' }}>{project.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Project Image */}
          <div style={{ width: '100%', height: 320, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', background: '#0a0e18' }}>
            <img
              src={getOptimizedImageUrl(project.image, 1200, 650) || project.image}
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Tentang Proyek</h4>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7' }}>
              {project.description}
            </p>
          </div>

          {/* Metrics Highlight */}
          {project.metrics && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              marginBottom: '1.5rem',
              color: 'var(--accent-cyan)'
            }}>
              <Sparkles size={18} />
              <span style={{ fontWeight: 600 }}>Highlight / Performance: {project.metrics}</span>
            </div>
          )}

          {/* Tech Stack */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Teknologi yang Digunakan</h4>
            <div className="project-tags-row">
              {project.tags?.map((tag, idx) => (
                <span key={idx} className="project-tag" style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <span>Kunjungi Live Website</span>
                <ExternalLink size={16} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Github size={16} />
                <span>Lihat Kode Sumber</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
