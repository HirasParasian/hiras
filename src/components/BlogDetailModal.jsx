import React from 'react';
import { X, Calendar, Clock, BookOpen, Share2 } from 'lucide-react';
import { getOptimizedImageUrl } from '../services/cloudinary';

export default function BlogDetailModal({ post, onClose }) {
  if (!post) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link artikel telah disalin ke clipboard!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860 }}>
        <div className="modal-header">
          <div>
            <span className="section-tag" style={{ margin: 0, fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
              {post.category || 'Article'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="modal-close-btn" onClick={handleShare} title="Bagikan Artikel">
              <Share2 size={16} />
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '1rem', lineHeight: '1.3' }}>
            {post.title}
          </h2>

          <div className="blog-meta-row" style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} color="var(--accent-cyan)" />
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Baru dipublikasi'}</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} color="var(--accent-purple)" />
              <span>{post.readTime || '5 menit baca'}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div style={{ width: '100%', maxHeight: 380, borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '2rem', background: '#0a0e18' }}>
              <img
                src={getOptimizedImageUrl(post.image, 1200, 600) || post.image}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Article Content */}
          <div style={{
            color: '#e2e8f0',
            fontSize: '1.05rem',
            lineHeight: '1.85',
            whiteSpace: 'pre-line'
          }}>
            {post.content || post.summary}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {post.tags.map((tag, idx) => (
                <span key={idx} className="project-tag" style={{ padding: '0.3rem 0.8rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
